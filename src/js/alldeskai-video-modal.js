// Video Modal Functions
function openVideoModal() {
  const modal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  
  // Set video source
  videoPlayer.src = 'https://player.vimeo.com/video/1084081200?h=2d829428a1&autoplay=1&muted=1&badge=0&autopause=0&player_id=0&app_id=58479';
  
  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  
  // Hide modal
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  
  // Stop video
  videoPlayer.src = '';
}

// Close modal on escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeVideoModal();
  }
});

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', function() {
  const videoModal = document.getElementById('videoModal');
  if (videoModal) {
    videoModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeVideoModal();
      }
    });
  }
});
