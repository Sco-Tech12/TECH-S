#!/usr/bin/env python3
"""Génère les pages HTML de LE GOÛT DU MOMENT (gabarit commun header/footer)."""
import html, json, os, sys
from urllib.parse import quote

OUT = sys.argv[1]
NAME = "LE GOÛT DU MOMENT"
SLOGAN = "Le temple du goût et de la convivialité à Calavi."
ADDR = "Togoudo, près de l'école de base (à 100 m du Carrefour Maria Gléta), Abomey-Calavi, Bénin"
PHONE_INTL = "+2290100000000"
PHONE_DISP = "+229 01 00 00 00 00"
WA = "2290100000000"
URL = "https://le-gout-du-moment.vercel.app"
DESC = "LE GOÛT DU MOMENT, restaurant à Togoudo (Abomey-Calavi), à 100 m du Carrefour Maria Gléta. Commande en ligne sur WhatsApp : livraison, à emporter ou sur place."
V = "1"
e = lambda s: html.escape(s, quote=True)
MAPS = "https://www.google.com/maps/search/?api=1&query=" + quote(NAME + ", Togoudo, Carrefour Maria Gléta, Abomey-Calavi, Bénin")
MAP_EMBED = "https://maps.google.com/maps?q=" + quote("Carrefour Maria Gléta, Abomey-Calavi, Bénin") + "&z=16&output=embed"
WA_HELLO = f"https://wa.me/{WA}?text=" + quote(f"Bonjour {NAME}, je vous contacte depuis votre site web.")

ICON = {
  "bag": '<path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>',
  "menu": '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
  "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "phone": '<path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .95.68l1.5 4.5a1 1 0 0 1-.5 1.21l-2.26 1.13a11.04 11.04 0 0 0 5.52 5.52l1.13-2.26a1 1 0 0 1 1.21-.5l4.5 1.5a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2h-1C9.72 21 3 14.28 3 6V5z"/>',
  "back": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "arrow": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
  "check": '<path d="M20 6 9 17l-5-5"/>',
  "pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
}
WA_PATH = '<path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.93.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47a9.4 9.4 0 0 1 6.7 2.78 9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.47-9.47 9.47M20.11 3.89A11.32 11.32 0 0 0 12.05.55C5.77.55.66 5.66.66 11.94c0 2 .52 3.97 1.52 5.7L.56 23.5l6-1.57a11.36 11.36 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.19-5.9-3.33-8.05"/>'

def ico(name, cls=""):
    return f'<svg class="ico {cls}" viewBox="0 0 24 24" aria-hidden="true">{ICON[name]}</svg>'
def wa_ico(cls=""):
    return f'<svg class="ico ico--fill {cls}" viewBox="0 0 24 24" aria-hidden="true">{WA_PATH}</svg>'
def fcfa(n):
    return f"{n:,}".replace(",", " ") + " FCFA"

