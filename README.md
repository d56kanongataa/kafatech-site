# kafatech.to: hub site

Static site, no build step. Open `index.html` locally to preview.

## Edit projects
All project cards, the marquee and footer links come from `projects.js`.
Set each `url` to make its card clickable (cards with `url: "#"` show "In development").

## Logos
Done: Kafa Tech, Takeaway Pacific, All-Pacific Sports, Pacific Pay (from your uploads).
Still needed: `assets/logos/exchange.png` and `assets/logos/koula-rewards.png` (square transparent PNG, ~256px).
To give a card a logo panel, set `media: { logo: "assets/logos/<file>.png" }` in projects.js.

## Interactions
Mouse: cards tilt and glow, logos zoom, buttons are magnetic. Tap/click: opens live sites, otherwise flips the card.
Press and hold (any device): flips the card, with a short vibration on Android. Mobile: project cards are a swipe carousel with dots.
All motion is disabled for visitors with "reduce motion" turned on.

## Hosting (GitHub Pages, free, no badge)
This repo is served by GitHub Pages from `main` (root). `CNAME` holds the domain `kafatech.to`.
Any push to `main` goes live within a minute or two. No build step.

DNS at the .to registrar (leave the `MX` email records alone):
- `A` records, host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` record, host `www`: `d56kanongataa.github.io`

## Fonts
Sora and Inter, self-hosted in `assets/fonts/` (SIL Open Font License), so no third-party requests.
