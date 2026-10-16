# NBA Records — cultureofspeech

NBA-ийн түүхэн рекордуудын тухай статик танилцуулга сайт (HTML / CSS / JS, GSAP).

## Бүтэц

```
speech/
  index.html      # үндсэн хуудас
  style.css
  script.js
  assets/images/
```

## Локал дээр ажиллуулах

```bash
npm start   # http://localhost:3000
```

## Deploy

Build алхам шаардлагагүй — `speech/` хавтас нь publish хийгдэнэ.

- **Vercel**: repo-г import хийхэд `vercel.json` автоматаар `speech/`-г serve хийнэ.
- **Netlify**: `netlify.toml` нь `publish = "speech"` гэж тохируулсан.
- **GitHub Pages**: Settings → Pages → Source: **GitHub Actions** сонгоход `main` руу push хийх бүрт `.github/workflows/pages.yml` deploy хийнэ.