# ---------------------------------------------------------------------------
# Carte (EXEMPLE à remplacer par la carte officielle de l'établissement)
# ---------------------------------------------------------------------------
MENU = [
  ("cuisine-locale", "La Cuisine du Pays", "Les classiques béninois, comme à la maison", [
    ("riz-au-gras-poulet", "Riz au gras & poulet", "Riz parfumé à la tomate, poulet braisé et alloco.", 2500, False, "Signature"),
    ("amiwo-poulet", "Amiwo au poulet", "Pâte rouge de maïs, sauce tomate pimentée et poulet.", 2500, False, None),
    ("atassi", "Atassi complet", "Riz-haricot, sauce rouge, œuf, gari et piment frais.", 1500, False, None),
    ("pate-sauce-legumes", "Pâte blanche, sauce légumes", "Sauce gboman ou crincrin, viande ou poisson au choix.", 2000, False, None),
  ]),
  ("grillades", "Les Grillades du Moment", "Braisées à la commande, servies avec alloco ou frites", [
    ("poisson-braise", "Poisson braisé", "Carpe ou bar entier, marinade maison, oignons et tomate.", 3500, True, "Signature"),
    ("poulet-braise-demi", "Demi-poulet braisé", "Poulet bicyclette mariné aux épices douces.", 3500, False, None),
    ("brochettes-boeuf", "Brochettes de bœuf (x3)", "Bœuf mariné, oignons grillés, piment à part.", 1500, False, None),
    ("alloco", "Portion d'alloco", "Bananes plantains mûres frites.", 500, False, None),
  ]),
  ("bistro", "Le Coin Bistro", "Pour les envies d'ailleurs", [
    ("burger-maison", "Burger du Moment", "Pain brioché, steak de bœuf, cheddar, sauce maison et frites.", 3000, False, None),
    ("spaghetti-bolo", "Spaghetti bolognaise", "Sauce tomate mijotée à la viande hachée.", 2500, False, None),
    ("frites", "Portion de frites", "Frites dorées et croustillantes.", 1000, False, None),
  ]),
  ("boissons", "Le Comptoir", "Bien frais, pour la convivialité", [
    ("jus-bissap", "Jus de bissap maison", "Fleurs d'hibiscus, menthe et gingembre.", 500, False, None),
    ("jus-ananas", "Jus d'ananas frais", "Ananas pain de sucre pressé du jour.", 1000, False, None),
    ("biere-locale", "Bières locales", "Selon disponibilité au comptoir.", 700, True, None),
    ("sodas-eau", "Sodas & eau minérale", "Bouteille fraîche.", 500, True, None),
  ]),
]

def add_btn(id_, nom, prix, cat, variable):
    v = ' data-variable="1"' if variable else ""
    return (f'<button type="button" class="add-btn" data-add data-id="{id_}" data-nom="{e(nom)}" data-prix="{prix}" '
            f'data-categorie="{e(cat)}"{v} aria-label="Ajouter {e(nom)} au panier">'
            f'{ico("plus","ico-plus")}{ico("check","ico-check")}<span class="lbl-add">Ajouter</span><span class="lbl-added">Ajouté</span></button>')
def price(prix, variable):
    return f'<span class="price">{"<small>dès</small>" if variable else ""}{fcfa(prix)}</span>'

# ---------------------------------------------------------------------------
NAV = [("index.html", "Accueil"), ("menu.html", "La carte"), ("a-propos.html", "À propos"), ("index.html#infos", "Nous trouver")]

