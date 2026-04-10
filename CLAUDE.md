# Shopify Theme — Developer Instructions for Claude

This file is automatically read by Claude Code at the start of every session.
Follow every rule here without exception when writing or editing section code for this project.

---

## Role

Act as an Expert Shopify Theme Developer and CSS Architect working on the Dawn theme.
The goal is a highly scalable, hyper-customizable Shopify theme built on a global utility CSS architecture.

---

## 1. Global Typography Utilities

**Do NOT write new CSS for font sizes. Always apply these utility classes directly in HTML.**

### Fonts
| Element      | Font family   |
|--------------|---------------|
| Headings     | `EB Garamond` (Regular) |
| Descriptions | `Helvetica`   |

### Heading size classes
| Class         | Desktop | Mobile |
|---------------|---------|--------|
| `.font-55-37` | 55px    | 37px   |
| `.font-44-34` | 44px    | 34px   |
| `.font-30-24` | 30px    | 24px   |

### Description size classes
| Class          | Desktop | Mobile |
|----------------|---------|--------|
| `.desc-large`  | 22px    | 18px   |
| `.desc-normal` | 18px    | 16px   |
| `.desc-small`  | 16px    | 14px   |

---

## 2. Global Layout Utilities

**Do NOT re-implement page width or side padding in section CSS.**

| Class                | Behaviour                                                      |
|----------------------|----------------------------------------------------------------|
| `.custom-page-width` | `max-width: 1440px`, auto margins, `56px` side padding desktop, `16px` side padding mobile (< 749px) |

Always wrap section content in `<div class="custom-page-width">` instead of `.page-width`.

---

## 3. Reusable Button Classes

Use these classes for all CTA buttons. Do not invent new button CSS.

| Class               | Style                          |
|---------------------|--------------------------------|
| `.n-button-primary` | Filled pill button             |
| `.n-button-secondary` | Outline / white-fill pill button |

Button colors are passed via CSS custom properties set in the scoped `<style>` block:
- `--sm-btn-bg` — primary background
- `--sm-btn-text` — primary text
- `--sm-btn2-bg` — secondary background
- `--sm-btn2-text` — secondary text

---

## 4. Font-size Utility Classes (fine-tuning)

These are defined globally and can be applied as extra classes where needed:

```
.font-size-11-13   .font-size-12-14   .font-size-13-15
.font-size-14-16   .font-size-16-18   .font-size-18-20
.font-size-20-24   .font-size-24-30   .font-size-28-36
.font-size-36-48   .font-size-48-64   .font-size-60-80
```

Format: `clamp(MINrem, Xvw, MAXrem)` — do not redefine these.

---

## 5. Mobile Breakpoint

**Always use `749px` as the single mobile breakpoint.**

```css
@media screen and (max-width: 749px) { ... }
```

Never use `768px`, `576px`, or any other breakpoint.

---

## 6. Schema — Hyper-Customization Requirements

Every section schema MUST include the following settings. No exceptions.

### Typography controls
```json
{ "type": "select", "id": "heading_size",  "label": "Heading size",
  "options": [
    { "value": "font-55-37", "label": "Large (55/37px)"  },
    { "value": "font-44-34", "label": "Medium (44/34px)" },
    { "value": "font-30-24", "label": "Small (30/24px)"  }
  ], "default": "font-44-34" },

{ "type": "select", "id": "desc_size", "label": "Description size",
  "options": [
    { "value": "desc-large",  "label": "Large (22/18px)"  },
    { "value": "desc-normal", "label": "Normal (18/16px)" },
    { "value": "desc-small",  "label": "Small (16/14px)"  }
  ], "default": "desc-normal" }
```

### Padding controls (Desktop + Mobile)
```json
{ "type": "range", "id": "padding_top",           "label": "Desktop padding top",    "min": 0, "max": 120, "step": 4, "unit": "px", "default": 60 },
{ "type": "range", "id": "padding_bottom",         "label": "Desktop padding bottom", "min": 0, "max": 120, "step": 4, "unit": "px", "default": 60 },
{ "type": "range", "id": "mobile_padding_top",     "label": "Mobile padding top",     "min": 0, "max": 80,  "step": 4, "unit": "px", "default": 40 },
{ "type": "range", "id": "mobile_padding_bottom",  "label": "Mobile padding bottom",  "min": 0, "max": 80,  "step": 4, "unit": "px", "default": 40 }
```

### Alignment control
```json
{ "type": "select", "id": "text_alignment", "label": "Text alignment",
  "options": [
    { "value": "left",   "label": "Left"   },
    { "value": "center", "label": "Center" },
    { "value": "right",  "label": "Right"  }
  ], "default": "left" }
```

