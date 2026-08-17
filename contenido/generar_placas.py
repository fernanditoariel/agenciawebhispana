#!/usr/bin/env python3
# Genera placas de carrusel 1080x1350 para los 3 fijados de @agenciawebhispana
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1080, 1350
NAVY = (19, 19, 71)
NAVY2 = (27, 27, 107)
BLUE = (30, 99, 214)
CYAN = (22, 166, 232)
YELLOW = (245, 224, 0)
WHITE = (255, 255, 255)
MUTED = (200, 206, 240)

BLACK_F = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
BOLD_F = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG_F = "/System/Library/Fonts/Supplemental/Arial.ttf"

OUT = os.path.join(os.path.dirname(__file__), "placas")
os.makedirs(OUT, exist_ok=True)
LOGO = Image.open(os.path.join(os.path.dirname(__file__), "..", "web", "assets", "logo-icon.png")).convert("RGBA")


def font(path, size):
    return ImageFont.truetype(path, size)


def bg():
    # gradiente vertical navy -> navy2 + glow cyan arriba-derecha
    img = Image.new("RGB", (W, H), NAVY)
    top = Image.new("RGB", (W, H), NAVY)
    px = top.load()
    for y in range(H):
        t = y / H
        r = int(NAVY[0] + (NAVY2[0] - NAVY[0]) * t)
        g = int(NAVY[1] + (NAVY2[1] - NAVY[1]) * t)
        b = int(NAVY[2] + (NAVY2[2] - NAVY[2]) * t)
        for x in range(0, W, 1):
            px[x, y] = (r, g, b)
    img = top
    # glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W - 520, -360, W + 260, 420], fill=(22, 166, 232, 120))
    gd.ellipse([-300, H - 380, 360, H + 260], fill=(30, 99, 214, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    return img


def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit(draw, text, path, max_w, max_h, start, min_s=44, line_ratio=1.12):
    s = start
    while s >= min_s:
        f = font(path, s)
        lines = wrap(draw, text, f, max_w)
        lh = int(s * line_ratio)
        if len(lines) * lh <= max_h:
            return f, lines, lh
        s -= 4
    f = font(path, min_s)
    return f, wrap(draw, text, f, max_w), int(min_s * line_ratio)


def header(img, d):
    logo = LOGO.resize((92, 92), Image.LANCZOS)
    img.paste(logo, (80, 74), logo)
    d.text((186, 82), "AGENCIA", font=font(BOLD_F, 40), fill=WHITE)
    d.text((188, 130), "W E B   H I S P A N A", font=font(BOLD_F, 20), fill=YELLOW)


def footer(d, counter, last=False):
    d.text((80, H - 96), counter, font=font(BOLD_F, 30), fill=YELLOW)
    if not last:
        t = "Deslizá →"
        w = d.textlength(t, font=font(BOLD_F, 30))
        d.text((W - 80 - w, H - 96), t, font=font(BOLD_F, 30), fill=MUTED)


def pill(d, text, y):
    f = font(BOLD_F, 40)
    tw = d.textlength(text, font=f)
    pad = 46
    x0 = (W - (tw + pad * 2)) / 2
    d.rounded_rectangle([x0, y, x0 + tw + pad * 2, y + 96], radius=48, fill=YELLOW)
    d.text((x0 + pad, y + 24), text, font=f, fill=NAVY)


def slide(name, kind, text, eyebrow=None, sub=None, num=None, counter="", last=False):
    img = bg()
    d = ImageDraw.Draw(img)
    header(img, d)
    MX = 80
    maxw = W - MX * 2

    if kind in ("hook", "body", "cta", "quote"):
        # accent bar
        cy = 300
        if eyebrow:
            d.text((MX, 250), eyebrow, font=font(BOLD_F, 30), fill=CYAN)
            cy = 300
        d.rectangle([MX, cy + 6, MX + 96, cy + 20], fill=YELLOW)
        headfont = BLACK_F if kind in ("hook", "cta") else BOLD_F
        start = 92 if kind in ("hook", "cta") else 78
        f, lines, lh = fit(d, text, headfont, maxw, 620, start)
        y = cy + 60
        for ln in lines:
            d.text((MX, y), ln, font=f, fill=WHITE)
            y += lh
        if kind == "quote" and sub:
            y += 26
            fs = font(BOLD_F, 34)
            d.text((MX, y), sub, font=fs, fill=YELLOW)
        if kind == "cta":
            pill(d, "TEST GRATIS · LINK EN BIO", H - 340)

    elif kind == "offer":
        # número grande + beneficio
        d.text((MX, 250), str(num), font=font(BLACK_F, 220), fill=YELLOW)
        f, lines, lh = fit(d, text, BOLD_F, maxw, 460, 74)
        y = 560
        for ln in lines:
            d.text((MX, y), ln, font=f, fill=WHITE)
            y += lh

    footer(d, counter, last=last)
    img.save(os.path.join(OUT, name + ".png"), optimize=True)


# ---------- FIJADO 1 ----------
slide("f1-1", "hook", "Si dependés SOLO de los referidos, tenés un techo.",
      eyebrow="AGENTE DE BIENES RAÍCES", counter="1/5")
slide("f1-2", "body", "El 90% de tus futuros clientes te busca primero en internet. Si no te encuentran, eligen a otro.",
      counter="2/5")
slide("f1-3", "body", "Armamos tu presencia digital completa: web + redes + contenido que atrae.",
      counter="3/5")
slide("f1-4", "body", "Vos cerrás operaciones. De que te encuentren y confíen, nos ocupamos nosotros.",
      counter="4/5")
slide("f1-5", "cta", "¿Tu presencia vende o espanta clientes?", counter="5/5", last=True)

# ---------- FIJADO 2 ----------
slide("f2-1", "hook", "Tu marca personal como realtor, lista para vender.",
      eyebrow="LLAVE EN MANO", counter="1/6")
slide("f2-2", "offer", "Página web profesional con tu marca, tus propiedades y botón directo a WhatsApp.",
      num=1, counter="2/6")
slide("f2-3", "offer", "Dominio y alojamiento incluidos. No tocás nada técnico.",
      num=2, counter="3/6")
slide("f2-4", "offer", "Instagram y TikTok armados + 6 posteos iniciales (3 fijados) que venden por vos.",
      num=3, counter="4/6")
slide("f2-5", "offer", "Estrategia de contenido cada mes para que sigas apareciendo y sumando clientes.",
      num=4, counter="5/6")
slide("f2-6", "cta", "Empezá por el diagnóstico gratis.", counter="6/6", last=True)

# ---------- FIJADO 3 ----------
slide("f3-1", "hook", "De invisible online a que los clientes la busquen.",
      eyebrow="CASO REAL", counter="1/3")
slide("f3-2", "quote",
      "«Me armaron mi web y ordenaron todas mis redes en tiempo récord. Pasé de no tener presencia online a que los clientes me encuentren y me escriban por WhatsApp.»",
      sub="— Eunice Martínez, Agente de Bienes Raíces", counter="2/3")
slide("f3-3", "cta", "¿Querés lo mismo para tu marca personal?", counter="3/3", last=True)

print("OK placas en", OUT)