def page(file, title, desc, body, current=None, noindex=False, extra_head="", wa_float=True):
    full_title = f"{title} | {NAME}" if title else f"{NAME} — Restaurant à Abomey-Calavi"
    def nav(cls):
        items = []
        for href, label in NAV:
            cur = ' aria-current="page"' if href == current else ""
            items.append(f'<li><a href="{href}" class="{cls}"{cur}>{label}</a></li>')
        return "".join(items)
    brand = (f'<a href="index.html" class="brand" aria-label="{NAME}, accueil"><span class="brand__mark" aria-hidden="true">Gm</span>'
             f'<span class="brand__text"><span class="brand__name">Le Goût du Moment</span><span class="brand__city">Abomey-Calavi</span></span></a>')
    canonical = f"{URL}/{'' if file == 'index.html' else file}"
    float_btn = (f'<a href="{WA_HELLO}" class="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Nous écrire sur WhatsApp">{wa_ico()}<span>WhatsApp</span></a>'
                 if wa_float else "")
    return f"""<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(full_title)}</title>
  <meta name="description" content="{e(desc)}">
  {'<meta name="robots" content="noindex, follow">' if noindex else ''}
  <meta name="theme-color" content="#1E1F22">
  <link rel="canonical" href="{canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr">
  <meta property="og:site_name" content="{NAME}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="{e(full_title)}">
  <meta property="og:description" content="{e(desc)}">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=DM+Sans:opsz,wght@9..40,400..700&family=Fraunces:ital,opsz,wght@0,9..144,500..700;1,9..144,600..700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v={V}">
  <script>document.documentElement.classList.add("js");</script>{extra_head}
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="header">
  <div class="container header__inner">
    {brand}
    <nav class="nav" aria-label="Navigation principale"><ul class="nav__list">{nav("nav__link")}</ul></nav>
    <div class="header__actions">
      <a href="menu.html" class="header__cta">Commander</a>
      <a href="commander.html" class="icon-btn cart-btn" aria-label="Mon panier, vide">{ico("bag","ico--lg")}<span class="cart-badge" aria-hidden="true" hidden>0</span></a>
      <button type="button" class="icon-btn burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="drawer">{ico("menu","ico--lg")}</button>
    </div>
  </div>
</header>
<div class="drawer-overlay" id="drawer-overlay" hidden></div>
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" hidden>
  <div class="drawer__head">
    <p class="drawer__title" id="drawer-title">Le Goût du Moment</p>
    <p class="drawer__desc">{SLOGAN}</p>
    <button type="button" class="icon-btn drawer__close" id="drawer-close" aria-label="Fermer le menu">{ico("x")}</button>
  </div>
  <nav class="drawer__nav" aria-label="Navigation mobile"><ul>{nav("drawer__link")}<li><a href="commander.html" class="drawer__link">Mon panier</a></li></ul></nav>
  <div class="drawer__actions">
    <a href="menu.html" class="is-gold">Commander maintenant</a>
    <a href="tel:{PHONE_INTL}" class="is-outline">{ico("phone")} {PHONE_DISP}</a>
    <a href="{WA_HELLO}" class="is-wa" target="_blank" rel="noopener noreferrer">{wa_ico()} WhatsApp</a>
  </div>
</div>
<main id="contenu">
{body}
</main>
<footer class="footer">
  <div class="rule" aria-hidden="true"></div>
  <div class="container footer__grid">
    <div>{brand}<p class="footer__slogan">{SLOGAN}</p></div>
    <nav class="footer__col" aria-label="Pied de page"><p class="footer__heading">Navigation</p><ul>{"".join(f'<li><a href="{h}">{l}</a></li>' for h, l in NAV)}<li><a href="commander.html">Mon panier</a></li></ul></nav>
    <div class="footer__col">
      <p class="footer__heading">Nous trouver</p>
      <a href="{MAPS}" target="_blank" rel="noopener noreferrer" class="footer__addr">{e(ADDR)}</a>
      <a href="tel:{PHONE_INTL}" class="tnum" style="margin-top:.5rem">{PHONE_DISP}</a>
    </div>
    <div class="footer__col">
      <p class="footer__heading">Commander</p>
      <a href="{WA_HELLO}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <p>🛵 Livraison · 🛍️ À emporter · 🍽️ Sur place</p>
    </div>
  </div>
  <div class="container footer__bottom">
    <p>© {NAME} · Abomey-Calavi, Bénin</p>
    <a href="mentions-legales.html">Mentions légales</a>
  </div>
</footer>
{float_btn}
<script src="assets/js/cart.js?v={V}" defer></script>
<script src="assets/js/main.js?v={V}" defer></script>
</body>
</html>
"""

def page_head(eyebrow, title, lead="", back=("index.html", "Retour à l'accueil")):
    lead_html = f'<p class="page-head__lead">{lead}</p>' if lead else ""
    return f"""<section class="page-head chalkboard">
  <div class="container page-head__inner hero-rise">
    <a href="{back[0]}" class="back">{ico("back","ico--sm")} {back[1]}</a>
    <p class="page-head__eyebrow">{eyebrow}</p>
    <h1 class="page-head__title">{title}</h1>
    {lead_html}
  </div>
  <div class="rule" aria-hidden="true"></div>
</section>"""

# ---------------------------------------------------------------------------
# index.html
# ---------------------------------------------------------------------------
all_items = {it[0]: (cat_title, it) for _, cat_title, _, items in MENU for it in items}
slate_ids = ["riz-au-gras-poulet", "poisson-braise", "amiwo-poulet", "jus-bissap"]
slate = "".join(
    f'<li><div class="grow"><p class="slate__name">{e(all_items[i][1][1])}</p><p class="slate__desc">{e(all_items[i][1][2])}</p></div>'
    f'<span class="slate__price">{"dès " if all_items[i][1][4] else ""}{fcfa(all_items[i][1][3])}</span></li>' for i in slate_ids)

