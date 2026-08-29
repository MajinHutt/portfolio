"""
Reads the real numbers out of the published .glb files.

  python scripts/model-stats.py

Prints triangle counts, material counts and texture resolutions straight from
the models on the CDN, so the spec tables in lib/projects.ts state facts rather
than adjectives. Re-run it whenever a model is re-exported, and paste the
numbers in.

It reads from the live CDN rather than a local copy on purpose: those are the
files a visitor actually downloads.
"""

import io
import json
import struct
import sys
import urllib.request

BASE = "https://cdn.jsdelivr.net/gh/MajinHutt/portfolio-assets@main"

MODELS = {
    "Red Velvet Chair": "red-velvet-chair/chair.glb",
    "Low Poly Island": "low-poly-island/island.glb",
    "Lego Batman": "lego-batman/batman.glb",
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "model-stats"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def image_size(blob: bytes):
    """Dimensions from the file header. Covers PNG, JPEG and WebP."""
    if blob[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", blob[16:24])
        return w, h, "PNG"

    if blob[:2] == b"\xff\xd8":  # JPEG: walk the segment markers to a SOF
        i = 2
        while i < len(blob) - 9:
            if blob[i] != 0xFF:
                i += 1
                continue
            marker = blob[i + 1]
            if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
                h, w = struct.unpack(">HH", blob[i + 5 : i + 9])
                return w, h, "JPEG"
            seg = struct.unpack(">H", blob[i + 2 : i + 4])[0]
            i += 2 + seg
        return None, None, "JPEG"

    if blob[:4] == b"RIFF" and blob[8:12] == b"WEBP":
        if blob[12:16] == b"VP8X":
            w = int.from_bytes(blob[24:27], "little") + 1
            h = int.from_bytes(blob[27:30], "little") + 1
            return w, h, "WebP"
        if blob[12:16] == b"VP8L":
            b = blob[21:25]
            n = int.from_bytes(b, "little")
            return (n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1, "WebP"
        if blob[12:16] == b"VP8 ":
            w = struct.unpack("<H", blob[26:28])[0] & 0x3FFF
            h = struct.unpack("<H", blob[28:30])[0] & 0x3FFF
            return w, h, "WebP"
    return None, None, "unknown"


def describe(px):
    """2048 becomes 2K, which is how modellers actually talk about textures."""
    if px is None:
        return "?"
    if px >= 4096:
        return "4K"
    if px >= 2048:
        return "2K"
    if px >= 1024:
        return "1K"
    return f"{px}px"


def analyse(name: str, path: str):
    url = f"{BASE}/{path}"
    try:
        data = fetch(url)
    except Exception as exc:
        print(f"\n=== {name} ===\n  could not fetch: {exc}")
        return

    if len(data) < 20 or data[:4] != b"glTF":
        print(f"\n=== {name} ===")
        print(f"  NOT A VALID GLB: {len(data)} bytes, header {data[:4]!r}")
        print("  This file needs re-exporting and re-uploading.")
        return

    clen = struct.unpack("<I", data[12:16])[0]
    js = json.loads(data[20 : 20 + clen].decode("utf-8"))

    # The binary chunk follows the JSON chunk, 8 bytes of header in between.
    bin_start = 20 + clen + 8
    binary = data[bin_start:]

    accessors = js.get("accessors", [])
    tris = 0
    for mesh in js.get("meshes", []):
        for prim in mesh.get("primitives", []):
            idx = prim.get("indices")
            if idx is not None and idx < len(accessors):
                tris += accessors[idx]["count"] // 3

    views = js.get("bufferViews", [])
    resolutions = []
    for img in js.get("images", []):
        bv = img.get("bufferView")
        if bv is None or bv >= len(views):
            continue
        v = views[bv]
        off = v.get("byteOffset", 0)
        blob = binary[off : off + v["byteLength"]]
        w, h, fmt = image_size(blob)
        resolutions.append((w, h, fmt))

    # Per-mesh, because a total on its own can actively mislead. The island
    # read as 137k triangles until it was clear that 96% of them were a single
    # subdivided ocean plane, and the island itself was 6k.
    node_name = {}
    for n in js.get("nodes", []):
        if "mesh" in n:
            node_name.setdefault(n["mesh"], n.get("name", ""))

    per_mesh = []
    for i, mesh in enumerate(js.get("meshes", [])):
        t = 0
        for prim in mesh.get("primitives", []):
            idx = prim.get("indices")
            if idx is not None and idx < len(accessors):
                t += accessors[idx]["count"] // 3
        per_mesh.append((mesh.get("name") or node_name.get(i, "") or f"mesh {i}", t))
    per_mesh.sort(key=lambda r: -r[1])

    print(f"\n=== {name} ===")
    print(f"  File size    : {len(data) / 1024 / 1024:.2f} MB")
    print(f"  Triangles    : {tris:,}")
    if len(per_mesh) > 1 and tris:
        print("  Per mesh     :")
        for mesh_name, count in per_mesh:
            print(f"     {mesh_name:<26}{count:>10,}  {count / tris * 100:5.1f}%")
    print(f"  Meshes       : {len(js.get('meshes', []))}")
    print(f"  Materials    : {len(js.get('materials', []))}")
    print(f"  Textures     : {len(js.get('images', []))}")
    for w, h, fmt in resolutions:
        print(f"     {w}x{h} {fmt} -> {describe(max(w, h) if w else None)}")

    if resolutions:
        sizes = [describe(max(w, h)) for w, h, _ in resolutions if w]
        if sizes:
            common = max(set(sizes), key=sizes.count)
            print(f"  Spec line    : {len(sizes)} x {common}")


if __name__ == "__main__":
    for name, path in MODELS.items():
        analyse(name, path)
    print()
