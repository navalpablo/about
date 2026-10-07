# Pablo Naval Baudín — personal website

Personal academic website for Pablo Naval Baudín, MD, consultant
neuroradiologist and clinical researcher in Barcelona.

Live site: [navalpablo.github.io/about](https://navalpablo.github.io/about/)

## Content model

The website reads [`data/cv.public.json`](data/cv.public.json), a
privacy-filtered derivative of the canonical CV master record. The public JSON
is also available directly from the website at
[`/about/data/cv.public.json`](https://navalpablo.github.io/about/data/cv.public.json).

The canonical master record is intentionally not published in this repository.
After updating it, regenerate the public dataset with:

```sh
node scripts/generate-public-cv.mjs /path/to/Pablo_Naval_Baudin_CV_Master.json
cp data/cv.public.json public/data/cv.public.json
```

The downloadable PDF is stored at
[`public/cv/Pablo_Naval_Baudin_CV_English_July_2026.pdf`](public/cv/Pablo_Naval_Baudin_CV_English_July_2026.pdf).

## Supporting material

Certificates and lecture screenshots are stored in `public/evidence/` and linked
from each activity's `evidence` array in the public CV data. Each link has a
`label`, a `url` relative to the site root, and a `kind` such as `certificate`,
`image`, or `recording`. These files are served by GitHub Pages; the website does
not depend on expiring Notion attachment URLs.

The `courses` array records professional courses attended separately from talks
and teaching. ECNR examination certificates attest to the listed module exams,
not a complete board diploma. When regenerating the public data from a master
record, retain the courses, activity entries and supporting-material links added
to this public dataset.

## Local development

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow that builds and deploys
the static site under `/about/`.

In **Settings → Pages → Build and deployment**, the **Source must be GitHub
Actions**. Do not enable branch publishing: its Jekyll deployment publishes
the README and can overwrite the Next.js site.

The workflow checks the static export before uploading it and verifies that
the live URL serves the same commit and its compiled CSS after deployment.
To run the export check locally:

```sh
npm run pages:build
node scripts/verify-pages.mjs
```

## Author

Pablo Naval Baudín