feat_ids = ["poisson-braise", "riz-au-gras-poulet", "brochettes-boeuf", "burger-maison", "jus-bissap"]
def fcard(i, dark=False):
    cat, (id_, nom, desc, prix, var, badge) = all_items[i]
    return (f'<article class="fcard{" fcard--dark" if dark else ""}"><p class="fcard__tag">{e(badge or cat)}</p><h3 class="fcard__name">{e(nom)}</h3>'
            f'<p class="fcard__desc">{e(desc)}</p><div class="fcard__foot">{price(prix, var)}{add_btn(id_, nom, prix, cat, var)}</div></article>')
feats = fcard(feat_ids[0], True) + "".join(fcard(i) for i in feat_ids[1:])

ld = {"@context": "https://schema.org", "@type": "Restaurant", "name": NAME, "slogan": SLOGAN, "description": DESC, "url": URL,
      "telephone": PHONE_INTL, "priceRange": "FCFA", "servesCuisine": ["Béninoise", "Grillades", "Bistro"],
      "address": {"@type": "PostalAddress", "streetAddress": "Togoudo, près de l'école de base, à 100 m du Carrefour Maria Gléta",
                  "addressLocality": "Abomey-Calavi", "addressCountry": "BJ"}}
ld_tag = f'\n  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'

index_body = f"""<section class="hero chalkboard">
  <div class="container hero__grid">
    <div class="hero-rise">
      <p class="hero__kicker">Bienvenue à Togoudo</p>
      <h1 class="hero__title">Le Goût <em>du Moment</em></h1>
      <p class="hero__lead">{SLOGAN} Cuisine du pays, grillades et coin bistro : commandez en ligne, on s'occupe du reste.</p>
      <div class="hero__ctas">
        <a href="menu.html" class="btn btn--gold">Voir la carte & commander {ico("arrow")}</a>
        <a href="{WA_HELLO}" class="btn btn--ghost" target="_blank" rel="noopener noreferrer">{wa_ico()} Nous écrire</a>
      </div>
      <p class="hero__addr">{ico("pin","ico--sm")}<span>{e(ADDR)}</span></p>
    </div>
    <aside class="slate hero-rise hero-rise--late" aria-labelledby="slate-title">
      <h2 class="slate__title" id="slate-title">À l'ardoise</h2>
      <p class="slate__sub">Les envies du moment</p>
      <ul class="slate__list">{slate}</ul>
      <a href="menu.html" class="slate__more">Toute la carte {ico("arrow","ico--sm")}</a>
    </aside>
  </div>
  <div class="rule" aria-hidden="true"></div>
</section>

<section class="bg-white" aria-label="Nos atouts">
  <ul class="container perks__list stagger" style="padding-inline:0">
    <li class="perks__item"><span class="perks__ico" aria-hidden="true">🛵</span><div><h2 class="perks__title">Livraison à domicile</h2><p>Dans Calavi et environs, tarif confirmé sur WhatsApp.</p></div></li>
    <li class="perks__item"><span class="perks__ico" aria-hidden="true">🛍️</span><div><h2 class="perks__title">À emporter</h2><p>Commandez en ligne, retrait rapide au comptoir.</p></div></li>
    <li class="perks__item"><span class="perks__ico" aria-hidden="true">🍽️</span><div><h2 class="perks__title">Sur place</h2><p>En terrasse ou en salle, dans une ambiance conviviale.</p></div></li>
  </ul>
</section>

<section class="section bg-white">
  <div class="container">
    <div class="featured__top">
      <div class="heading reveal"><p class="eyebrow">Nos incontournables</p><h2 class="heading__title">Ce qu'on vient chercher chez nous</h2></div>
      <a href="menu.html" class="link-arrow reveal">Toute la carte {ico("arrow","ico--sm")}</a>
    </div>
    <div class="featured__grid stagger">{feats}</div>
  </div>
</section>

<section class="section chalkboard">
  <div class="container">
    <div class="heading reveal"><p class="eyebrow">Comme vous voulez</p><h2 class="heading__title" style="color:#fff">Trois façons de profiter du moment</h2></div>
    <div class="ways stagger">
      <div class="way"><p class="emoji" aria-hidden="true">🛵</p><h3 class="way__title">Livraison à domicile</h3><p>Vos plats livrés chauds à Calavi et dans les environs. Indiquez vos repères, on vous appelle si besoin.</p></div>
      <div class="way"><p class="emoji" aria-hidden="true">🛍️</p><h3 class="way__title">À emporter</h3><p>Validez votre panier, on vous prévient sur WhatsApp et vous passez récupérer votre commande.</p></div>
      <div class="way"><p class="emoji" aria-hidden="true">🍽️</p><h3 class="way__title">Sur place</h3><p>En terrasse ou en salle : votre commande est prête à votre arrivée.</p></div>
    </div>
  </div>
</section>

<section class="section bg-white" id="infos" aria-labelledby="loc-title">
  <div class="container loc">
    <div class="reveal">
      <div class="heading"><p class="eyebrow">Nous trouver</p><h2 class="heading__title" id="loc-title">À Togoudo, près du Carrefour Maria Gléta</h2></div>
      <p class="loc__addr">{ico("pin")}<span>{e(ADDR)}</span></p>
      <ul class="loc__marks"><li>Près de l'école de base de Togoudo</li><li>À 100 m du Carrefour Maria Gléta</li></ul>
      <div class="loc__ctas">
        <a href="{MAPS}" class="btn btn--outline" target="_blank" rel="noopener noreferrer">Itinéraire Google Maps</a>
        <a href="tel:{PHONE_INTL}" class="btn btn--outline">{ico("phone")} Appeler</a>
      </div>
    </div>
    <div class="map reveal" id="map" data-src="{e(MAP_EMBED)}" style="--d:.1s">
      <button type="button" class="map__btn" id="map-btn"><span class="map__pin">{ico("pin")}</span><span class="map__label">Afficher la carte</span><span class="map__hint">Chargée seulement si vous la demandez</span></button>
    </div>
  </div>
</section>

<section class="chalkboard">
  <div class="rule" aria-hidden="true"></div>
  <div class="container final__inner">
    <h2 class="final__title reveal">Une petite faim ? <em>C'est le moment.</em></h2>
    <a href="menu.html" class="btn btn--gold reveal">Commander maintenant {ico("arrow")}</a>
  </div>
</section>"""

