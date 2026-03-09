# Design Document - ZlecTrack (Tablica Zleceń)
**Date:** 2026-03-09
**Status:** Approved (Brainstorming Complete)

## 1. Executive Summary
ZlecTrack is a specialized B2B SaaS for workshop owners (auto, repair, print) designed to eliminate organizational chaos and automate customer communication. The core differentiator is an interactive, automation-ready Kanban board that triggers external webhooks (Make/n8n/Zapier) on status changes.

## 2. Product Architecture

### 2.1. Landing Page & Interactive Hero
- **Aesthetics:** Professional Modern SaaS (Option A). Clean typography, Indigo/Blue palette, high-end feel.
- **Interactive Hero:** A functional "live" Kanban teaser on a transparent glassmorphic background. Users can drag a sample order (e.g., "Audi A4 Repair") to a "Done" column to trigger a success animation ("Webhook Sent!").
- **Bento Grid Features:** Marketing layout highlighting Kanban, Webhooks, Invoice PDF generation, and Stock Management.

### 2.2. Application Dashboard
- **Layout:** Sidebar-based navigation with core modules: Board, Clients, Inventory, Settings.
- **Kanban Board:** Four standard columns: *Nowe* | *W trakcie* | *Czeka na części* | *Gotowe / SMS*. 
- **Efficiency Features:** Quick search by VIN/Customer, "Greasy-finger friendly" mobile design for on-site workshop usage.

### 2.3. Technical Logic & Data Flow
- **State:** Angular Signals for reactive UI updates.
- **Backend:** Supabase with Realtime Subscriptions for multi-device sync.
- **Automation Hub:** Supabase Edge Functions listening to DB triggers on status changes. These functions call external Webhook URLs (Make.com, n8n, Zapier) defined by the user in Settings.
- **Payload:** Structured JSON containing full order metadata to allow complex automation scenarios in third-party tools.

## 3. Implementation Phases (MVP)
1. **Core Shell:** Unified SPA with Landing and Dashboard routes (using Angular 21).
2. **Interactive Board:** Drag-and-drop logic for status changes.
3. **Webhook Engine:** Settings UI and Edge Function trigger logic.
4. **Refinement:** Polishing animations and mobile responsiveness.

## 4. Success Criteria
- Seamless transition from Hero interaction to Dashboard demo.
- Reliable triggering of external webhooks within <1s of status change.
- Highly readable and responsive UI that workshop owners find "simple yet powerful".
