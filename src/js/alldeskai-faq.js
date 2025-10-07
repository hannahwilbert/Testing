// FAQ Motion Component
function faqMotion({ count }) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spring = { type: 'spring', stiffness: 280, damping: 30, mass: 0.9 };
  const fade   = { duration: 0.25, easing: 'easeOut' };
  const { animate } = Motion;

  return {
    openIndex: 0, // -1 for all closed

    init() {
      this.$nextTick(() => {
        for (let i = 0; i < count; i++) this._setClosed(i, true);
        if (this.openIndex >= 0) this._open(this.openIndex, true);
      });
      window.addEventListener('resize', () => this._syncOpenHeight());
    },

    tabId(i){ return `faq-tab-${i}` },
    panelId(i){ return `faq-panel-${i}` },

    toggle(i) {
      if (this.openIndex === i) {
        this._close(i);
        this.openIndex = -1;
        return;
      }
      const prev = this.openIndex;
      if (prev >= 0) this._close(prev);
      this.openIndex = i;
      this._open(i);
    },

    _open(i, instant = false) {
      const panel = this.$refs['panel' + i];
      const inner = this.$refs['inner' + i];
      const chev  = this.$refs['chev' + i];
      if (!panel || !inner) return;

      const targetH = inner.scrollHeight;

      if (instant || prefersReduced) {
        panel.style.height = targetH + 'px';
        panel.style.opacity = 1;
        panel.style.transform = 'translateY(0px)';
        if (chev) chev.style.transform = 'rotate(180deg)';
        return;
      }

      animate(panel, { height: [panel.offsetHeight, targetH] }, spring);
      animate(panel, { opacity: [0, 1], transform: ['translateY(-4px)', 'translateY(0px)'] }, fade);
      if (chev) animate(chev, { rotate: 180 }, fade);
    },

    _close(i, instant = false) {
      const panel = this.$refs['panel' + i];
      const chev  = this.$refs['chev' + i];
      if (!panel) return;

      const currentH = panel.offsetHeight;

      if (instant || prefersReduced) {
        panel.style.height = '0px';
        panel.style.opacity = 0;
        panel.style.transform = 'translateY(-4px)';
        if (chev) chev.style.transform = 'rotate(0deg)';
        return;
      }

      // Animate height → 0
      animate(panel, { height: [currentH, 0] }, spring);
      // Fade + move up
      animate(panel, { opacity: [1, 0], transform: ['translateY(0px)', 'translateY(-4px)'] }, fade);
      // Rotate chevron back
      if (chev) animate(chev, { rotate: 0 }, fade);
    },

    _syncOpenHeight() {
      if (this.openIndex < 0) return;
      const panel = this.$refs['panel' + this.openIndex];
      const inner = this.$refs['inner' + this.openIndex];
      if (panel && inner) {
        panel.style.height = inner.scrollHeight + 'px';
      }
    },

    _setClosed(i, force = false) {
      const panel = this.$refs['panel' + i];
      const chev  = this.$refs['chev' + i];
      if (!panel) return;
      panel.style.overflow = 'hidden';
      panel.style.height = '0px';
      panel.style.opacity = 0;
      panel.style.transform = 'translateY(-4px)';
      if (force && chev) chev.style.transform = 'rotate(0deg)';
    },

    onKeydown(e, i) {
      const tabs = [...e.currentTarget.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
      const clamp = (n) => Math.max(0, Math.min(n, tabs.length - 1));
      const focusTab = (idx) => tabs[clamp(idx)]?.focus();

      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); focusTab(i + 1); break;
        case 'ArrowUp':   e.preventDefault(); focusTab(i - 1); break;
        case 'Home':      e.preventDefault(); focusTab(0);     break;
        case 'End':       e.preventDefault(); focusTab(tabs.length - 1); break;
        case 'Enter':
        case ' ':
          e.preventDefault(); this.toggle(i); break;
      }
    }
  }
}
