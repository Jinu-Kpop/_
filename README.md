# Jinu Kpop — Cute Futuristic Site (KPDH theme)

This repository is a personal landing page with a cute futuristic K-pop vibe. Features include:
- Circular glowing logo, starfield background, pastel neon UI
- Big draggable music bubble with full controls
- Playlist loader supporting local MP3s (recommended) and Google Drive file link importer
- Autoplay if there's exactly one song (will loop)
- Secret modal, Konami easter egg, logo jingle, many animations
- Achievements (stored locally). Sign in locally with a username to save achievements.

---

## Files
- `index.html` — main page
- `styles.css` — design & animations
- `script.js` — behavior
- `songs.json` — your playlist (optional; the site also supports importing run-time links)
- `assets/`
  - `logo.png` (recommended)
  - `fun.png` (fun.gif works too)
  - `jingle.mp3` (logo click sound)
  - `songs/` (put MP3s here, e.g. `The Storyteller.mp3`)

---

## Quick GitHub Pages setup
1. Create a repo on GitHub (e.g. `jinu-kpop-site`).
2. Upload these files and the `assets/` folder (use GitHub web or push with git).
3. Edit `songs.json` (optional) to include your MP3s (example below).
4. In repo Settings → Pages: select branch `main` and folder `/ (root)`. Save.
5. Wait ~1–2 minutes and visit `https://<username>.github.io/<repo>/`.

---

## Using Google Drive songs (how to import)
If you prefer not to upload MP3s to GitHub, use Google Drive file share links:
1. Open your Drive file (right-click file → Get link → set to "Anyone with the link" and copy the link).
2. Open the live site, open the big music bubble, paste file share links (one per line) into the import box.
3. Click **Import** — the site attempts to convert Drive share links into direct download links.

---

## songs.json example (one-song autoplay)
```json
[
  {
    "title": "The Storyteller",
    "artist": "Jinu",
    "url": "assets/songs/The Storyteller.mp3"
  }
]
