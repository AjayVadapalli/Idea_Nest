import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://79a6f5dea54cca38af80b57aa402e33b@o4509093814992896.ingest.us.sentry.io/4509094286065664",
  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
    }),
  ],
});