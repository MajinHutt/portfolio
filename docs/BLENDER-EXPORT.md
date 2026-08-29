# Blender export settings

The aim: a `.glb` that looks like your render but downloads in a couple of
seconds. jsDelivr will not serve a file over about 20 MB, and a visitor on a
phone will not wait for one either.

**Target: under 5 MB per model. Under 2 MB is better and usually achievable.**

Check before pushing:

```bash
npm run check-uploads -- ../portfolio-assets
```

---

## 1. Before you export

Do these in Blender, in this order. Most of the file size saving happens here,
not in the exporter.

1. **Apply modifiers**, or set Subdivision Surface **viewport** level to match
   what you want exported. The exporter uses the viewport level, not the render
   level, so a model set to 3 in render and 1 in viewport exports at 1.
2. **Delete what the camera never sees.** Backfaces of a closed object, the
   inside of a mug, the collision mesh you hid: all of it ships unless deleted.
3. **Apply transforms** (Ctrl+A, All Transforms). Unapplied scale causes
   lighting to look wrong in the browser.
4. **Set the origin sensibly** (Object → Set Origin → Origin to Geometry). The
   viewer frames the model on its bounding box, so a stray origin throws off
   the framing.
5. **Triangulate is not needed.** The exporter does it, and the wireframe view
   shows triangles either way.
6. **Name your objects.** They come through into the GLB and make debugging
   possible later.

### Textures

This is usually where the megabytes actually are.

- **2K (2048px) is the ceiling** for anything on this site. 1K is fine for
  small props. A 4K texture set will blow the budget on its own.
- **Pack images into the .blend** (File → External Data → Pack Resources)
  before exporting, or the exporter may silently skip them.
- **Bake procedural shaders to image textures.** Geometry Nodes and procedural
  materials do not survive the glTF format: only baked images do. If your
  velvet shader is procedural, bake it to Base Colour, Roughness and Normal.
- **Combine channels** where you can: glTF expects Metallic in blue and
  Roughness in green of a single ORM texture.

---

## 2. Export dialog settings

File → Export → **glTF 2.0 (.glb/.gltf)**

| Setting | Value | Why |
| --- | --- | --- |
| Format | **glTF Binary (.glb)** | One file, textures embedded. Never use .gltf + separate files here. |
| Include → Limit to | **Selected Objects** | Stops you exporting the whole scene by accident. |
| Include → Data → Custom Properties | off | Nothing needs them. |
| Transform → +Y Up | **on** | glTF convention. Off, and your model lies on its side in the browser. |
| Data → Mesh → Apply Modifiers | **on** | |
| Data → Mesh → UVs, Normals | **on** | |
| Data → Mesh → Tangents | off unless you use normal maps | |
| Data → Mesh → Vertex Colours | only if the shader uses them | Otherwise pure weight. |
| Data → Material → Images | **WebP** if offered, else JPEG | PNG is lossless and enormous. Use PNG only for a texture with hard alpha. |
| Data → Material → Image quality | **75 to 85** | Below 70 shows artefacts on smooth gradients. |
| Data → Shape Keys | on **only** for a rig with correctives | |
| Data → Skinning | on for rigged models, off otherwise | |
| Animation | off unless the piece **is** the animation | A turntable belongs in a video file, not the GLB. |
| **Compression → Draco mesh compression** | **on** | The single biggest win. See below. |

### Draco settings

Tick **Compression**, then:

| Draco setting | Value | Notes |
| --- | --- | --- |
| Compression level | **6** | 0 is fastest, 10 is smallest. 6 is the sensible middle; above 6 the returns are tiny and export gets slow. |
| Quantise Position | **14** | Drop to 12 if the model is small on screen. Below 11 causes visible vertex wobble. |
| Quantise Normal | **10** | |
| Quantise Texcoord | **12** | Lower than 12 makes UVs drift and textures swim. |
| Quantise Colour | **8** | |
| Quantise Generic | **12** | |

Draco routinely takes a mesh to a fifth of its size. The site already ships the
Draco decoder at `/public/draco/`, self-hosted, so compressed files load with
no extra setup and no third-party request.

### If Draco is not enough

Use **Meshopt** instead, via the `gltf-transform` command line tool. The viewer
supports both, so you can switch per model:

```bash
npx @gltf-transform/cli optimize input.glb output.glb --compress meshopt
```

Meshopt decompresses faster than Draco at similar sizes, which matters on
phones. Draco usually wins on file size. Try both and keep the smaller.

---

## 3. Check it before you commit

Drag the exported `.glb` onto **https://gltf-viewer.donmccurdy.com**. Confirm:

- it loads at all (a Draco file that fails here will fail on the site too)
- the scale looks sane
- materials are present, not a flat grey
- the triangle count matches roughly what you expect

Then check the size:

```bash
npm run check-uploads -- ../portfolio-assets
```

---

## 4. The still that goes alongside

Each project needs **one** image: the poster, used as the card thumbnail on the
homepage and as the viewer's pre-load state.

Landscape, roughly 3:2, 2000px wide is plenty. Export as **WebP or AVIF** if
you can: about half the size of JPEG at the same quality.

There is no wireframe, UV or blockout still to prepare. The viewer renders
those live from the real mesh via its Shaded / Wireframe / Clay buttons, which
is better evidence than a screenshot of the same thing.

### The hero render, specifically

The homepage hero uses whichever project is first in `lib/projects.ts`, shown
full-bleed behind the headline.

**Keep the bottom-left third clear.** The three words and the line beneath them
sit there, and although the type carries a shadow, a busy subject behind it will
fight the copy. Compose with the subject to the right, or leave negative space
at the lower left.

---

## 5. A realistic budget per project

| File | Target |
| --- | --- |
| Model `.glb` | under 5 MB |
| Poster render | under 400 KB |
| Video, if any | under 15 MB |
| **Project total** | **under 20 MB** |

At that size the whole portfolio stays comfortably inside every free tier, and
loads quickly on a phone on mobile data, which is how a fair number of people
will first see it.
