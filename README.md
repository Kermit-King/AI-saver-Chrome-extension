# AI Impulse Saver (Chrome Extension)

A Chrome extension that intercepts checkout clicks and shows a pause overlay before spending.

## What this project includes

- `frontend/`: React + Vite Chrome extension build
- `backend/`: Node server for persuasion messages (works now with a safe fallback response)
- `test.html`: Local page to test the content script quickly

## Prerequisites

- Node.js 18+
- npm
- Python 3.10+
- Google Chrome

## 1) Install dependencies

From the project root:

```bash
cd frontend
npm install

cd ../backend
npm install
```

## 2) Build the extension

```bash
cd ../frontend
npm run build
```

After success, a `dist/` folder is created inside `frontend/`.

## 3) Load extension in Chrome

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select the `frontend/dist` folder

## 4) Serve the local test page (required)

The content script is configured for localhost URLs, so do not open `test.html` directly from Finder.

Start a local server from the project root:

```bash
cd ..
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/test.html`

Click the **Check Out** button to verify the overlay appears.

## 5) Stop the server (important)

If `python3 -m http.server 8000` is running in a terminal, stop it with:

- `Control + C` (in that same terminal window)

If needed, you can also kill the process by port:

```bash
lsof -i :8000
kill -9 <PID>
```

## Optional: Run backend AI service

The basic overlay test works without backend. If backend is running, the overlay will display a personalized persuasion message.

If you want AI responses wired in:

```bash
cd backend
node src/server.js
```

Default backend URL is `http://localhost:5050`.

## Development workflow (quick)

1. Build extension: `cd frontend && npm run build`
2. In Chrome, click **Reload** on the extension card after each rebuild
3. Refresh `http://localhost:8000/test.html`

## Troubleshooting

### Build fails with TypeScript errors

- Run: `cd frontend && npm run build`
- Read the first TypeScript error and fix that file first

### Overlay does not appear

- Confirm extension is loaded from `frontend/dist`
- Confirm page URL is exactly localhost (not `file://`)
- Refresh the page after reloading extension in `chrome://extensions`

### Port 8000 is already in use

Run the server on another port:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080/test.html`

## Project status

Frontend extension flow is active for local testing. Backend API routes `/analyze` and `/analyze-impulse` are compatible with the current frontend payload. Advanced Python/Gemini generation is still in progress.
