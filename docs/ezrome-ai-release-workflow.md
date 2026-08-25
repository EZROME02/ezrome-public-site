# EZROME AI-assisted release workflow

## Purpose

This workflow supports EZROME V1 without turning the assistant into an autonomous publisher, payment operator, or release owner. It can prepare drafts and evidence for human approval.

## Allowed automated work

The assistant may summarize source material, extract claims and links, classify content into culture, entertainment, football, or product-build lanes, draft newsroom briefs, prepare release notes, generate QA matrices, compare checklist states, and flag missing policy or store-listing fields.

Every generated newsroom summary must retain source URLs, publication timestamps, uncertainty notes, and an explicit human-approval state. Every release artifact must identify its input files and the person who approved it.

## Prohibited automated work

The assistant must not publish posts, approve newsroom summaries, submit a Google Play release, accept legal terms, access production signing keys, alter owner credentials, initiate purchases or refunds, change prices, or mark an entitlement active without verified purchase evidence.

## Provider boundary

The app should treat the model provider as configurable. If a valid Kimi K2.7 endpoint becomes available, configure it through a server-side secret and an allowlisted model identifier; do not place provider keys in the client or source repository. Until the model is verified and credentials are supplied, use the existing approval workflow without hard-coding a nonexistent model name.

## Recommended run sequence

1. Collect only public, permitted source material.
2. Generate a structured draft with source list, confidence, policy flags, and proposed destination.
3. Run deterministic checks for missing sources, unsupported claims, private data, copyright risk, and prohibited actions.
4. Place the draft in an approval queue.
5. Require founder approval before publishing or changing user-facing release state.
6. Record the decision and preserve the source/evidence trail.
