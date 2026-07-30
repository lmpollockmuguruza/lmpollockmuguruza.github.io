# papers/

Each folder here is one document: a page that shows the PDF inline, with an
"open in a new window" and a "download" option beside it. There is no index
page — the home page links straight to each one.

## Uploading a PDF

Drop the PDF into its folder using **exactly** the filename below (the viewer
looks for that name):

| Folder | Filename it expects | Page |
| --- | --- | --- |
| `msc-dissertation/` | `Lucas-Pollock-Muguruza-MSc-Dissertation.pdf` | `/papers/msc-dissertation/` |
| `causal-inference-reappraisal/` | `Causal-Inference-Summative-Reappraisal-Lucas-Pollock-Muguruza.pdf` | `/papers/causal-inference-reappraisal/` |
| `cultural-backlash/` | `PSPE-Current-Issues-Summative-Essay-Lucas-Pollock-Muguruza.pdf` | `/papers/cultural-backlash/` |

The CV lives outside this folder, in `/cv/Lucas-Pollock-Muguruza-CV.pdf`, and
its page is `/cv/`.

Until a PDF is uploaded, its page says so in plain words and points readers at
the Dropbox copy instead of showing a broken frame, so nothing 404s while you
work through the uploads. Once the file is there the page switches to the
viewer on its own; you can then drop the `data-fallback` attribute.

Renaming a PDF is fine as long as you change the places that mention it in
that folder's `index.html`: the two `href`s in the action buttons, the
`data-pdf` attribute on `<section class="viewer">`, and the filename shown in
`.viewer-file`.

## Adding a new document

1. Copy an existing folder, e.g. `cp -r cultural-backlash new-paper`.
2. In `new-paper/index.html` edit the `<title>`, the meta description, and
   every mention of the old filename (see above). Drop `data-fallback` if there
   is no external copy to point at.
3. Link to `papers/new-paper/` from the home page.

## Shared bits

Design and behaviour live in two files at the repository root, so every
document page stays in step:

- `pdf-viewer.css` — layout and theming (follows `palette.js` like the rest of
  the site).
- `pdf-viewer.js` — theme toggle, the "not uploaded yet" check, the inline
  frame, full screen, and the hand-off to the system reader on phones, where
  inline PDFs behave badly.
