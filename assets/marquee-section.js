class MarqueeTicker extends HTMLElement {
  connectedCallback() {
    this._inner = this.querySelector('[data-marquee-inner]');
    if (!this._inner) return;

    // Duplicate the inner set for a seamless infinite loop.
    // Two side-by-side copies, each animating -100% of its own width,
    // produces a gapless scroll at any viewport size.
    const clone = this._inner.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('data-marquee-inner');
    this._inner.parentNode.appendChild(clone);

    this._items = [this._inner, clone];

    // Apply direction class
    const dirClass = this.dataset.direction === 'right' ? 'is-rtl' : 'is-ltr';
    this._items.forEach(el => el.classList.add(dirClass));

    // Pause on hover
    if (this.dataset.pauseHover === 'true') {
      this.addEventListener('mouseenter', () => this._setPaused(true));
      this.addEventListener('mouseleave', () => this._setPaused(false));
    }

    // Pause when tab is not visible (saves CPU)
    this._visibilityHandler = () => this._setPaused(document.hidden);
    document.addEventListener('visibilitychange', this._visibilityHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('visibilitychange', this._visibilityHandler);
  }

  _setPaused(state) {
    this._items.forEach(el => el.classList.toggle('is-paused', state));
  }
}

customElements.define('marquee-ticker', MarqueeTicker);
