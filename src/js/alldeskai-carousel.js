// Services Carousel Component
function servicesCarousel() {
  const { animate } = Motion;

  // Motion helpers
  const pressStartFx = (el) => el && animate(el, { scale: 0.92, opacity: 0.9 }, { duration: 0.08, easing: 'easeOut' });
  const pressEndFx   = (el) => el && animate(el, { scale: 1,    opacity: 1    }, { duration: 0.12, easing: 'easeOut' });

  const showBtn = (el, instant=false) => {
    if (!el) return;
    el.style.visibility = 'visible';
    el.style.pointerEvents = 'auto';
    if (instant) { el.style.opacity = 1; el.style.transform = 'scale(1)'; return; }
    animate(el, { opacity: 1, scale: 1 }, { duration: 0.14, easing: 'easeOut' });
  };
  const hideBtn = (el, instant=false) => {
    if (!el) return;
    el.style.pointerEvents = 'none';
    if (instant) { el.style.opacity = 0; el.style.transform = 'scale(0.95)'; el.style.visibility = 'hidden'; return; }
    animate(el, { opacity: 0, scale: 0.95 }, { duration: 0.10, easing: 'easeIn' })
      .finished.then(() => { el.style.visibility = 'hidden'; });
  };

  const fadeTo = (el, v) => el && animate(el, { opacity: v }, { duration: 0.16, easing: 'easeOut' });

  return {
    embla: null,

    init() {
      this.$nextTick(() => {
        // Initialize Embla on the viewport & container
        this.embla = EmblaCarousel(this.$refs.viewport, {
          loop: false,
          align: 'start',
          dragFree: false,
          containScroll: 'trimSnaps', // keeps last slide tidy
          skipSnaps: false
        });

        // Initial UI state
        this.updateUI(true);

        // React to any selection/scroll changes
        this.embla.on('select', this.updateUI.bind(this));
        this.embla.on('init',   this.updateUI.bind(this));
        this.embla.on('reInit', this.updateUI.bind(this));
        this.embla.on('scroll', () => {
          // lightweight: just fades; embla fires often during drag
          const canPrev = this.embla.canScrollPrev();
          const canNext = this.embla.canScrollNext();
          fadeTo(this.$refs.fadeLeft,  canPrev ? 1 : 0);
          fadeTo(this.$refs.fadeRight, canNext ? 1 : 0);
        });

        // Re-init on resize (Embla handles sizes well)
        window.addEventListener('resize', () => this.embla?.reInit());
      });
    },

    // Buttons: immediate hide/show on click (no lingering)
    goNext() {
      hideBtn(this.$refs.next);   // vanish now
      showBtn(this.$refs.prev);   // appear now
      this.embla && this.embla.scrollNext();
    },
    goPrev() {
      hideBtn(this.$refs.prev);
      showBtn(this.$refs.next);
      this.embla && this.embla.scrollPrev();
    },

    // Press FX
    pressStart(el){ pressStartFx(el); },
    pressEnd(el){ pressEndFx(el); },

    // Sync arrows + fades to Embla state
    updateUI(instant=false) {
      const canPrev = this.embla.canScrollPrev();
      const canNext = this.embla.canScrollNext();

      // Edge fades
      fadeTo(this.$refs.fadeLeft,  canPrev ? 1 : 0);
      fadeTo(this.$refs.fadeRight, canNext ? 1 : 0);

      // Arrows (only one visible at edges; during mid-track drag Embla will call 'scroll' which keeps fades right)
      if (canPrev && !canNext) {  // at right edge
        showBtn(this.$refs.prev, instant); hideBtn(this.$refs.next, instant);
      } else if (!canPrev && canNext) { // at left edge
        showBtn(this.$refs.next, instant); hideBtn(this.$refs.prev, instant);
      } else {
        // mid track: prefer both visible, or choose one?
        // To match your two-state feel, bias toward next on left half, prev on right half:
        const progress = this.embla.scrollProgress(); // 0 → 1
        if (progress < 0.5) { showBtn(this.$refs.next); hideBtn(this.$refs.prev); }
        else                { showBtn(this.$refs.prev); hideBtn(this.$refs.next); }
      }
    }
  }
}
