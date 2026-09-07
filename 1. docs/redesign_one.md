# MediSync UI Redesign Context

## Project

MediSync is a full-stack personal health management web application.

The backend is complete.

Current modules

- Authentication
- Dashboard
- Profile
- Medicines
- Health Logs
- Doctors
- Prescriptions

Future modules

- OCR
- AI Summary
- Medical Documents
- PDF Export

Tech Stack

Frontend

- React 19
- Vite
- React Router v7
- Context API
- TailwindCSS v4
- Chart.js
- Lucide React

Backend

- Express
- MongoDB
- JWT

--------------------------------------------------------

# IMPORTANT

DO NOT CHANGE

- API calls
- Fetch logic
- Context API
- Authentication
- Backend
- MongoDB models
- Routes
- Folder structure
- State management
- Business logic

Only redesign the UI.

Everything must continue working exactly the same.

--------------------------------------------------------

# Goal

Transform MediSync into a premium healthcare SaaS application.

The application should feel like software used by

Hospitals

Clinics

Medical Centers

Doctors

Healthcare startups

instead of a university project.

--------------------------------------------------------

# Design References

Use inspiration from

- Linear
- Stripe Dashboard
- Notion
- One Medical
- Google Health
- Vercel Dashboard

DO NOT copy them.

Only follow their design philosophy.

--------------------------------------------------------

# Design Keywords

Professional

Minimal

Elegant

Medical

Clean

Modern

Readable

Premium

Trustworthy

Organized

Spacious

Calm

--------------------------------------------------------

# Avoid

Glassmorphism

Neumorphism

Heavy gradients

Colorful backgrounds

Neon colors

Large shadows

Rounded cartoon blobs

Overly playful UI

Animated backgrounds

Random colors

Material UI style

Bootstrap appearance

Student project appearance

--------------------------------------------------------

# Color Palette

Primary

Blue 600

#2563EB

Primary Hover

Blue 700

#1D4ED8

Accent

Sky 500

#0EA5E9

Background

Slate 50

#F8FAFC

Card

White

#FFFFFF

Border

Slate 200

#E2E8F0

Primary Text

Slate 900

#0F172A

Secondary Text

Slate 600

#475569

Muted Text

Slate 500

#64748B

Success

Green 600

Warning

Amber 500

Danger

Red 600

Never introduce additional colors unless absolutely necessary.

--------------------------------------------------------

# Typography

Use

Inter

Fallback

system-ui

Hierarchy

Page Title

36px

Bold

Section Title

28px

Semibold

Card Title

20px

Semibold

Normal Text

16px

Muted Text

14px

Small Labels

13px

Good line height.

Never overcrowd text.

--------------------------------------------------------

# Layout

Desktop

Max width

1280px

Padding

32px

Tablet

24px

Mobile

20px

Vertical spacing between sections

64px

Spacing between cards

24px

Spacing inside cards

24px

Spacing between form controls

20px

Never make pages feel cramped.

--------------------------------------------------------

# Navbar

Sticky

White background

Thin bottom border

Small shadow

72px height

Logo left

Navigation right

Icons beside navigation labels

Active page

Blue underline

Hover

Subtle text color change

Logout

Red button

Professional appearance.

--------------------------------------------------------

# Cards

Every data block should use cards.

Cards

White

Rounded-2xl

Border

Slate 200

Shadow-sm

Padding

24px

Hover

Only slightly stronger shadow

No scaling

No floating animation

--------------------------------------------------------

# Buttons

Primary

Blue background

White text

Rounded-xl

Height

44px

Medium weight

Secondary

White

Gray border

Dark text

Danger

Red

Buttons should optionally include Lucide icons.

Examples

Save

Upload

Delete

Edit

Add

Logout

--------------------------------------------------------

# Forms

Labels above inputs

Rounded-xl inputs

44px height

Blue focus ring

Consistent spacing

Textareas

Same design

Selects

Same design

Checkboxes

Proper spacing

Radio buttons

Proper spacing

Never mix input styles.

--------------------------------------------------------

# Icons

Use Lucide React.

Never use emojis.

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

Dashboard

Heart

Droplets

Activity

Scale

Calendar

Clock

Homepage

ShieldCheck

Brain

ClipboardPlus

Hospital

ChartSpline

Pill

Medicines

Pill

Clock3

ImagePlus

Trash2

Pencil

Doctors

Hospital

Phone

Clock

Building2

Award

Prescriptions

Upload

Image

Eye

Trash2

Calendar

Profile

User

Phone

HeartHandshake

Building2

Health

Activity

Heart

Droplets

TrendingUp

Icons should remain subtle.

Use them only where helpful.

--------------------------------------------------------

# Dashboard

Dashboard should feel like a professional analytics dashboard.

Structure

Greeting

↓

Health Summary

↓

Statistics Cards

↓

Latest Health Metrics

↓

Quick Actions

↓

Recent Activity

↓

Health Tips

Cards should align perfectly.

Statistics

Medicine Count

Doctor Count

Prescription Count

Health Logs

Summary should feel AI-generated.

--------------------------------------------------------

# Homepage

Landing page.

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

Do not hardcode illustrations.

Leave professional placeholder containers for future images.

--------------------------------------------------------

# CRUD Pages

Medicines

Doctors

Prescriptions

Profile

Use the same layout.

Two columns.

Left

Existing records

Right

Add/Edit form

Never redesign each CRUD page differently.

All CRUD pages should look like they belong to the same application.

--------------------------------------------------------

# Profile

Left

Personal Information

Medical Information

Lifestyle

Emergency Contact

Right

Edit Form

--------------------------------------------------------

# Doctors

Left

Doctor Cards

Right

Doctor Form

Doctor cards should clearly display

Hospital

Speciality

Phone

Visiting Days

Designation

--------------------------------------------------------

# Prescriptions

Left

Gallery

Right

Upload

Cards

Image

Hospital

Date

Preview

Delete

Large preview modal

--------------------------------------------------------

# Health

Metric summary cards

↓

Charts

↓

History

Everything inside cards.

--------------------------------------------------------

# Login

Centered authentication card.

Professional.

Minimal.

Logo

Title

Subtitle

Inputs

Primary Button

Signup Link

--------------------------------------------------------

# Signup

Same design language as Login.

--------------------------------------------------------

# Empty States

Every page should have an empty state.

Large icon

Title

Description

Primary Button

--------------------------------------------------------

# Loading

Prefer skeleton cards.

Avoid large loading spinners.

--------------------------------------------------------

# Animations

Only

transition

duration-150

hover background

hover border

hover shadow

Do NOT use

Bounce

Rotate

Flip

Parallax

Large scaling

Animated gradients

--------------------------------------------------------

# Responsive

Desktop first.

Tablet

2-column layouts when appropriate.

Mobile

Single column.

--------------------------------------------------------

# Accessibility

Pointer cursor

Visible focus

Readable contrast

Large click targets

--------------------------------------------------------

# Code Rules

Reuse existing components.

Do not duplicate code.

Do not add unnecessary components.

Keep architecture unchanged.

Do not rewrite business logic.

Keep API calls untouched.

If a JSX file is larger than the response limit,

split it into multiple responses.

Do not omit any code.

--------------------------------------------------------

# Redesign Workflow

We are redesigning the application phase by phase.

Each phase contains

Page(s)

+

Components used by those pages.

Redesign them together so every page follows exactly the same design language.

Consistency is more important than adding new visual effects.

The final application should look like a polished production healthcare platform.
