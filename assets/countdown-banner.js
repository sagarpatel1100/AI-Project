class CountdownBanner extends HTMLElement {
  connectedCallback() {
    const raw = this.dataset.endDate;
    if (!raw) return;

    this.endTime = new Date(raw).getTime();
    if (isNaN(this.endTime)) return;

    this._days    = this.querySelector('[data-days]');
    this._hours   = this.querySelector('[data-hours]');
    this._minutes = this.querySelector('[data-minutes]');
    this._seconds = this.querySelector('[data-seconds]');
    this._timer   = this.querySelector('.bf-countdown');
    this._expired = this.querySelector('.bf-countdown__expired');

    this._tick();
    this._interval = setInterval(() => this._tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this._interval);
  }

  _tick() {
    const diff = this.endTime - Date.now();

    if (diff <= 0) {
      clearInterval(this._interval);
      if (this._timer)   this._timer.hidden   = true;
      if (this._expired) this._expired.hidden = false;
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    if (this._days)    this._days.textContent    = String(d).padStart(2, '0');
    if (this._hours)   this._hours.textContent   = String(h).padStart(2, '0');
    if (this._minutes) this._minutes.textContent = String(m).padStart(2, '0');
    if (this._seconds) this._seconds.textContent = String(s).padStart(2, '0');
  }
}

customElements.define('countdown-banner', CountdownBanner);
