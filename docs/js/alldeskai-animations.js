// Animation and Reveal Effects
document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { animate, scroll } = Motion;

  const cards = document.querySelectorAll("#features [data-reveal], [data-reveal]");

  cards.forEach((card) => {
    if (reduce) {
      card.style.opacity = 1;
      card.style.transform = "none";
      const icons = card.querySelectorAll("[data-icon-reveal]");
      icons.forEach((icon) => {
        icon.style.opacity = 1;
        icon.style.transform = "scale(1)";
      });
      return;
    }

    card.style.opacity = 0;
    card.style.transform = "translateY(12px)";

    const anim = animate(
      card,
      { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0px)"] },
      { duration: 0.8, easing: "ease-out" }
    );

    scroll(anim, {
      target: card,
      offset: ["start 85%", "start 60%"],
    });

    const icons = card.querySelectorAll("[data-icon-reveal]");
    if (icons.length > 0) {
      icons.forEach((icon) => {
        icon.style.opacity = "0";
        icon.style.transform = "scale(0.75)";
      });

      let iconAnimationStarted = false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !iconAnimationStarted) {
              iconAnimationStarted = true;

              setTimeout(() => {
                icons.forEach((icon, index) => {
                  setTimeout(() => {
                    animate(
                      icon,
                      {
                        opacity: [0, 1],
                        transform: ["scale(0.75)", "scale(1)"],
                      },
                      {
                        duration: 0.6,
                        easing: "ease-out",
                        onComplete: () => {
                          icon.style.setProperty("opacity", "1", "important");
                          icon.style.setProperty("transform", "scale(1)", "important");
                        },
                      }
                    );
                  }, index * 100);
                });
              }, 400);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(card);
    }
  });
});
