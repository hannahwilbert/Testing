// Services Carousel Component
function servicesCarousel() {
  const { animate } = Motion;

  const pressStartFx = (element) =>
    element && animate(element, { scale: 0.92, opacity: 0.9 }, { duration: 0.08, easing: "easeOut" });
  const pressEndFx = (element) =>
    element && animate(element, { scale: 1, opacity: 1 }, { duration: 0.12, easing: "easeOut" });

  const showBtn = (element, instant = false) => {
    if (!element) return;
    animate(
      element,
      { opacity: 1, transform: "translateY(0px)" },
      { duration: instant ? 0 : 0.26, easing: "easeOut" }
    );
  };

  const hideBtn = (element, instant = false) => {
    if (!element) return;
    animate(
      element,
      { opacity: 0, transform: "translateY(12px)" },
      { duration: instant ? 0 : 0.26, easing: "easeOut" }
    );
  };

  return {
    instance: null,
    current: 1,
    total: 0,
    isScrolling: false,

    init() {
      const options = {
        align: "start",
        loop: false,
        slidesToScroll: 1,
        containScroll: "trimSnaps",
        watchDrag: true,
        skipSnaps: false,
        dragFree: false,
      };

      const viewport = this.$refs.viewport;
      if (!viewport) return;

      this.instance = EmblaCarousel(viewport, options);
      this.total = this.instance.slideNodes().length;
      this.current = this.instance.selectedScrollSnap() + 1;

      const endHandler = () => {
        this.isScrolling = false;
        pressEndFx(viewport);
      };

      this.instance.on("scroll", () => {
        this.isScrolling = true;
        pressStartFx(viewport);
      });
      this.instance.on("dragEnd", endHandler);
      this.instance.on("pointerUp", endHandler);

      this.instance.on("select", () => {
        this.current = this.instance.selectedScrollSnap() + 1;
        this._syncButtons();
      });

      this._syncButtons(true);
    },

    prev() {
      if (!this.instance) return;
      this.instance.scrollPrev();
    },

    next() {
      if (!this.instance) return;
      this.instance.scrollNext();
    },

    _syncButtons(instant = false) {
      const prevBtn = this.$refs.prev;
      const nextBtn = this.$refs.next;

      const canPrev = this.instance && this.instance.canScrollPrev();
      const canNext = this.instance && this.instance.canScrollNext();

      canPrev ? showBtn(prevBtn, instant) : hideBtn(prevBtn, instant);
      canNext ? showBtn(nextBtn, instant) : hideBtn(nextBtn, instant);
    },
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const carouselSection = document.querySelector("[data-carousel]");
  if (!carouselSection) return;

  const carouselComponent = servicesCarousel();
  carouselComponent.$refs = {
    viewport: carouselSection.querySelector("[data-carousel-viewport]"),
    prev: carouselSection.querySelector("[data-carousel-prev]"),
    next: carouselSection.querySelector("[data-carousel-next]"),
  };
  carouselComponent.init();

  carouselSection.querySelector("[data-carousel-prev]")?.addEventListener("click", () => carouselComponent.prev());
  carouselSection.querySelector("[data-carousel-next]")?.addEventListener("click", () => carouselComponent.next());
});
