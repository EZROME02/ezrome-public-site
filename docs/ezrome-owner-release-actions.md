# EZROME owner release actions

## 1. Activate the approved platform mailboxes

The public policy pages now use these approved EZROME addresses:

| Purpose | Address |
| --- | --- |
| General support, privacy, access, deletion, and moderation questions | `support@ezrome.co.za` |
| Copyright and rights reports | `copyright@ezrome.co.za` |

These addresses are **not verified as operational** until they are created at the provider that manages email for `ezrome.co.za`.

### Provider-independent steps

1. Sign in to the provider that manages `ezrome.co.za` DNS and email.
2. Create the two mailboxes above, or create forwarding aliases only if a monitored destination mailbox exists.
3. Configure the provider’s required MX records and sender-authentication records (SPF, DKIM, and DMARC) according to that provider’s setup guide.
4. Send and receive a test message through both addresses.
5. Set a response owner, monitoring schedule, escalation process, and auto-reply that does not expose personal or security information.
6. Reply with the provider name or dashboard screenshots if you want exact, provider-specific guidance. Do not share passwords, recovery codes, or private keys.

## 2. Complete Android and Play ownership

The intended application ID is `com.ezrome.app`. The Google Play Console account and release-signing identity must remain controlled by the EZROME owner.

1. Create or confirm the Play Console app under the owner-controlled developer account.
2. Confirm `com.ezrome.app` is available before creating the production Android project and signing configuration.
3. Enroll in Play App Signing and keep any local upload key secure. Never place signing material in a website repository or share it in chat.
4. Complete the App content declarations with the same privacy, deletion, ads, target audience, content-rating, reviewer-access, and data-safety facts shown in the production app.
5. Start an internal or closed test with real Android devices. Record sign-in, upload, offline playback, report, deletion, moderation, and entitlement test outcomes.
6. Keep digital billing inactive until the free-first core is stable and server-side Play purchase verification is tested.

## 3. Before public submission

Confirm that both public mailboxes work, the working policy package has received final review, the deletion resource works without sign-in, all Play declarations match real behavior, and the closed test has no unresolved high-severity issues.
