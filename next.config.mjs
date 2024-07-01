/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['img.clerk.com'],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' optimal-trout-45.accounts.dev optimal-trout-45.clerk.accounts.dev cdn.jsdelivr.net js.sentry-cdn.com browser.sentry-cdn.com *.ingest.sentry.io challenges.cloudflare.com scdn.clerk.com segapi.clerk.com https://gc.kis.v2.scr.kaspersky-labs.com wss://gc.kis.v2.scr.kaspersky-labs.com https://clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
