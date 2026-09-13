# API Contracts

## GET /api/v1/me/points

Requires:

```http
Authorization: Bearer <launcher_access_token>
Accept: application/json
```

### 200 — Wallet balance

```json
{
  "balance": "9900"
}
```

The `balance` value is returned as a string because the database uses PostgreSQL `bigint`.

If the authenticated user does not have a wallet yet:

```json
{
  "balance": "0"
}
```

### 401 — Unauthorized

Returned when the launcher access token is missing, invalid, expired, or revoked.

```json
{
  "error": "Unauthorized"
}
```

### 500 — Internal server error

```json
{
  "error": "Internal server error"
}
```

## Server-side wallet functions

The following PostgreSQL functions are server-only:

```text
grant_points(uuid, bigint, text, text, text)
deduct_points(uuid, bigint, text, text, text)
```

They are executable only by `service_role`.

Unity clients and browsers must never call these functions directly.

Both operations support idempotency keys.

Every successful operation creates an immutable transaction record.
