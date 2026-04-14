# PhishGuard EU Dataset

A curated and continuously updated dataset of **179 legitimate (benign) European websites** for phishing detection research.

## Purpose

- Train/test phishing detection systems
- Benchmark LLM classifiers and traditional ML models
- Compare suspicious sites vs. verified legitimate ones

## Dataset

`dataset.json` — 179 entries across 24 countries and 11 categories, all labeled `benign`.

Each entry contains: `domain`, `url`, `country`, `countryCode`, `city`, `category`, `subcategory`, `language`, `tls`, `registrar`, `yearEstablished`, `description`.

## Dashboard

Interactive dashboard built with React + Express + SQLite:
- Overview with KPI cards and charts
- Searchable/filterable dataset browser
- Analytics deep-dive (registrar distribution, TLD breakdown, domain age, top cities)
- CSV and JSON export

## Running Locally

```bash
npm install
npm run dev        # Development server at http://localhost:5000
npm run build      # Production build
NODE_ENV=production node dist/index.cjs  # Production server
```

## Methodology

See `search-methodology.pplx.md` for the full search and verification methodology, including daily discovery logs, keyword strategies, and verification gates.

## Categories

Government · Technology · Banking & Finance · Education · News & Media · E-Commerce · Transport · Industry · Travel · Healthcare · Culture

## License

Dataset is provided for academic and research purposes.
