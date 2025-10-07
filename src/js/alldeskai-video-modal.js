// Video Modal Functions
function openVideoModal() {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");

  if (!modal || !videoPlayer) return;

  videoPlayer.src =
    "https://player.vimeo.com/video/1084081200?h=2d829428a1&autoplay=1&muted=1&badge=0&autopause=0&player_id=0&app_id=58479";

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");

  if (!modal || !videoPlayer) return;

  modal.classList.add("hidden");
  document.body.style.overflow = "auto";

  videoPlayer.src = "";
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeVideoModal();
});

document.addEventListener("DOMContentLoaded", () => {
  const videoModal = document.getElementById("videoModal");
  if (!videoModal) return;

  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) closeVideoModal();
  });
});
