// Animation and Reveal Effects
document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const { animate, scroll } = Motion

  const cards = document.querySelectorAll('#features [data-reveal], [data-reveal]')

  cards.forEach((card) => {
    if (reduce) {
      card.style.opacity = 1
      card.style.transform = 'none'
      // Also show icons immediately if reduced motion
      const icons = card.querySelectorAll('[data-icon-reveal]')
      icons.forEach(icon => {
        icon.style.opacity = 1
        icon.style.transform = 'scale(1)'
      })
      return
    }

    // Initial state (inline so it overrides Tailwind's translate classes)
    card.style.opacity = 0
    card.style.transform = 'translateY(12px)'

    // Define the reveal animation once
    const anim = animate(
      card,
      { opacity: [0, 1], transform: ['translateY(12px)', 'translateY(0px)'] },
      { duration: 0.8, easing: 'ease-out' }
    )

    // Bind it to the card's scroll progress within the viewport
    // Top of card: from 85% down the viewport to 60% down
    scroll(anim, {
      target: card,
      offset: ['start 85%', 'start 60%']
    })

      // Add delayed icon animation
      const icons = card.querySelectorAll('[data-icon-reveal]')
      if (icons.length > 0) {
        // Set initial state for icons
        icons.forEach(icon => {
          icon.style.opacity = '0'
          icon.style.transform = 'scale(0.75)'
        })
        
        // Create a simple timeout-based animation that triggers when card comes into view
        let iconAnimationStarted = false
        
        // Use Intersection Observer to detect when card comes into view
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !iconAnimationStarted) {
              iconAnimationStarted = true
              
              // Animate icons with a delay after card appears
              setTimeout(() => {
                icons.forEach((icon, index) => {
                  setTimeout(() => {
                    animate(icon, 
                      { 
                        opacity: [0, 1], 
                        transform: ['scale(0.75)', 'scale(1)'] 
                      },
                      { 
                        duration: 0.6, 
                        easing: 'ease-out',
                        onComplete: () => {
                          icon.style.setProperty('opacity', '1', 'important')
                          icon.style.setProperty('transform', 'scale(1)', 'important')
                        }
                      }
                    )
                  }, index * 100) // Stagger each icon by 100ms
                })
              }, 400) // Wait 400ms after card comes into view
            }
          })
        }, { threshold: 0.5 })
        
        observer.observe(card)
      }
  })
})
