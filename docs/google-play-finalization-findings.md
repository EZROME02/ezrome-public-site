# Google Play finalization findings

1. Google Play Billing covers digital products and content in Android apps, including one-time purchases and subscriptions. Google’s documentation explicitly distinguishes digital items from physical goods and services.

2. If an app enables account creation, Google Play requires an in-app account-deletion path and a web resource where users can request account and associated-data deletion. Developers must also complete the Data deletion questions in Play Console’s Data safety section.

3. Play Console’s App content page is used for privacy-policy URLs, ads declarations, restricted-access instructions, target audience and content, permissions declarations, content ratings, privacy/security practices, and news-app declarations where applicable.

Sources:
- https://developer.android.com/google/play/billing
- https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- https://support.google.com/googleplay/android-developer/answer/9859455?hl=en
