"""Actualiza el catálogo de la web de Semilla Viva (precio, stock, foto y categoría).

Hoy lee la tienda online pública (Tiendanube). Cuando tengamos las claves de la API
de Contabilium, este script se reemplaza por una lectura directa de Contabilium.

Uso, desde la carpeta del repo:
    python3 -I semilla-viva/_herramientas/actualizar_catalogo.py

Reescribe el bloque <script id="catalogo-datos"> de semilla-viva/index.html.
"""
import html
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

TIENDA = "https://minorista.semillaviva.com.ar"
INDEX = Path(__file__).resolve().parent.parent / "index.html"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) catalogo-semilla-viva"}
CATEGORIAS = [  # (slug en la tienda, clave en la web), en orden de prioridad
    ("infusiones", "yerbas"), ("dulces", "mieles"), ("harinas-y-semillas", "harinas"),
    ("aceites", "aceites"), ("snacks-y-galletitas", "snacks"), ("bebidas", "bebidas"),
    ("gourmet", "gourmet"), ("azucar-y-edulcorantes", "endulzantes"),
    ("sales-y-especias", "especias"), ("suplementos-superalimentos-y-mas1", "suplementos"),
]
ETIQUETAS = [("o", "organicos"), ("g", "singluten"), ("v", "veganos")]


def bajar(url):
    for intento in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return r.read().decode("utf-8", "ignore")
        except Exception:
            time.sleep(2 * (intento + 1))
    return ""


def ids(pagina):
    return list(dict.fromkeys(int(x) for x in re.findall(r'data-product-id="(\d+)"', pagina)))


def paginas(base):
    """Todas las páginas de un listado, hasta que una no traiga productos nuevos."""
    vistos, salida = set(), []
    for n in range(1, 80):
        pag = bajar(base if n == 1 else f"{base}page/{n}/")
        nuevos = [i for i in ids(pag) if i not in vistos]
        if not nuevos:
            break
        vistos.update(nuevos)
        salida.append(pag)
    return salida


def foto_variante(vs):
    for x in vs:
        m = re.search(r"/products/(.+?)-\d+-\d+\.(webp|png|jpe?g)", x.get("image_url") or "")
        if m:
            return f"{m.group(1)}.{m.group(2)}"
    return None


def productos(pagina):
    for b in re.split(r'(?=<div class="js-item-product )', pagina)[1:]:
        m = re.search(r'data-product-id="(\d+)"', b)
        v = re.search(r'data-variants="([^"]*)"', b)
        a = re.search(r'<a href="(' + re.escape(TIENDA) + r'/productos/[^"?]*)[^"]*" title="([^"]*)"', b)
        # la primera foto del producto: las de abajo vienen con carga diferida (data-srcset)
        im = re.search(r'(?:src|srcset)="//acdn-us\.mitiendanube\.com/stores/976/760/products/([^" ]+?)-\d+-0\.(webp|png|jpe?g)[ "]', b)
        if not (m and v and a):
            continue
        yield {
            "id": int(m.group(1)),
            "nombre": html.unescape(a.group(2)).strip(),
            "slug": a.group(1).rstrip("/").split("/")[-1],
            "variantes": json.loads(html.unescape(v.group(1))),
            "foto": f"{im.group(1)}.{im.group(2)}" if im else foto_variante(json.loads(html.unescape(v.group(1)))),
        }


def main():
    todos = {}
    for pag in paginas(f"{TIENDA}/productos/"):
        for p in productos(pag):
            todos.setdefault(p["id"], p)
    if len(todos) < 100:
        sys.exit(f"Solo encontré {len(todos)} productos; no toco la web.")
    en_cat = {}
    for slug, _ in CATEGORIAS + [(c, None) for _, c in ETIQUETAS]:
        for pag in paginas(f"{TIENDA}/{slug}/"):
            for i in ids(pag):
                en_cat.setdefault(i, set()).add(slug)

    salida = []
    for p in todos.values():
        vs = p["variantes"]
        disp = [x for x in vs if x.get("available")]
        precios = [x["price_number"] for x in (disp or vs) if x.get("price_number") is not None]
        if not precios:
            continue
        stocks = [x.get("stock") for x in vs]
        if not disp:
            stock = 0
        elif all(isinstance(s, int) for s in stocks):
            stock = sum(max(0, s) for s in stocks)
        else:
            stock = None  # la tienda no controla stock de este producto
        cats = en_cat.get(p["id"], set())
        salida.append({
            "i": p["id"], "n": p["nombre"],
            "c": next((k for s, k in CATEGORIAS if s in cats), "almacen"),
            "p": round(min(precios), 2), "s": stock, "u": p["slug"], "f": p["foto"],
            "t": "".join(k for k, s in ETIQUETAS if s in cats),
        })

    hoy = datetime.now(timezone(timedelta(hours=-3))).strftime("%Y-%m-%d")
    datos = {
        "fuente": "Tienda online de Semilla Viva (Tiendanube)", "actualizado": hoy, "moneda": "ARS",
        "img_base": "https://acdn-us.mitiendanube.com/stores/976/760/products/",
        "tienda": f"{TIENDA}/productos/", "productos": salida,
    }
    bloque = json.dumps(datos, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    web = INDEX.read_text(encoding="utf-8")
    nueva, n = re.subn(r'(<script type="application/json" id="catalogo-datos">).*?(</script>)',
                       lambda m: m.group(1) + bloque + m.group(2), web, count=1, flags=re.S)
    if n != 1:
        sys.exit("No encontré el bloque catalogo-datos en index.html.")
    INDEX.write_text(nueva, encoding="utf-8")
    con_stock = sum(1 for x in salida if x["s"] != 0)
    print(f"Listo: {len(salida)} productos, {con_stock} con stock, al {hoy}.")


if __name__ == "__main__":
    main()
