// ===== Utilities =====
function splitTextToSpans(el){
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  [...text].forEach(ch => {
    const span = document.createElement('span');
    span.textContent = ch;
    span.className = 'char';
    frag.appendChild(span);
  });
  el.appendChild(frag);
}
function prefersLight(){ return window.matchMedia('(prefers-color-scheme: light)').matches; }

// Theme
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'light' || (savedTheme === null && prefersLight())){ root.classList.add('light'); }
themeToggle?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.hero-title');
  if(title && title.hasAttribute('data-split')) splitTextToSpans(title);

  // Wordmark underline draw animation
  const wordmarkRect = document.querySelector('.wordmark rect');
  if(wordmarkRect){
    const len = 170;
    wordmarkRect.style.stroke = 'url(#tiTri)';
    wordmarkRect.style.fillOpacity = 0.0;
    wordmarkRect.style.strokeWidth = 6;
    wordmarkRect.style.strokeDasharray = len;
    wordmarkRect.style.strokeDashoffset = len;
    anime({ targets: wordmarkRect, strokeDashoffset:[len,0], duration:1200, easing:'easeInOutSine', delay:120, complete: () => {
      wordmarkRect.style.fillOpacity = 1.0;
      wordmarkRect.style.stroke = 'none';
    }});
  }

  spawnFloaters();

  const tl = anime.timeline({ easing:'easeOutExpo', autoplay:true });
  tl.add({ targets:'.nav-link, .brand, #themeToggle', translateY:[-10,0], opacity:[0,1], delay:anime.stagger(60), duration:600 })
    .add({ targets:'.hero-title .char', translateY:[40,0], opacity:[0,1], delay:anime.stagger(10), duration:650 }, '-=200')
    .add({ targets:'.hero-subtitle', translateY:[20,0], opacity:[0,1], duration:580 }, '-=300')
    .add({ targets:'.cta-row .btn', scale:[0.92,1], opacity:[0,1], delay:anime.stagger(80), duration:420 }, '-=350');

  // Scroll reveal
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        anime({ targets: entry.target, translateY:[14,0], opacity:[0,1], duration:700, easing:'easeOutCubic' });
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin:'0px 0px -10% 0px', threshold:0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Load live posts
  if(window.renderLiveModsChoice){ window.renderLiveModsChoice(); }
  setInterval(() => window.renderLiveModsChoice && window.renderLiveModsChoice(true), 5 * 60 * 1000);
});

// Floaters
function spawnFloaters(){
  const container = document.getElementById('floaters');
  if(!container) return;
  const count = 10;
  for(let i=0; i<count; i++){
    const b = document.createElement('span');
    b.className = 'floater';
    const size = Math.floor(Math.random()*14) + 8;
    b.style.width = b.style.height = size + 'px';
    b.style.left = Math.floor(Math.random()*98) + '%';
    b.style.top = Math.floor(Math.random()*80 + 5) + '%';
    b.style.borderRadius = Math.random() > .5 ? '50%' : '8px';
    b.style.background = 'currentColor';
    b.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    b.style.opacity = 0.14 + Math.random()*0.2;
    container.appendChild(b);

    const travel = (Math.random()*36 + 18)|0;
    const dur = Math.random()*2200 + 2800;
    anime({ targets:b, translateY:[travel,-travel], translateX:[Math.random()*-12, Math.random()*12],
      direction:'alternate', easing:'easeInOutSine', duration:dur, loop:true, delay:Math.random()*800 });
  }
}
async function loadRedditPosts() {
  try {
    const response = await fetch("https://www.reddit.com/r/teenindia.json");
    const data = await response.json();

    const container = document.getElementById("posts");
    container.innerHTML = "";

    data.data.children.slice(0, 10).forEach(post => {
      const p = post.data;
      const div = document.createElement("div");
      div.className = "post";

      div.innerHTML = `
        <h3><a href="https://reddit.com${p.permalink}" target="_blank">${p.title}</a></h3>
        <p>👍 ${p.ups} | 💬 ${p.num_comments}</p>
      `;
      container.appendChild(div);
    });
  } catch (e) {
    console.error("Error loading reddit:", e);
  }
}

window.onload = loadRedditPosts;
