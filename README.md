# Lukas Tadros personal website

The website lives in `website/`. Run `npm ci` and `npm run dev` there. `npm run build` creates the production build.

## Adding your content
- Biography and portrait: `website/app/page.tsx`. Replace the marked portrait placeholder with your photo; put assets in `website/public/photos/` and reference `/photos/filename.jpg`.
- Courses, projects, and travel: `website/content/site.ts`.
- Each travel destination has a unique id, name, country, latitude, longitude, description, and photos. Photos have a src, descriptive alt text, and optional caption. Each destination automatically gains a keyboard-accessible map marker and album button.

Example destination (illustrative only; not published as a trip):
```ts
{ id: 'example-city', name: 'Example city', country: 'Country', lat: 0, lng: 0,
  description: 'Your trip notes',
  photos: [{ src: '/photos/trip-01.jpg', alt: 'Describe the photo', caption: 'Optional caption' }] }
```

No personal history, coursework, project claims, or visited places are fabricated. All collections start empty. Photo uploads are handled by adding files to the repository; there is no public upload endpoint. The map uses Leaflet and attributed OpenStreetMap tiles (an internet connection is needed). Review the OSM tile usage policy before high-traffic use.
