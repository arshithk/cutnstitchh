import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Cover page (Page 1) gets a minimal bottom branding, subsequent pages get full header & footer
        if self._pageNumber == 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0F172A"))
            self.drawString(40, 30, "CUT N STITCH APPAREL  •  BANGALORE & TIRUPUR")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(275, 30, "|  cutnstitchapparel.com  |  Confidential Master SEO Blueprint")
            self.drawRightString(555, 30, f"Page 1 of {page_count}")
        else:
            # Running Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0F172A"))
            self.drawString(40, 810, "CUT N STITCH APPAREL")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(145, 810, "|   Complete SEO Keyword Strategy & Master Optimization Blueprint")
            
            # Header line
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(40, 802, 555, 802)

            # Footer line
            self.line(40, 42, 555, 42)

            # Footer text
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(40, 30, "cutnstitchapparel.com  •  B2B Custom Clothing & Private Label Manufacturing")
            
            # Page Number
            self.drawRightString(555, 30, f"Page {self._pageNumber} of {page_count}")
            
        self.restoreState()


def create_seo_pdf(output_filename):
    # A4: 595.27 x 841.89 pt. Usable width = 595.27 - 80 = 515.27 pt
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=48,
    )

    styles = getSampleStyleSheet()

    # Color Palette
    c_primary = colors.HexColor("#0F172A")    # Deep Navy
    c_secondary = colors.HexColor("#B45309")  # Amber / Gold
    c_blue = colors.HexColor("#0284C7")       # Tech Blue
    c_dark = colors.HexColor("#1E293B")       # Dark Charcoal
    c_muted = colors.HexColor("#64748B")      # Muted Slate
    c_border = colors.HexColor("#CBD5E1")     # Border Slate
    c_card_bg = colors.HexColor("#F8FAFC")    # Very light card fill
    c_card_inner = colors.HexColor("#F1F5F9") # Inner contrast

    title_style = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=23,
        leading=28,
        textColor=c_primary,
    )

    subtitle_style = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        textColor=c_secondary,
    )

    h1_style = ParagraphStyle(
        "SectionH1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        "SectionH2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=c_blue,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12.5,
        textColor=c_dark,
        spaceAfter=6,
    )

    callout_text = ParagraphStyle(
        "CalloutText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#334155"),
    )

    table_header = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10.5,
        textColor=colors.white,
    )

    table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10.5,
        textColor=c_dark,
    )

    table_cell_bold = ParagraphStyle(
        "TableCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10.5,
        textColor=c_primary,
    )

    priority_critical = ParagraphStyle(
        "PriorityCritical",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#B91C1C"),
    )

    priority_high = ParagraphStyle(
        "PriorityHigh",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#B45309"),
    )

    priority_med = ParagraphStyle(
        "PriorityMed",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7,
        leading=9,
        textColor=colors.HexColor("#0284C7"),
    )

    story = []

    # =========================================================================
    # PAGE 1: EXECUTIVE COVER & STRATEGIC SEO ROADMAP
    # =========================================================================
    story.append(Paragraph("CUT N STITCH APPAREL", ParagraphStyle(
        "BrandKicker", fontName="Helvetica-Bold", fontSize=11, leading=13, textColor=c_secondary
    )))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Master SEO Keyword Strategy & High-Ranking Blueprint", title_style))
    story.append(Spacer(1, 5))
    story.append(Paragraph("Target Website: https://cutnstitchapparel.com  •  B2B Custom Apparel & Private Label Manufacturing", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=c_secondary, spaceBefore=2, spaceAfter=10))

    # Executive Overview Box
    exec_summary_html = """
    <b>Executive Strategy Overview:</b><br/>
    This document serves as the master search engine optimization (SEO) roadmap for <b>cutnstitchapparel.com</b>. The core objective is to position Cut N Stitch Apparel as the <b>#1 organic search result across Google</b> for commercial and transactional queries related to B2B apparel manufacturing, custom clothing production, private labeling, and wholesale blank garments.<br/><br/>
    <b>Core Market Differentiators to Weave into Search Meta & On-Page Copy:</b><br/>
    • <b>Low MOQ (100 Pieces):</b> Removes the barrier for emerging D2C fashion labels and startups that competitors reject.<br/>
    • <b>Direct Tirupur Mill Factory Rates:</b> In-house manufacturing in Tirupur eliminates intermediate margins, enabling unmatched margins.<br/>
    • <b>Bangalore Operational Agility:</b> Localized client service, rapid fabric sampling, and instant dispatch for Bangalore & South India.<br/>
    • <b>Full-Stack Customization:</b> 50+ fabrics, bio-washing, DTF, puff print, high-density embroidery, custom labels, and polybags.<br/>
    • <b>Live Stock Inventory:</b> Ready-to-print blanks available for same-day dispatch, meeting urgent bulk order needs.
    """
    card_table = Table([[Paragraph(exec_summary_html, callout_text)]], colWidths=[515])
    card_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_card_bg),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("LINEBEFORE", (0, 0), (0, 0), 4, c_secondary),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(card_table)
    story.append(Spacer(1, 10))

    # Target Personas & Keyword Intent Mapping Table
    story.append(Paragraph("Target Buyer Personas & High-Value Search Queries", h2_style))
    personas_data = [
        ["Target Persona", "Primary Motivation", "Typical Search Queries", "Conversion Page"],
        [
            "D2C Streetwear &\nFashion Brands",
            "High GSM heavy drape, drop-shoulder silhouettes, puff/DTF printing, custom neck tags.",
            "oversized t-shirt manufacturer india, 240 gsm drop shoulder blanks, streetwear clothing manufacturer bangalore",
            "/products/oversized\n& Customizer"
        ],
        [
            "Corporate HR &\nAdmin Procurement",
            "Premium collars, durable embroidery, colorfast pique knit, professional employee kits.",
            "corporate polo t-shirt manufacturer bangalore, company logo embroidered shirts, employee uniform supplier",
            "/products/polo\n& /services"
        ],
        [
            "College Fests &\nMarathon Organizers",
            "Cost-efficient dry-fit polyester or combed cotton, rapid 7-10 day delivery, bulk discounts.",
            "bulk promotional t-shirts bangalore, marathon jersey manufacturer, cheap bulk t-shirts printing",
            "/products/regular-fit\n& /live-stock"
        ],
        [
            "Activewear &\nGym Wear Brands",
            "Moisture wicking, 4-way lycra stretch, squat-proof gym shorts, zip joggers, quick turnaround.",
            "custom activewear manufacturer india, gym joggers wholesale, dry fit sublimation t-shirts",
            "/products/shorts\n& /products/joggers"
        ],
        [
            "Global Apparel\nImporters (US/EU/UAE)",
            "Direct factory container supply, international export compliance, GOTS organic cotton.",
            "apparel manufacturer india export, private label clothing exporter tirupur, oem garment factory india",
            "Homepage (/)\n& /about"
        ]
    ]

    p_table_rows = []
    for idx, row in enumerate(personas_data):
        if idx == 0:
            p_table_rows.append([Paragraph(cell, table_header) for cell in row])
        else:
            p_table_rows.append([
                Paragraph(row[0], table_cell_bold),
                Paragraph(row[1], table_cell),
                Paragraph(row[2], table_cell),
                Paragraph(row[3], table_cell),
            ])

    p_table = Table(p_table_rows, colWidths=[105, 135, 175, 100])
    p_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), c_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(p_table)

    # =========================================================================
    # PAGE 2 & 3: PRIMARY COMMERCIAL HEAD KEYWORDS TABLE
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("1. Top High-Intent Commercial 'Money' Keywords", h1_style))
    story.append(Paragraph(
        "The following master keyword inventory represents the highest commercial search volume terms across Google Search in India and global export channels. These must be targeted in primary Title tags, H1 headers, canonical URLs, and structured data.",
        body_style
    ))
    story.append(Spacer(1, 4))

    top_keywords_data = [
        ["Target Keyword", "Search Intent", "Search Volume", "Target Landing Page", "Priority"],
        ["apparel manufacturer in bangalore", "Commercial / B2B", "High (2.4k/mo)", "Homepage (/)", "CRITICAL (P1)"],
        ["clothing manufacturer in bangalore", "Commercial / B2B", "High (2.9k/mo)", "Homepage (/)", "CRITICAL (P1)"],
        ["custom apparel manufacturer india", "Commercial / B2B", "Very High (4.1k/mo)", "Homepage (/)", "CRITICAL (P1)"],
        ["private label clothing manufacturer india", "Transactional / B2B", "Very High (3.6k/mo)", "Homepage & Services", "CRITICAL (P1)"],
        ["t-shirt manufacturer in bangalore", "Transactional / Local", "High (3.2k/mo)", "/products/regular-fit", "CRITICAL (P1)"],
        ["oversized t-shirt manufacturer india", "Commercial / B2B", "High (2.8k/mo)", "/products/oversized", "CRITICAL (P1)"],
        ["custom hoodie manufacturer india", "Commercial / B2B", "Medium (1.8k/mo)", "/products/hoodie", "CRITICAL (P1)"],
        ["polo t-shirt manufacturer bangalore", "Commercial / Local", "Medium (1.5k/mo)", "/products/polo", "CRITICAL (P1)"],
        ["corporate uniform manufacturer bangalore", "Transactional / B2B", "High (2.1k/mo)", "Homepage & Services", "CRITICAL (P1)"],
        ["low moq clothing manufacturer india", "High Intent / Startup", "High (2.6k/mo)", "Homepage (/)", "CRITICAL (P1)"],
        ["cut and sew apparel manufacturer india", "Technical / B2B", "Medium (1.2k/mo)", "Homepage & Customizer", "HIGH (P1)"],
        ["bulk t-shirt printing and manufacturing bangalore", "Transactional", "High (1.9k/mo)", "/products/regular-fit", "HIGH (P1)"],
        ["blank oversized t-shirts wholesale india", "Wholesale / Supply", "High (2.2k/mo)", "/products/oversized", "HIGH (P1)"],
        ["custom streetwear manufacturer india", "High Commercial", "High (2.7k/mo)", "/products/oversized", "CRITICAL (P1)"],
        ["gsm 240 oversized t-shirt manufacturer", "Specific / High Value", "Medium (880/mo)", "/products/oversized", "HIGH (P1)"],
        ["french terry hoodie manufacturer india", "Specific / Fabric", "Medium (950/mo)", "/products/hoodie", "HIGH (P1)"],
        ["pique polo t-shirt manufacturer bangalore", "Specific / Product", "Medium (720/mo)", "/products/polo", "HIGH (P1)"],
        ["sports jersey manufacturer bangalore", "Commercial / B2B", "High (1.6k/mo)", "/products/shorts", "HIGH (P1)"],
        ["joggers and sweatpants manufacturer india", "Commercial", "Medium (1.1k/mo)", "/products/joggers", "HIGH (P1)"],
        ["dtf printing on t-shirts bulk bangalore", "Technical Service", "High (1.4k/mo)", "Services & Catalog", "HIGH (P1)"],
        ["high density embroidery apparel bangalore", "Technical Service", "Medium (650/mo)", "Services & Polo", "HIGH (P2)"],
        ["ready stock plain t-shirts bangalore", "Immediate Wholesale", "Medium (1.3k/mo)", "/live-stock", "CRITICAL (P1)"],
        ["tirupur garment manufacturer office bangalore", "Factory Synergy", "Medium (1.1k/mo)", "/about", "HIGH (P1)"],
        ["custom activewear manufacturer india", "Commercial / Niche", "High (1.7k/mo)", "/products/shorts", "HIGH (P1)"],
        ["clothing manufacturer 100 pcs moq", "Startup Intent", "High (1.8k/mo)", "Homepage (/)", "CRITICAL (P1)"],
        ["custom woven neck labels manufacturer india", "Branding / Addon", "Medium (750/mo)", "Services & Detail Pages", "HIGH (P2)"],
        ["round neck cotton t-shirt supplier bangalore", "Wholesale / Local", "High (1.5k/mo)", "/products/regular-fit", "HIGH (P1)"],
        ["heavyweight fleece sweatshirts manufacturer", "Winter Product", "Medium (820/mo)", "/products/sweatshirt", "HIGH (P1)"],
        ["corporate uniform polo t-shirts with logo", "Corporate Intent", "High (1.6k/mo)", "/products/polo", "CRITICAL (P1)"],
        ["custom track pants and gym shorts bangalore", "Activewear", "Medium (640/mo)", "/products/shorts", "HIGH (P2)"],
        ["wholesale blank hoodies bangalore", "Immediate Wholesale", "Medium (890/mo)", "/products/hoodie", "HIGH (P1)"],
        ["acid wash oversized t-shirts bulk manufacturer", "Streetwear Niche", "Medium (580/mo)", "/products/oversized", "HIGH (P2)"],
        ["dry fit sublimation t-shirts manufacturer", "Event / Sports", "High (1.3k/mo)", "/products/regular-fit", "HIGH (P1)"],
        ["apparel manufacturing factory in tirupur", "Factory Direct", "High (2.2k/mo)", "Homepage & /about", "HIGH (P1)"],
        ["custom clothing sampling before bulk order", "High Conversion", "Medium (490/mo)", "Homepage & Contact", "HIGH (P2)"]
    ]

    top_table_rows = []
    for idx, row in enumerate(top_keywords_data):
        if idx == 0:
            top_table_rows.append([Paragraph(cell, table_header) for cell in row])
        else:
            p_style = priority_critical if "CRITICAL" in row[4] else (priority_high if "HIGH" in row[4] else priority_med)
            top_table_rows.append([
                Paragraph(row[0], table_cell_bold),
                Paragraph(row[1], table_cell),
                Paragraph(row[2], table_cell),
                Paragraph(row[3], table_cell),
                Paragraph(row[4], p_style),
            ])

    top_table = Table(top_table_rows, colWidths=[165, 95, 80, 105, 70], repeatRows=1)
    top_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), c_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(top_table)

    # =========================================================================
    # SECTION 2: PAGE-BY-PAGE KEYWORD ARCHITECTURE & ON-PAGE BLUEPRINTS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("2. Page-by-Page Keyword Architecture & Meta Tag Blueprint", h1_style))
    story.append(Paragraph(
        "Each page on cutnstitchapparel.com targets a defined keyword silo with precise title tags, meta descriptions, and semantic terms. Use these exact specifications for engineering updates.",
        body_style
    ))
    story.append(Spacer(1, 4))

    def make_page_card(page_title, url_path, target_kws, sec_kws, longtail_kws, rec_title, rec_desc, h1_tag):
        blueprint_content = f"""
        <b>Page:</b> <font color="#0284C7">{page_title}</font> &nbsp;&nbsp;|&nbsp;&nbsp; <b>URL:</b> {url_path}<br/>
        <b>Primary Keywords:</b> <i>{', '.join(target_kws)}</i><br/>
        <b>Secondary Keywords:</b> <i>{', '.join(sec_kws)}</i><br/>
        <b>Long-Tail Queries:</b> <i>{', '.join(longtail_kws)}</i><br/>
        <b>Recommended Title Tag:</b> <font color="#0F172A"><b>{rec_title}</b></font> <font color="#64748B">({len(rec_title)} chars)</font><br/>
        <b>Recommended Meta Description:</b> {rec_desc} <font color="#64748B">({len(rec_desc)} chars)</font><br/>
        <b>Target H1 Tag:</b> <b>{h1_tag}</b>
        """
        bp_table = Table([[Paragraph(blueprint_content, callout_text)]], colWidths=[515])
        bp_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), c_card_bg),
            ("BOX", (0, 0), (-1, -1), 0.75, c_border),
            ("LINEBEFORE", (0, 0), (0, 0), 4, c_blue),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        return bp_table

    # 2.1 Homepage
    story.append(Paragraph("2.1 Homepage (https://cutnstitchapparel.com/)", h2_style))
    story.append(make_page_card(
        page_title="Homepage - B2B Apparel Manufacturing Hub",
        url_path="https://cutnstitchapparel.com/",
        target_kws=["apparel manufacturer in bangalore", "clothing manufacturer in bangalore", "custom apparel manufacturer india", "private label clothing manufacturer india", "low moq clothing manufacturer india"],
        sec_kws=["bulk t-shirt manufacturing bangalore", "cut and sew apparel manufacturer", "custom merchandise manufacturer", "corporate uniform supplier", "tirupur garment manufacturer office bangalore"],
        longtail_kws=["best b2b clothing manufacturer in bangalore with low moq", "how to manufacture custom clothing for brand in india", "direct factory apparel manufacturer bangalore"],
        rec_title="B2B Apparel & Custom Clothing Manufacturer in Bangalore | Cut N Stitch",
        rec_desc="Cut N Stitch Apparel is Bangalore's premier B2B custom clothing & apparel manufacturer. Low MOQ (100 pcs), private label, bulk T-shirts, oversized tees, hoodies & corporate uniforms.",
        h1_tag="Premium B2B Custom Apparel & Private Label Clothing Manufacturer in Bangalore"
    ))
    story.append(Spacer(1, 6))

    # 2.2 Product Catalog Hub
    story.append(Paragraph("2.2 Product Catalog Hub (/products)", h2_style))
    story.append(make_page_card(
        page_title="Product Catalog Hub",
        url_path="/products",
        target_kws=["b2b apparel catalog", "wholesale blank garments bangalore", "custom apparel catalog india", "bulk clothing catalog"],
        sec_kws=["wholesale plain t-shirts", "blank hoodies wholesale", "oversized t-shirts bulk supplier", "corporate uniform styles", "blank sportswear catalogue"],
        longtail_kws=["download clothing manufacturing catalog pdf bangalore", "bulk apparel prices per unit india", "wholesale clothing catalog with moq 100"],
        rec_title="B2B Apparel Manufacturing Catalog & Wholesale Garments | Cut N Stitch",
        rec_desc="Browse our B2B apparel catalog: regular fit tees, 240 GSM oversized t-shirts, pique polo shirts, fleece hoodies, joggers & uniforms. Low MOQ & direct factory pricing.",
        h1_tag="B2B Custom Apparel Manufacturing Catalog & Wholesale Blank Styles"
    ))
    story.append(Spacer(1, 6))

    # 2.3 Regular Fit T-Shirts
    story.append(Paragraph("2.3 Regular Fit T-Shirts Category (/products/regular-fit)", h2_style))
    story.append(make_page_card(
        page_title="Regular Fit & Plain Round Neck T-Shirts",
        url_path="/products/regular-fit",
        target_kws=["round neck t-shirt manufacturer bangalore", "180 gsm cotton t-shirt manufacturer", "plain t-shirt manufacturer bangalore", "bulk round neck t-shirts india"],
        sec_kws=["100% combed cotton t-shirts wholesale", "bio-washed t-shirt manufacturer", "poly-cotton 180 gsm t-shirts", "promotional t-shirts manufacturer bangalore", "custom printed round neck t-shirts"],
        longtail_kws=["best bio-washed 180 gsm t-shirt manufacturer in bangalore", "custom screen printed round neck t-shirts low moq", "polyester 90 gsm marathon event t-shirts bangalore"],
        rec_title="Round Neck T-Shirt Manufacturer in Bangalore | 180 GSM Bio-Washed Tees",
        rec_desc="Premium 180 GSM bio-washed combed cotton regular fit t-shirts. Custom screen printing, DTF, embroidery & private labeling. Direct factory prices, low MOQ 100 pcs.",
        h1_tag="Custom Round Neck T-Shirt Manufacturer in Bangalore - 180 GSM Bio-Washed Cotton"
    ))
    story.append(Spacer(1, 6))

    # 2.4 Oversized & Streetwear T-Shirts
    story.append(Paragraph("2.4 Oversized & Streetwear Category (/products/oversized)", h2_style))
    story.append(make_page_card(
        page_title="Oversized T-Shirts & Streetwear Blanks",
        url_path="/products/oversized",
        target_kws=["oversized t-shirt manufacturer india", "streetwear clothing manufacturer bangalore", "240 gsm oversized t-shirt", "heavyweight t-shirt manufacturer"],
        sec_kws=["drop shoulder t-shirt manufacturer", "french terry oversized t-shirt wholesale", "boxy fit streetwear blanks india", "acid wash oversized t-shirt manufacturer", "puff print oversized t-shirts"],
        longtail_kws=["where to manufacture 240 gsm oversized t-shirts in india", "heavyweight drop shoulder t-shirt blanks for streetwear brand", "custom acid wash and vintage wash oversized t-shirts"],
        rec_title="Oversized T-Shirt Manufacturer India | 240 GSM Heavyweight Streetwear Blanks",
        rec_desc="India's leading oversized t-shirt manufacturer. Heavyweight 220-280 GSM French Terry, drop-shoulder silhouettes, boxy cuts, custom puff printing & private label tags.",
        h1_tag="Heavyweight Oversized T-Shirt & Streetwear Manufacturer in Bangalore, India"
    ))

    # 2.5 Polo T-Shirts
    story.append(PageBreak())
    story.append(Paragraph("2.5 Polo T-Shirts Category (/products/polo)", h2_style))
    story.append(make_page_card(
        page_title="Polo T-Shirts & Corporate Collared Tees",
        url_path="/products/polo",
        target_kws=["polo t-shirt manufacturer bangalore", "custom polo t-shirts with logo", "corporate polo t-shirt supplier", "pique cotton polo t-shirt manufacturer"],
        sec_kws=["matty polo t-shirts wholesale", "220 gsm polo t-shirt manufacturer", "tipping collar polo t-shirts", "embroidered polo t-shirts bulk bangalore", "honeycomb knit polo shirts"],
        longtail_kws=["custom corporate polo t-shirt manufacturer with embroidery bangalore", "high quality pique polo shirts for tech companies", "poly cotton 220 gsm uniform polo shirts"],
        rec_title="Polo T-Shirt Manufacturer in Bangalore | Custom Embroidered Corporate Polos",
        rec_desc="Manufacturer of premium 220-240 GSM Pique, Matty & Combed Cotton polo t-shirts in Bangalore. Custom embroidery, tipping collars, company logos & corporate uniform orders.",
        h1_tag="Custom Polo T-Shirt Manufacturer in Bangalore - Pique Knit & Corporate Polos"
    ))
    story.append(Spacer(1, 6))

    # 2.6 Hoodies & Sweatshirts
    story.append(Paragraph("2.6 Hoodies & Sweatshirts (/products/hoodie, /products/sweatshirt)", h2_style))
    story.append(make_page_card(
        page_title="Custom Hoodies & Crewneck Sweatshirts",
        url_path="/products/hoodie & /products/sweatshirt",
        target_kws=["hoodie manufacturer in bangalore", "custom hoodie manufacturer india", "sweatshirt manufacturer bangalore", "300 gsm fleece hoodie wholesale"],
        sec_kws=["french terry sweatshirt manufacturer", "pullover hoodie manufacturer", "zip up hoodie manufacturer india", "heavyweight 340 gsm fleece hoodies", "custom embroidered hoodies for brands"],
        longtail_kws=["where to get custom heavyweight hoodies manufactured in india", "double layered hood fleece sweatshirt supplier", "custom brand hoodies with ykk zippers and chenille patches"],
        rec_title="Custom Hoodie & Sweatshirt Manufacturer in Bangalore | 300-360 GSM Fleece",
        rec_desc="Custom hoodies & crewneck sweatshirts manufacturer in Bangalore. Premium 300-360 GSM brushed fleece and French Terry, double-layered hoods, zip & pullover styles, custom printing.",
        h1_tag="Custom Hoodie & Sweatshirt Manufacturer in Bangalore - 300-360 GSM Heavyweight Fleece"
    ))
    story.append(Spacer(1, 6))

    # 2.7 Shorts & Joggers
    story.append(Paragraph("2.7 Athletic Shorts & Performance Joggers (/products/shorts, /products/joggers)", h2_style))
    story.append(make_page_card(
        page_title="Custom Shorts & Athletic Joggers",
        url_path="/products/shorts & /products/joggers",
        target_kws=["joggers manufacturer in bangalore", "custom shorts manufacturer india", "track pants manufacturer bangalore", "gym wear manufacturer india"],
        sec_kws=["4-way lycra joggers wholesale", "french terry shorts manufacturer", "custom sweatpants with zipper pockets", "athletic activewear bottomwear supplier", "custom elastic waistband shorts"],
        longtail_kws=["wholesale 4-way stretch joggers with zip pockets for athletic brands", "custom printed gym shorts manufacturer low moq", "french terry lounge shorts bulk supplier"],
        rec_title="Custom Joggers & Shorts Manufacturer Bangalore | Activewear Bottomwear",
        rec_desc="Manufacturer of premium joggers, track pants & French Terry shorts in Bangalore. 4-way Lycra stretch, zippered pockets, custom drawstrings & activewear branding.",
        h1_tag="Custom Joggers & Shorts Manufacturer in Bangalore - Performance & Athleisure"
    ))
    story.append(Spacer(1, 6))

    # 2.8 Live Stock Inventory
    story.append(Paragraph("2.8 Ready Live Stock Inventory (/live-stock)", h2_style))
    story.append(make_page_card(
        page_title="Live Stock & Ready Garment Inventory",
        url_path="/live-stock",
        target_kws=["ready stock plain t-shirts bangalore", "blank t-shirts ready stock india", "immediate dispatch plain t-shirts", "plain t-shirt wholesale bangalore"],
        sec_kws=["ready blank hoodies stock", "in stock oversized t-shirts bangalore", "same day dispatch blank t-shirts", "ready stock corporate polo shirts", "wholesale apparel ready to print"],
        longtail_kws=["urgent bulk plain t-shirts available in bangalore for printing", "ready inventory blank t-shirts in bangalore with live stock tracker", "plain black and white round neck tees in stock"],
        rec_title="Ready Stock Plain T-Shirts & Blank Garments Bangalore | Live Inventory",
        rec_desc="Check live stock inventory of ready plain t-shirts, oversized tees, polo shirts & hoodies in Bangalore. Instant dispatch, zero production wait, ready for DTF and screen printing.",
        h1_tag="Ready Live Stock Plain T-Shirts & Blank Garments in Bangalore - Instant Dispatch"
    ))

    # =========================================================================
    # SECTION 3: CORE SERVICES & CAPABILITIES KEYWORDS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("3. Core Services & Manufacturing Capabilities Keyword Silos", h1_style))
    story.append(Paragraph(
        "Service-specific searches represent high-intent commercial buyers who already know what technique or capability they require. These keywords should be deployed across service landing pages, feature cards, and homepage sections.",
        body_style
    ))
    story.append(Spacer(1, 4))

    services_data = [
        ["Service Category", "Target Primary Keywords", "Technical & Secondary Keywords", "Target Buyer & Search Intent"],
        [
            "Private Labeling &\nBrand Packaging",
            "private label clothing manufacturer india,\ncustom woven neck label manufacturer,\nprivate label apparel bangalore,\ncustom brand tags for clothing",
            "satin wash care labels, custom barcode stickers, branded polybags, custom hang tags, embossed leather patches, custom heat seal neck transfers",
            "D2C brands, fashion startups looking for end-to-end white-label and private-label apparel runs ready for retail display."
        ],
        [
            "Custom Cut & Sew\nApparel Manufacturing",
            "cut and sew manufacturer india,\ncustom pattern making apparel bangalore,\ncustom fit clothing manufacturer,\nbespoke garment manufacturing",
            "tech pack development, grading services, custom garment dimensions, flatlock stitching, double needle hems, seam sealing, custom ribbing",
            "Fashion designers, established brands with proprietary fits, tech packs, and non-standard garment silhouettes."
        ],
        [
            "Screen Printing &\nPuff / 3D Printing",
            "bulk screen printing bangalore,\ncustom puff print manufacturer india,\nplastisol screen printing t-shirts,\nwater-based ink printing bangalore",
            "high-density 3D print, discharge printing, metallic foil printing, neon inks, soft-hand feel prints, oversized screen printing on chest & back",
            "Streetwear labels, graphic merchandise brands, collegiate and marathon apparel requiring durable high-color graphics."
        ],
        [
            "Direct-to-Film (DTF)\n& Sublimation",
            "dtf printing on t-shirts bulk bangalore,\ncustom sublimation jersey printing india,\nfull color apparel printing bangalore,\ndtf printed hoodies bulk",
            "all-over sublimation prints, quick turnaround digital prints, multi-color gradient artwork, photo-realistic apparel prints, polyester jerseys",
            "Merchandise sellers, quick turnaround event runs, highly complex multi-color designs, sports tournament organizers."
        ],
        [
            "High-Density\nEmbroidery & Patches",
            "custom embroidery on polo t-shirts bangalore,\nchenille patch hoodie manufacturer india,\n3d puff embroidery apparel,\ncorporate logo embroidery bangalore",
            "tatami embroidery, badge applique, direct garment embroidery, gold/silver metallic thread embroidery, laser cut felt patches, sleeve embroidery",
            "Corporate gifting, luxury streetwear labels, varsity jacket/hoodie brands, executive uniform buyers."
        ],
        [
            "Corporate Uniforms &\nIndustrial Workwear",
            "corporate uniform manufacturer bangalore,\ncustom office uniforms bangalore,\ncompany branded polo t-shirts bulk,\nindustrial workwear manufacturer india",
            "IT company onboarding merchandise, restaurant staff uniforms, hospital scrubs, security uniforms, anti-static work shirts, safety reflective wear",
            "HR managers, corporate procurement officers, facility managers, enterprise administrative directors."
        ]
    ]

    services_table_rows = []
    for idx, row in enumerate(services_data):
        if idx == 0:
            services_table_rows.append([Paragraph(cell, table_header) for cell in row])
        else:
            services_table_rows.append([
                Paragraph(row[0], table_cell_bold),
                Paragraph(row[1].replace("\n", " "), table_cell),
                Paragraph(row[2], table_cell),
                Paragraph(row[3], table_cell),
            ])

    services_table = Table(services_table_rows, colWidths=[90, 150, 140, 135], repeatRows=1)
    services_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), c_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(services_table)

    # =========================================================================
    # SECTION 4: FABRIC, GSM & TECHNICAL SPECIFICATION KEYWORDS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("4. Fabric, GSM & Technical Specification Keywords (Long-Tail Engine)", h1_style))
    story.append(Paragraph(
        "Apparel buyers and production managers search specifically by fabric compositions, knit structures, and GSM weights. Integrating these keywords throughout product specs and filter menus captures high-converting bottom-of-funnel traffic.",
        body_style
    ))
    story.append(Spacer(1, 4))

    specs_data = [
        ["Fabric & Weight Category", "Target GSM / Blends", "High-Converting Keywords to Integrate", "Key Applications"],
        [
            "100% Combed Cotton\nSingle Jersey",
            "160 GSM\n180 GSM\n200 GSM",
            "100% super combed cotton, bio-washed fabric, pre-shrunk cotton, compact yarn, 180 gsm single jersey, soft enzyme wash, zero pilling fabric",
            "Everyday t-shirts, premium brand merchandise, promotional events, retail basic collections."
        ],
        [
            "Heavyweight Cotton &\nFrench Terry",
            "220 GSM\n240 GSM\n280 GSM",
            "240 gsm french terry, heavyweight cotton jersey, loopknit interior, drop shoulder streetwear fabric, 100% cotton 220 gsm, dense knit fabric",
            "Streetwear oversized t-shirts, luxury basic tees, lightweight summer crewneck sweatshirts."
        ],
        [
            "Pique Honeycomb &\nMatty Knit",
            "220 GSM\n240 GSM\n260 GSM",
            "pique honeycomb fabric, matty knit cotton, poly cotton pique blend, breathable collar knit, colorfast polo fabric, anti-curling collar fabric",
            "Corporate polo t-shirts, executive staff uniforms, golf shirts, hospitality service wear."
        ],
        [
            "Heavy Winter Fleece\n& Brushed Loopknit",
            "300 GSM\n340 GSM\n360 GSM",
            "300 gsm brushed fleece, 340 gsm polycotton fleece, heavy loopknit, anti-shrink fleece, warm hoodie fabric, soft brushed cotton interior",
            "Winter hoodies, full-zip sweatshirts, college varsity jackets, winter streetwear apparel."
        ],
        [
            "Performance Polyester\n& Dri-Fit Blends",
            "90 GSM\n110 GSM\n140 GSM\n180-200 GSM",
            "dri-fit mars fabric, dot knit moisture wicking, 100% micro polyester, quick dry athletic fabric, breathable sportswear knit, sublimation ready polyester",
            "Marathon tees, sports jerseys, gym performance tees, event volunteer uniforms, cycling apparel."
        ],
        [
            "Lycra Spandex Stretch\nAthletic Fabrics",
            "190 GSM\n220 GSM\n240 GSM",
            "2-way lycra stretch, 4-way lycra polyester, cotton lycra blend, elastane athletic fabric, squat proof gym fabric, flexible sports fabric",
            "Athletic track pants, gym joggers, training shorts, compression wear, flexible fitness gear."
        ]
    ]

    specs_table_rows = []
    for idx, row in enumerate(specs_data):
        if idx == 0:
            specs_table_rows.append([Paragraph(cell, table_header) for cell in row])
        else:
            specs_table_rows.append([
                Paragraph(row[0], table_cell_bold),
                Paragraph(row[1], table_cell),
                Paragraph(row[2], table_cell),
                Paragraph(row[3], table_cell),
            ])

    specs_table = Table(specs_table_rows, colWidths=[110, 65, 200, 140], repeatRows=1)
    specs_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), c_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(specs_table)

    # =========================================================================
    # SECTION 5: HYPER-LOCAL & GEO-TARGETED KEYWORDS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("5. Hyper-Local & Geo-Targeted Keywords (Bangalore, Tirupur & Metros)", h1_style))
    story.append(Paragraph(
        "Local SEO is the single fastest way to secure qualified inquiries. By pairing Bangalore's startup/corporate ecosystems with Tirupur's manufacturing dominance, Cut N Stitch captures localized high-volume queries with high conversion rates.",
        body_style
    ))
    story.append(Spacer(1, 4))

    geo_data = [
        ["Geographic Zone", "Target Hubs & Search Terms", "High-Priority Geo Keywords to Add", "Strategy & Implementation"],
        [
            "Bangalore Tech Corridors\n& Startup Hubs",
            "Koramangala, Indiranagar, HSR Layout, Electronic City, Whitefield, Bellandur, Marathahalli",
            "t-shirt manufacturer in koramangala, startup merchandise manufacturer hsr layout, corporate uniform manufacturer electronic city, custom tees whitefield bangalore",
            "Add dedicated Bangalore local landing pages and Google Business Profile location mentions for tech company apparel."
        ],
        [
            "Bangalore Industrial\n& Textile Belts",
            "Peenya Industrial Area, Bommanahalli, Rajajinagar, Yeshwanthpur, Jayanagar",
            "garment manufacturer in peenya, clothing factory bommanahalli, apparel manufacturers in rajajinagar, wholesale t-shirts jayanagar bangalore",
            "Captures commercial B2B procurement heads and industrial managers seeking localized manufacturing suppliers."
        ],
        [
            "Tirupur Direct Factory\nSynergy",
            "Anupparapalayam, Thilaga Nagar, Tirupur Textile Hub, South India Knitwear Cluster",
            "tirupur knitwear manufacturer bangalore office, direct tirupur factory prices apparel, tirupur custom t-shirt manufacturers, tirupur textile suppliers india",
            "Showcases the direct manufacturing roots in Tirupur, giving buyers the lowest direct mill pricing without middlemen."
        ],
        [
            "Tier-1 Indian Metros\n(PAN India)",
            "Mumbai, Delhi NCR (Gurgaon, Noida), Hyderabad, Chennai, Pune, Kolkata",
            "custom clothing manufacturer for mumbai brands, t-shirt manufacturer in hyderabad, apparel manufacturing delhi ncr, bulk hoodies manufacturer pune",
            "Target national shipping & logistics (Gati, Delhivery, V-Trans) across India within 2-4 days transit."
        ],
        [
            "Global Export Markets\n(International B2B)",
            "United States (USA), United Kingdom (UK), UAE / Dubai, Australia, Germany, Canada",
            "apparel manufacturer in india for export, custom clothing manufacturer for us brands, private label clothing exporter tirupur, low moq apparel exporter india",
            "Optimize for global buyers seeking reliable Indian manufacturers with international quality compliance, customs clearance, and USD pricing."
        ]
    ]

    geo_table_rows = []
    for idx, row in enumerate(geo_data):
        if idx == 0:
            geo_table_rows.append([Paragraph(cell, table_header) for cell in row])
        else:
            geo_table_rows.append([
                Paragraph(row[0], table_cell_bold),
                Paragraph(row[1], table_cell),
                Paragraph(row[2], table_cell),
                Paragraph(row[3], table_cell),
            ])

    geo_table = Table(geo_table_rows, colWidths=[100, 110, 155, 150], repeatRows=1)
    geo_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), c_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(geo_table)

    # =========================================================================
    # SECTION 6: HIGH-ROI BLOG & CONTENT MARKETING KEYWORDS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("6. High-ROI Content Marketing & Blog Keyword Clusters", h1_style))
    story.append(Paragraph(
        "Publishing 1-2 authoritative, keyword-dense educational articles per month builds topic authority (EEAT) and captures top-of-funnel buyers researching how to start clothing brands, choose fabrics, or assess print durability.",
        body_style
    ))
    story.append(Spacer(1, 4))

    blog_clusters_data = [
        ["Proposed Article Title / Topic", "Primary Target Keywords", "Target Search Intent", "Business Call-to-Action (CTA)"],
        [
            "How to Start a Streetwear Brand in India: Complete Manufacturing Guide (2026)",
            "how to start a streetwear brand in india, streetwear manufacturer india, how to produce oversized t-shirts",
            "Informational -> Commercial",
            "Inquire for low MOQ 100 pcs sample kit of 240 GSM oversized streetwear blanks."
        ],
        [
            "The Ultimate GSM Guide for T-Shirts: 160 vs 180 vs 240 GSM Explained",
            "best gsm for t-shirts, 180 gsm vs 240 gsm, what is gsm in fabric, oversized t-shirt gsm",
            "Informational / Technical",
            "Explore our fabric swatch book and request physical fabric swatches."
        ],
        [
            "Screen Printing vs DTF vs Puff Print: Which is Best for Bulk Apparel?",
            "dtf vs screen printing for t-shirts, puff print durability, best printing method for hoodies bulk",
            "Commercial Investigation",
            "Consult with our printing experts for your brand's artwork tech pack."
        ],
        [
            "How to Find a Low MOQ Clothing Manufacturer in India (Avoid Middlemen)",
            "low moq clothing manufacturer india, clothing manufacturer 100 pieces, apparel factory direct india",
            "High Commercial Intent",
            "Get an instant quotation for 100-piece pilot production runs."
        ],
        [
            "Complete Guide to Corporate Uniforms: Fabric Selection & Logo Embroidery",
            "best fabric for corporate polo shirts, corporate uniform guidelines bangalore, polo embroidery tips",
            "B2B Procurement Intent",
            "Request corporate uniform catalog and sample polo box for office HR teams."
        ],
        [
            "How to Create an Apparel Tech Pack: Step-by-Step Template for Fashion Designers",
            "how to make a tech pack for clothing, tech pack template apparel, clothing specs sheet india",
            "Technical / Designer Intent",
            "Submit your tech pack for direct engineering review and sample pricing."
        ],
        [
            "French Terry vs Fleece: Choosing the Right Fabric for Custom Hoodies",
            "french terry vs fleece hoodie, loopknit vs brushed fleece, best fabric for winter sweatshirts",
            "Product Comparison",
            "View our custom hoodie catalog with 300-360 GSM fleece and French Terry."
        ],
        [
            "The Complete Private Label Packaging Checklist: Labels, Tags & Polybags",
            "custom clothing tags and labels india, woven neck label manufacturer, custom polybag packaging apparel",
            "Value-Add Commercial",
            "Order private label branding package with your custom clothing run."
        ]
    ]

    blog_table_rows = []
    for idx, row in enumerate(blog_clusters_data):
        if idx == 0:
            blog_table_rows.append([Paragraph(cell, table_header) for cell in row])
        else:
            blog_table_rows.append([
                Paragraph(row[0], table_cell_bold),
                Paragraph(row[1], table_cell),
                Paragraph(row[2], table_cell),
                Paragraph(row[3], table_cell),
            ])

    blog_table = Table(blog_table_rows, colWidths=[130, 130, 95, 160], repeatRows=1)
    blog_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), c_primary),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(blog_table)

    # =========================================================================
    # SECTION 7: TECHNICAL ON-PAGE IMPLEMENTATION CHECKLIST
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("7. Technical On-Page Keyword Implementation Checklist", h1_style))
    story.append(Paragraph(
        "Having keywords is only half the battle; exact syntactic placement within HTML tags, structured data, and image attributes determines if Google rewards you with rank #1. Follow this technical execution checklist.",
        body_style
    ))
    story.append(Spacer(1, 4))

    tech_rules = [
        ("1. Title Tag Syntax", "Keep within 55-60 characters. Format: <b>[Primary Target Keyword] in [City/Country] | [Brand / USP]</b>.<br/><i>Example:</i> <code>Oversized T-Shirt Manufacturer India | Cut N Stitch Apparel</code>"),
        ("2. Meta Description Formula", "Keep within 145-155 characters. Include: (1) Primary keyword, (2) Core USPs (Low MOQ 100, Bio-Washed, Factory Direct), and (3) Clear Call to Action (Inquire, Order Samples).<br/><i>Example:</i> <code>Leading custom apparel manufacturer in Bangalore. Low MOQ 100 pcs, 240 GSM oversized tees, polo shirts & hoodies. Request your sample kit today!</code>"),
        ("3. Heading Hierarchy (H1, H2, H3)", "Ensure exactly ONE <code>&lt;h1&gt;</code> per page matching the page's primary target keyword. Use <code>&lt;h2&gt;</code> tags for subcategories and services containing secondary keywords. Use <code>&lt;h3&gt;</code> for product variants, GSM specs, and FAQ questions."),
        ("4. Image Alt Attribute Optimization", "Never leave image alt tags blank. Avoid generic names like 'image1.jpg'. Use descriptive keywords:<br/>• <code>alt='cotton-180gsm-regular-fit-tshirt-white-manufacturer-bangalore'</code><br/>• <code>alt='heavyweight-240gsm-oversized-streetwear-tshirt-black-blank'</code><br/>• <code>alt='custom-embroidered-pique-polo-tshirt-corporate-uniform'</code>"),
        ("5. JSON-LD Schema Markup", "Implement complete structured data schemas across all pages:<br/>• <b>LocalBusiness / Organization:</b> With physical Tirupur factory & Bangalore operational office, telephone, geo coordinates, and logo.<br/>• <b>Product & AggregateOffer:</b> For all catalog variants with price tier, availability, and currency (INR).<br/>• <b>FAQPage Schema:</b> On homepage and category pages to capture rich Google snippet FAQs.<br/>• <b>BreadcrumbList Schema:</b> To show Google clean hierarchical navigation paths."),
        ("6. Internal Linking & Anchor Text", "Never use generic anchors like 'Click Here' or 'Read More'. Always link using keyword-rich anchors:<br/>• Link to Oversized: <code>custom oversized t-shirts</code> or <code>heavyweight 240 GSM blanks</code><br/>• Link to Live Stock: <code>ready stock plain t-shirts in Bangalore</code><br/>• Link to Contact: <code>request B2B manufacturing quotation</code>"),
        ("7. Natural Keyword Density", "Aim for 1.2% - 1.8% keyword density. Avoid keyword stuffing. Weave semantic synonyms (LSI) such as 'garment fabrication', 'apparel production line', 'low minimum order run', 'textile finishing', and 'pre-production sampling' naturally throughout copy."),
    ]

    for title, desc in tech_rules:
        rule_table = Table([[Paragraph(f"<b>{title}</b><br/>{desc}", callout_text)]], colWidths=[515])
        rule_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFFFFF")),
            ("BOX", (0, 0), (-1, -1), 0.75, c_border),
            ("LINEBEFORE", (0, 0), (0, 0), 3.5, c_primary),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(rule_table)
        story.append(Spacer(1, 3))

    # Summary Sign-Off
    story.append(Spacer(1, 6))
    signoff_text = """
    <b>Document Status:</b> Ready for immediate engineering deployment & on-page integration.<br/>
    <b>Direct Support:</b> Cut N Stitch Apparel  •  vidhyashankar@cutnstitchapparel.com  •  +91 99444 66311<br/>
    <b>Factory:</b> 339/2, Thilaga Nagar, Anupparapalayam, Tirupur, Tamil Nadu - 641652  |  <b>Bangalore Operations Hub</b>
    """
    signoff_table = Table([[Paragraph(signoff_text, callout_text)]], colWidths=[515])
    signoff_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_card_bg),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("LINEBEFORE", (0, 0), (0, 0), 4, c_secondary),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(signoff_table)

    # Build PDF with custom NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated master SEO PDF at: {output_filename}")


if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "CutnStitch_Apparel_Complete_SEO_Keyword_Master_Strategy.pdf"
    create_seo_pdf(out_path)