# ---------------------------------------------------------------------------
# menu.html
# ---------------------------------------------------------------------------
cats_nav = "".join(f'<li><a href="#{cid}" class="cat-nav__link">{e(t)}</a></li>' for cid, t, _, _ in MENU)
sections = []
for n, (cid, title, note, items) in enumerate(MENU, 1):
    lis = "".join(
        f'<li class="item"><div class="grow"><div class="item__top"><h3 class="item__name">{e(nom)}</h3>'
        f'{f"<span class=\"badge\">{e(badge)}</span>" if badge else ""}</div><p class="item__desc">{e(desc)}</p>{price(prix, var)}</div>'
        f'{add_btn(id_, nom, prix, title, var)}</li>' for id_, nom, desc, prix, var, badge in items)
    sections.append(f"""<section id="{cid}" class="carte__cat" aria-labelledby="{cid}-titre">
      <div class="carte__head reveal"><span class="carte__num" aria-hidden="true">{n:02d}</span><div><h2 id="{cid}-titre" class="carte__title">{e(title)}</h2><p class="carte__note">{e(note)}</p></div></div>
      <ul class="carte__list stagger">{lis}</ul>
    </section>""")
menu_body = page_head("La carte", "Ce qui se mange en ce moment",
                      "Ajoutez vos plats au panier : le total se calcule en direct, puis la commande part sur WhatsApp.") + f"""
<nav class="cat-nav" aria-label="Catégories de la carte"><ul class="container cat-nav__list">{cats_nav}</ul></nav>
<div class="bg-white">
<div class="container carte">
  <div class="carte__cats">{"".join(sections)}</div>
  <div class="carte__cta reveal">
    <div><p class="carte__cta-title">Panier prêt ?</p><p>🛵 Livraison, 🛍️ à emporter ou 🍽️ sur place (terrasse ou salle).</p></div>
    <a href="commander.html" class="btn btn--gold btn--static">Voir mon panier {ico("arrow")}</a>
  </div>
  <p class="carte__foot">« dès » : prix variable selon votre choix, montant final confirmé sur WhatsApp.</p>
</div>
</div>"""

