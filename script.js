// Replace these with your own images if you want (put files in an /images folder).
const photos = [
  { seed: "forest",   title: "Misty Forest",     cat: "nature" },
  { seed: "mountain", title: "Mountain Peak",    cat: "nature" },
  { seed: "lake",     title: "Calm Lake",        cat: "nature" },
  { seed: "beach",    title: "Golden Beach",     cat: "nature" },
  { seed: "skyline",  title: "City Skyline",     cat: "city" },
  { seed: "street",   title: "Night Street",     cat: "city" },
  { seed: "bridge",   title: "Old Bridge",       cat: "city" },
  { seed: "tower",    title: "Tall Tower",       cat: "city" },
  { seed: "fox",      title: "Curious Fox",      cat: "animals" },
  { seed: "bird",     title: "Colorful Bird",    cat: "animals" },
  { seed: "horse",    title: "Wild Horse",       cat: "animals" },
  { seed: "cat",      title: "Lazy Cat",         cat: "animals" },
  { seed: "laptop",   title: "Coding Setup",     cat: "tech" },
  { seed: "circuit",  title: "Circuit Board",    cat: "tech" },
  { seed: "robot",    title: "Little Robot",     cat: "tech" },
  { seed: "keyboard", title: "Mechanical Keys",  cat: "tech" },
].map(p => ({
  ...p,
  thumb: `https://picsum.photos/seed/${p.seed}/600/450`,
  full:  `https://picsum.photos/seed/${p.seed}/1400/1000`,
}));

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");

let visible = [];   // indexes of photos currently shown (after filtering)
let current = 0;    // position inside `visible`

// Build cards
photos.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.cat = p.cat;
  card.dataset.index = i;
  card.innerHTML = `
    <img src="${p.thumb}" alt="${p.title}" loading="lazy">
    <div class="overlay"><h3>${p.title}</h3><span>${p.cat}</span></div>`;
  card.addEventListener("click", () => openLightbox(i));
  gallery.appendChild(card);
});

function refreshVisible() {
  visible = [...gallery.querySelectorAll(".card:not(.hide)")].map(c => +c.dataset.index);
}
refreshVisible();

// Filters
document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const f = btn.dataset.filter;
  gallery.querySelectorAll(".card").forEach(c => {
    c.classList.toggle("hide", f !== "all" && c.dataset.cat !== f);
  });
  refreshVisible();
});

// Lightbox
function show(photoIndex, animate = true) {
  const p = photos[photoIndex];
  const set = () => {
    lbImg.src = p.full;
    lbImg.alt = p.title;
    lbCaption.textContent = `${p.title}  •  ${visible.indexOf(photoIndex) + 1} / ${visible.length}`;
    lbImg.classList.remove("switching");
  };
  if (animate) {
    lbImg.classList.add("switching");
    setTimeout(set, 200);
  } else set();
}

function openLightbox(photoIndex) {
  current = visible.indexOf(photoIndex);
  show(photoIndex, false);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function step(dir) {
  current = (current + dir + visible.length) % visible.length;
  show(visible[current]);
}

document.getElementById("close").addEventListener("click", closeLightbox);
document.getElementById("next").addEventListener("click", () => step(1));
document.getElementById("prev").addEventListener("click", () => step(-1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});

// Touch swipe
let startX = 0;
lightbox.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
});
