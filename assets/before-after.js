class BeforeAfterSlider extends HTMLElement {
  connectedCallback() {
    this._container = this.querySelector('[data-ba-container]');
    this._handle    = this.querySelector('[data-ba-handle]');
    if (!this._container || !this._handle) return;

    this._dragging = false;

    // Fix 3: initialize JS-tracked split from the data attribute so
    // _currentSplit is always set before any interaction occurs.
    this._currentSplit = parseFloat(this.dataset.initialSplit || 50);
    this._container.style.setProperty('--ba-split', this._currentSplit + '%');

    // Mouse
    this._container.addEventListener('mousedown', this._onMouseDown.bind(this));

    // Fix 1: passive: false lets us call e.preventDefault() immediately
    // on touchstart, blocking browser scroll before the first touchmove.
    this._container.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });

    // Keyboard
    this._handle.addEventListener('keydown', this._onKeyDown.bind(this));
  }

  disconnectedCallback() {
    this._cleanup();
  }

  /* ── Helpers ─────────────────────────────────────────────── */

  _getSplit(clientX) {
    const rect = this._container.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  _setSplit(pct) {
    // Fix 3: keep split in a JS property — no need to re-parse CSS strings.
    this._currentSplit = pct;
    this._container.style.setProperty('--ba-split', pct + '%');
    this._handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  /* ── Mouse ───────────────────────────────────────────────── */

  _onMouseDown(e) {
    e.preventDefault();
    this._dragging = true;
    this._handle.classList.add('is-dragging');
    this._setSplit(this._getSplit(e.clientX));

    this._moveHandler = (e) => this._setSplit(this._getSplit(e.clientX));
    this._upHandler   = () => this._endDrag();

    document.addEventListener('mousemove', this._moveHandler);
    document.addEventListener('mouseup',   this._upHandler);
  }

  /* ── Touch ───────────────────────────────────────────────── */

  _onTouchStart(e) {
    // Fix 1: prevent page scroll from starting on this touch.
    e.preventDefault();

    this._dragging = true;
    this._handle.classList.add('is-dragging');
    this._setSplit(this._getSplit(e.touches[0].clientX));

    // Fix 1: passive: false on touchmove so we can call preventDefault
    // to block scroll for the full duration of the drag.
    this._touchMoveHandler = (e) => {
      e.preventDefault();
      this._setSplit(this._getSplit(e.touches[0].clientX));
    };
    this._touchEndHandler = () => this._endDrag();

    document.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
    document.addEventListener('touchend',  this._touchEndHandler);
  }

  /* ── Keyboard ────────────────────────────────────────────── */

  _onKeyDown(e) {
    // Fix 3: read from this._currentSplit — no fragile CSS string parsing.
    const current = this._currentSplit;
    const step    = e.shiftKey ? 10 : 5;

    if      (e.key === 'ArrowLeft')  { e.preventDefault(); this._setSplit(Math.max(0,   current - step)); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); this._setSplit(Math.min(100, current + step)); }
    else if (e.key === 'Home')       { e.preventDefault(); this._setSplit(0);   }
    else if (e.key === 'End')        { e.preventDefault(); this._setSplit(100); }
  }

  /* ── Cleanup ─────────────────────────────────────────────── */

  _endDrag() {
    this._dragging = false;
    this._handle.classList.remove('is-dragging');
    this._cleanup();
  }

  _cleanup() {
    if (this._moveHandler)      { document.removeEventListener('mousemove', this._moveHandler);           this._moveHandler = null; }
    if (this._upHandler)        { document.removeEventListener('mouseup',   this._upHandler);             this._upHandler   = null; }
    if (this._touchMoveHandler) { document.removeEventListener('touchmove', this._touchMoveHandler);      this._touchMoveHandler = null; }
    if (this._touchEndHandler)  { document.removeEventListener('touchend',  this._touchEndHandler);       this._touchEndHandler  = null; }
  }
}

customElements.define('before-after-slider', BeforeAfterSlider);
