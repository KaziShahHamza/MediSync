# MediSync Development Rules

## Primary Goal

Maintain a clean, scalable, production-ready codebase.

Every change should improve the application without breaking existing functionality.

---

# Do Not Change

Never modify

- Existing API routes
- Backend business logic
- Authentication flow
- Context API architecture
- Folder structure

unless explicitly requested.

---

# File Size

Prefer files under

150-200 lines.

Split only when a component becomes genuinely reusable.

Avoid creating tiny one-use components.

---

# Component Rules

Create a component only if

- reused
- improves readability
- shared across pages

Otherwise keep logic inside the page.

---

# React Rules

Prefer

Functional components

Hooks

Context API

Avoid unnecessary useEffect calls.

Avoid duplicated state.

---

# Context Rules

Always reuse existing contexts.

Never fetch identical data twice.

Prefer existing fetch functions.

---

# Backend Rules

Never duplicate routes.

Reuse middleware.

Reuse auth.

Reuse models.

Business logic belongs inside services when appropriate.

---

# Styling

Always use

Global utility classes.

Avoid inline styling.

Use Tailwind utilities consistently.

---

# Forms

Every form should

Validate

Use existing button styles

Use existing input styles

Keep spacing consistent.

---

# Layout

Prefer

Two-column CRUD layout.

List left

Form right

Dashboard

Cards

Grid

Summary

Quick actions

---

# Performance

Avoid unnecessary renders.

Avoid duplicated fetch requests.

Avoid repeated calculations.

Reuse utility functions.

---

# Dependencies

Do not install new packages unless necessary.

Prefer existing libraries.

Current libraries

React

Tailwind

Chart.js

Lucide React

---

# Code Quality

Prefer readable code.

Meaningful variable names.

Small functions.

Minimal duplication.

Production-ready.

---

# Comments

Only comment complicated logic.

Do not comment obvious code.

---

# Final Rule

Improve the application while preserving architecture and functionality.