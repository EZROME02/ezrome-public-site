# EZROME Play Console worksheet

This worksheet is a preparation aid for the owner-controlled Google Play submission. It is not a Play approval or legal certification. Confirm every answer against the production Android build and Google Play Console forms.

## App identity

| Field | Working value | Owner action |
| --- | --- | --- |
| App name | EZROME | Confirm final store name |
| Application ID | `com.ezrome.app` | Confirm availability and create the Play app under the owner account |
| Publisher | Sixolile Ezrome Mtyhali / EZROME | Confirm the developer-account display identity |
| Primary country | South Africa | Confirm account and business details |
| Support email | `support@ezrome.co.za` | Create, verify, and monitor through Cloudflare Email Routing |
| Copyright email | `copyright@ezrome.co.za` | Create, verify, and monitor through Cloudflare Email Routing |
| Website | `https://ezromepub-f3hzkejz.manus.space` | Confirm final public URL and policy paths |

## V1 release scope

The working free-first scope includes Watch, Shorts, Creator Stations, Community, Football/Rated Opinionz, hip-hop and entertainment culture, discovery/search, offline library behavior, creator download controls, reporting, moderation, account deletion, and AI-assisted drafts with human approval.

Live streaming, advertising, creator payouts, marketplace functions, and active premium checkout are deferred. The current build must not be described as having live paid subscriptions until Google Play Billing and server-side purchase verification are implemented and tested.

## Data-safety preparation

| Data or capability | Working description to verify in production |
| --- | --- |
| Account identity | Authentication and account profile information are used to provide signed-in features. |
| User-generated content | Videos, thumbnails, channel details, community posts, comments, reports, and moderation records may be submitted by users. |
| App activity | Playback, saved stories, offline-library records, and creator actions may be processed to provide the service. |
| Files and media | Creator media is stored through managed object storage; database rows hold metadata and access references. |
| Device or technical data | Only the technical information required for reliability, authentication, storage, and offline behavior should be retained. Verify the production analytics configuration. |
| Deletion | Signed-in account deletion is available in-app, and a public deletion resource is linked from the policy footer. Test both paths. |
| Sharing | Confirm every actual analytics, authentication, storage, email, and AI provider before declaring whether data is shared with service providers. |
| Security | Do not include secrets, upload keys, signing keys, or private credentials in the app, repository, screenshots, or store listing. |

## Closed-test script

1. Install the release candidate on at least two real Android devices and one clean account.
2. Verify sign-in, sign-out, session expiry, and account recovery behavior.
3. Create a creator station, upload a permitted test video, and verify the creator download toggle.
4. Watch the video online, save it to the library, download it only when permission allows, then test limited offline playback.
5. Submit a report for a test item and verify that the report reaches the human moderation queue.
6. Request account deletion in-app, cancel it while pending, then submit it again and verify the documented state.
7. Open the public Privacy, Terms, Community Guidelines, Support, Copyright/Reporting, and Account Deletion routes without signing in.
8. Verify the Cloudflare-routed support and copyright addresses using independent sender accounts.
9. Confirm that AI newsroom or release assistance produces drafts only and cannot publish, delete, charge, or change Play Console settings.
10. Record device model, Android version, build number, expected result, actual result, severity, and owner disposition for every case.

## Owner completion fields

- Final professionally reviewed policy URLs: **[OWNER TO COMPLETE]**
- Confirmed Cloudflare destination inbox: **[OWNER TO COMPLETE]**
- Play Console developer account: **[OWNER TO COMPLETE]**
- Final Android signing and upload-key custody: **[OWNER TO COMPLETE — never share keys in chat]**
- Closed-test tester list and devices: **[OWNER TO COMPLETE]**
- Data-safety declarations verified against production: **[OWNER TO COMPLETE]**
- Content rating and target-audience answers verified: **[OWNER TO COMPLETE]**
- Ads declaration: **No ads in free-first V1 unless the owner changes scope and updates the declarations.**
- Billing catalog: **Deferred; no active digital checkout in the current release candidate.**
