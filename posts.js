// Live fetch of posts with flair "Mod's Choice"
async function renderLiveModsChoice(isRefresh=false){
  const grid = document.getElementById('postsGrid');
  if(!isRefresh){ grid.innerHTML = ''; }

  const url = 'https://www.reddit.com/r/TeenIndia/search.json?q=flair_name:%22Mod%27s%20Choice%22&restrict_sr=1&sort=new&limit=12';
  try{
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await res.json();
    const items = (data?.data?.children || []).map(c => c.data);

    // Clear before re-populating on refresh
    grid.innerHTML = '';

    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card post reveal';
      const comments = p.num_comments ?? 0;
      const ups = p.ups ?? p.score ?? 0;
      const author = p.author ? 'u/' + p.author : 'unknown';
      const link = 'https://www.reddit.com' + p.permalink;
      const flair = (p.link_flair_text || '').trim();
      const time = new Date(p.created_utc * 1000).toLocaleDateString(undefined, { day:'2-digit', month:'short' });

      card.innerHTML = `
        <div class="meta"><span>🧵</span><time title="${new Date(p.created_utc*1000).toLocaleString()}">${time}</time> · <span>${author}</span> · <span>${ups}⬆︎</span> · <span>${comments}💬</span>${flair ? ' · <span>'+flair+'</span>' : ''}</div>
        <h3 class="title">${escapeHtml(p.title)}</h3>
        <p class="excerpt">${escapeHtml(p.selftext?.slice(0,140) || '')}</p>
        <p><a class="btn ghost" href="${link}" target="_blank" rel="noopener">Open on Reddit</a></p>
      `;
      grid.appendChild(card);
    });

    // Animate newly added
    anime({
      targets: '#postsGrid .post',
      translateY:[20,0],
      opacity:[0,1],
      delay: anime.stagger(60),
      duration: 600,
      easing: 'easeOutCubic'
    });
  }catch(err){
    console.error('Failed to fetch Reddit feed', err);
    if(!grid.children.length){
      const warn = document.createElement('p');
      warn.className = 'muted';
      warn.textContent = 'Could not load live posts. Reddit API may be rate-limiting or CORS-blocked. Try opening directly on Reddit.';
      grid.appendChild(warn);
    }
  }
}

function escapeHtml(str=''){
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

window.renderLiveModsChoice = renderLiveModsChoice;
// run once on page load
renderLiveModsChoice();

// auto refresh every 5 minutes
setInterval(() => renderLiveModsChoice(true), 5 * 60 * 1000);
