// FAQ Motion Component
function faqMotion({ count }) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const spring = { type: "spring", stiffness: 280, damping: 30, mass: 0.9 };
  const fade = { duration: 0.25, easing: "easeOut" };
  const { animate } = Motion;

  return {
    openIndex: 0,

    init() {
      this.$nextTick(() => {
        for (let index = 0; index < count; index += 1) this._setClosed(index, true);
        if (this.openIndex >= 0) this._open(this.openIndex, true);
      });
      window.addEventListener("resize", () => this._syncOpenHeight());
    },

    tabId(index) {
      return `faq-tab-${index}`;
    },
    panelId(index) {
      return `faq-panel-${index}`;
    },

    toggle(index) {
      if (this.openIndex === index) {
        this._close(index);
        this.openIndex = -1;
        return;
      }
      const previous = this.openIndex;
      if (previous >= 0) this._close(previous);
      this.openIndex = index;
      this._open(index);
    },

    _open(index, instant = false) {
      const panel = this.$refs[`panel${index}`];
      const inner = this.$refs[`inner${index}`];
      const chevron = this.$refs[`chev${index}`];
      if (!panel || !inner) return;

      const targetHeight = inner.scrollHeight;

      if (instant || prefersReduced) {
        panel.style.height = `${targetHeight}px`;
        panel.style.opacity = 1;
        panel.style.transform = "translateY(0px)";
        if (chevron) chevron.style.transform = "rotate(180deg)";
        return;
      }

      animate(panel, { height: [panel.offsetHeight, targetHeight] }, spring);
      animate(panel, { opacity: [0, 1], transform: ["translateY(-4px)", "translateY(0px)"] }, fade);
      if (chevron) animate(chevron, { rotate: 180 }, fade);
    },

    _close(index, instant = false) {
      const panel = this.$refs[`panel${index}`];
      const chevron = this.$refs[`chev${index}`];
      if (!panel) return;

      const currentHeight = panel.offsetHeight;

      if (instant || prefersReduced) {
        panel.style.height = "0px";
        panel.style.opacity = 0;
        panel.style.transform = "translateY(-4px)";
        if (chevron) chevron.style.transform = "rotate(0deg)";
        return;
      }

      animate(panel, { height: [currentHeight, 0] }, spring);
      animate(panel, { opacity: [1, 0], transform: ["translateY(0px)", "translateY(-4px)"] }, fade);
      if (chevron) animate(chevron, { rotate: 0 }, fade);
    },

    _syncOpenHeight() {
      if (this.openIndex < 0) return;
      const panel = this.$refs[`panel${this.openIndex}`];
      const inner = this.$refs[`inner${this.openIndex}`];
      if (panel && inner) panel.style.height = `${inner.scrollHeight}px`;
    },

    _setClosed(index, force = false) {
      const panel = this.$refs[`panel${index}`];
      const chevron = this.$refs[`chev${index}`];
      if (!panel) return;
      panel.style.overflow = "hidden";
      panel.style.height = "0px";
      panel.style.opacity = 0;
      panel.style.transform = "translateY(-4px)";
      if (force && chevron) chevron.style.transform = "rotate(0deg)";
    },

    onKeydown(event, index) {
      const tabs = [...event.currentTarget.closest("[role=\"tablist\"]").querySelectorAll("[role=\"tab\"]")];
      const clamp = (value) => Math.max(0, Math.min(value, tabs.length - 1));
      const focusTab = (idx) => {
        const tab = tabs[clamp(idx)];
        if (tab) tab.focus();
      };

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          focusTab(index + 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          focusTab(index - 1);
          break;
        case "Home":
          event.preventDefault();
          focusTab(0);
          break;
        case "End":
          event.preventDefault();
          focusTab(tabs.length - 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          this.toggle(index);
          break;
        default:
          break;
      }
    },
  };
}
