"""Copia um build `out/` do Next para um diretorio servivel sob qualquer caminho.

Usado pelo deploy para publicar versoes do site em /1/, /2/, /3/ (ver scripts/versoes/build.sh).
Reescreve caminhos absolutos do HTML e do CSS para relativos e injeta um shim que corrige
os caminhos montados em tempo de execucao (chunks, imagens, videos, fetch).

Uso: relativize.py <out> <dest> <rotulo> [tamanho_de_quadro_removido ...]
"""
import os, re, shutil, sys, json

src, dst, label = sys.argv[1], sys.argv[2], sys.argv[3]
drop_sizes = set(sys.argv[4:])

if os.path.exists(dst):
    shutil.rmtree(dst)

def skip(rel):
    parts = rel.split("/")
    if rel.endswith(".txt") and rel != "robots.txt":
        return True
    if rel.endswith(".htaccess"):
        return True
    if parts[0] == "configurador" and len(parts) >= 3 and parts[2] in drop_sizes:
        return True
    if parts[0] in ("404", "_not-found") or rel == "404.html":
        return True
    return False

SHIM = r"""<script>(function(){
var ROOT=new URL(%(prefix)s,location.href).href;window.__JK_ROOT=ROOT;
var DROP=%(drop)s;
function fix(u){if(typeof u!=="string"||u.charAt(0)!=="/"||u.charAt(1)==="/")return u;
var p=u.slice(1);
if(p.indexOf("configurador/")===0){var s=p.split("/");if(s.length>3&&DROP.indexOf(s[2])>=0){s[2]="1280";p=s.join("/");}}
var q=p.search(/[?#]/),path=q<0?p:p.slice(0,q),tail=q<0?"":p.slice(q);
if(path===""||path.slice(-1)==="/")path+="index.html";
return ROOT+path+tail;}
function fixSet(v){if(typeof v!=="string")return v;return v.split(",").map(function(part){var t=part.trim(),i=t.indexOf(" ");return i<0?fix(t):fix(t.slice(0,i))+t.slice(i);}).join(", ");}
function fixCss(v){return typeof v==="string"?v.replace(/url\((['"]?)(\/[^/][^)'"]*)\1\)/g,function(m,q,u){return "url("+q+fix(u)+q+")";}):v;}
window.TURBOPACK_CHUNK_BASE_PATH=ROOT+"_next/";
var ATTR={src:fix,href:fix,poster:fix,srcset:fixSet,imagesrcset:fixSet};
var sa=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(n,v){var f=ATTR[String(n).toLowerCase()];return sa.call(this,n,f?f(v):v);};
function hook(C,prop,f){if(!C)return;var d=Object.getOwnPropertyDescriptor(C.prototype,prop);if(!d||!d.set)return;
Object.defineProperty(C.prototype,prop,{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){d.set.call(this,f(v));}});}
hook(window.HTMLImageElement,"src",fix);hook(window.HTMLImageElement,"srcset",fixSet);
hook(window.HTMLSourceElement,"src",fix);hook(window.HTMLSourceElement,"srcset",fixSet);
hook(window.HTMLMediaElement,"src",fix);hook(window.HTMLVideoElement,"poster",fix);
hook(window.HTMLScriptElement,"src",fix);hook(window.HTMLLinkElement,"href",fix);
hook(window.HTMLLinkElement,"imageSrcset",fixSet);
var sp=CSSStyleDeclaration.prototype.setProperty;
CSSStyleDeclaration.prototype.setProperty=function(n,v,p){return sp.call(this,n,fixCss(v),p);};
var of=window.fetch;if(of)window.fetch=function(i,o){return of.call(this,typeof i==="string"?fix(i):i,o);};
var xo=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){var a=[].slice.call(arguments);a[1]=fix(u);return xo.apply(this,a);};
window.addEventListener("click",function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a||a.target==="_blank")return;
var h=a.getAttribute("href");if(!h||h.charAt(0)==="#")return;
var u=new URL(a.href);if(u.origin!==location.origin)return;
if(u.pathname===location.pathname&&u.hash)return;
e.stopImmediatePropagation();},true);
})();</script>"""

ATTR_RE = re.compile(r'(\s(?:src|href|poster|srcset|srcSet|imageSrcSet|imagesrcset))="([^"]*)"')

def rel_url(u, prefix):
    if not u.startswith("/") or u.startswith("//"):
        return u
    p = u[1:]
    m = re.search(r"[?#]", p)
    path, tail = (p, "") if not m else (p[: m.start()], p[m.start():])
    parts = path.split("/")
    if parts[0] == "configurador" and len(parts) > 3 and parts[2] in drop_sizes:
        parts[2] = "1280"
        path = "/".join(parts)
    if path == "" or path.endswith("/"):
        path += "index.html"
    return prefix + path + tail

def rel_set(v, prefix):
    out = []
    for part in v.split(","):
        t = part.strip()
        if " " in t:
            u, rest = t.split(" ", 1)
            out.append(rel_url(u, prefix) + " " + rest)
        else:
            out.append(rel_url(t, prefix))
    return ", ".join(out)

count = 0
for root, _, files in os.walk(src):
    for name in files:
        full = os.path.join(root, name)
        rel = os.path.relpath(full, src).replace(os.sep, "/")
        if skip(rel):
            continue
        target = os.path.join(dst, rel)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        count += 1
        if rel.endswith(".html"):
            depth = rel.count("/")
            prefix = "../" * depth if depth else "./"
            html = open(full, encoding="utf-8").read()
            def attr(m):
                n, v = m.group(1), m.group(2)
                if "srcset" in n.lower():
                    return f'{n}="{rel_set(v, prefix)}"'
                return f'{n}="{rel_url(v, prefix)}"'
            html = ATTR_RE.sub(attr, html)
            html = re.sub(r"(<style[^>]*>)(.*?)(</style>)", lambda m: m.group(1) + re.sub(r"url\((['\"]?)(/[^/][^)'\"]*)\1\)", lambda n: f"url({n.group(1)}{rel_url(n.group(2), prefix)}{n.group(1)})", m.group(2)) + m.group(3), html, flags=re.S)
            shim = SHIM % {"prefix": json.dumps(prefix), "drop": json.dumps(sorted(drop_sizes))}
            banner = ('<div style="position:fixed;left:8px;bottom:8px;z-index:2147483647;'
                      'font:600 11px/1.4 system-ui,sans-serif;background:#1d1a17;color:#f3eee6;'
                      'padding:4px 8px;border-radius:4px;opacity:.85;pointer-events:none">'
                      f'{label}</div>')
            html = html.replace("<head>", '<head><meta name="robots" content="noindex, nofollow"/>' + shim, 1)
            html = html.replace("</body>", banner + "</body>", 1)
            open(target, "w", encoding="utf-8").write(html)
        elif rel.endswith(".css"):
            depth = rel.count("/")
            prefix = "../" * depth
            css = open(full, encoding="utf-8").read()
            css = re.sub(r"url\((['\"]?)(/[^/][^)'\"]*)\1\)",
                         lambda m: f"url({m.group(1)}{rel_url(m.group(2), prefix)}{m.group(1)})", css)
            open(target, "w", encoding="utf-8").write(css)
        else:
            shutil.copy2(full, target)
print(count)
