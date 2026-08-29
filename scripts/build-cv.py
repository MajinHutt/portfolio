"""
Builds the public, redacted CV at public/james-hutt-cv.pdf.

  python scripts/build-cv.py

WHY THIS EXISTS RATHER THAN A COPY OF THE ORIGINAL PDF
------------------------------------------------------
The original CV carries James's home address and mobile number. Publishing it
would put a young person's home address on an indexed, permanently scrapeable
URL. Covering that text with a black box does not remove it: the characters
stay in the PDF's text layer and any extraction tool reads them straight back
out.

So the public copy is rebuilt from scratch, containing only what a studio or an
admissions tutor actually needs. There is no hidden layer to recover, because
the redacted content was never written into this file.

Keep the full version, with address and phone, for UCAS and direct
applications. Do not commit it.

Content mirrors James's own CV wording. Only the encoding artefacts from the
original export have been repaired.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = "public/james-hutt-cv.pdf"

INK = colors.HexColor("#201e1d")
MUTED = colors.HexColor("#5c5856")
ACCENT = colors.HexColor("#ae1800")

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "name", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=26, leading=28, alignment=0, textColor=INK, spaceAfter=2,
)
role_style = ParagraphStyle(
    "role", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, leading=14, textColor=MUTED, spaceAfter=10,
)
h2 = ParagraphStyle(
    "h2", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=10, leading=13, textColor=ACCENT, spaceBefore=12, spaceAfter=5,
)
body = ParagraphStyle(
    "body", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=13.5, textColor=INK,
)
item_title = ParagraphStyle(
    "item_title", parent=body, fontName="Helvetica-Bold", fontSize=9.5, leading=12.5,
)
item_meta = ParagraphStyle(
    "item_meta", parent=body, fontSize=8.5, leading=11, textColor=MUTED,
)
right_meta = ParagraphStyle(
    "right_meta", parent=item_meta, alignment=2,
)

# ── Content, from James's CV. No address, no phone number. ──────────────────

BACKGROUND = (
    "I'm a self-taught 3D artist with an intermediate command of Blender, having "
    "independently built a portfolio of original assets and developed a solid working "
    "knowledge of 3D pipelines: skills I've pursued alongside completing my A-levels, "
    "informed in part by early exposure to industry tools through my father's career in "
    "the space. I'm now applying to study 3D Animation at BA Honours level to formalise "
    "and build on the technical foundation I've already established through self-directed "
    "practice."
)

EDUCATION = [
    ("Level 3 Diploma Practitioner in Personal Training (RQF)", "", "2026"),
    ("Level 3 Award in Emergency First Aid at Work (RQF)", "", "2026"),
    ("A Levels: Geography, Biology, Economics", "Malmesbury Sixth Form", "2025"),
    (
        "GCSEs: English Language, English Literature, Maths, Science, "
        "Sports Science, Creative iMedia, Geography",
        "Malmesbury Comprehensive School",
        "2023",
    ),
]

EXPERIENCE = [
    ("Fitness coach / Personal trainer", "PureGym Chippenham", "May 2026 to Aug 2026"),
    ("Team member", "Co-op Lyneham", "Jul 2025 to Dec 2025"),
    ("Work experience", "PD Fitness Malmesbury", "Jul 2024"),
    ("Team member", "Co-op Malmesbury (Tetbury Hill)", "Jun 2024 to Sep 2024"),
    ("Assistant coach", "Ignition Tennis", "2021 to 2023"),
]

ATTRIBUTES = [
    "System and software troubleshooting",
    "Active listening and rapport building",
    "Structured planning and execution",
    "Face-to-face communication",
    "Adaptability",
    "Problem solving",
    "Time management and accountability",
    "Committed to ongoing learning",
]

PORTFOLIO = [
    ("Portfolio", "portfolio-flax-pi-n17wrr08c7.vercel.app"),
    ("ArtStation", "artstation.com/james_hutt"),
    ("LinkedIn", "linkedin.com/in/james-hutt-3b518b385"),
    ("Email", "jpfhutt@gmail.com"),
]


def rule():
    return HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#c9c4c1"),
                      spaceBefore=2, spaceAfter=6)


def entry_rows(items):
    """Two-column rows: title and organisation left, dates right."""
    rows = []
    for title, where, when in items:
        left = [Paragraph(title, item_title)]
        if where:
            left.append(Paragraph(where, item_meta))
        rows.append([left, Paragraph(when, right_meta)])

    table = Table(rows, colWidths=[122 * mm, 42 * mm])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def build():
    doc = SimpleDocTemplate(
        OUT, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=16 * mm, bottomMargin=16 * mm,
        title="James Hutt: 3D Artist and Modeller",
        author="James Hutt",
        subject="Curriculum vitae",
    )

    story = [
        Paragraph("James Hutt", name_style),
        Paragraph("3D Artist and Modeller", role_style),
    ]

    contact = " &nbsp;|&nbsp; ".join(f"{label}: {value}" for label, value in PORTFOLIO)
    story += [Paragraph(contact, item_meta), Spacer(1, 4), rule()]

    story += [Paragraph("Background", h2), Paragraph(BACKGROUND, body)]

    story += [Paragraph("Education", h2), rule(), entry_rows(EDUCATION)]
    story += [Paragraph("Experience", h2), rule(), entry_rows(EXPERIENCE)]

    story += [Paragraph("Key attributes", h2), rule()]
    half = (len(ATTRIBUTES) + 1) // 2
    attr_rows = [
        [Paragraph(f"- {a}", body),
         Paragraph(f"- {ATTRIBUTES[half + i]}", body) if half + i < len(ATTRIBUTES) else ""]
        for i, a in enumerate(ATTRIBUTES[:half])
    ]
    attr_table = Table(attr_rows, colWidths=[82 * mm, 82 * mm])
    attr_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(attr_table)

    doc.build(story)
    print(f"Written {OUT}")


if __name__ == "__main__":
    build()
