# MediSync Design System

## Objective

Redesign the entire MediSync application into a modern, elegant, professional healthcare management platform.

The redesign is UI-only.

DO NOT change:

- Backend APIs
- Database models
- Context API
- Routing
- Business logic
- Fetch calls
- Form functionality

Only improve the UI while keeping the application fully functional.

---

# Overall Design

The application should feel similar to modern SaaS dashboards.

References

- Notion
- Stripe Dashboard
- Linear
- Vercel
- One Medical
- Google Health

Keywords

- Professional
- Medical
- Spacious
- Elegant
- Minimal
- Clean
- Modern
- Consistent

Avoid

- Glassmorphism
- Heavy gradients
- Cartoon design
- Bright colorful backgrounds
- Neon colors
- Oversized shadows
- Excessive animations
- Fancy hover effects
- Rotating icons
- Scaling cards dramatically

---

# Color Palette

Primary

Blue 600

Secondary

Slate

Background

Slate 50

Card

White

Border

Slate 200

Headings

Slate 900

Body Text

Slate 600

Muted Text

Slate 500

Success

Green

Warning

Amber

Danger

Red

Use colors consistently throughout the project.

---

# Typography

Font

Inter

Fallback

system-ui

Hierarchy

Page Title

Large
Bold

Section Title

Medium
Semibold

Card Title

Medium
Semibold

Normal Text

Comfortable reading size

Muted Text

Small
Slate 500

Never mix random font sizes.

---

# Layout

Desktop

Wide layout

Maximum width

1280px

Padding

32px

Sections

64px spacing

Cards

24px spacing

Forms

20px spacing

Mobile

Single-column layout

Tablet

Two-column layout when appropriate

---

# Navigation

Navbar

White background

Small bottom shadow

Sticky

Logo left

Navigation right

Icons beside menu labels

Active page

Blue underline

Hover

Subtle text color change

Logout

Red outline or filled red button

---

# Lucide React Icons

Use lucide-react icons consistently.

Do not use emojis.

Navigation

Dashboard

LayoutDashboard

Medicines

Pill

Health

HeartPulse

Doctors

Stethoscope

Prescriptions

FileImage

Profile

UserRound

Logout

LogOut

Homepage

ShieldCheck

ClipboardPlus

Brain

Pill

ChartSpline

Hospital

Dashboard

Heart

Droplets

Activity

Scale

Calendar

Clock

Profile

User

Phone

Building2

HeartHandshake

Doctors

Hospital

MapPin

Phone

Clock

Award

Prescription

Upload

Image

Calendar

Trash2

Eye

Medicine

Pill

Clock3

ImagePlus

Health

Activity

Heart

Droplets

TrendingUp

Use icons only where they improve readability.

Icons should remain small and subtle.

---

# Cards

All information should be inside cards.

Card

White

Rounded 2xl

Border

Light shadow

24px padding

Hover

Only slightly stronger shadow

No scaling

---

# Buttons

Primary

Blue

Rounded XL

Medium font

Height

44px

Secondary

White

Gray border

Danger

Red

Icons should appear inside buttons when appropriate.

Examples

Upload

Save

Delete

Edit

Add

Logout

---

# Forms

Every form should follow the same style.

Label

Above input

Input

Rounded XL

Height

44px

White background

Light gray border

Focus

Blue border

Blue ring

Textarea

Same style

Checkboxes

Proper spacing

Radio buttons

Proper spacing

Select

Same style

Use icons inside form sections only.

---

# Dashboard

Dashboard should resemble a healthcare analytics dashboard.

Order

Greeting

↓

Health Summary

↓

Statistics

↓

Latest Health Metrics

↓

Quick Actions

↓

Recent Activity

↓

Health Tips

Cards

Medicine count

Doctor count

Prescription count

Health logs

Quick Links

Medicines

Doctors

Health

Profile

Prescriptions

Summary

AI-style health summary

Professional paragraph

No chatbot appearance

---

# Homepage

Homepage is a landing page.

Sections

Hero

Features

How It Works

Health Monitoring

Privacy

Future AI

Call To Action

Footer

Reserve image placeholders.

Example

Hero

Left

Heading

Description

Buttons

Right

Large illustration placeholder

Feature section

Every feature card

Icon

Title

Description

Later real illustrations can replace placeholders.

---

# Login

Centered authentication card

Logo

Title

Subtitle

Inputs

Login button

Signup link

Simple

Professional

---

# Signup

Same style as Login

---

# Medicines

Two-column layout

Left

Medicine cards

Right

Form

Medicine card

Pill icon

Medicine name

Dosage

Schedule

Actions

---

# Doctors

Two-column layout

Left

Doctor cards

Right

Form

Doctor card

Doctor icon

Hospital

Speciality

Visiting days

Phone

Designation badge

---

# Prescriptions

Two-column layout

Left

Prescription gallery

Right

Upload form

Cards

Image

Hospital

Date

Preview

Delete

Image preview

Large modal

Google Drive style

---

# Profile

Two columns

Left

Summary cards

Personal

Medical

Lifestyle

Emergency Contact

Right

Profile form

Each summary card

Icon

Title

Information

---

# Health

Charts inside cards

Metric summary cards above charts

Latest BP

Latest BMI

Latest Blood Sugar

Charts aligned consistently

---

# Empty States

Every page should have a proper empty state.

Example

Large icon

Title

Description

Action button

Never leave empty white space.

---

# Loading

Prefer skeleton cards.

Avoid loading spinners unless necessary.

---

# Images

Images

Rounded 2xl

Object cover

Border

Light shadow

Keep placeholders until real images are added.

---

# Shadows

Use

shadow-sm

shadow-md

Avoid

shadow-xl

shadow-2xl

Colored shadows

---

# Border Radius

Cards

rounded-2xl

Buttons

rounded-xl

Inputs

rounded-xl

Images

rounded-2xl

Badges

rounded-full

---

# Animations

Very subtle.

Allowed

transition

duration-150

hover background

hover border

hover shadow

Forbidden

Bounce

Rotate

Continuous animation

Large scaling

Parallax

---

# Accessibility

Buttons should have icons and labels.

Clickable items

Pointer cursor

Focus states visible

Text contrast should remain high.

---

# Reusable Classes

Prefer existing global classes.

Use

container

page

section

card

stat-card

page-title

section-title

card-title

btn-primary

btn-secondary

btn-danger

input

badge

image-card

Avoid inline styling whenever possible.

---

# Components

Avoid unnecessary new components.

Reuse existing ones.

Only create components when reused across multiple pages.

---

# Code Rules

Keep files reasonably small.

Do not duplicate logic.

Reuse Context API.

Reuse existing fetch calls.

Keep current folder structure.

No backend changes.

No API changes.

UI improvements only.

---

# Final Goal

Every page should look like part of the same application.

The entire UI should resemble a polished healthcare SaaS dashboard suitable for real-world use, emphasizing clarity, consistency, accessibility, and professionalism over decorative effects.