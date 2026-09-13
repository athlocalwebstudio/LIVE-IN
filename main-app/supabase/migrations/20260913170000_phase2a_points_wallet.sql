-- Phase 2A: Server-side Points Wallet
-- Reproducible Supabase migration
-- Production must not be modified by this migration automatically.

create table if not exists public.points_wallets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique
        references auth.users(id) on delete restrict,
    balance bigint not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint points_wallets_balance_non_negative
        check (balance >= 0)
);

create table if not exists public.points_transactions (
    id uuid primary key default gen_random_uuid(),
    wallet_id uuid not null
        references public.points_wallets(id) on delete restrict,
    user_id uuid not null
        references auth.users(id) on delete restrict,
    type text not null,
    amount bigint not null,
    balance_after bigint not null,
    reason text not null,
    reference_id text,
    idempotency_key text unique,
    created_at timestamptz not null default now(),

    constraint points_transactions_type_check
        check (type in ('GRANT', 'DEDUCT')),

    constraint points_transactions_amount_positive
        check (amount > 0),

    constraint points_transactions_balance_non_negative
        check (balance_after >= 0)
);

create index if not exists points_transactions_wallet_created_at_idx
    on public.points_transactions (wallet_id, created_at);

create index if not exists points_transactions_user_created_at_idx
    on public.points_transactions (user_id, created_at);

create index if not exists points_transactions_reference_id_idx
    on public.points_transactions (reference_id);

alter table public.points_wallets enable row level security;
alter table public.points_transactions enable row level security;


-- Transaction immutability
create or replace function public.prevent_points_transaction_mutation()
returns trigger
language plpgsql
as $$
begin
    raise exception 'Points transactions are immutable';
end;
$$;

drop trigger if exists points_transaction_immutable
on public.points_transactions;

create trigger points_transaction_immutable
before update or delete
on public.points_transactions
for each row
execute function public.prevent_points_transaction_mutation();


-- Wallet/transaction user consistency
create or replace function public.validate_points_transaction_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_wallet_user_id uuid;
begin
    select user_id
    into v_wallet_user_id
    from public.points_wallets
    where id = new.wallet_id;

    if v_wallet_user_id is null then
        raise exception 'Points wallet does not exist';
    end if;

    if new.user_id <> v_wallet_user_id then
        raise exception 'Points transaction user does not match wallet user';
    end if;

    return new;
end;
$$;

drop trigger if exists points_transaction_user_consistency
on public.points_transactions;

create trigger points_transaction_user_consistency
before insert or update
on public.points_transactions
for each row
execute function public.validate_points_transaction_user();


-- Grant points
create or replace function public.grant_points(
    p_user_id uuid,
    p_amount bigint,
    p_reason text,
    p_reference_id text default null,
    p_idempotency_key text default null
)
returns public.points_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
    v_wallet public.points_wallets;
    v_transaction public.points_transactions;
    v_new_balance bigint;
begin
    if p_amount is null or p_amount <= 0 then
        raise exception 'Points amount must be greater than zero';
    end if;

    if p_reason is null or length(trim(p_reason)) = 0 then
        raise exception 'Reason is required';
    end if;

    if p_idempotency_key is not null then
        select *
        into v_transaction
        from public.points_transactions
        where idempotency_key = p_idempotency_key;

        if found then
            if v_transaction.user_id <> p_user_id
               or v_transaction.type <> 'GRANT'
               or v_transaction.amount <> p_amount
               or v_transaction.reason <> p_reason
               or v_transaction.reference_id is distinct from p_reference_id then
                raise exception 'Idempotency key has already been used for a different operation';
            end if;

            return v_transaction;
        end if;
    end if;

    insert into public.points_wallets (user_id)
    values (p_user_id)
    on conflict (user_id) do nothing;

    select *
    into v_wallet
    from public.points_wallets
    where user_id = p_user_id
    for update;

    v_new_balance := v_wallet.balance + p_amount;

    update public.points_wallets
    set
        balance = v_new_balance,
        updated_at = now()
    where id = v_wallet.id;

    insert into public.points_transactions (
        wallet_id,
        user_id,
        type,
        amount,
        balance_after,
        reason,
        reference_id,
        idempotency_key
    )
    values (
        v_wallet.id,
        p_user_id,
        'GRANT',
        p_amount,
        v_new_balance,
        p_reason,
        p_reference_id,
        p_idempotency_key
    )
    returning *
    into v_transaction;

    return v_transaction;
end;
$$;


-- Deduct points
create or replace function public.deduct_points(
    p_user_id uuid,
    p_amount bigint,
    p_reason text,
    p_reference_id text default null,
    p_idempotency_key text default null
)
returns public.points_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
    v_wallet public.points_wallets;
    v_transaction public.points_transactions;
    v_new_balance bigint;
begin
    if p_amount is null or p_amount <= 0 then
        raise exception 'Points amount must be greater than zero';
    end if;

    if p_reason is null or length(trim(p_reason)) = 0 then
        raise exception 'Reason is required';
    end if;

    if p_idempotency_key is not null then
        select *
        into v_transaction
        from public.points_transactions
        where idempotency_key = p_idempotency_key;

        if found then
            if v_transaction.user_id <> p_user_id
               or v_transaction.type <> 'DEDUCT'
               or v_transaction.amount <> p_amount
               or v_transaction.reason <> p_reason
               or v_transaction.reference_id is distinct from p_reference_id then
                raise exception 'Idempotency key has already been used for a different operation';
            end if;

            return v_transaction;
        end if;
    end if;

    select *
    into v_wallet
    from public.points_wallets
    where user_id = p_user_id
    for update;

    if not found then
        raise exception 'Points wallet does not exist';
    end if;

    if v_wallet.balance < p_amount then
        raise exception 'Insufficient points';
    end if;

    v_new_balance := v_wallet.balance - p_amount;

    update public.points_wallets
    set
        balance = v_new_balance,
        updated_at = now()
    where id = v_wallet.id;

    insert into public.points_transactions (
        wallet_id,
        user_id,
        type,
        amount,
        balance_after,
        reason,
        reference_id,
        idempotency_key
    )
    values (
        v_wallet.id,
        p_user_id,
        'DEDUCT',
        p_amount,
        v_new_balance,
        p_reason,
        p_reference_id,
        p_idempotency_key
    )
    returning *
    into v_transaction;

    return v_transaction;
end;
$$;


-- Wallet mutations are server-only.
revoke all on function public.grant_points(uuid, bigint, text, text, text)
from public, anon, authenticated;

revoke all on function public.deduct_points(uuid, bigint, text, text, text)
from public, anon, authenticated;

grant execute on function public.grant_points(uuid, bigint, text, text, text)
to service_role;

grant execute on function public.deduct_points(uuid, bigint, text, text, text)
to service_role;
