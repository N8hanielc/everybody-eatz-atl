# Images

Everything in this folder is served from the site root, e.g.
`public/images/items/green-beans.jpg` → `/images/items/green-beans.jpg`.

## Product photos (Items page carousel)
1. Save a photo you have the rights to use (your own photo, or a royalty-free one) into `public/images/items/`.
   Square images around 800×800 px work best. Keep files under ~300 KB.
2. Open `config/site.ts`, find the item under `groceries.carousel`, and set
   `image: "/images/items/your-file.jpg"` and optionally `imageAlt: "..."`.
3. If the image is missing or fails to load, the site automatically shows the built-in illustration.

Do not hotlink retailer product images — they can disappear or be blocked.

## Partner logos
1. Get the official logo file from the partner (SVG or PNG).
2. Save it to `public/images/partners/`.
3. In `config/site.ts`, set the partner's `logo: "/images/partners/file.svg"`.
Without a logo, the partner's name is shown as text.

## Closing photo (homepage)
Add a pumpkin/autumn photo (e.g. `public/images/closing.jpg`) and set
`closingImage: "/images/closing.jpg"` in `config/site.ts`. Otherwise an illustration is shown.

## Social-sharing image
`app/opengraph-image.tsx` generates a placeholder. To use official artwork, delete that file and add
`app/opengraph-image.png` (1200×630).
