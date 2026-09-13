# Phase 2B — Unity Points Contract

## Balance endpoint

Unity requests the current authoritative Points balance using the existing Phase 1 launcher access token.

```http
GET {apiBaseUrl}/api/v1/me/points
Authorization: Bearer <launcher_access_token>
Accept: application/json
```

## Successful response

HTTP `200`

```json
{
  "balance": "9900"
}
```

The `balance` value is returned as a string because the server stores Points as PostgreSQL `bigint`.

Unity should parse the value using a 64-bit integer (`long`).

## User has no wallet

HTTP `200`

```json
{
  "balance": "0"
}
```

The absence of a wallet is therefore treated as a zero balance.

## Unauthorized

HTTP `401`

```json
{
  "error": "Unauthorized"
}
```

This means the launcher access token is missing, invalid, expired, or revoked.

Unity should use the existing Phase 1 authentication and refresh/re-authentication flow.

## Server error

HTTP `500`

```json
{
  "error": "Internal server error"
}
```

Unity must not modify its authoritative Points state after a failed request.

## Security

Unity must NOT call:

```text
grant_points
deduct_points
```

directly.

These are trusted server-side operations.

The server and database are authoritative for Points.

## Phase 2A scope

Implemented:

```text
GET /api/v1/me/points
```

Not implemented in Phase 2A:

* Game reward endpoints
* Game deduction endpoints
* Payments
* itch.io claiming
* Game integration

Those belong to later phases.
