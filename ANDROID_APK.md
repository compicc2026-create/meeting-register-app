# Building an Android APK from Meeting Register

Your PWA is already installable as an app (the "Install app" button in the
header). This guide covers going one step further: producing a real `.apk`
file — the kind you can side-load on any Android phone or submit to the
Play Store — built automatically by GitHub whenever you push.

It works by wrapping your **already-hosted** PWA in a **Trusted Web
Activity (TWA)** — Google's official, lightweight way to turn a PWA into an
Android app. The APK doesn't contain a copy of your app; it opens your live
site full-screen inside Chrome's engine. That means it's always in sync
with whatever's deployed, and there's no separate codebase to maintain.

There are two ways to get an APK. Pick whichever fits:

- **Option A — one-off, no setup:** use [PWABuilder.com](https://www.pwabuilder.com/) directly. Paste your hosted URL, click Android, download. Good if you just want a file once.
- **Option B — automated via GitHub Actions:** every push builds a fresh signed APK for you. More setup up front, but you never repeat it. This is the "using GitHub" path — the rest of this guide covers it.

---

## Prerequisite

Your PWA must already be hosted at a stable HTTPS URL (GitHub Pages,
Netlify, etc. — see `SETUP.md`). You'll need that URL's `manifest.json`
address, e.g. `https://<you>.github.io/<repo>/manifest.json`.

---

## Part A — One-time setup (~10 minutes)

This part is interactive (it asks you questions), so it can't run inside
the automated workflow itself. Easiest way to do it with nothing to
install: use a **GitHub Codespace** (a full dev environment in your
browser, free tier available).

1. In your GitHub repo, click **Code → Codespaces → Create codespace on main**.
2. In the Codespace's terminal:
   ```bash
   mkdir android && cd android
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest=https://<you>.github.io/<repo>/manifest.json
   ```
3. Answer its prompts:
   - App name / short name — defaults come from your manifest, press Enter to accept.
   - **Package ID** — a unique reverse-domain identifier, e.g. `com.yourname.meetingregister`. This can't be changed later without publishing as a new app, so pick something you're happy with.
   - "Would you like to create a new signing key?" — **Yes** (first time only).
   - Keystore path — accept the default (`./android.keystore`).
   - **Keystore password** and **key password** — choose strong passwords and save them somewhere safe (a password manager). You cannot recover them, and losing them means you can never update this app again with the same identity.
   - Key alias, plus your name/organization/country — used only for the certificate metadata, not shown to users.
4. This creates, inside `android/`: `twa-manifest.json`, `android.keystore`, `manifest-checksum.txt`, and a full generated Android project.
5. Add a `.gitignore` entry so the keystore never gets committed:
   ```bash
   cd ..
   echo "android/android.keystore" >> .gitignore
   ```
6. Base64-encode the keystore so you can paste it into a GitHub secret:
   ```bash
   base64 -w0 android/android.keystore
   ```
   Copy the long output string.
7. In your repo: **Settings → Secrets and variables → Actions → New repository secret**. Add three secrets:
   | Name | Value |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | the base64 string from step 6 |
   | `ANDROID_KEYSTORE_PASSWORD` | the keystore password from step 3 |
   | `ANDROID_KEY_PASSWORD` | the key password from step 3 |
8. Commit and push everything in `android/` **except** `android.keystore` (your `.gitignore` handles that) — including `twa-manifest.json`, `manifest-checksum.txt`, and the generated project files.

That's it for setup. The keystore itself now lives only in your GitHub
secrets (encrypted) and wherever you personally back it up — never in the
repo.

---

## Part B — Getting an APK (every time after)

Pushing a change to `android/twa-manifest.json` (or running the workflow
manually) triggers the build:

1. Go to your repo's **Actions** tab → **Build Android APK** → **Run workflow** (or just push a change).
2. When it finishes (a few minutes), open the run → **Artifacts** → download `meeting-register-android`.
3. Inside: `app-release-signed.apk` (install directly on any Android phone — you may need to enable "Install unknown apps" for your browser/file manager) and `app-release-bundle.aab` (the format the Play Store wants, if you ever submit there).

---

## Optional — remove the browser address bar

Right after Part A, the APK works but shows a thin Chrome toolbar at the
top. To get the fully "native-looking" experience with no toolbar, you
verify you own both the app and the site:

1. In the Codespace, run `bubblewrap fingerprint` inside `android/` (or open `twa-manifest.json`) to get your signing certificate's SHA-256 fingerprint.
2. Create a file at `.well-known/assetlinks.json` in the **root of your hosted PWA** (so it ends up served at `https://<you>.github.io/<repo>/.well-known/assetlinks.json`):
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.yourname.meetingregister",
       "sha256_cert_fingerprints": ["YOUR:FINGERPRINT:HERE"]
     }
   }]
   ```
3. Redeploy the PWA files (GitHub Pages/Netlify) so that file goes live.
4. Rebuild the APK. The toolbar should disappear.

This step is optional — skip it if the small toolbar doesn't bother you.

## Notes

- JDK 17 specifically is required (older/newer versions are rejected) — the workflow already pins this.
- If Google ever changes Bubblewrap's CLI flags, `bubblewrap build --help` (run in the Codespace) shows the current options.
- Updating the app later (new icon, new name) means editing `android/twa-manifest.json` and re-running `bubblewrap update` once in a Codespace before pushing — the checksum file is how Bubblewrap detects the manifest changed.
