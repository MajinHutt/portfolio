# Uploading the three models: exact steps

Everything here is done once. After the first time, adding a model is just
step 4 again.

Nothing in this process costs money.

---

## What the site is waiting for

The site already knows the filenames. It looks for these three, and until they
exist each project shows a poster with no interactive viewer.

| Project | Exact path it expects |
| --- | --- |
| Red Velvet Chair | `red-velvet-chair/chair.glb` |
| Low Poly Island | `low-poly-island/island.glb` |
| Lego Batman | `lego-batman/batman.glb` |

**The folder and file names must match exactly, including the hyphens and the
lower case.** The CDN runs on Linux, where `Chair.glb` and `chair.glb` are two
different files.

If you would rather use different names, change the `model:` values in
`lib/projects.ts` to match instead. Either way they have to agree.

---

## Step 1: export each model from Blender

**Format: `.glb`, with Draco compression on.** Not `.blend`, not `.fbx`, not
`.gltf` with separate files. One `.glb` per project, textures included inside.

In Blender: **File → Export → glTF 2.0 (.glb/.gltf)**

The settings that matter:

| Setting | Value |
| --- | --- |
| Format | **glTF Binary (.glb)** |
| Include → Limit to | **Selected Objects** |
| Transform → **+Y Up** | **on** (off, and the model lies on its side in the browser) |
| Data → Mesh → Apply Modifiers | on |
| Data → Mesh → UVs, Normals | on |
| Data → Material → Images | **WebP**, or JPEG if WebP is not offered |
| Data → Material → Image quality | 75 to 85 |
| Animation | **off** (none of these three are animated) |
| **Compression** | **on** |

Then open the **Compression** panel and set:

| Draco setting | Value |
| --- | --- |
| Compression level | 6 |
| Quantise Position | 14 |
| Quantise Normal | 10 |
| Quantise Texcoord | 12 |
| Quantise Colour | 8 |
| Quantise Generic | 12 |

Before exporting, check the **viewport** level of any Subdivision Surface
modifier: the exporter uses the viewport level, not the render level. A model
set to 3 for renders and 1 in the viewport exports at 1.

**Target: under 5 MB each. Hard limit: 20 MB.** Full detail and troubleshooting
in `docs/BLENDER-EXPORT.md`.

### Check each file before uploading

Drag the `.glb` onto **https://gltf-viewer.donmccurdy.com**. If it does not
load there, it will not load on the site either. Confirm the scale looks
right, it is the right way up, and the materials came through.

---

## Step 2: create the assets repository (once)

Models do not go in the website repository. They live in a separate one, which
jsDelivr then serves worldwide for free.

Signed in to GitHub as **MajinHutt**:

1. **+ → New repository**
2. Name it exactly **`portfolio-assets`**
3. Set it to **Public**. jsDelivr can only serve public repositories.
4. Tick **Add a README file** so the repository is not empty.
5. **Create repository**

---

## Step 3: put the files in the right folders

Clone it somewhere **outside** the website folder:

```bash
cd "C:/Users/26mar"
```

```bash
git clone https://github.com/MajinHutt/portfolio-assets.git
```

Inside `portfolio-assets`, build exactly this structure:

```
portfolio-assets/
  red-velvet-chair/
    chair.glb
    wireframe.jpg
    uv.jpg
    blockout.jpg
  low-poly-island/
    island.glb
    wireframe.jpg
    uv.jpg
    blockout.jpg
  lego-batman/
    batman.glb
    wireframe.jpg
    uv.jpg
    blockout.jpg
```

The three `.glb` files are the only ones needed to switch the viewers on. The
wireframe, UV and blockout stills fill the strip at the bottom of each project
page, and can follow later.

Check the sizes before pushing:

```bash
cd "C:/Users/26mar/james-hutt-website"
```

```bash
npm run check-uploads -- ../portfolio-assets
```

That fails on anything jsDelivr will not serve, rather than letting you find
out from a broken page.

---

## Step 4: push them

```bash
cd "C:/Users/26mar/portfolio-assets"
```

```bash
git add -A && git commit -m "Add models" && git push
```

---

## Step 5: tell the site where they are (once)

In **Vercel → the portfolio project → Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_ASSET_BASE_URL` | `https://cdn.jsdelivr.net/gh/MajinHutt/portfolio-assets@main` |

Apply it to **Production, Preview and Development**, then **Save**.

Then **Deployments → the most recent one → Redeploy**. Environment variables
are read at build time, so an existing deployment will not pick it up on its
own.

For working locally, put the same line in `.env.local`:

```
NEXT_PUBLIC_ASSET_BASE_URL=https://cdn.jsdelivr.net/gh/MajinHutt/portfolio-assets@main
```

---

## What happens next

The models appear on their own. No code changes.

- Each project page gains a working 3D viewer with **Shaded / Wireframe / Clay**
- The homepage hero swaps the placeholder island for the **Red Velvet Chair**,
  because the hero always shows the first project in the list

---

## If something does not appear

**The viewer still shows the placeholder island.** Almost always the path or
the environment variable. Check the file is at exactly
`red-velvet-chair/chair.glb` in the assets repo, and that you redeployed after
adding the variable.

**The model loads but is grey.** Textures were not packed. In Blender:
**File → External Data → Pack Resources**, then export again.

**The model is on its side.** `+Y Up` was off during export.

**You replaced a file and the old one still appears.** jsDelivr caches for
about 12 hours. Force it to refresh by visiting:

```
https://purge.jsdelivr.net/gh/MajinHutt/portfolio-assets@main/red-velvet-chair/chair.glb
```

**The model is enormous or microscopic.** Apply transforms in Blender
(Ctrl+A → All Transforms) and export again. The viewer frames on the bounding
box, so an unapplied scale throws the framing off.
