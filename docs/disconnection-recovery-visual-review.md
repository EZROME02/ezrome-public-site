# EZROME disconnection recovery visual review

## Review scope

The shared EZROME shell and Build Lab route were reviewed at desktop width (1280×720) and mobile width (390×844) after the OAuth and Android-origin hardening.

## Findings

The desktop shell preserves the intended navy, cyan, and violet hierarchy, with the top navigation, side navigation, primary action, and content panel remaining aligned after the authentication changes. The Build Lab heading and learning surface remain balanced without visible overflow.

The mobile shell keeps the compact top bar, primary Create action, content hierarchy, and bottom navigation readable. The Build Lab content wraps within the viewport, and the visual panel remains inside the content column. No new layout shift or horizontal overflow was observed in the reviewed routes.

The connection fallback now avoids rendering a raw error stack and provides an actionable retry path. The actual disconnected state still requires an Android-device test against the configured HTTPS origin because the sandbox preview cannot reproduce a carrier or device network failure.

## Verification boundary

Automated checks passed after the fix: 35 tests, TypeScript, production build, supported-file formatting, and `git diff --check`. The Capacitor configuration now uses the verified HTTPS deployment origin by default and accepts `CAPACITOR_SERVER_URL` for the future Azure/Cloudflare origin.