# ---------------------------------------------------------------------------
# commander.html
# ---------------------------------------------------------------------------
def mode(value, emoji, title, small, checked=False):
    return (f'<label class="mode"><input type="radio" name="mode" value="{value}"{" checked" if checked else ""}>'
            f'<span class="emoji" aria-hidden="true">{emoji}</span><span class="mode__body"><strong>{title}</strong><small>{small}</small></span></label>')

order_body = page_head("Commande en ligne", "Mon panier", back=("menu.html", "Continuer mes achats")) + f"""
<div class="bg-white">
  <div class="container order">
    <div class="order__main">
      <section class="card" aria-labelledby="cart-title">
        <div class="card__head">
          <h2 class="card__title" id="cart-title">Votre panier</h2>
          <button type="button" class="link-btn" id="cart-clear" hidden>Vider le panier</button>
        </div>
        <div class="skeleton" id="cart-loading" aria-hidden="true"></div>
        <ul class="cart-list" id="cart-list" aria-live="polite" hidden></ul>
        <div class="empty" id="cart-empty" hidden>
          {ico("bag","empty__ico")}
          <p class="empty__title">Votre panier est vide</p>
          <p class="empty__text">Commencez par ajouter des plats depuis la carte.</p>
          <a href="menu.html" class="btn btn--gold btn--static">Voir la carte</a>
        </div>
        <div class="empty" id="cart-done" hidden>
          <span class="empty__ok">{ico("check")}</span>
          <p class="empty__title">Commande prête à l'envoi !</p>
          <p class="empty__text">Envoyez le message dans WhatsApp pour transmettre votre commande. L'équipe vous confirme la prise en charge et, en livraison, le tarif selon votre quartier.</p>
          <a href="#" class="btn btn--wa btn--static" id="cart-done-link" target="_blank" rel="noopener noreferrer">{wa_ico()} Rouvrir WhatsApp</a>
        </div>
      </section>

      <form class="card stack" id="form-commande" novalidate hidden>
        <h2 class="card__title">Vos informations</h2>
        <fieldset><legend class="legend">Comment souhaitez-vous être servi ?</legend><div class="modes">
          {mode("livraison", "🛵", "Livraison à domicile", "Calavi et environs", True)}
          {mode("emporter", "🛍️", "À emporter", "Retrait rapide")}
          {mode("surplace", "🍽️", "Sur Place", "Terrasse ou Salle")}
        </div></fieldset>
        <fieldset id="espace-field" hidden><legend class="legend">Où souhaitez-vous vous installer ?</legend><div class="choices">
          <label class="choice"><input type="radio" name="espace" value="terrasse" checked><span class="emoji" aria-hidden="true">🌿</span><span><strong>Terrasse</strong><small>En plein air</small></span></label>
          <label class="choice"><input type="radio" name="espace" value="salle"><span class="emoji" aria-hidden="true">🏠</span><span><strong>Salle</strong><small>À l'intérieur</small></span></label>
        </div></fieldset>
        <div class="grid-2">
          <div class="field"><label for="livraison-nom">Nom complet <abbr title="obligatoire">*</abbr></label><input class="input" type="text" id="livraison-nom" autocomplete="name" required placeholder="Ex. Aïcha Dossou"></div>
          <div class="field"><label for="livraison-tel">Numéro WhatsApp <abbr title="obligatoire">*</abbr></label><input class="input" id="livraison-tel" type="tel" inputmode="tel" autocomplete="tel" required placeholder="01 00 00 00 00" pattern="^(\\+?229[\\s.\\-]?)?01([\\s.\\-]?\\d{{2}}){{4}}$" title="Numéro béninois à 10 chiffres commençant par 01, ex. 01 00 00 00 00"></div>
        </div>
        <div class="field" id="adresse-field">
          <label for="livraison-adresse">Adresse de livraison précise <abbr title="obligatoire">*</abbr></label>
          <textarea class="input" id="livraison-adresse" rows="3" required placeholder="Quartier, rue, repères (ex. Togoudo, derrière la pharmacie, portail vert)"></textarea>
        </div>
        <p class="pickup" id="pickup-info" hidden>🛍️ Retrait au comptoir : {e(ADDR)}.</p>
      </form>
    </div>

    <aside class="order__side" aria-labelledby="summary-title">
      <div class="summary">
        <h2 class="card__title" id="summary-title">L'addition</h2>
        <dl class="summary__lines">
          <div><dt>Articles</dt><dd id="sum-count">0</dd></div>
          <div><dt>Sous-total</dt><dd id="sum-subtotal">0 FCFA</dd></div>
          <div><dt>Livraison</dt><dd class="is-light" id="sum-delivery">À définir</dd></div>
        </dl>
        <div class="summary__total"><span>Total</span><span id="sum-total">0 FCFA</span></div>
        <p class="summary__note" id="sum-variable" hidden>* Certains articles ont un prix variable : le montant final vous sera confirmé sur WhatsApp.</p>
        <p class="summary__note" id="sum-delivery-note">Livraison : tarif confirmé sur WhatsApp selon votre quartier.</p>
        <p class="summary__error" id="order-error" role="alert" hidden></p>
        <button type="submit" form="form-commande" class="btn btn--gold btn--block" id="btn-commander" disabled>{wa_ico()} Valider la commande</button>
        <p class="summary__foot">La commande s'ouvre dans WhatsApp, prête à envoyer.</p>
      </div>
    </aside>
  </div>
</div>"""

