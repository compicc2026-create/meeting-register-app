# Meeting Register — Setup Guide

This app has two halves:

1. **The backend** — a Google Sheet + a small Apps Script attached to it, which acts as your free CRUD API and file store.
2. **The frontend** — the HTML/CSS/JS files in this folder, which you host anywhere (they talk to the backend over the internet, so hosting can be as simple as GitHub Pages).

No servers to pay for, no database to manage — your Google Sheet *is* the database.

---

## Part 1 — Create the Google Sheet backend (5 minutes)

1. Go to [sheets.google.com](https://sheets.google.com) and create a **new blank spreadsheet**. Name it something like "Meeting Register Data".
2. In the sheet, go to **Extensions → Apps Script**. A new tab opens with a script editor.
3. Delete the placeholder `myFunction() {}` code in `Code.gs`, and paste in the entire contents of the **`apps-script/Code.gs`** file from this project.
4. Click the **Save** icon (or Ctrl/Cmd+S).
5. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Description: `Meeting Register API` (optional).
   - **Execute as:** `Me`.
   - **Who has access:** `Anyone`. *(This makes the API URL reachable by your app. It does not expose your sheet publicly — only the fields this script chooses to return, and only to people who have the secret URL.)*
   - Click **Deploy**.
6. The first time you deploy, Google will ask you to **authorize** the script (it needs permission to read/write your Sheet and Drive). Click through the consent screens — you may see an "unverified app" warning since this is your own personal script; click **Advanced → Go to (project name)** to proceed.
7. Copy the **Web app URL** shown after deployment. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`
   Keep this somewhere handy — you'll paste it into the app in Part 3.

A sheet tab named **"Meetings"** and a Drive folder named **"Meeting Register Attachments"** will be created automatically the first time the app is used — you don't need to set those up by hand.

> **Updating the script later:** if you ever edit `Code.gs` again, use **Deploy → Manage deployments → ✎ Edit → New version → Deploy** so the same URL picks up your changes.

> **If you set up your sheet before August 2026:** redeploy the current `Code.gs` (same steps above). It fixes a Google Sheets quirk where typed Date/Time text could get silently reinterpreted as a date-time value and display wrong (e.g. showing `1899-12-30T...`). The fix applies going forward automatically; any old rows already corrupted this way will need their Date/Time retyped once.

---

## Part 2 — Host the frontend

The app is plain static files, so any static host works. Two easy free options:

### Option A: GitHub Pages
1. Create a new GitHub repo and upload everything in this folder **except** the `apps-script/` folder (that one stays only in Apps Script, not on the web host).
2. Repo → **Settings → Pages** → set source to your main branch, root folder.
3. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option B: Netlify (drag-and-drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole project folder (minus `apps-script/`) onto the page.
3. Netlify gives you a live HTTPS URL immediately.

**PWA installability requires HTTPS** (both options above provide it automatically). Opening `index.html` directly from your computer's file system will work for testing the interface, but the "Install app" button and offline caching only activate over HTTPS.

---

## Part 3 — Connect the app to your Sheet

1. Open your hosted app URL.
2. You'll see a banner: **"Not connected to a Google Sheet yet."** Click **Connect now** (or tap the ⚙ gear icon anytime).
3. Paste the **Web app URL** you copied in Part 1, step 7.
4. Click **Save & connect**. The app will test the connection and load your (currently empty) register.

That's it — start logging meetings. Every entry you add, edit, or delete updates the Google Sheet in real time, and any file you attach is uploaded to the "Meeting Register Attachments" folder in your Drive with a view link stored alongside the entry.

---

## Installing as an app

Once hosted over HTTPS and connected:
- **Desktop Chrome/Edge:** click the **Install app** button in the header, or the install icon in the address bar.
- **Android Chrome:** tap **Install app**, or the "Add to Home screen" option in the browser menu.
- **iPhone/iPad Safari:** tap the Share icon → **Add to Home Screen** (iOS doesn't support the automatic install-prompt banner, so this manual step is required there).

## Dashboard features

- **Sort** — click "Topic & location" or "When" in the table header to sort; click again to reverse direction. Your sort and filter choices are remembered on the same device.
- **Search** — press `/` anywhere to jump into the search box. Press `n` to start a new entry. (Shortcuts are disabled while a field or dialog is focused.)
- **Duplicate** — the copy icon on any row opens a prefilled "New entry" form, handy for recurring meetings. It doesn't copy the attachment — each logged meeting keeps its own file.
- **Bulk select** — check any rows (or the header checkbox to select everything currently visible) to delete several at once.
- **Undo** — deleting one or many entries removes them immediately with an "Undo" toast for a few seconds before the change is actually sent to your Sheet. Closing the tab or waiting out the toast makes it permanent.
- **Dark mode** — the moon/sun icon in the header switches themes; your choice is remembered.
- **Language** — the EN/বাং button in the header switches the interface between English and Bengali (your choice is remembered). This translates buttons, labels, filters, and messages — it doesn't translate what you type into Topic/Where, and the one-time Connection Settings screen stays in English since it's technical setup, not daily-use.
- **Export** — the Export button downloads the currently filtered/sorted list as a CSV file.
- **Print** — your browser's print command (Ctrl/Cmd+P) produces a clean printable list with the header/buttons hidden.
- **Connection status** — the dot next to today's date shows Connected (green), Offline (amber, using cached data), or Not connected.

## Building a real Android APK

Want an actual installable `.apk` (not just the browser install prompt),
built automatically by GitHub on every push? See **ANDROID_APK.md** in this
repo — it walks through wrapping this PWA as a Trusted Web Activity using
Google's Bubblewrap tool and a GitHub Actions workflow already included
here (`.github/workflows/build-apk.yml`).

## Notes & limits

- Attachments are capped at **5MB** client-side to keep uploads fast; Apps Script itself can handle larger files if you raise that limit in `app.js` (`MAX_FILE_BYTES`).
- The register works offline for **viewing** the last-loaded list (cached locally); adding, editing, or deleting requires an internet connection.
- Multiple people can use the same hosted app URL and Sheet at once — Google Sheets handles the concurrent writes.
- If you want a completely separate register for a second boss/department, repeat Part 1 with a second spreadsheet and deploy a second app instance (or just add a second "connection" — ask if you'd like this built in as a switcher).
