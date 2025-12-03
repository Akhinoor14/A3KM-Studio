// Complete Blog Engine with List View, Post View, Filters, Search, Pagination, Related Posts, Comments, SEO
(function(){
  'use strict';
  
  const isMobile = location.pathname.includes('blog-mobile');
  const POSTS_INDEX = 'content/blog/posts.json';
  const POSTS_DIR = 'content/blog/posts/';
  const SITE_TITLE = 'Md Akhinoor Islam - Portfolio Blog';
  const SITE_URL = location.origin;
  
  const qs = new URLSearchParams(location.search);
  const slugParam = qs.get('post');
  const tagParam = qs.get('tag');
  const searchParam = qs.get('search') || '';
  const pageParam = parseInt(qs.get('page')||'1',10);
  const PAGE_SIZE = 10;
  
  const container = document.getElementById('app');
  
  // Utility functions
  function setTitle(t){ 
    document.title = t ? `${t} | ${SITE_TITLE}` : SITE_TITLE; 
  }
  
  function setMetaTags(meta = {}){
    const {title, description, image, url} = meta;
    
    // Basic meta
    if(description){
      updateMeta('description', description);
    }
    
    // Open Graph
    if(title) updateMeta('og:title', title, 'property');
    if(description) updateMeta('og:description', description, 'property');
    if(image) updateMeta('og:image', `${SITE_URL}/${image}`, 'property');
    if(url) updateMeta('og:url', url, 'property');
    updateMeta('og:type', 'article', 'property');
    
    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    if(title) updateMeta('twitter:title', title);
    if(description) updateMeta('twitter:description', description);
    if(image) updateMeta('twitter:image', `${SITE_URL}/${image}`);
  }
  
  function updateMeta(name, content, attr = 'name'){
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if(!meta){
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }
  
  function addJsonLd(data){
    const existing = document.getElementById('json-ld');
    if(existing) existing.remove();
    
    const script = document.createElement('script');
    script.id = 'json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
  
  async function fetchJSON(url){ 
    const r = await fetch(url); 
    if(!r.ok) throw new Error('Failed '+url); 
    return r.json(); 
  }
  
  async function fetchText(url){ 
    const r = await fetch(url); 
    if(!r.ok) throw new Error('Failed '+url); 
    return r.text(); 
  }
  
  function formatDate(iso){ 
    try { 
      const d=new Date(iso); 
      return d.toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'}); 
    } catch { 
      return iso; 
    } 
  }
  
  function computeReadingTime(text){ 
    const words = text.replace(/\s+/g,' ').trim().split(' ').length; 
    return Math.max(1, Math.round(words/200)); 
  }
  
  function escapeHTML(s){ 
    const d=document.createElement('div'); 
    d.innerText=s; 
    return d.innerHTML; 
  }
  
  // Render list view
  function renderList(posts){
    const search = searchParam.toLowerCase();
    const filtered = posts.filter(p=> p.status==='published')
      .filter(p=> !tagParam || (p.tags||[]).includes(tagParam))
      .filter(p=> !search || (
        (p.title||'').toLowerCase().includes(search) ||
        (p.summary||'').toLowerCase().includes(search) ||
        (p.tags||[]).join(' ').toLowerCase().includes(search)
      ))
      .sort((a,b)=> new Date(b.date)-new Date(a.date));
    
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page = Math.min(totalPages, Math.max(1, pageParam));
    const start = (page-1)*PAGE_SIZE;
    const pageItems = filtered.slice(start, start+PAGE_SIZE);
    
    const uniqueTags = Array.from(new Set(posts.filter(p=>p.status==='published').flatMap(p=>p.tags||[]))).sort();
    
    const html = `
      <div class="blog-search-filters">
        <div class="search">
          <input class="search-input" id="search" placeholder="🔍 Search posts..." value="${escapeHTML(searchParam)}" />
        </div>
        <div class="filters">
          ${uniqueTags.map(t=> `<span class="tag ${t===tagParam?'active':''}" data-tag="${escapeHTML(t)}">${escapeHTML(t)}</span>`).join('')}
        </div>
      </div>
      <div class="container">
        <div id="list">
          ${pageItems.length === 0 ? '<p class="loading">No posts found.</p>' : ''}
          ${pageItems.map(p=> `
            <div class="card" data-slug="${escapeHTML(p.slug)}">
              ${p.coverImage ? `<div class="card-image"><img src="${escapeHTML(p.coverImage)}" alt="${escapeHTML(p.title)}" loading="lazy" /></div>` : ''}
              <div class="card-content">
                <h3>${escapeHTML(p.title)}</h3>
                <div class="meta">${formatDate(p.date)} • ${(p.tags||[]).map(escapeHTML).join(', ')}</div>
                <p>${escapeHTML(p.summary||'')}</p>
                ${(p.tags && p.tags.length) ? `<div class="tags">${p.tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="pagination">
          <button class="button" id="prev" ${page<=1?'disabled':''}>← Previous</button>
          <span>Page ${page} / ${totalPages}</span>
          <button class="button" id="next" ${page>=totalPages?'disabled':''}>Next →</button>
        </div>
      </div>`;
    
    container.innerHTML = html;
    
    // Event listeners
    document.getElementById('search').addEventListener('input', (e)=>{
      qs.set('search', e.target.value);
      qs.set('page','1');
      history.replaceState(null,'', `${location.pathname}?${qs.toString()}`);
      renderList(posts);
    });
    
    document.querySelectorAll('.tag').forEach(el=>{
      el.addEventListener('click', ()=>{
        const t = el.getAttribute('data-tag');
        if(tagParam===t){ qs.delete('tag'); } else { qs.set('tag', t); }
        qs.set('page','1');
        history.replaceState(null,'', `${location.pathname}?${qs.toString()}`);
        renderList(posts);
      });
    });
    
    document.querySelectorAll('.card').forEach(el=>{
      el.addEventListener('click', ()=>{
        const slug = el.getAttribute('data-slug');
        qs.set('post', slug);
        qs.delete('tag');
        qs.delete('search');
        qs.delete('page');
        history.pushState(null,'', `${location.pathname}?${qs.toString()}`);
        loadPost(slug, posts);
      });
    });
    
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    
    if(prevBtn) prevBtn.addEventListener('click', ()=>{
      if(page>1){ qs.set('page', String(page-1)); history.replaceState(null,'', `${location.pathname}?${qs.toString()}`); renderList(posts); }
    });
    
    if(nextBtn) nextBtn.addEventListener('click', ()=>{
      if(page<totalPages){ qs.set('page', String(page+1)); history.replaceState(null,'', `${location.pathname}?${qs.toString()}`); renderList(posts); }
    });
    
    setTitle('');
    setMetaTags({
      title: SITE_TITLE,
      description: 'Portfolio blog with project updates, tutorials, and tech notes.',
      url: location.href
    });
  }
  
  // Parse front matter from markdown
  function parseFrontMatter(text){
    if(text.startsWith('---')){
      const end = text.indexOf('\n---',3);
      if(end>0){
        const fmText = text.slice(3, end).trim();
        const body = text.slice(end+4).trim();
        const fm = {};
        fmText.split(/\r?\n/).forEach(line=>{
          const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
          if(m){
            const key=m[1];
            let val=m[2];
            if(val.startsWith('[')){
              try{ val = JSON.parse(val); }catch{ val = val.slice(1,-1).split(',').map(s=>s.trim()); }
            }
            fm[key]=val;
          }
        });
        return { frontMatter: fm, body };
      }
    }
    return { frontMatter: {}, body: text };
  }
  
  // Lightweight markdown to HTML
  function markdownToHtml(md){
    let html = md;
    
    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold, italic, code
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
      if(para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol')) return para;
      return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
    
    return html;
  }
  
  // Load and render single post
  async function loadPost(slug, allPosts){
    try{
      container.innerHTML = '<div class="loading">Loading post...</div>';
      
      const text = await fetchText(POSTS_DIR + slug + '.md');
      const { frontMatter, body } = parseFrontMatter(text);
      const minutes = computeReadingTime(body);
      
      // Build related posts (by top tag)
      let relatedHtml = '';
      const tags = frontMatter.tags || [];
      const primary = tags[0];
      if(primary && allPosts){
        const related = allPosts
          .filter(p=> p.status==='published' && p.slug!==slug && (p.tags||[]).includes(primary))
          .sort((a,b)=> new Date(b.date)-new Date(a.date))
          .slice(0,3);
        if(related.length){
          relatedHtml = `
            <div class="related-posts">
              <h3>Related Posts</h3>
              <ul>
                ${related.map(r=> `<li><a href="#" data-slug="${escapeHTML(r.slug)}">${escapeHTML(r.title)}</a> — ${formatDate(r.date)}</li>`).join('')}
              </ul>
            </div>`;
        }
      }
      
      const postUrl = `${SITE_URL}/${location.pathname}?post=${encodeURIComponent(slug)}`;
      
      const html = `
        <div class="container post">
          <a href="${isMobile ? 'blog-mobile.html' : 'blog.html'}" class="back-button">Back to Blog</a>
          <h1>${escapeHTML(frontMatter.title||slug)}</h1>
          <div class="meta">
            ${formatDate(frontMatter.date||'')} • ${minutes} min read
            ${(tags && tags.length) ? `<div class="post-tags">${tags.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>` : ''}
          </div>
          ${frontMatter.coverImage ? `<img class="cover" src="${escapeHTML(frontMatter.coverImage)}" alt="${escapeHTML(frontMatter.title||slug)}" loading="lazy" />` : ''}
          <div class="content">${markdownToHtml(body)}</div>
          <div class="share">
            <button class="button" id="copy">📋 Copy Link</button>
            <a class="button" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(frontMatter.title||slug)}" target="_blank" rel="noopener">🐦 Share on X</a>
            <a class="button" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}" target="_blank" rel="noopener">📘 Facebook</a>
            <a class="button" href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(frontMatter.title||slug)}" target="_blank" rel="noopener">💼 LinkedIn</a>
          </div>
          ${relatedHtml}
          <div id="comments"></div>
        </div>`;
      
      container.innerHTML = html;
      
      setTitle(frontMatter.title||slug);
      setMetaTags({
        title: frontMatter.title||slug,
        description: frontMatter.summary || body.substring(0,160),
        image: frontMatter.coverImage,
        url: postUrl
      });
      
      // JSON-LD for Article
      addJsonLd({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": frontMatter.title||slug,
        "description": frontMatter.summary||'',
        "image": frontMatter.coverImage ? `${SITE_URL}/${frontMatter.coverImage}` : '',
        "datePublished": frontMatter.date,
        "author": {
          "@type": "Person",
          "name": "A3KM Studio"
        },
        "publisher": {
          "@type": "Organization",
          "name": "A3KM Studio"
        }
      });
      
      // Event listeners
      document.getElementById('copy').addEventListener('click', async ()=>{
        try{
          await navigator.clipboard.writeText(postUrl);
          alert('✅ Link copied to clipboard!');
        }catch{
          prompt('Copy this link:', postUrl);
        }
      });
      
      // Wire related post links
      document.querySelectorAll('.related-posts a').forEach(link=>{
        link.addEventListener('click', (e)=>{
          e.preventDefault();
          const relSlug = link.getAttribute('data-slug');
          qs.set('post', relSlug);
          history.pushState(null,'', `${location.pathname}?${qs.toString()}`);
          loadPost(relSlug, allPosts);
          window.scrollTo(0,0);
        });
      });
      
      // Inject Giscus comments
      injectComments(slug);
      
    }catch(err){
      console.error(err);
      container.innerHTML = `<div class="container error"><p>❌ Failed to load post. Please try again.</p></div>`;
    }
  }
  
  // Inject Giscus comments widget
  function injectComments(slug){
    const comments = document.getElementById('comments');
    if(!comments) return;
    
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'Akhinoor14/A3KM-Studio');
    script.setAttribute('data-repo-id', ''); // Fill from https://giscus.app
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', ''); // Fill from https://giscus.app
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    comments.appendChild(script);
    
    // Fallback link
    const fallback = document.createElement('p');
    fallback.style.marginTop = '16px';
    fallback.style.fontSize = '14px';
    fallback.style.color = '#888';
    fallback.innerHTML = `<a href="https://github.com/Akhinoor14/A3KM-Studio/discussions" target="_blank" rel="noopener" style="color:#667eea">💬 Discuss on GitHub</a>`;
    comments.appendChild(fallback);
  }
  
  // Main entry
  async function main(){
    try{
      const posts = await fetchJSON(POSTS_INDEX);
      
      if(slugParam){ 
        await loadPost(slugParam, posts); 
      } else { 
        renderList(posts); 
      }
    }catch(err){
      console.error(err);
      container.innerHTML = `<div class="container error"><p>❌ Failed to load blog. Please check your connection.</p></div>`;
    }
  }
  
  // Handle back/forward navigation
  window.addEventListener('popstate', ()=>{
    const qs2 = new URLSearchParams(location.search);
    const s = qs2.get('post');
    if(s) {
      fetchJSON(POSTS_INDEX).then(posts=> loadPost(s, posts));
    } else {
      main();
    }
  });
  
  // Start
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