# ---------------------------------------------------------------------------
# a-propos.html
# ---------------------------------------------------------------------------
about_body = f"""<section class="about-hero chalkboard" aria-labelledby="about-title">
  <div class="container about-hero__inner hero-rise">
    <p class="page-head__eyebrow">Notre histoire</p>
    <h1 class="about-hero__title" id="about-title">Le Goût <em>du Moment</em></h1>
    <p class="about-hero__lead">{SLOGAN}</p>
  </div>
  <div class="rule" aria-hidden="true"></div>
</section>

<section class="section bg-white">
  <div class="container about-split">
    <h2 class="about-split__title reveal">Une table où l'on prend le temps <em>de bien manger.</em></h2>
    <div class="about-split__text reveal" style="--d:.1s">
      <p>Installé à Togoudo, près de l'école de base et à deux pas du Carrefour Maria Gléta, LE GOÛT DU MOMENT est né d'une envie simple : offrir à Calavi un lieu où la bonne cuisine et la convivialité vont de pair.</p>
      <p>Plats du pays mijotés comme à la maison, grillades braisées à la commande, coin bistro pour les envies d'ailleurs : la carte suit les saisons et les envies du moment, d'où notre nom.</p>
      <p>Que vous passiez en famille, entre amis ou que vous commandiez depuis chez vous, notre équipe vous accueille avec le sourire.</p>
      <a href="menu.html" class="link-arrow">Découvrir la carte {ico("arrow","ico--sm")}</a>
    </div>
  </div>
</section>

<section class="section bg-muted" aria-labelledby="values-title">
  <div class="container">
    <h2 id="values-title" class="heading__title reveal">Ce qui nous définit</h2>
    <ul class="values stagger">
      <li class="value value--dark"><p class="emoji" aria-hidden="true">🔥</p><h3 class="value__title">Le goût d'abord</h3><p>Des produits frais du marché, des marinades maison et des cuissons à la commande.</p></li>
      <li class="value"><p class="emoji" aria-hidden="true">🤝</p><h3 class="value__title">La convivialité</h3><p>Une terrasse et une salle pensées pour se retrouver, partager et prendre son temps.</p></li>
      <li class="value"><p class="emoji" aria-hidden="true">📍</p><h3 class="value__title">Au cœur de Togoudo</h3><p>À 100 m du Carrefour Maria Gléta, facile d'accès. Livraison dans Calavi et environs.</p></li>
    </ul>
    <div class="about-ctas reveal">
      <a href="menu.html" class="btn btn--gold">Commander en ligne</a>
      <a href="index.html#infos" class="btn btn--outline">Nous trouver</a>
    </div>
  </div>
</section>"""

