# react-test

A minimal React app bundled with **esbuild**, written in **TypeScript**, styled with **SCSS**, and using **RxJS** for reactive state.

## Stack

| Concern     | Tool                          |
| ----------- | ----------------------------- |
| Bundler     | esbuild + esbuild-sass-plugin |
| Language    | TypeScript                    |
| UI          | React 19                      |
| Styles      | SCSS (Sass)                   |
| Reactivity  | RxJS                          |

## Getting started

```bash
npm install
npm run dev      # dev server + live reload at http://localhost:3000
```

## Scripts

- `npm run dev` / `npm start` — build, watch, and serve on port 3000 with live reload
- `npm run build` — minified production build into `dist/`
- `npm run typecheck` — run `tsc --noEmit`

## Layout

```
public/index.html      HTML shell (references /index.js and /index.css)
esbuild.mjs            build + dev-server script
src/
  index.tsx            React entry point
  App.tsx              root component (RxJS clock + counter demo)
  hooks/useObservable.ts   bridge an RxJS Observable into React state
  styles/main.scss     global styles
  types/scss.d.ts      module declarations for *.scss imports
```
