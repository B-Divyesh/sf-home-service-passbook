# Final live identity and response policy

Verified 2026-08-28 after Azure Static Web Apps deployment `7c03c675-cbc6-45d1-b357-9371b4a0ca95`.

| File | HTTP | Local and live SHA-256 | Result |
| --- | ---: | --- | --- |
| `index.html` | 200 | `e45c0b5a68f3daa30535cae597dc2235becb65aa52db56d026dd2f2b2a624c70` | Match |
| `assets/index-BrCrBByi.js` | 200 | `e5204bed816391f18e912a1c45a123d8feef5f83ae3135c68a1ec59408040f1a` | Match |
| `assets/index-v3kgqw0P.css` | 200 | `22b4bc4ca2e85642d88550feee62b423e117d634df2b7c739b9ffad02090214e` | Match |
| `sw.js` | 200 | `fe087f95d0d2f620a1ee6bcb73a73ba0c3166305c8129b756ff8a35580e17c45` | Match |
| `manifest.webmanifest` | 200 | `e046e6322833fdb209174f1914c7c07043cba664c3915c63904263d589098fb3` | Match |
| `404.html` | 200 | `764cff590c54ad4eb8676a7a471296940333642bb481068613316861feb36d06` | Match |

An unknown route returned HTTP 404. Live HTML returned:

- `Cache-Control: public, must-revalidate, max-age=30`
- `Strict-Transport-Security: max-age=10886400; includeSubDomains; preload`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- CSP limited scripts/styles to self and connections to self plus `https://api.sociobot.in`.

The checkout returned HTTP 303 to `checkout.dodopayments.com`. Invalid license verification returned `Cache-Control: no-store`, `Access-Control-Allow-Origin: https://home-service-passbook.sociobot.in`, and `{\"expires_at\":null,\"reason\":\"invalid\",\"valid\":false}`.
