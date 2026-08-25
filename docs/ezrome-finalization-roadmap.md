# EZROME finalization roadmap

> I’m an AI, not a lawyer — this is a working product and compliance checklist, not formal legal advice. Have a qualified attorney or compliance professional review the final privacy, copyright, consumer, tax, and platform-policy materials before launch.

## Current position

The live EZROME foundation is at checkpoint `e4e4cc6d`. It includes authentication, creator uploads, video and shorts discovery, offline playback controls, creator download permissions, moderation report states, account-deletion requests with cancellation, persisted non-charging premium selections, and a digital-product catalog. It is **not yet Google Play approved**, and no live billing is active.

## Gate 1 — Freeze the product scope

Decide that Version 1 will ship with Watch, Shorts, creator stations, Community, Football/ Rated Opinionz, offline library, reporting, deletion, and the free tier. Keep AI newsroom summaries human-approved. Do not add live streaming, creator payouts, advertising, or real premium charging until their operational controls are ready.

Confirm the digital products you intend to sell: **EZROME Premium**, **Brainwork Studio / AI Assistant**, **Rated Opinionz Intelligence**, premium hip-hop and entertainment content, and premium reports. Treat merchandise, live events, consulting, sponsorships, and production services as a separate non-digital category.

## Gate 2 — Finish ownership and policy materials

Publish a privacy policy that accurately describes Manus authentication, account data, creator uploads, managed storage, analytics, notifications, AI processing, offline copies, reports, deletion, and support. Publish Terms of Service, Community Guidelines, Copyright/DMCA-style reporting instructions appropriate to your jurisdiction, and a visible support contact controlled by you.

Create a real deletion web page that explains what will be deleted, what may be retained for legal or security reasons, expected processing status, and how to contact support. In Play Console, complete the Data safety and Data deletion questions consistently with the actual implementation. Google requires an in-app deletion path and a web resource when an app supports account creation. [1]

Complete a human moderation operating procedure: who can access the queue, response targets, evidence retention, escalation, correction, appeal handling, copyright takedown handling, and emergency removal. Do not publish AI-generated newsroom copy without human approval and visible source context.

## Gate 3 — Configure Android and Google Play

Create or confirm your Google Play Console developer account, verify identity, choose a unique Android application ID, create a secure release-signing process, and use Play App Signing. Package the current web app using a maintained Android wrapper or a dedicated Android client. Test deep links, authentication expiry, back navigation, media playback, device storage limits, offline behavior, and network loss on physical devices.

Prepare the store listing: app name, short and full descriptions, icon, screenshots, feature graphic, contact email, privacy-policy URL, content rating, target-audience declaration, ads declaration, app-access instructions, and any news-app or permission declarations that apply. Play Console’s App content area is where these declarations and reviewer instructions are managed. [2]

Run an internal release candidate with test accounts. Verify sign-in, upload rights confirmation, storage limits, download toggle changes, offline playback revocation, report submission, deletion request and cancellation, moderation access denial for non-admin users, and premium pending-selection cancellation.

## Gate 4 — Implement billing only when ready

For Android digital products, use Google Play Billing. Google states that Play Billing is for digital products and content, including one-time purchases and subscriptions; physical goods and services are a separate category. [3] Create the products in Play Console, integrate the Android billing client, verify purchases on your server, acknowledge purchases, handle renewals, cancellations, refunds, chargebacks, grace periods, and entitlement revocation, and test with licensed testers before enabling production access.

Keep the current EZROME premium UI in read-only or pending-selection mode until purchase verification is live. Never represent a pending choice as an active paid entitlement, and do not route Android users around required Play billing rules.

## Gate 5 — Closed test and public release

Start with a closed Play test. Collect crash reports, sign-in failures, offline playback failures, deletion requests, report queue outcomes, and billing-state mismatches. Fix all high-severity issues and repeat the test after every release candidate.

Submit only after the App content page is complete, the privacy and support URLs work without login, reviewer access instructions are accurate, the Data safety form matches runtime behavior, and the release build has been tested on representative Android devices. Use a staged rollout and keep a rollback plan.

## What you personally need to provide or decide

| Decision or asset | Why it is needed |
| --- | --- |
| Legal business/contact identity | Store listing, privacy, copyright, and support pages |
| Final privacy policy and Terms | User trust and Play review |
| Android application ID and signing ownership | Release identity and update continuity |
| Google Play Console account | Testing, product catalog, declarations, submission |
| Final digital product names, prices, regions, and trial policy | Play Billing catalog |
| Support and copyright-reporting inbox | Moderation, takedowns, appeals, deletion support |
| Whether ads or news classification apply | Play Console declarations |
| Closed-test users and Android devices | Real-world release validation |

## Official references

[1] [Google Play account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)

[2] [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)

[3] [Google Play Billing](https://developer.android.com/google/play/billing)
