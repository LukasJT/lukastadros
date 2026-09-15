// Type of the runtime binding module supplied by the Cloudflare Vite plugin.
declare module 'cloudflare:workers' { export const env: Record<string,unknown>; }
