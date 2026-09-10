# Product

## Platform
Web personal portfolio for Lukas Tadros.

## Confirmed scope
Home with biography, about-me text and portrait to be provided. School and coursework, projects, and travel. Travel offers an interactive map whose destinations open photo albums. Real personal content will be supplied later; do not invent it.

## Implementation choices
React/Vinext scaffold, four routes, Leaflet map, repository-managed content. Private preview for review. Public release is a separate decision.

## Owner editing
A protected /admin route edits page copy, portrait, coursework, projects and travel albums. Content persists in D1 and media in R2. Only the configured site-scoped owner identity may mutate content. The Save changes button publishes the staged document atomically with optimistic revision protection.
