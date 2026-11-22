# Mohit Boora — Portfolio

Minecraft game-menu styled personal portfolio. Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Framer Motion.
All scenery is lightweight isometric SVG (no real-time 3D, no image assets).

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

## Push to GitHub
```bash
git init -b main
git add .
git commit -m "Initial commit: Minecraft-style portfolio"
# create an empty repo named mohit-portfolio on github.com first, then:
git remote add origin https://github.com/mohitboora/mohit-portfolio.git
git push -u origin main
```

## Deploy on Vercel
Option A (dashboard): vercel.com → Add New → Project → import the GitHub repo → Deploy. Framework is auto-detected as Next.js; no settings needed.

Option B (CLI):
```bash
npm i -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production deployment
```

Edit your details in `lib/data.ts`.
