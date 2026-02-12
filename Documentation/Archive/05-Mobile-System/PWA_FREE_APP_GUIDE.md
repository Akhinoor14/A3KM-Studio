# Free App Path for A3KM Studio (No Fees)

This repo is already wired as a PWA (installable website). Here’s how to finish it using only free tools and services.

## 1) Use the website icon as the app icon
- Your site icon is `favicon.svg` (root). We’ll keep that as the brand source.
- Generate these PNGs for best install support and place them in `icons/`:
  - `icon-180.png` (Apple/iOS)
  - `icon-192.png` (Android & PWA)
  - `icon-512.png` (PWA Large)

Free generators (no cost):
- PWABuilder Image Generator: https://www.pwabuilder.com/imageGenerator
- Favicon.io Converter: https://favicon.io/favicon-converter/
- RealFaviconGenerator: https://realfavicongenerator.net/

After generating, copy the files into `icons/`. The site is already configured to use them.

## 2) Deploy for free
- Vercel static hosting is free. Push to GitHub → Import on Vercel → Deploy.
- The PWA is auto-registered and will work on your Vercel domain.

## 3) Install for free (no app store)
- Android (Chrome): Open your site → “Install app” prompt or the floating red Install button → Add.
- iOS (Safari): Share → “Add to Home Screen” (Apple doesn’t show the prompt, this is the free path).
- Desktop (Chrome/Edge): Install from the URL bar Install icon.

## 4) Optional: Build a free Android APK (sideload)
If you want an APK without paying Play Store fees:
- Use PWABuilder’s Android platform builder: https://www.pwabuilder.com
- Upload your site URL → Generate Android package → Download the APK/AAB.
- You can sideload the APK on Android devices (Settings → allow installations from this source).
- Note: Publishing on Play Store costs a one-time $25 (not free). Sideloading is free.

## 5) iOS native app (stores are not free)
- Apple App Store requires a paid developer account ($99/year). There’s no free way to publish there.
- Free alternative: keep using the PWA with “Add to Home Screen.”

## 6) Capacitor wrapper (optional, still free to build locally)
- You can create native wrappers for Android/iOS locally for free using Capacitor + Android Studio/Xcode.
- Building and running on your own device is free. Store publishing still requires paid accounts.

Quick steps (optional):
1. Create `capacitor.config.ts` with `server: { url: 'https://your-vercel-url', cleartext: true }` or copy the built web assets.
2. `npx cap add android` / `npx cap add ios`
3. Open in Android Studio/Xcode and run on a device.

## 7) Test checklist (no-cost)
- Install prompt: Appears on Android/desktop within seconds of loading the site.
- Add to Home Screen (iOS): Icon uses `icons/icon-180.png`.
- Offline: Visit, then go offline → basic pages still load (SW cache).
- Manifest: Lighthouse → PWA audit shows green (icons, manifest, SW).

## 8) Common FAQs
- Can icons be SVG only? Browsers prefer PNG for install (we keep SVG as extra). Provide 192/512 PNGs.
- Do I need a custom domain? Optional; free Vercel subdomain works.
- Is Play Store free? No, $25 one-time. iOS is $99/year. PWA install itself is 100% free.

That’s it — you have an installable app experience for free. Add the PNG icons and deploy on Vercel.
