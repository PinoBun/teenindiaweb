# TeenIndia — Hub (Anime.js + Live Reddit)

This version includes:
- Your PNG logo + an SVG wordmark underline.
- Official links (Discord, Instagram, YouTube, Reddit, Chat, Wiki, Rules).
- Live feed of posts with the **Mod’s Choice** flair via Reddit JSON (auto-refresh every 5 minutes).

## Quick start
1. Unzip and open `index.html` in a browser.
2. Update links in `index.html` if needed.
3. No backend required. Reddit JSON is fetched client-side.

## Notes
- Reddit may rate limit or block some requests if opened too frequently; the UI handles errors gracefully.
- If you ever need CORS-free reliability, use a tiny proxy (Netlify function / Vercel edge) — I can add that.
