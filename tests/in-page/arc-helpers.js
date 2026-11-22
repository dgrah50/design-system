// Injected into every page with page.addInitScript({ path }). Plain JS on purpose: it is serialised as-is.
// Exposes window.__arc with colour resolution and WCAG contrast helpers.
;(function () {
  let ctx = null
  function getCtx() {
    if (!ctx) {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      ctx = canvas.getContext("2d", { willReadFrequently: true })
    }
    return ctx
  }

  // Paint `color` (any CSS colour string the browser can parse: hex, rgb(), oklch(), color(), color-mix() results,
  // alpha included) over an opaque `backdrop` [r,g,b] and read the composited pixel back.
  function paint(color, backdrop) {
    const c = getCtx()
    const sentinel = "#010203"
    c.globalCompositeOperation = "source-over"
    c.clearRect(0, 0, 1, 1)
    c.fillStyle = "rgb(" + backdrop[0] + "," + backdrop[1] + "," + backdrop[2] + ")"
    c.fillRect(0, 0, 1, 1)
    // An unparsable value is silently ignored by canvas, so detect that with a sentinel.
    c.fillStyle = sentinel
    c.fillStyle = color
    if (c.fillStyle === sentinel && String(color).trim().toLowerCase() !== sentinel) {
      throw new Error("Canvas could not parse colour: " + color)
    }
    c.fillRect(0, 0, 1, 1)
    const d = c.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2]]
  }

  function channel(v) {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  function luminance(rgb) {
    return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2])
  }
  function ratio(a, b) {
    const la = luminance(a)
    const lb = luminance(b)
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
  }

  // Opaque colour the user sees behind `el`'s content: every ancestor background (and the element's own, unless
  // excludeSelf) composited from the root down over white. Gradients and images are ignored.
  function effectiveBg(el, excludeSelf) {
    const chain = []
    for (let n = excludeSelf ? el.parentElement : el; n; n = n.parentElement) chain.unshift(n)
    let backdrop = [255, 255, 255]
    for (const n of chain) {
      const bg = getComputedStyle(n).backgroundColor
      backdrop = paint(bg, backdrop)
    }
    return backdrop
  }

  window.__arc = {
    paint: paint,
    luminance: luminance,
    ratio: ratio,
    effectiveBg: effectiveBg,
    // Contrast of two CSS colours; the foreground may be translucent and is composited over the background.
    ratioBetween: function (fg, bg) {
      const back = paint(bg, [255, 255, 255])
      return ratio(paint(fg, back), back)
    },
    textContrast: function (el) {
      const bg = effectiveBg(el, false)
      const color = getComputedStyle(el).color
      const fg = paint(color, bg)
      return { ratio: ratio(fg, bg), color: color, fg: fg, bg: bg }
    },
    // Resting border of `el` (top side) against the surface behind it (the parent's effective background).
    borderContrast: function (el) {
      const cs = getComputedStyle(el)
      const surface = effectiveBg(el, true)
      const width = parseFloat(cs.borderTopWidth)
      const visible = width > 0 && cs.borderTopStyle !== "none" && cs.borderTopStyle !== "hidden"
      if (!visible) return { ratio: 1, color: cs.borderTopColor, width: width, style: cs.borderTopStyle, surface: surface, visible: false }
      const fg = paint(cs.borderTopColor, surface)
      return { ratio: ratio(fg, surface), color: cs.borderTopColor, width: width, style: cs.borderTopStyle, surface: surface, visible: true }
    },
    // Resolve a CSS length expression (var(--x), calc(), rem) to px using a probe element.
    resolveLength: function (expr) {
      const probe = document.createElement("div")
      probe.style.cssText = "position:absolute;visibility:hidden;width:" + expr
      document.body.appendChild(probe)
      const px = parseFloat(getComputedStyle(probe).width)
      probe.remove()
      return px
    },
  }
})()
