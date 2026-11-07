# AI Fitness Coach — Fixed Version

This is an isolated working copy. The original repository is not modified.

## Improvements in this branch

- Startup routing checks the logged-in user and fitness profile.
- Fitness profiles and workout progress are scoped to the logged-in email.
- Fitness profile values and corrupt stored data are validated safely.
- Core authentication and application screens are explicitly registered.

## Run

```bash
npm install
npx expo start
```

## Production note

The app still uses local development authentication. A production release must use backend authentication with password hashing, password reset, and secure sessions. AI chat and food-image analysis also require deployment-specific service integration; no API keys are included.
