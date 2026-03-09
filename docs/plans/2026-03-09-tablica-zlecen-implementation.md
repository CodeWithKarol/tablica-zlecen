# Tablica Zleceń Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the core infrastructure for Tablica Zleceń, including a high-end Landing Page with Interactive Hero and a functional Kanban Dashboard with Webhook triggers.

**Architecture:** A monolithic Angular SPA using Signals for state management and Supabase for real-time persistence and Edge Functions for webhook delivery.

**Tech Stack:** Angular 21, Tailwind CSS, Supabase (DB + Realtime + Functions).

---

### Task 1: Project Setup & Branding

**Files:**
- Modify: `src/app/app.config.ts`
- Modify: `src/index.html`

**Step 1: Set page title and favicon**
Update `index.html` to use "Tablica Zleceń" as the title.

**Step 2: Initialize Theme Variables**
Add Tailwind colors for "Professional SaaS" (Deep Indigo) in `tailwind.config.js`.

**Step 3: Commit**
```bash
git add .
git commit -m "chore: initial project setup for Tablica Zleceń"
```

### Task 2: Interactive Hero Component

**Files:**
- Create: `src/app/landing-page/hero-board.component.ts`
- Modify: `src/app/landing-page/landing-page.html`

**Step 1: Implement CSS-only draggable cards**
Create a lightweight Kanban mockup in the Hero section.

**Step 2: Add "Feedback Bubble" on Status Change**
Implement a visual cue ("Webhook Wyzwolony!") when a card is moved.

**Step 3: Commit**
```bash
git add src/app/landing-page/
git commit -m "feat: add interactive hero board"
```

### Task 3: Core Kanban Board Logic (App Section)

**Files:**
- Create: `src/app/services/orders.service.ts`
- Modify: `src/app/layout-page/layout-page.ts`

**Step 1: Create Order Signal**
Define `orders = signal<Order[]>([])` and methods to move cards.

**Step 2: Implement Drag & Drop**
Use CDK Drag & Drop or a custom Signal-based implementation for the board.

**Step 3: Commit**
```bash
git add src/app/
git commit -m "feat: implement reactive kanban board with signals"
```

### Task 4: Webhook Integration Engine

**Files:**
- Create: `supabase/functions/trigger-webhook/index.ts`
- Create: `src/app/settings/webhook-config.component.ts`

**Step 1: Setup Supabase DB Trigger**
Write a SQL migration to trigger the Edge Function on `order.status` update.

**Step 2: Implement Edge Function**
Write the Deno function to POST JSON payload to the user-provided URL.

**Step 3: Commit**
```bash
git add supabase/
git commit -m "feat: add webhook trigger engine"
```