# ---------------------------------------------------------------------------
legal_body = f"""<div class="bg-white"><div class="simple">
  <h1>Mentions légales</h1>
  <div class="simple__body">
    <h2>Éditeur du site</h2>
    <p>{NAME} — {e(ADDR)}.<br>Téléphone / WhatsApp : <a href="tel:{PHONE_INTL}">{PHONE_DISP}</a></p>
    <h2>Commandes</h2>
    <p>Les commandes passées sur ce site sont transmises par WhatsApp et ne sont définitives qu'après confirmation de l'établissement. Les prix sont indiqués en francs CFA ; les frais de livraison sont précisés lors de la confirmation.</p>
    <h2>Données personnelles</h2>
    <p>Le site ne collecte aucune donnée sur un serveur. Le contenu du panier est conservé uniquement dans votre navigateur. Les informations saisies (nom, téléphone, adresse) sont incluses dans le message WhatsApp que vous choisissez d'envoyer.</p>
    <h2>Hébergement</h2>
    <p>À compléter selon l'hébergeur retenu.</p>
  </div>
</div></div>"""

notfound_body = f"""<div class="bg-white"><div class="simple">
  <p class="eyebrow">Erreur 404</p>
  <h1>Cette page n'est plus à l'ardoise.</h1>
  <div class="simple__body"><p>La page demandée n'existe pas ou a été déplacée.</p>
  <p><a href="index.html" class="btn btn--gold">Retour à l'accueil</a></p></div>
</div></div>"""

PAGES = [
  ("index.html", None, DESC, index_body, "index.html", False, ld_tag),
  ("menu.html", "La carte", "La carte de LE GOÛT DU MOMENT : cuisine du pays, grillades, coin bistro et boissons. Ajoutez au panier et commandez sur WhatsApp.", menu_body, "menu.html", False, ""),
  ("commander.html", "Mon panier", "Votre panier LE GOÛT DU MOMENT : livraison, à emporter ou sur place, commande validée sur WhatsApp.", order_body, None, True, ""),
  ("a-propos.html", "À propos", f"L'histoire de LE GOÛT DU MOMENT. {SLOGAN}", about_body, "a-propos.html", False, ""),
  ("mentions-legales.html", "Mentions légales", "Mentions légales du site LE GOÛT DU MOMENT.", legal_body, None, False, ""),
  ("404.html", "Page introuvable", "Page introuvable.", notfound_body, None, True, ""),
]
for file, title, desc, body, cur, noindex, extra in PAGES:
    with open(os.path.join(OUT, file), "w") as f:
        f.write(page(file, title, desc, body, cur, noindex, extra, wa_float=file != "commander.html"))

with open(os.path.join(OUT, "robots.txt"), "w") as f:
    f.write(f"User-agent: *\nAllow: /\nSitemap: {URL}/sitemap.xml\n")
with open(os.path.join(OUT, "sitemap.xml"), "w") as f:
    urls = "".join(f"  <url><loc>{URL}/{p}</loc></url>\n" for p in ["", "menu.html", "a-propos.html", "mentions-legales.html"])
    f.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
with open(os.path.join(OUT, "assets/img/favicon.svg"), "w") as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#1E1F22"/>'
            '<circle cx="32" cy="32" r="27" fill="none" stroke="#D4AF37" stroke-width="2.5"/>'
            '<text x="32" y="41" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="25" fill="#D4AF37">Gm</text></svg>\n')
print("ok")
