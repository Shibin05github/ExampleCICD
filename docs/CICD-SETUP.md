# CI/CD Setup Guide for ExampleCICD

This guide explains **why** CI/CD is needed for this React Native project and **how** to set it up in detail.

---

## Part 1: Why CI/CD Is Needed

### 1. **Catch bugs before they reach users**
- **Tests** run on every push so regressions are caught in minutes, not in production.
- **Lint** and **type checks** catch style and type errors before code is merged.
- For a React Native app, this means fewer crashes and broken flows on Android/iOS.

### 2. **Consistent, repeatable builds**
- Builds run in a clean environment (e.g. GitHub Actions) with fixed Node/Java/Xcode versions.
- No “works on my machine” — the same commands produce the same artifacts (APK/AAB, IPA).
- Essential for releasing to Play Store and App Store.

### 3. **Faster feedback for the team**
- Developers see pass/fail within minutes of pushing.
- No need to run full Android/iOS builds locally for every small change.
- PRs can be blocked until CI passes (required status checks).

### 4. **Safe, auditable releases**
- Every release is tied to a commit and a CI run.
- You can trace which build went to which store and when.
- Rollbacks are clearer (revert commit → new build → redeploy).

### 5. **Automation of repetitive work**
- Install deps, run tests, lint, build Android/iOS, and (optionally) upload to stores or internal distribution — all automated.
- Frees time for feature work and reduces human error in release steps.

---

## Part 2: What This Project Already Has

You already have a GitHub Actions workflow at `.github/workflows/main.yml` that:

| Step | What it does |
|------|----------------|
| **CI (build)** | Checkout → Node 20 → `npm ci` → `npm test` |
| **build_android** | After CI passes: Java 17, Android SDK, debug keystore, JS bundle, `gradlew bundleRelease`, upload AAB as artifact |
| **download_bundle** | Downloads the AAB artifact (useful for verification or later deployment) |

So you already have:
- ✅ CI on push to `main`
- ✅ Unit tests in CI
- ✅ Android release build (AAB) and artifact upload

---

## Part 3: Steps to Complete and Harden CI/CD

### Step 1: Add Lint (and optionally typecheck) to CI

**Why:** Lint catches many issues before tests; TypeScript catches type errors.

**1.1** Ensure `package.json` has (you already have `lint`):

```json
"scripts": {
  "lint": "eslint .",
  "test": "jest"
}
```

**1.2** Add a `typecheck` script if you use TypeScript (recommended):

```json
"typecheck": "tsc --noEmit"
```

**1.3** In `.github/workflows/main.yml`, in the `build` job, add steps **after** “Install dependencies” and **before** “Run tests”:

```yaml
- name: Lint
  run: npm run lint

- name: Typecheck
  run: npm run typecheck
```

This makes every push require passing lint and typecheck.

---

### Step 2: Run CI on pull requests (not only push to main)

**Why:** You want CI to run on PRs so you don’t merge broken code.

**2.1** In `.github/workflows/main.yml`, change the `on` section to:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```

Now every PR targeting `main` runs the same CI (and Android build if you keep it).

---

### Step 3: Optional — Add iOS build to CI

**Why:** So both platforms are built and tested in CI.

**3.1** GitHub-hosted runners use macOS for iOS. Add a job (or use a matrix). Example job:

```yaml
build_ios:
  runs-on: macos-latest
  needs: build
  steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20

    - name: Install dependencies
      run: npm ci

    - name: Install CocoaPods dependencies
      run: cd ios && pod install && cd ..

    - name: Build iOS (release)
      run: |
        cd ios
        xcodebuild -workspace exampleCICD.xcworkspace -scheme exampleCICD -configuration Release -sdk iphonesimulator -derivedDataPath build
