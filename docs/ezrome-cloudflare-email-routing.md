# EZROME Cloudflare Email Routing & Triage

This guide explains how to activate the approved EZROME public addresses using Cloudflare Email Routing and how to prepare an optional approval-based triage workflow.

## 1. Cloudflare Email Routing setup

Cloudflare Email Routing allows you to create custom addresses for `ezrome.co.za` and forward them to an existing inbox (like your personal Gmail or Outlook) without paying for separate mailbox hosting.

### Prerequisites
- You must have access to the Cloudflare account that manages `ezrome.co.za`.
- You must have access to the destination inbox where you want to receive the forwarded mail.

### Step-by-step activation
1. Log in to your Cloudflare dashboard and select the `ezrome.co.za` zone.
2. Navigate to **Email > Email Routing** in the sidebar.
3. Click **Get Started** or **Enable Email Routing**.
4. Cloudflare will prompt you to add the required MX and TXT records to your DNS. If your DNS is managed by Cloudflare, you can usually click **Add records automatically**.
5. Go to the **Routes** tab and add your destination inbox (e.g., your personal email). Cloudflare will send a verification email to that address. You must click the link in that email to verify it.
6. Once the destination is verified, create two custom addresses:
   - Custom address: `support` -> Action: Send to -> Destination: [Your verified inbox]
   - Custom address: `copyright` -> Action: Send to -> Destination: [Your verified inbox]
7. Test the setup by sending an email from a *different* account to `support@ezrome.co.za` and confirming it arrives in your destination inbox.

## 2. Approval-based triage workflow (Optional)

Once the basic forwarding is working, you can optionally add an automated triage layer. This prevents your personal inbox from being overwhelmed by spam or routine requests while keeping you in control of important decisions.

### How it works
Instead of forwarding directly to your personal inbox, Cloudflare Email Routing can forward messages to a Cloudflare Worker. The Worker can:
1. Receive the incoming email.
2. Use an AI model (like Kimi or Cloudflare's built-in Workers AI) to categorize the request (e.g., "Copyright Takedown", "Account Deletion", "General Support", "Spam").
3. Automatically reply to the sender with a standardized acknowledgment (e.g., "We have received your copyright report and are reviewing it.").
4. Forward only the categorized, legitimate requests to your personal inbox, often with a suggested action or summary.

### Automation boundaries
To maintain safety and compliance, the triage workflow must adhere to these boundaries:
- **No autonomous moderation:** The bot cannot automatically delete user accounts or remove content. It can only prepare the request for your review.
- **No autonomous legal responses:** The bot cannot issue formal legal counter-notices or binding agreements. It can only acknowledge receipt.
- **Owner approval required:** You must manually approve and execute any account deletion, content takedown, or premium entitlement change through the EZROME Trust & Safety settings or database.

### Implementation path
If you want to implement this triage workflow later:
1. You will need to enable Cloudflare Workers in your account.
2. You will need to deploy a specific Worker script that handles the `email` event.
3. You will need to configure the Email Routing rules to send `support` and `copyright` emails to the Worker instead of directly to your inbox.

For now, the direct forwarding setup in Section 1 is sufficient to meet the Google Play and public policy requirements for the V1 release.
