# Angular app

## Deploy to Vercel

The Angular application lives in `mini/`. The root-level `vercel.json` configures
Vercel to install and build that app and publish its browser output.

From the repository root, authenticate with Vercel and deploy:

```bash
npx vercel login
npx vercel --prod
```

Alternatively, import this repository in Vercel and keep the project root set to
the repository root so it uses `vercel.json`.