### Color controls (always include)
```json
{ "type": "color", "id": "bg_color",      "label": "Background color", "default": "#FFFFFF" },
{ "type": "color", "id": "heading_color", "label": "Heading color",    "default": "#111111" },
{ "type": "color", "id": "text_color",    "label": "Text color",       "default": "#444444" }
```

### Background image (include when relevant)
```json
{ "type": "image_picker", "id": "bg_image", "label": "Background image" }
```

---

## 7. Code Structure — Strict Output Order

Every `.liquid` section file MUST follow this exact order:

```
1. <style>   — ONLY for dynamic schema variables scoped to #SectionName-{{ section.id }}
2. <script>  — ONLY if JS is explicitly required (e.g. countdown timer, carousel)
3. HTML/Liquid structure
4. {% schema %}
```

### The `<style>` block rules

- Scope ALL dynamic variables to `#SectionName-{{ section.id }}` — never use global selectors
- Only map schema values to CSS custom properties here
- Never write font-size, max-width, or padding utility logic here — those belong in global CSS

**Correct pattern:**
```liquid
{%- style -%}
  #MySection-{{ section.id }} {
    --bg:             {{ section.settings.bg_color }};
    --heading-color:  {{ section.settings.heading_color }};
    --text-color:     {{ section.settings.text_color }};
    --pt:             {{ section.settings.padding_top }}px;
    --pb:             {{ section.settings.padding_bottom }}px;
  }
  @media screen and (max-width: 749px) {
    #MySection-{{ section.id }} {
      --pt: {{ section.settings.mobile_padding_top }}px;
      --pb: {{ section.settings.mobile_padding_bottom }}px;
    }
  }
{%- endstyle -%}
```

**Wrong — never do this:**
```html
<!-- ❌ Inline styles for things global utilities handle -->
<h2 style="font-size: 44px;">...</h2>
<div style="max-width: 1440px; padding: 0 56px;">...</div>
```

---

## 8. HTML Pattern — Applying Dynamic Classes

Schema select values map directly to utility class names. Apply them in HTML like this:

```liquid
<h2 class="{{ section.settings.heading_size }}" style="color: var(--heading-color);">
  {{ section.settings.heading }}
</h2>

<p class="{{ section.settings.desc_size }}" style="color: var(--text-color);">
  {{ section.settings.description }}
</p>

<div class="my-section__content my-section__content--{{ section.settings.text_alignment }}">
  ...
</div>
```

---

## 9. CSS — Scoped Section Styles

When a section needs custom CSS beyond global utilities, create a separate asset file:

- File name: `assets/section-[name].css`
- Load it: `{{ 'section-[name].css' | asset_url | stylesheet_tag }}`
- Scope everything to `.my-section` prefix — never use global/bare selectors
- Do NOT redeclare global utility classes inside section CSS

---

## 10. No Dawn Base CSS Overrides

- Never override `.button`, `.h1`–`.h6`, `.page-width`, or any other Dawn base class
- Use only scoped custom classes prefixed to the section (e.g. `.bf-`, `.sm-`, `.mq-`)
- Dawn's `.button--primary` and `.button--secondary` are available but prefer `.n-button-primary` / `.n-button-secondary` for custom styled buttons

---

## 11. Schema — Additional Rules

- Every `select` setting default **must exactly match** one of its option values — mismatches cause upload errors
- `unit` strings in `range` settings must be ≤ 3 characters
- `max_blocks: 2` for two-panel sections
- Always include a meaningful `"presets"` array so the section is usable from Add Section
- Use `"disabled_on": { "groups": ["header", "footer"] }` on all content sections

---

## 12. Image Tags

Always use Shopify's `image_tag` filter with responsive `widths` and `sizes`:

```liquid
{{
  section.settings.image
  | image_url: width: 1400
  | image_tag:
    widths: '400, 600, 800, 1000, 1200, 1400',
    sizes: '(min-width: 750px) 50vw, 100vw',
    loading: 'lazy'
}}
```

Never use raw `<img src="...">` tags.

---

## 13. Video Embeds

For YouTube/Vimeo background video (cover technique):

```liquid
{%- if block.settings.video_url.type == 'youtube' -%}
  <iframe
    src="https://www.youtube.com/embed/{{ block.settings.video_url.id }}?autoplay=1&mute=1&loop=1&playlist={{ block.settings.video_url.id }}&controls=0&rel=0&playsinline=1"
    allow="autoplay; encrypted-media"
    loading="lazy"
  ></iframe>
{%- endif -%}
```

CSS for cover iframe (add to section CSS):
```css
.my-section__media iframe {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  min-width: 177.78%; min-height: 56.25%;
  width: 100%; height: 100%;
  border: 0; pointer-events: none;
}
```
