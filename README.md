# Kanishka Mogha - SDET Portfolio

Static portfolio website deployed with GitHub Pages.

## Live URL

After GitHub Pages finishes deployment, the site should be available at:

```text
https://cazmick.github.io/kanishka-sdet/
```

## Deployment

This repository uses GitHub Actions for Pages deployment.

Workflow file:

```text
.github/workflows/pages.yml
```

If the workflow does not start automatically, enable Pages manually:

1. Open repository **Settings**.
2. Go to **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Re-run the `Deploy static site to GitHub Pages` workflow from the **Actions** tab.

## Local preview

Open `index.html` directly in a browser, or run a simple static server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```
