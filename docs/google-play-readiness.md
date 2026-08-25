# Ezrome Google Play Readiness Notes

These notes are implementation guidance, not legal advice or a guarantee of Google Play approval.

## Verified official requirements

- Play Console's App content page requires policy declarations and reviewer access details; developers must provide a privacy policy where required, declare ads, target audience/content, permissions, content ratings, and sign-in details for restricted areas.
- Apps with login-restricted features must provide working sign-in details and any special instructions for reviewers in Play Console.
- Digital goods, content subscriptions, app functionality, and cloud software/services generally require Google Play Billing unless an applicable policy exception applies.
- Google Play describes in-app products and subscriptions as supported monetization paths; pricing and monetization should be selected in Play Console.
- New personal developer accounts created after November 13, 2023 must run a closed test with at least 12 testers opted in continuously for at least 14 days before applying for production access.
- User-generated content apps need content, moderation, reporting, privacy, copyright, account deletion, and child-safety processes appropriate to the app's actual features.

## Sources

1. Prepare your app for review — https://support.google.com/googleplay/android-developer/answer/9859455?hl=en
2. Understanding Google Play's Payments policy — https://support.google.com/googleplay/android-developer/answer/10281818?hl=en
3. Monetize with Google Play Commerce — https://play.google.com/console/about/guides/play-commerce/
4. App testing requirements for new personal developer accounts — https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
