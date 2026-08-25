# EZROME Android release handoff

This is an owner-operated preparation guide for the EZROME Android release. It does not create a Play Console app, generate signing keys, or certify Google Play approval.

## Working release configuration

| Field | Working value | Owner action |
| --- | --- | --- |
| App name | EZROME | Confirm final store listing name |
| Application ID | `com.ezrome.app` | Confirm availability and use consistently in the Android wrapper/build |
| Release model | Free-first V1 | Confirm no paid checkout, ads, creator payouts, or live streaming in the first public release |
| Product surface | Watch, Shorts, Football, Community, Explore, Creator Studio, Offline Library, Governance, Foundations | Verify each feature on a real Android build |
| Support | `support@ezrome.co.za` | Verify Cloudflare forwarding and monitor the inbox |
| Copyright/reporting | `copyright@ezrome.co.za` | Verify forwarding and response process |
| Website | `https://ezromepub-f3hzkejz.manus.space` | Confirm final canonical domain before listing |
| Publisher | Sixolile Ezrome Mtyhali / EZROME | Confirm the Play developer-account identity |

## Credentials and signing

The owner must create or confirm the Play Console developer account and control the Android app-signing key, upload key, recovery methods, and access roles. Never place private keys, passwords, recovery codes, or Play service-account JSON in chat, screenshots, the repository, or client-side code. Keep at least one secure offline backup of the signing material according to the owner’s security policy.

## Staged rollout sequence

1. Confirm the application ID and create the Play Console app under the owner’s account.
2. Build a signed Android release using owner-controlled signing credentials.
3. Complete the store listing, app icon, feature graphic, screenshots, contact details, privacy-policy URL, target-audience answers, content rating, and Data safety form.
4. Add a small closed-test group and at least two real Android device profiles.
5. Test sign-in, sign-out, creator upload, download permissions, offline playback, account deletion, reporting, moderation, Foundations demos, deep links, and network-loss behavior.
6. Resolve all high-severity issues and record the build number, device matrix, test results, and known limitations.
7. Release to closed testing, monitor crashes and reports, and keep the support inbox staffed.
8. Move to a staged production rollout only after the owner approves the policy URLs, declarations, listing, release notes, and test evidence.

## Billing boundary

Digital EZROME features such as Premium, AI Assistant access, Brainwork content, Rated Opinionz intelligence, premium culture content, reports, subscriptions, and app unlocks should remain deferred in the current free-first build until Google Play Billing products, purchase verification, entitlement restoration, refunds, and subscription-state handling are implemented and tested. Do not advertise an active paid catalog in the first listing if checkout is not live.

## Owner completion fields

- Final Android build system or wrapper selected: **[OWNER TO COMPLETE]**
- Confirmed application ID availability: **[OWNER TO COMPLETE]**
- Play Console account created: **[OWNER TO COMPLETE]**
- Signing and upload-key custody verified: **[OWNER TO COMPLETE]**
- Final policy URLs reviewed and published: **[OWNER TO COMPLETE]**
- Cloudflare routes tested from independent sender accounts: **[OWNER TO COMPLETE]**
- Closed-test users and devices: **[OWNER TO COMPLETE]**
- Crash, privacy, deletion, reporting, and offline test evidence: **[OWNER TO COMPLETE]**
- Staged-rollout approval: **[OWNER TO COMPLETE]**
