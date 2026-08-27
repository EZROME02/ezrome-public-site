# EZROME Capacitor Android handoff

This document prepares the existing EZROME React/Vite application for an Android wrapper. It does not create a Play Console app, generate signing keys, submit a release, or certify Google Play approval.

## Prepared configuration

| Setting               | Value                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| App name              | `EZROME`                                                                                       |
| Application ID        | `com.ezrome.app`                                                                               |
| Web build directory   | `dist/public`                                                                                  |
| Android scheme        | `https`                                                                                        |
| Web stack             | React 19 / Vite / TypeScript                                                                   |
| Existing capabilities | Manus OAuth, tRPC API, offline/PWA behavior, creator uploads, moderation, sharing, Watch Later |

The repository now contains `capacitor.config.ts` and the following safe scripts:

```bash
pnpm build:frontend
pnpm cap:sync
pnpm cap:open:android
pnpm cap:build:android
```

The Android platform directory is intentionally not committed by this preparation step. Generate it in an owner-controlled Android development environment with `pnpm exec cap add android` after confirming the application ID and installing Android Studio/SDK tooling. Capacitor’s Android workflow is documented by the project maintainers. [1]

## Owner-operated setup

First install Android Studio and the required SDK/platform tools on the owner’s machine. Then run:

```bash
pnpm install
pnpm exec cap add android
pnpm cap:sync
pnpm cap:open:android
```

Inside Android Studio, confirm the package/application ID is exactly `com.ezrome.app`, verify the app label is `EZROME`, and test the debug build on at least two real Android devices or emulators. Do not commit `android/app/*.jks`, `*.keystore`, `google-services.json`, local Gradle secrets, or any Play service-account credentials. The repository ignore rules now exclude these patterns, but the owner remains responsible for checking `git status` before every push.

## Required release checks

Before creating an Android App Bundle, test authentication, sign-out, Shorts vertical scrolling, muted playback, sound controls, sharing, reporting, Watch Later, offline playback, creator upload permission controls, account deletion, moderation, Foundations demos, deep links, and network-loss behavior. Large media should continue to use authorized storage URLs rather than being bundled into the Android package.

For Play Console, create the app under the owner’s developer account, reserve the confirmed package ID, complete the store listing and content declarations, provide the final policy URLs, complete the Data safety form, and create a closed test. Keep the initial release free-first until Google Play Billing products, purchase verification, entitlement restoration, refunds, and subscription-state handling have been implemented and tested. Google’s app-signing and release guidance should be followed for the final signed bundle. [2]

## Secret and signing boundary

The owner must create and control the upload key, app-signing configuration, recovery methods, Play Console roles, and any CI deployment secrets. Private keys and recovery material must stay outside chat, screenshots, the repository, and client-side JavaScript. Keep an encrypted offline backup according to the owner’s security policy.

The repository-side work is complete when `pnpm test`, `pnpm check`, `pnpm build`, and `pnpm exec cap doctor` pass in the owner’s Android environment. A successful local web build alone does not prove that the Android package is ready for Play submission.

## Current handoff status

| Area                               | Status                                                    |
| ---------------------------------- | --------------------------------------------------------- |
| Capacitor dependency and CLI       | Prepared in repository                                    |
| Capacitor app ID and web directory | Configured                                                |
| Android signing                    | Owner-controlled and not generated here                   |
| Play Console app                   | Owner-controlled and not created here                     |
| Cloudflare DNS/email routing       | Still requires the correct Cloudflare zone/account        |
| Final policies                     | Approved working drafts pending professional legal review |
| Closed testing                     | Owner-controlled; real users and devices required         |

### References

[1]: https://capacitorjs.com/docs/android — Capacitor, “Android”.

[2]: https://developer.android.com/studio/publish/app-signing — Android Developers, “Sign your app”.