```

Adjust `-workspace`, `-scheme`, and `-sdk` to match your Xcode project. For real device/IPA you’d need signing and secrets.

---

### Step 4: Use a single Node version and lockfile

**Why:** Reproducibility and matching `engines` in `package.json`.

**4.1** In the workflow, use the same Node version everywhere (e.g. `20`), and always install with:

```yaml
- run: npm ci
```

You already use `npm ci`; keep it. Ensure `package-lock.json` is committed.

---

### Step 5: Add required status checks (branch protection)

**Why:** Prevents merging PRs that fail CI.

**5.1** In GitHub: **Settings → Branches → Branch protection rules** for `main`:
- Enable “Require status checks to pass before merging”.
- Select the statuses from your workflow (e.g. `build`, `build_android`).
- Optionally enable “Require branches to be up to date before merging”.

---

### Step 6: CD — Automate deployment (high level)

**Why:** To go from “build passed” to “build in TestFlight/Play Internal Testing” without manual steps.

**6.1** **Android (Play Store)**  
- Use a service account JSON key and Google Play Android Publisher API.  
- Store the key as a GitHub secret (e.g. `PLAY_STORE_CREDENTIALS`).  
- Add a job that runs only on release (e.g. tag or branch `release/*`): download the AAB artifact, then use a dedicated action (e.g. `r0adkll/upload-google-play`) to upload to an internal track.

**6.2** **iOS (TestFlight)**  
- Use App Store Connect API key or Apple ID + app-specific password.  
- Store credentials in GitHub Secrets.  
- Add a job that builds an IPA (with proper signing), then uploads via `xcrun altool` or a GitHub Action (e.g. `apple-actions/upload-testflight-build`).

**6.3** **When to run CD**  
- Option A: On push to `main` (auto-deploy to internal testing).  
- Option B: On git tag (e.g. `v1.0.0`) for versioned releases.  
- Option C: On push to a `release/*` branch.  

Start with one of these and add the other later.

---

### Step 7: Secrets and environment

**7.1** **Secrets to add in GitHub (Settings → Secrets and variables → Actions)** when you add CD:
- Android: `PLAY_STORE_CREDENTIALS` (service account JSON).
- iOS: e.g. `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, or `APP_STORE_CONNECT_API_KEY` (and related keys).

**7.2** Never commit:
- Keystore passwords or keystore files for release.
- API keys or credentials; use GitHub Secrets and reference them in the workflow with `${{ secrets.SECRET_NAME }}`.

---

### Step 8: Versioning and release notes

**8.1** Bump version in one place and reuse in native projects:
- `package.json` → `version`.
- Sync to `android/app/build.gradle` (e.g. `versionName`, `versionCode`) and to iOS (e.g. `CFBundleShortVersionString`, `CFBundleVersion`) via a script or manual step.

**8.2** For tagged releases, use the tag as the source of truth (e.g. `v1.0.0`) and derive version name/code from it in the workflow.

---

## Part 4: Quick reference — minimal CI pipeline

A minimal but solid CI for this repo looks like:

1. **On every push/PR to `main`:**
   - Checkout → Node 20 → `npm ci`
   - `npm run lint`
   - `npm run typecheck` (if you add the script)
   - `npm test`
   - (Optional) Build Android AAB and upload artifact
   - (Optional) Build iOS (e.g. for simulator) and/or IPA for TestFlight

2. **CD (when you’re ready):**
   - On tag or `main`: take the built AAB/IPA and upload to Play Internal Testing / TestFlight using secrets.

---

## Part 5: File checklist

| Item | Status / action |
|------|------------------|
| `.github/workflows/main.yml` | Exists; add `pull_request`, lint, typecheck |
| `package-lock.json` | Commit and keep in sync with `package.json` |
| `npm run lint` | Present; ensure it’s run in CI |
| `npm run typecheck` | Add script and run in CI |
| Branch protection for `main` | Configure in GitHub |
| Android AAB artifact | Already built and uploaded |
| iOS build | Add job when you need it |
| Play / TestFlight upload | Add CD jobs and secrets when ready |

---

## Summary

- **Need:** Reliable, repeatable builds; early bug detection; safer releases; less manual work.
- **You already have:** CI on push to `main`, tests, and Android AAB build + artifact.
- **Next steps:** Add lint (and typecheck) to CI, run on PRs, protect `main`, then add iOS build and CD (Play + TestFlight) when you’re ready to automate deployment.

If you want, the next step can be: “apply Step 1 and Step 2 to my current `main.yml`” and I can give you the exact patch for your file.
