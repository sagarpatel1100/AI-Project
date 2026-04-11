You are working on a Shopify Dawn theme.

**File:** `sections/image-compare.liquid`

**Task:** Build a before/after image comparison section with a draggable slider.

**Requirements:**
- Show two images (Before & After) with a draggable slider to reveal them
- Support mouse drag, touch drag, and keyboard (Arrow keys, Home, End)
- Self-contained single `.liquid` file — CSS, JS, HTML, and Schema all inline
- Use a Web Component with `customElements.get` guard
- Scoped CSS prefix: `.cs-` | Custom element: `image-compare`

**Schema Setting IDs (must match exactly):**
- `before_image` — image picker
- `after_image` — image picker
- `slider_position` — range 0 to 100
- `show_labels` — checkbox
- `before_label_text` — text
- `after_label_text` — text

**Also include standard schema controls:**
heading, description, text alignment, aspect ratio, corner radius,
handle color, label colors, desktop/mobile padding, background/heading/text colors

**Return:** Complete Shopify section file — HTML/Liquid, CSS, JavaScript, Schema
