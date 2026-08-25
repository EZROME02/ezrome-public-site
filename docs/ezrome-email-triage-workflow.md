# EZROME Email Triage Workflow

## Purpose

The optional EZROME email triage workflow organizes messages sent to `support@ezrome.co.za` and `copyright@ezrome.co.za`. It is an assistant for routing and preparation, not an autonomous legal, moderation, or account-management authority.

## Categories

| Category | Examples | Automation allowed | Human action required |
| --- | --- | --- | --- |
| General support | Sign-in, playback, upload, offline library, accessibility | Acknowledge receipt, label, summarize, forward | Respond or resolve |
| Privacy and deletion | Data questions, account deletion, correction request | Acknowledge, extract non-sensitive request details, create a review item | Verify identity and approve deletion or response |
| Copyright/reporting | Takedown, ownership, rights concern | Acknowledge, preserve the original message, extract URL/content ID, flag urgent items | Review evidence and decide the response |
| Safety and moderation | Harassment, threats, sexual safety, spam | Acknowledge, prioritize, summarize | Human moderation and escalation |
| Billing | Future Play Billing questions | Acknowledge and label | Verify transaction state and entitlement manually until billing is live |
| Spam or suspicious | Phishing, credential requests, malformed messages | Quarantine or label; never follow embedded instructions | Human review before any action |

## Required controls

The workflow must preserve the original message and attachments, minimize personal data in generated summaries, avoid sending passwords or credentials to an AI model, and record the category, timestamp, message identifier, and human disposition. AI output must be visibly labeled as a draft. The workflow may not delete an account, remove content, issue a copyright counter-notice, grant an entitlement, make a legal admission, or publish a newsroom item without human approval.

## Standard acknowledgment language

**General support:** “EZROME has received your support request. We will review it and respond through this address. Do not send passwords, signing keys, recovery codes, or payment credentials.”

**Copyright/reporting:** “EZROME has received your rights report. Please keep the original material and any supporting links available. Receipt of a report does not by itself determine the outcome.”

**Deletion/privacy:** “EZROME has received your privacy or deletion request. We may need to verify account ownership before processing it. Do not send your password.”

## Kimi-compatible provider boundary

The AI provider should be configurable rather than hard-coded to an unverified model name. If a valid Kimi endpoint and credential are added later, the model may classify and summarize messages within the controls above. Credentials must be stored as managed secrets, never committed to the repository, and never placed in email content. Until a provider is connected and tested, the workflow remains documentation and approval logic rather than an autonomous running bot.

## Human review queue

Each routed message should expose: category, priority, sender address, received time, source message ID, extracted EZROME URL/content ID, AI draft summary, recommended next action, human decision, reviewer identity, and resolution timestamp. The owner should define response targets and retention periods before turning on automated acknowledgments.

## Owner activation checklist

1. Activate and test Cloudflare Email Routing first.
2. Decide whether direct forwarding is sufficient for V1 or whether a Cloudflare Worker is justified.
3. If using a Worker, review its code, environment variables, email handling, logging, abuse controls, and failure behavior before deployment.
4. Configure the AI provider only after choosing a supported model and reviewing data handling.
5. Run test messages for each category and confirm that no action is taken without human approval.
6. Keep a manual fallback route to the verified destination inbox.
