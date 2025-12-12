# Welcome to **Beat Weaver** 🎶

**DEMO**: https://ddhanh.github.io/beat-weaver

## Beat Weaver

<img width="1013" height="990" alt="Screenshot 2025-12-12 at 12 03 26 AM" src="https://github.com/user-attachments/assets/baa1a496-8ef4-4048-89eb-684fe9a824f9" />


## Summary

- A lightweight, music-themed audio-feature exploration and playlist-mapping tool powered by [public FMA dataset](https://github.com/mdeff/fma).

- Provides interactive charts, similarity search, mood maps, and playlist-creation utilities—designed with a fun, colorful, musical UI theme.

- Uses small preprocessed JSON datasets to remain GitHub Pages–friendly with no backend, no tokens, and no external database.

## Some Concepts

- Fuzzy search with Levenshtein distance for approximate string matching and synonym expansion for music-related terms, similarity scoring

- Interactive visualization, static data hosting, client-side processing, and performance-aware lite rendering optimization.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

```sh
cd beat-weaver
npm i
npm run dev
```
For Git Pages deployment
```sh
npm install gh-pages --save-dev
npm run deploy
```
