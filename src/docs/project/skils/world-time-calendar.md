---
name: khoobrooz-world-time-calendar
description: Rules for international time and calendar widgets for Khoobrooz trade workflows.
---

# World Time and Calendar Skill

Use this skill when building:

- Home page world-clock widgets
- Trade-market time cards
- Calendar/date display
- Time-aware import/export planning UI

## Source Rules

- Use browser/server timezone APIs with IANA timezones for live display.
- Use `https://www.time.ir` as a reference/validation source for Iran date and time.
- Avoid relying on external time websites on every page render.

## Priority Timezones

- Asia/Tehran: Iran
- Asia/Dubai: UAE
- Asia/Shanghai: China
- Europe/Istanbul: Turkey
- Europe/Berlin: Europe/Germany

## UI Rules

- Keep the widget minimal, premium, and service-supportive.
- Use a subtle world-map or connection-pattern background.
- Make the date and key city times readable on mobile.
- Do not let the widget dominate service CTAs.
- Calendar tools should support daily, weekly, and monthly views when used as a practical planning widget.
- Weekly views can use a compact horizontal strip on mobile.
- Monthly views should use a clean Persian calendar grid with Saturday as the first column.

## Content Rules

- Explain why each city matters for trade workflows.
- Use formal Persian copy.
- Avoid unsupported claims about market hours unless verified.
