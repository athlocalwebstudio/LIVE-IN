# Phase 2A Points Wallet Report

## Status

Phase 2A server-side Points wallet implementation is complete on staging.

Production was not modified.

Phase 1 launcher authentication was preserved.

## Branch

```text
phase-2a-points-wallet
```

## Database

Phase 2A introduces:

```text
public.points_wallets
public.points_transactions
```

Wallet balances use PostgreSQL `bigint`.

Each user has at most one wallet.

Wallet balances cannot become negative.

## Transaction ledger

Every successful Points grant or deduction creates an immutable transaction.

Transactions record:

* Wallet
* User
* Type
* Amount
* Balance after operation
* Reason
* Reference ID
* Idempotency key
* Creation timestamp

Transaction UPDATE and DELETE operations are blocked by a database trigger.

## Atomicity

Wallet mutations lock the wallet row using:

```sql
FOR UPDATE
```

This prevents concurrent operations from incorrectly modifying the balance.

The wallet update and transaction creation occur within the same database function.

## Idempotency

Both grant and deduction operations support idempotency keys.

Repeating the exact same operation with the same idempotency key returns the original transaction without creating another transaction.

Reusing an existing idempotency key for a different operation is rejected.

## Security

Wallet mutation functions use:

```text
SECURITY DEFINER
```

with:

```text
search_path = public
```

Execution is revoked from:

```text
public
anon
authenticated
```

and granted only to:

```text
service_role
```

Transaction ownership is additionally validated against the wallet owner.

Row-level security is enabled on the wallet and transaction tables.

## API

The launcher-facing balance endpoint is:

```http
GET /api/v1/me/points
```

It requires a valid Phase 1 launcher access token.

The response returns the authoritative balance as a string.

## Acceptance test

The required staging acceptance test was executed.

### Step 1 — Grant

```text
GRANT 10,000
```

Resulting balance:

```text
10,000
```

### Step 2 — Deduct

```text
DEDUCT 100
```

Resulting balance:

```text
9,900
```

### Final result

```text
Balance:          9,900
Transactions:     2
Total granted:    10,000
Total deducted:   100
```

The two transactions were exactly:

```text
GRANT  10,000 → balance 10,000
DEDUCT    100 → balance  9,900
```

**Acceptance test: PASSED**

## Additional tests

### Unauthorized API request

Request without a launcher access token returned:

```text
HTTP 401
```

**PASSED**

### Transaction UPDATE

Attempting to modify an existing transaction was rejected with:

```text
Points transactions are immutable
```

**PASSED**

### Transaction DELETE

Attempting to delete an existing transaction was rejected with:

```text
Points transactions are immutable
```

**PASSED**

### Idempotency retry

Repeating the exact same grant request returned the original transaction.

No additional transaction was created.

**PASSED**

### Idempotency-key misuse

Reusing an existing idempotency key with different operation data was rejected.

No balance or transaction change occurred.

**PASSED**

## Migration

The reproducible migration is:

```text
supabase/migrations/20260913170000_phase2a_points_wallet.sql
```

The migration is source-controlled for reproduction.

The already-configured staging database was not re-run through this migration.

## Production safety

Production Supabase was not modified during Phase 2A database setup.

The staging Vercel environment points to the dedicated staging Supabase project.

Production environment variables remain unchanged.

## Out of scope

The following were explicitly excluded from Phase 2A:

* Payments
* itch.io claiming
* Game integration
* Gameplay reward APIs
* Gameplay deduction APIs

## Final assessment

```text
Core wallet implementation       COMPLETE
Database hardening               COMPLETE
Atomic operations                COMPLETE
Transaction immutability         COMPLETE
Idempotency                      COMPLETE
Acceptance test                  PASSED
Migration                        COMPLETE
Balance API                      COMPLETE
API contracts                    COMPLETE
Phase 2B Unity contract          COMPLETE
Production protection            COMPLETE
```

**Phase 2A: COMPLETE**
