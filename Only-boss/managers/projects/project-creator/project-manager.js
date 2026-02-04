// AI Project Manager — Logic Engine
// Client-side rules + local DB + smart suggestions

const PM_STORE = 'pm_projects_v1';
const PM_HISTORY = 'pm_history_v1';
const MAX_HISTORY = 50;
const PROJECTS_REPO_OWNER = 'Akhinoor14';
const PROJECTS_REPO_NAME = 'Projects';
const BACKEND_URL = 'http://localhost:5000';

let projects = [];
let history = [];
let currentPlan = null;
let githubUploader = null;

function loadStore(){
  projects = JSON.parse(localStorage.getItem(PM_STORE)||'[]');
  history = JSON.parse(localStorage.getItem(PM_HISTORY)||'[]');
}
function saveStore(){
  localStorage.setItem(PM_STORE, JSON.stringify(projects));
  localStorage.setItem(PM_HISTORY, JSON.stringify(history.slice(-MAX_HISTORY)));
}

function init(){
  loadStore();
  initGitHubUploader();
  bindUI();
  renderProjects();
  status('Ready','good');
}

function initGitHubUploader(){
  try{
    if(typeof GitHubUploader !== 'undefined'){
      const token = localStorage.getItem('dashboard_github_token') || '';
      if(token){
        githubUploader = new GitHubUploader(PROJECTS_REPO_OWNER, PROJECTS_REPO_NAME, token);
        console.log('✅ GitHubUploader ready for Projects repo');
      } else {
        console.warn('⚠️ No GitHub token found in localStorage');
      }
    }
  }catch(e){
    console.warn('GitHubUploader not available:', e);
  }
}

function bindUI(){
  const q = id=>document.getElementById(id);
  q('btnSuggest').onclick = suggestStructure;
  q('btnTemplate').onclick = applyTemplate;
  q('btnAutoLayout').onclick = autoLayout;
  q('btnScore').onclick = qualityScore;
  q('btnValidate').onclick = validatePlan;
  q('btnCreate').onclick = createProject;
  q('btnExport').onclick = exportProjects;
  q('btnSync').onclick = syncGithub;
  const btnScaffold = document.getElementById('btnScaffold');
  if(btnScaffold) btnScaffold.onclick = generateScaffold;
  const btnImportTemplate = document.getElementById('btnImportTemplate');
  if(btnImportTemplate) btnImportTemplate.onclick = importTemplate;
  const btnExportTemplate = document.getElementById('btnExportTemplate');
  if(btnExportTemplate) btnExportTemplate.onclick = exportTemplate;
  const btnSyncRepo = document.getElementById('btnSyncRepo');
  if(btnSyncRepo) btnSyncRepo.onclick = syncRepoProjects;
  const btnBackupAll = document.getElementById('btnBackupAll');
  if(btnBackupAll) btnBackupAll.onclick = exportProjects;
  
  // Color picker sync
  const colorPicker = document.getElementById('primaryColor');
  const colorHex = document.getElementById('primaryColorHex');
  if(colorPicker && colorHex){
    colorPicker.addEventListener('input', (e) => {
      colorHex.value = e.target.value;
    });
    colorHex.addEventListener('input', (e) => {
      if(/^#[0-9A-F]{6}$/i.test(e.target.value)){
        colorPicker.value = e.target.value;
      }
    });
  }
  
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey && e.key==='Enter'){e.preventDefault(); generatePlan();}
    if(e.ctrlKey && e.key.toLowerCase()==='s'){e.preventDefault(); createProject();}
    if(e.ctrlKey && e.key.toLowerCase()==='f'){e.preventDefault(); findInPlan();}
  });
}

function status(text,level='good'){
  const el = document.getElementById('statusText');
  el.textContent = text;
  const dot = el.previousElementSibling;
  dot.className = 'dot ' + (level==='good'?'good':level==='warn'?'warn':'bad');
}

function inputData(){
  const name = document.getElementById('name').value.trim();
  const type = document.getElementById('type').value;
  const audience = document.getElementById('audience').value;
  const goal = document.getElementById('goal').value.trim();
  const features = document.getElementById('features').value.split(',').map(s=>s.trim()).filter(Boolean);
  const design = document.getElementById('design').value;
  const primaryColor = document.getElementById('primaryColor')?.value || '#cc0000';
  const framework = document.getElementById('framework')?.value || 'vanilla';
  const deployment = document.getElementById('deployment')?.value || 'none';
  const includePackageJson = document.getElementById('includePackageJson')?.checked ?? true;
  const includeTesting = document.getElementById('includeTesting')?.checked ?? false;
  const includeAnimations = document.getElementById('includeAnimations')?.checked ?? true;
  
  return {
    name, type, audience, goal, features, design, 
    primaryColor, framework, deployment,
    includePackageJson, includeTesting, includeAnimations
  };
}

// ---------- AI-style Rules Engine ----------
const LIB_TEMPLATES = {
  library: {
    sections: ['README','Examples','API Reference','Changelog'],
    pages: ['index.html','examples.html','docs/api.html'],
    components: ['Core','Utils','Adapters']
  },
  webapp: {
    sections: ['Landing','Features','Pricing','Docs','Contact'],
    pages: ['index.html','documentation.html','contact.html'],
    components: ['Header','Footer','Dashboard','Editor']
  },
  ecommerce: {
    sections: ['Hero','Products','Categories','Cart','Checkout','About'],
    pages: ['index.html','products.html','product-detail.html','cart.html','checkout.html'],
    components: ['ProductCard','CartWidget','FilterSidebar','PaymentForm','OrderSummary']
  },
  blog: {
    sections: ['Home','Posts','Categories','About','Contact'],
    pages: ['index.html','blog.html','post.html','category.html','about.html'],
    components: ['PostCard','CommentSection','Sidebar','SearchBar','Newsletter']
  },
  dashboard: {
    sections: ['Overview','Analytics','Users','Settings','Reports'],
    pages: ['index.html','dashboard.html','analytics.html','users.html','settings.html'],
    components: ['Sidebar','StatCard','DataTable','Chart','Modal']
  },
  landing: {
    sections: ['Hero','Features','Pricing','Testimonials','CTA','Footer'],
    pages: ['index.html'],
    components: ['HeroSection','FeatureGrid','PricingCard','TestimonialSlider','CTABanner']
  },
  portfolio: {
    sections: ['About','Projects','Skills','Experience','Contact'],
    pages: ['index.html','project-detail.html'],
    components: ['ProjectCard','SkillBadge','TimelineItem','ContactForm']
  },
  hardware: {
    sections: ['Overview','Specs','Circuit','Firmware','Assembly'],
    pages: ['index.html','circuit-simulators.html','arduino-readme-viewer.html'],
    components: ['PCB','Firmware','Enclosure']
  },
  doc: {
    sections: ['Intro','Guide','FAQ','References'],
    pages: ['documentation.html','documentation-clean.html'],
    components: ['Sidebar','Search','Loader']
  }
};

function generatePlan(){
  const d = inputData();
  
  // Enhanced validation
  if(!d.name){
    status('⚠️ Project name is required','warn');
    return;
  }
  if(d.name.length < 3){
    status('⚠️ Project name must be at least 3 characters','warn');
    return;
  }
  if(!/^[a-zA-Z0-9\s_-]+$/.test(d.name)){
    status('⚠️ Project name contains invalid characters','warn');
    return;
  }
  
  try {
    // Learn from history & existing projects
    const prior = learnFromPrior(d);
    const base = LIB_TEMPLATES[d.type];
    
    if(!base){
      status('⚠️ Invalid project type','bad');
      return;
    }
    
    const features = enrichFeatures(d.features, prior.features);
    const sections = enrichSections(base.sections, d, prior.sections);
    const pages = dedupe([...base.pages, ...prior.pages]);
    const components = enrichComponents(base.components, features, d.design);
    const layout = autoLayoutPlan(sections, components, d.design);
    const style = designTokens(d.design, d.audience);

    currentPlan = { 
      meta: d, 
      features, 
      sections, 
      pages, 
      components, 
      layout, 
      style, 
      priorSignals: prior.signals 
    };
    
    renderPlan(currentPlan);
    status('✅ Plan generated successfully','good');
    pushHistory(currentPlan);
    
  } catch(error) {
    console.error('Plan generation error:', error);
    status('❌ Error generating plan: ' + error.message,'bad');
  }
}

function learnFromPrior(d){
  // Simple heuristics: collect frequent pages and features
  const features = {};
  const sections = {};
  const pages = {};
  let signals = { projects: projects.length };
  projects.forEach(p=>{
    (p.features||[]).forEach(f=>features[f]=(features[f]||0)+1);
    (p.sections||[]).forEach(s=>sections[s]=(sections[s]||0)+1);
    (p.pages||[]).forEach(pg=>pages[pg]=(pages[pg]||0)+1);
  });
  // Prefer brand pages
  if(d.design==='crimson') pages['about.html']=(pages['about.html']||0)+2;
  return {
    features: Object.keys(features).slice(0,10),
    sections: Object.keys(sections).slice(0,10),
    pages: Object.keys(pages).slice(0,10),
    signals
  };
}

function enrichFeatures(user, prior){
  const base = ['export','import','search','offline','auto-save'];
  return dedupe([...user, ...prior, ...base]);
}
function enrichSections(base, d, prior){
  const extra = [];
  if(d.audience==='beginner') extra.push('Tutorials');
  if(d.audience==='pro') extra.push('Advanced');
  if(d.goal.toLowerCase().includes('business')) extra.push('Pricing');
  return dedupe([...base, ...prior, ...extra]);
}
function enrichComponents(base, features, design){
  const extra = [];
  if(features.includes('editor')) extra.push('ContentEditor');
  if(features.includes('simulator')) extra.push('Simulator');
  if(design==='dark') extra.push('ThemeSwitcher');
  return dedupe([...base, ...extra]);
}
function autoLayoutPlan(sections, components, design){
  const grid = design==='crimson' ? 12 : 8;
  const slots = sections.map((s,i)=>({
    section:s,
    col: (i% (grid>10?3:2)) + 1,
    span: (s.length%3)+1,
    priority: s.match(/Intro|Overview|Landing|Home/i)?1: (i+1)
  }));
  return { grid, slots };
}
function designTokens(design,audience){
  const base = { color:'#cc0000', dark:true, radius:12 };
  if(design==='dark') base.color = '#202020';
  if(audience==='beginner') base.radius = 16;
  return base;
}

function renderPlan(plan){
  const sectionsEl = document.getElementById('planSections');
  sectionsEl.innerHTML = plan.sections.map(s=>`<div class="section-card"><h4>${s}</h4><div class="chips">${plan.features.slice(0,6).map(f=>`<span class='chip'>${f}</span>`).join('')}</div></div>`).join('');
  document.getElementById('jsonOut').value = JSON.stringify(plan,null,2);
  const preview = document.getElementById('previewContent');
  preview.innerHTML = `
    <div class="grid">
      ${plan.layout.slots.slice(0,6).map(slot=>`
        <div class="section-card"><h4>${slot.section}</h4><div class="chips"><span class='chip'>col ${slot.col}</span><span class='chip'>span ${slot.span}</span><span class='chip'>p${slot.priority}</span></div></div>
      `).join('')}
    </div>
  `;
}

function dedupe(arr){
  return [...new Set(arr.filter(Boolean))];
}
function pushHistory(plan){
  history.push({ ts: Date.now(), plan });
  saveStore();
}

// ---------- Actions ----------
function suggestStructure(){
  generatePlan();
}
function applyTemplate(){
  const d = inputData();
  const base = LIB_TEMPLATES[d.type];
  document.getElementById('features').value = ['calculator','editor','export','search'].join(', ');
  document.getElementById('goal').value = d.goal || 'education & fast prototyping';
  status('Template applied','good');
}
function autoLayout(){
  if(!currentPlan){status('Generate plan first','warn');return;}
  currentPlan.layout = autoLayoutPlan(currentPlan.sections, currentPlan.components, currentPlan.meta.design);
  renderPlan(currentPlan);
  status('Auto layout refreshed','good');
}
function qualityScore(){
  if(!currentPlan){status('Generate plan first','warn');return;}
  const f = currentPlan.features.length;
  const s = currentPlan.sections.length;
  const c = (currentPlan.components||[]).length;
  const score = Math.min(100, 40 + f*2 + s*1.5 + c*3);
  status(`Quality Score: ${Math.round(score)}/100`, score>80?'good':score>60?'warn':'bad');
}

function validatePlan(){
  if(!currentPlan){status('Generate plan first','warn');return;}
  const errors = [];
  const name = currentPlan.meta?.name||'';
  if(name.length < 3) errors.push('Name too short');
  if(!/^[a-zA-Z0-9 _-]+$/.test(name)) errors.push('Name has invalid characters');
  if(!currentPlan.sections?.length) errors.push('No sections');
  if(!currentPlan.pages?.length) errors.push('No pages');
  if(!currentPlan.features?.length) errors.push('No features');
  const msg = errors.length? `Validation failed: ${errors.join(', ')}` : 'Validation passed';
  status(msg, errors.length?'bad':'good');
}

function createProject(){
  if(!currentPlan){generatePlan();}
  const id = `PRJ-${Date.now()}`;
  const proj = { id, name: currentPlan.meta.name, ...currentPlan };
  projects.unshift(proj);
  saveStore();
  renderProjects();
  status('Project saved','good');
}

function exportProjects(){
  const blob = new Blob([JSON.stringify(projects,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=`projects-${Date.now()}.json`; a.click();
  status('Exported JSON','good');
}

function syncGithub(){
  // Stub: integrate with github-sync.js if available
  try{
    if(window.githubSync){
      window.githubSync.syncProjects(projects);
      status('GitHub sync complete','good');
    } else {
      status('GitHub sync library not found','warn');
    }
  }catch(e){
    console.error(e);
    status('GitHub sync failed','bad');
  }
}

async function syncRepoProjects(){
  if(!githubUploader){ status('GitHubUploader not initialized','warn'); return; }
  try{
    status('Syncing to Projects repo...','warn');
    const ok = await githubUploader.validateAccess();
    if(!ok){ status('Repo access failed','bad'); return; }
    
    let synced = 0;
    for(const p of projects){
      await syncSingleProject(p);
      synced++;
    }
    status(`Synced ${synced} projects to repo`,'good');
  }catch(e){ console.error(e); status('Repo sync error','bad'); }
}

async function syncSingleProject(project){
  const slug = (project.name||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const base = slug;
  
  // Organized folder structure
  const folders = {
    src: `${base}/src`,
    docs: `${base}/docs`,
    assets: `${base}/assets`,
    config: `${base}/config`
  };
  
  // Generate README
  const readme = generateProjectReadme(project);
  await githubUploader.uploadTextFile(`${base}/README.md`, readme, `Add ${slug} README`);
  
  // Store plan.json in config/
  await githubUploader.uploadTextFile(`${folders.config}/plan.json`, JSON.stringify(project,null,2), `Add ${slug} plan`);
  
  // Auto-generate files based on project plan
  const files = generateProjectFiles(project, folders);
  for(const [path, content] of Object.entries(files)){
    await githubUploader.uploadTextFile(path, content, `Add ${slug} ${path.split('/').pop()}`);
  }
}

function generateProjectReadme(project){
  const date = new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});
  return `# ${project.name}

**Type:** ${project.meta.type}  
**Audience:** ${project.meta.audience}  
**Design:** ${project.meta.design}  
**Created:** ${date}

## 📋 Overview

${project.meta.goal || 'Auto-generated project by AI Project Manager'}

## 🎯 Sections

${project.sections.map(s=>`- ${s}`).join('\n')}

## ✨ Features

${project.features.map(f=>`- ${f}`).join('\n')}

## 🧩 Components

${(project.components||[]).map(c=>`- ${c}`).join('\n')}

## 📁 Project Structure

\`\`\`
${project.name}/
├── src/           # Source files (HTML, CSS, JS)
├── docs/          # Documentation
├── assets/        # Images, fonts, media
└── config/        # Configuration (plan.json)
\`\`\`

## 🚀 Pages

${project.pages.map(p=>`- \`${p}\``).join('\n')}

## 🎨 Design Tokens

- **Primary Color:** ${project.style?.color || '#cc0000'}
- **Dark Mode:** ${project.style?.dark ? 'Yes' : 'No'}
- **Border Radius:** ${project.style?.radius || 12}px

## 📊 Quality Score

Generated with ${project.features.length} features, ${project.sections.length} sections, ${(project.components||[]).length} components.

---

**Auto-generated by AI Project Manager**  
**Repository:** [Akhinoor14/Projects](https://github.com/Akhinoor14/Projects)
`;
}

function generateProjectFiles(project, folders){
  const files = {};
  const slug = (project.name||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  
  // Generate index.html
  files[`${folders.src}/index.html`] = generateIndexHTML(project);
  
  // Generate styles.css
  files[`${folders.src}/styles.css`] = generateCSS(project);
  
  // Generate app.js
  files[`${folders.src}/app.js`] = generateJS(project);
  
  // Generate docs/GUIDE.md
  files[`${folders.docs}/GUIDE.md`] = generateGuide(project);
  
  // Generate .gitignore
  files[`${slug}/.gitignore`] = `node_modules/\n.DS_Store\n*.log\n.env\ndist/\nbuild/\n.cache/`;
  
  // Generate package.json if enabled
  if(project.meta?.includePackageJson !== false){
    files[`${slug}/package.json`] = generatePackageJson(project);
  }
  
  // Generate deployment configs
  const deployment = project.meta?.deployment || 'none';
  if(deployment === 'vercel'){
    files[`${slug}/vercel.json`] = generateVercelConfig(project);
  } else if(deployment === 'netlify'){
    files[`${slug}/netlify.toml`] = generateNetlifyConfig(project);
  } else if(deployment === 'docker'){
    files[`${slug}/Dockerfile`] = generateDockerfile(project);
    files[`${slug}/docker-compose.yml`] = generateDockerCompose(project);
  }
  
  // Generate .env template
  files[`${slug}/.env.example`] = generateEnvTemplate(project);
  
  // Generate testing setup if enabled
  if(project.meta?.includeTesting){
    files[`${slug}/jest.config.js`] = generateJestConfig(project);
    files[`${slug}/src/__tests__/app.test.js`] = generateTestFile(project);
  }
  
  return files;
}

function generatePackageJson(project){
  const name = (project.name||'project').toLowerCase().replace(/[^a-z0-9-]/g,'-');
  const framework = project.meta?.framework || 'vanilla';
  
  const dependencies = {};
  const devDependencies = {
    "vite": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  };
  
  // Add framework-specific dependencies
  if(framework === 'react'){
    dependencies['react'] = '^18.2.0';
    dependencies['react-dom'] = '^18.2.0';
    devDependencies['@vitejs/plugin-react'] = '^4.0.0';
  } else if(framework === 'vue'){
    dependencies['vue'] = '^3.3.0';
    devDependencies['@vitejs/plugin-vue'] = '^4.0.0';
  } else if(framework === 'svelte'){
    dependencies['svelte'] = '^4.0.0';
    devDependencies['@sveltejs/vite-plugin-svelte'] = '^3.0.0';
  }
  
  // Add testing dependencies if enabled
  if(project.meta?.includeTesting){
    devDependencies['jest'] = '^29.0.0';
    devDependencies['@testing-library/jest-dom'] = '^6.0.0';
  }
  
  const pkg = {
    name: name,
    version: '1.0.0',
    description: project.meta?.goal || 'Project generated by AI Project Manager',
    main: 'src/index.html',
    scripts: {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "lint": "eslint src",
      "format": "prettier --write src"
    },
    keywords: (project.features || []).slice(0, 5),
    author: 'Generated by AI Project Manager',
    license: 'MIT',
    dependencies: dependencies,
    devDependencies: devDependencies
  };
  
  if(project.meta?.includeTesting){
    pkg.scripts.test = 'jest';
  }
  
  return JSON.stringify(pkg, null, 2);
}

function generateVercelConfig(project){
  return JSON.stringify({
    version: 2,
    builds: [{
      src: 'src/index.html',
      use: '@vercel/static'
    }],
    routes: [{
      src: '/(.*)',
      dest: '/src/$1'
    }]
  }, null, 2);
}

function generateNetlifyConfig(project){
  return `[build]
  publish = "src"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"`;
}

function generateDockerfile(project){
  return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]`;
}

function generateDockerCompose(project){
  const name = (project.name||'project').toLowerCase().replace(/[^a-z0-9-]/g,'-');
  return `version: '3.8'

services:
  ${name}:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development`;
}

function generateEnvTemplate(project){
  return `# Environment Variables Template
# Copy this file to .env and fill in your values

# API Configuration
API_URL=http://localhost:3000
API_KEY=your_api_key_here

# GitHub Configuration (for project sync)
GITHUB_TOKEN=your_github_token
GITHUB_REPO=${project.name || 'project'}

# Deployment
NODE_ENV=development
PORT=3000`;
}

function generateJestConfig(project){
  return `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
  ],
};`;
}

function generateTestFile(project){
  const name = project.name || 'Project';
  return `describe('${name}', () => {
  test('should render successfully', () => {
    document.body.innerHTML = '<div id="app"></div>';
    const app = document.getElementById('app');
    expect(app).toBeInTheDocument();
  });
  
  test('should have correct title', () => {
    const title = document.querySelector('title');
    expect(title?.textContent).toContain('${name}');
  });
});`;
}

function generateIndexHTML(project){
  const color = project.style?.color || '#cc0000';
  const sections = project.sections || [];
  const name = project.name || 'Project';
  const goal = project.meta.goal || 'Welcome to the project';
  const features = project.features || [];
  
  // Generate sections HTML with proper formatting
  const sectionsHTML = sections.map((s, i) => {
    const id = s.toLowerCase().replace(/\s+/g, '-');
    return `        <section id="${id}" class="content-section">
            <div class="section-container">
                <div class="section-icon">
                    <i class="fas fa-${getSectionIcon(s)}"></i>
                </div>
                <h2>${s}</h2>
                <p class="section-description">Content for ${s} section. Customize this based on your project needs.</p>
                ${i < features.length ? `                <div class="feature-grid">
                    ${features.slice(i*2, i*2+2).map(f => `<div class="feature-card">
                        <i class="fas fa-check-circle"></i>
                        <h4>${f}</h4>
                    </div>`).join('\n                    ')}
                </div>` : ''}
            </div>
        </section>`;
  }).join('\n\n');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${goal}">
    <meta name="theme-color" content="${color}">
    <title>${name}</title>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Mobile Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-rocket"></i>
                <span>${name}</span>
            </div>
            <ul class="nav-menu">
                ${sections.slice(0, 5).map(s => `<li class="nav-item">
                    <a href="#${s.toLowerCase().replace(/\s+/g, '-')}" class="nav-link">${s}</a>
                </li>`).join('\n                ')}
            </ul>
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">
                    <i class="fas fa-star"></i>
                    ${name}
                </h1>
                <p class="hero-subtitle">${goal}</p>
                <div class="hero-features">
                    ${features.slice(0, 3).map(f => `<span class="hero-badge">
                        <i class="fas fa-check"></i> ${f}
                    </span>`).join('\n                    ')}
                </div>
                <div class="hero-actions">
                    <a href="#${sections[0]?.toLowerCase().replace(/\s+/g, '-') || 'content'}" class="btn btn-primary">
                        <i class="fas fa-rocket"></i> Get Started
                    </a>
                    <a href="#features" class="btn btn-secondary">
                        <i class="fas fa-info-circle"></i> Learn More
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
${sectionsHTML}
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3>${name}</h3>
                    <p>${goal}</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        ${sections.slice(0, 4).map(s => `<li><a href="#${s.toLowerCase().replace(/\s+/g, '-')}">${s}</a></li>`).join('\n                        ')}
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Connect</h4>
                    <div class="social-links">
                        <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${name}. Built with AI Project Manager.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="app.js"></script>
</body>
</html>`;
}

function getSectionIcon(section){
  const icons = {
    'overview': 'info-circle',
    'features': 'star',
    'pricing': 'dollar-sign',
    'docs': 'book',
    'documentation': 'file-lines',
    'guide': 'compass',
    'api': 'code',
    'contact': 'envelope',
    'about': 'users',
    'faq': 'question-circle',
    'tutorial': 'graduation-cap',
    'examples': 'lightbulb'
  };
  const key = section.toLowerCase();
  for(const [k, v] of Object.entries(icons)){
    if(key.includes(k)) return v;
  }
  return 'cube';
}

function generateCSS(project){
  const color = project.meta?.primaryColor || project.style?.color || '#cc0000';
  const radius = project.style?.radius || 12;
  const dark = project.style?.dark !== false;
  const includeAnimations = project.meta?.includeAnimations !== false;
  
  const animationsCSS = includeAnimations ? `
/* ==============================================
   Animations & Transitions
   ============================================== */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out;
}

.animate-slide-left {
    animation: slideInLeft 0.6s ease-out;
}

.animate-slide-right {
    animation: slideInRight 0.6s ease-out;
}

.hover-lift:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}

.hover-glow:hover {
    box-shadow: 0 0 20px rgba(${hexToRgb(color)}, 0.5);
    transition: box-shadow 0.3s ease;
}
` : '';
  
  return `/* ==============================================
   ${project.name} - Auto-generated Styles
   Mobile-first responsive design
   Theme: ${dark ? 'Dark' : 'Light'} with ${color}
   Framework: ${project.meta?.framework || 'Vanilla JS'}
   ============================================== */

/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: ${color};
    --primary-dark: ${adjustColor(color, -20)};
    --primary-light: ${adjustColor(color, 20)};
    --bg-primary: ${dark ? '#0a0a0a' : '#ffffff'};
    --bg-secondary: ${dark ? '#1a0000' : '#f5f5f5'};
    --text-primary: ${dark ? '#ffffff' : '#000000'};
    --text-secondary: ${dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'};
    --border: ${dark ? 'rgba(204,0,0,0.25)' : 'rgba(0,0,0,0.1)'};
    --shadow: ${dark ? '0 10px 30px rgba(204,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)'};
    --radius: ${radius}px;
    --transition: all 0.3s ease;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background: ${dark ? 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'};
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
}

${animationsCSS}

/* ==============================================
   Navbar - Mobile First
   ============================================== */
.navbar {
    background: ${dark ? 'linear-gradient(135deg, rgba(20,0,0,0.95), rgba(10,0,0,0.98))' : 'rgba(255,255,255,0.98)'};
    border-bottom: 3px solid var(--primary);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--primary);
    text-shadow: 0 0 10px rgba(${hexToRgb(color)}, 0.3);
}

/* Utility function for hex to rgb conversion */
function hexToRgb(hex) {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? 
        \`\${parseInt(result[1], 16)}, \${parseInt(result[2], 16)}, \${parseInt(result[3], 16)}\` : 
        '204, 0, 0';
}`;
}

.nav-logo i {
    font-size: 1.5rem;
}

.nav-menu {
    display: none;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;
}

.nav-link:hover {
    color: var(--primary);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

.hamburger {
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
}

.bar {
    width: 25px;
    height: 3px;
    background: var(--primary);
    border-radius: 3px;
    transition: all 0.3s ease;
}

/* ==============================================
   Hero Section
   ============================================== */
.hero {
    background: ${dark ? 'linear-gradient(135deg, rgba(30,0,0,0.8), rgba(10,0,0,0.95))' : 'linear-gradient(135deg, #f8f9fa, #ffffff)'};
    border-bottom: 2px solid var(--border);
    padding: 4rem 1.5rem;
    text-align: center;
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
}

.hero-title {
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 1rem;
    text-shadow: 0 0 20px rgba(204,0,0,0.3);
    animation: fadeInUp 0.6s ease;
}

.hero-title i {
    margin-right: 0.5rem;
}

.hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease;
}

.hero-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease;
}

.hero-badge {
    background: ${dark ? 'rgba(204,0,0,0.2)' : 'rgba(204,0,0,0.1)'};
    border: 1px solid var(--primary);
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-size: 0.9rem;
    color: var(--text-primary);
}

.hero-badge i {
    color: var(--primary);
    margin-right: 0.5rem;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    animation: fadeInUp 1.2s ease;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    border: 2px solid transparent;
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    border-color: var(--primary);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(204,0,0,0.4);
}

.btn-secondary {
    background: ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
    color: var(--text-primary);
    border-color: var(--border);
}

.btn-secondary:hover {
    background: ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
    border-color: var(--primary);
}

/* ==============================================
   Main Content Sections
   ============================================== */
.main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
}

.content-section {
    background: ${dark ? 'rgba(30,0,0,0.6)' : '#ffffff'};
    border: 2px solid var(--border);
    border-radius: calc(var(--radius) + 4px);
    padding: 2.5rem 1.5rem;
    margin-bottom: 2.5rem;
    transition: all 0.3s ease;
}

.content-section:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
    box-shadow: var(--shadow);
}

.section-container {
    max-width: 900px;
    margin: 0 auto;
}

.section-icon {
    font-size: 2.5rem;
    color: var(--primary);
    margin-bottom: 1rem;
    opacity: 0.7;
}

.content-section h2 {
    color: var(--primary);
    font-size: 1.8rem;
    margin-bottom: 1rem;
}

.section-description {
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
}

.feature-card {
    background: ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.feature-card i {
    color: var(--primary);
    font-size: 1.2rem;
}

.feature-card h4 {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
}

/* ==============================================
   Footer
   ============================================== */
.footer {
    background: ${dark ? 'linear-gradient(135deg, rgba(20,0,0,0.9), rgba(10,0,0,0.95))' : 'rgba(0,0,0,0.95)'};
    border-top: 3px solid var(--primary);
    color: ${dark ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)'};
    padding: 3rem 1.5rem 1.5rem;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
}

.footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
    color: var(--primary);
    margin-bottom: 1rem;
}

.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: 0.5rem;
}

.footer-links a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-links a:hover {
    color: var(--primary);
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-links a {
    width: 40px;
    height: 40px;
    background: rgba(204,0,0,0.2);
    border: 1px solid var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-size: 1.2rem;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-links a:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-3px);
}

.footer-bottom {
    border-top: 1px solid rgba(204,0,0,0.3);
    padding-top: 1.5rem;
    text-align: center;
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
}

/* ==============================================
   Animations
   ============================================== */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ==============================================
   Responsive - Tablet (768px+)
   ============================================== */
@media (min-width: 768px) {
    .nav-menu {
        display: flex;
    }
    
    .hamburger {
        display: none;
    }
    
    .hero {
        padding: 6rem 2rem;
    }
    
    .hero-title {
        font-size: 3rem;
    }
    
    .hero-subtitle {
        font-size: 1.3rem;
    }
    
    .feature-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .content-section {
        padding: 3rem 2rem;
    }
}

/* ==============================================
   Responsive - Desktop (1024px+)
   ============================================== */
@media (min-width: 1024px) {
    .hero {
        padding: 8rem 2rem;
    }
    
    .hero-title {
        font-size: 3.5rem;
    }
    
    .content-section h2 {
        font-size: 2.2rem;
    }
    
    .section-description {
        font-size: 1.1rem;
    }
}

/* ==============================================
   Utility Classes
   ============================================== */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
`;
}

function adjustColor(hex, percent){
  // Simple color adjustment helper
  const num = parseInt(hex.replace('#',''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return `#${(0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1)}`;
}

function generateJS(project){
  return `// ${project.name} - Auto-generated Interactive Features
// Features: ${project.features.join(', ')}
// Generated by AI Project Manager

console.log('%c${project.name} initialized', 'color: #cc0000; font-size: 16px; font-weight: bold');

// ==============================================
// Mobile Navigation Toggle
// ==============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });
}

// ==============================================
// Smooth Scroll for Anchor Links
// ==============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Navbar height
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==============================================
// Intersection Observer for Animations
// ==============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.querySelectorAll('.content-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ==============================================
// Active Navigation Highlighting
// ==============================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === \`#\${current}\`) {
            link.classList.add('active');
        }
    });
});

// ==============================================
// Back to Top Button (Auto-created)
// ==============================================
const createBackToTop = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = \`
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #cc0000, #990000);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(204,0,0,0.4);
    \`;
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
};

createBackToTop();

// ==============================================
// Performance Optimization
// ==============================================
// Lazy load images if any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==============================================
// Console Welcome Message
// ==============================================
console.log('%c\\u{1F680} ${project.name}', 'color: #cc0000; font-size: 24px; font-weight: bold');
console.log('%cBuilt with AI Project Manager', 'color: #999; font-size: 12px');
console.log('%cRepository: https://github.com/Akhinoor14/Projects', 'color: #666; font-size: 10px');

// ==============================================
// Export for external use
// ==============================================
window.${project.name.replace(/[^a-zA-Z0-9]/g, '')} = {
    version: '1.0.0',
    features: ${JSON.stringify(project.features)},
    init: () => console.log('Project initialized')
};
`;
}

function generateGuide(project){
  return `# ${project.name} - User Guide

## Getting Started

1. Open \`src/index.html\` in your browser
2. Customize styles in \`src/styles.css\`
3. Add functionality in \`src/app.js\`

## Features

${project.features.map(f=>`- **${f}**: Add implementation details here`).join('\n')}

## Sections

${project.sections.map(s=>`### ${s}\n\nDescribe ${s} functionality.`).join('\n\n')}

## Customization

- **Colors**: Edit CSS variables in \`styles.css\`
- **Layout**: Modify grid in \`index.html\`
- **Components**: Add new components in \`src/\`

## Support

Generated by AI Project Manager  
Repository: [Akhinoor14/Projects](https://github.com/Akhinoor14/Projects)
`;
}

function renderProjects(){
  const list = document.getElementById('projectList');
  if(projects.length===0){ list.innerHTML = '<div class="list-item">No projects yet</div>'; return; }
  list.innerHTML = projects.map(p=>`
    <div class="list-item">
      <div>
        <strong>${p.name}</strong>
        <div class="chips" style="margin-top:6px">
          ${p.features.slice(0,4).map(f=>`<span class='chip'>${f}</span>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="tool" onclick="editProject('${p.id}')"><i class="fas fa-pen"></i> Edit</button>
        <button class="tool" onclick="removeProject('${p.id}')"><i class="fas fa-trash"></i> Remove</button>
        <button class="tool" onclick="previewProject('${p.id}')"><i class="fas fa-eye"></i> Preview</button>
        <button class="tool" onclick="scaffoldProject('${p.id}')"><i class="fas fa-hammer"></i> Scaffold</button>
      </div>
    </div>
  `).join('');
}

function getProject(id){ return projects.find(p=>p.id===id); }
function editProject(id){
  const p = getProject(id); if(!p) return;
  document.getElementById('name').value = p.name;
  document.getElementById('type').value = p.meta.type;
  document.getElementById('audience').value = p.meta.audience;
  document.getElementById('goal').value = p.meta.goal;
  document.getElementById('features').value = p.features.join(', ');
  document.getElementById('design').value = p.meta.design;
  currentPlan = p; renderPlan(p);
  status('Loaded for edit','good');
}
function removeProject(id){
  projects = projects.filter(p=>p.id!==id);
  saveStore(); renderProjects(); status('Removed','warn');
}
function previewProject(id){
  const p = getProject(id)||currentPlan; if(!p) return;
  renderPlan(p); status('Preview updated','good');
}

function scaffoldProject(id){
  const p = getProject(id)||currentPlan; if(!p){ status('No project','warn'); return; }
  const files = buildScaffoldFiles(p);
  downloadZip(files, (p.name||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-'));
  status('Scaffold generated','good');
}

function generateScaffold(){
  if(!currentPlan){ status('Generate plan first','warn'); return; }
  const files = buildScaffoldFiles(currentPlan);
  downloadZip(files, (currentPlan.meta.name||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-'));
  status('Scaffold generated','good');
}

function buildScaffoldFiles(plan){
  const slug = (plan.meta.name||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const folders = {
    src: `${slug}/src`,
    docs: `${slug}/docs`,
    assets: `${slug}/assets`,
    config: `${slug}/config`
  };
  const files = {};
  files[`${slug}/README.md`] = generateProjectReadme(plan);
  files[`${folders.config}/plan.json`] = JSON.stringify(plan, null, 2);
  files[`${folders.src}/index.html`] = generateIndexHTML(plan);
  files[`${folders.src}/styles.css`] = generateCSS(plan);
  files[`${folders.src}/app.js`] = generateJS(plan);
  files[`${folders.docs}/GUIDE.md`] = generateGuide(plan);
  files[`${slug}/.gitignore`] = 'node_modules/\n.DS_Store\n*.log\n.env';
  return files;
}

function downloadZip(files, name){
  // Simple client-side zip using Blob (store as .zip-like folder tarball JSON)
  const blob = new Blob([JSON.stringify(files,null,2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-scaffold.json`;
  a.click();
}

function importTemplate(){
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json,application/json';
  input.onchange = async ()=>{
    const file = input.files[0]; if(!file) return;
    const text = await file.text();
    try{ const tpl = JSON.parse(text); currentPlan = tpl; renderPlan(tpl); status('Template imported','good'); }
    catch(e){ status('Invalid template','bad'); }
  };
  input.click();
}

function exportTemplate(){
  if(!currentPlan){ status('Generate plan first','warn'); return; }
  const blob = new Blob([JSON.stringify(currentPlan,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'project-template.json'; a.click();
  status('Template exported','good');
}

function findInPlan(){
  const term = prompt('Find term in plan:');
  if(!term || !currentPlan) return;
  const found = [];
  Object.entries(currentPlan).forEach(([k,v])=>{
    const str = JSON.stringify(v).toLowerCase();
    if(str.includes(term.toLowerCase())) found.push(k);
  });
  alert(found.length?`Found in: ${found.join(', ')}`:'Not found');
}

// ========================= LIVE PREVIEW SYSTEM =========================

/**
 * Initialize live preview modal and viewport controls
 */
function initLivePreview() {
  const btnLivePreview = document.getElementById('btnLivePreview');
  const previewModal = document.getElementById('previewModal');
  const closePreview = document.getElementById('closePreview');
  const viewMobile = document.getElementById('viewMobile');
  const viewTablet = document.getElementById('viewTablet');
  const viewDesktop = document.getElementById('viewDesktop');
  const previewFrame = document.getElementById('previewFrame');

  if (!btnLivePreview) return;

  // Viewport sizes
  const viewports = {
    mobile: { width: '375px', height: '667px' },
    tablet: { width: '768px', height: '1024px' },
    desktop: { width: '1440px', height: '900px' }
  };

  // Open preview
  btnLivePreview.addEventListener('click', () => {
    const projects = loadProjects();
    if (projects.length === 0) {
      alert('No projects to preview. Create a project first!');
      return;
    }

    // Get first project or selected project
    const project = projects[0];
    const htmlContent = generateIndexHTML(project);
    const cssContent = generateCSS(project);
    const jsContent = generateJS(project);

    // Build complete HTML document
    const fullHTML = htmlContent.replace(
      '</head>',
      `<style>${cssContent}</style></head>`
    ).replace(
      '</body>',
      `<script>${jsContent}</script></body>`
    );

    // Load into iframe
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    previewModal.style.display = 'block';
  });

  // Close preview
  closePreview.addEventListener('click', () => {
    previewModal.style.display = 'none';
    previewFrame.src = '';
  });

  // Viewport switchers
  viewMobile.addEventListener('click', () => {
    setViewport('mobile');
    setActiveViewport(viewMobile);
  });

  viewTablet.addEventListener('click', () => {
    setViewport('tablet');
    setActiveViewport(viewTablet);
  });

  viewDesktop.addEventListener('click', () => {
    setViewport('desktop');
    setActiveViewport(viewDesktop);
  });

  function setViewport(type) {
    previewFrame.style.width = viewports[type].width;
    previewFrame.style.height = viewports[type].height;
  }

  function setActiveViewport(activeBtn) {
    [viewMobile, viewTablet, viewDesktop].forEach(btn => {
      btn.style.background = 'transparent';
      btn.style.border = '1px solid rgba(204,0,0,0.3)';
    });
    activeBtn.style.background = 'rgba(204,0,0,0.2)';
    activeBtn.style.border = '1px solid #cc0000';
  }

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.style.display === 'block') {
      closePreview.click();
    }
  });
}

// ========================= COMPONENT LIBRARY =========================

/**
 * Comprehensive pre-built component templates inspired by modern web design
 */
const COMPONENT_LIBRARY = {
  hero: {
    modern: (project) => `
    <section class="hero-modern">
      <div class="hero-particles"></div>
      <div class="hero-content">
        <h1 class="hero-title" data-animate="fadeInUp">
          <i class="fas fa-${getSectionIcon(project.name)}"></i>
          ${project.name}
        </h1>
        <p class="hero-subtitle" data-animate="fadeInUp" data-delay="200">
          ${project.description || 'Next-generation solution for modern challenges'}
        </p>
        <div class="hero-stats" data-animate="fadeInUp" data-delay="400">
          ${project.features?.slice(0, 3).map((f, i) => `
            <div class="stat-card">
              <div class="stat-value">${['100+', '500K+', '99.9%'][i]}</div>
              <div class="stat-label">${f}</div>
            </div>
          `).join('') || ''}
        </div>
        <div class="hero-actions" data-animate="fadeInUp" data-delay="600">
          <button class="btn-primary"><i class="fas fa-rocket"></i> Get Started</button>
          <button class="btn-secondary"><i class="fas fa-play"></i> Watch Demo</button>
        </div>
      </div>
    </section>`,

    minimal: (project) => `
    <section class="hero-minimal">
      <div class="container">
        <span class="hero-badge">${project.type || 'New Project'}</span>
        <h1>${project.name}</h1>
        <p>${project.description || 'Built with modern technologies for exceptional performance'}</p>
        <a href="#features" class="btn-link">Explore Features →</a>
      </div>
    </section>`,

    split: (project) => `
    <section class="hero-split">
      <div class="hero-left">
        <h1>${project.name}</h1>
        <p>${project.description || 'Powerful. Simple. Effective.'}</p>
        <div class="hero-features-list">
          ${project.features?.slice(0, 4).map(f => `
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>${f}</span>
            </div>
          `).join('') || ''}
        </div>
        <button class="btn-primary">Start Free Trial</button>
      </div>
      <div class="hero-right">
        <div class="hero-image-placeholder">
          <i class="fas fa-image fa-5x"></i>
          <p>Add your hero image here</p>
        </div>
      </div>
    </section>`,

    gradient: (project) => `
    <section class="hero-gradient">
      <div class="gradient-overlay"></div>
      <div class="hero-content">
        <span class="hero-label">Welcome to</span>
        <h1>${project.name}</h1>
        <p>${project.description || 'Transform your workflow with cutting-edge technology'}</p>
        <form class="hero-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit" class="btn-primary">Get Started →</button>
        </form>
        <div class="hero-trust">
          <p>Trusted by 10,000+ users worldwide</p>
        </div>
      </div>
    </section>`
  },

  features: {
    grid: (features) => `
    <section class="features-grid" id="features">
      <div class="container">
        <h2>Features</h2>
        <p class="section-subtitle">Everything you need to succeed</p>
        <div class="grid-3">
          ${features.map(f => `
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-${getSectionIcon(f)}"></i>
              </div>
              <h3>${f}</h3>
              <p>Experience the power of ${f.toLowerCase()} with our advanced solution that delivers exceptional results.</p>
              <a href="#" class="feature-link">Learn more →</a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`,

    timeline: (features) => `
    <section class="features-timeline">
      <div class="container">
        <h2>Feature Timeline</h2>
        <p class="section-subtitle">Our journey to excellence</p>
        <div class="timeline">
          ${features.map((f, i) => `
            <div class="timeline-item ${i % 2 === 0 ? 'left' : 'right'}">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h3><i class="fas fa-${getSectionIcon(f)}"></i> ${f}</h3>
                <p>Innovative approach to ${f.toLowerCase()} that sets new industry standards.</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`,

    tabs: (features) => `
    <section class="features-tabs">
      <div class="container">
        <h2>Explore Features</h2>
        <div class="tabs">
          ${features.map((f, i) => `
            <button class="tab ${i === 0 ? 'active' : ''}" data-tab="${i}">
              <i class="fas fa-${getSectionIcon(f)}"></i> ${f}
            </button>
          `).join('')}
        </div>
        <div class="tab-content">
          ${features.map((f, i) => `
            <div class="tab-pane ${i === 0 ? 'active' : ''}" data-pane="${i}">
              <div class="tab-grid">
                <div class="tab-left">
                  <h3>${f}</h3>
                  <p>Deep dive into ${f.toLowerCase()} capabilities with comprehensive tools and features.</p>
                  <ul>
                    <li><i class="fas fa-check"></i> Advanced functionality</li>
                    <li><i class="fas fa-check"></i> Easy integration</li>
                    <li><i class="fas fa-check"></i> Full customization</li>
                  </ul>
                </div>
                <div class="tab-right">
                  <div class="tab-placeholder">
                    <i class="fas fa-${getSectionIcon(f)} fa-4x"></i>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`,

    showcase: (features) => `
    <section class="features-showcase">
      <div class="container">
        <h2>What Makes Us Different</h2>
        <div class="showcase-grid">
          ${features.map((f, i) => `
            <div class="showcase-item" style="--delay: ${i * 0.1}s">
              <div class="showcase-number">${String(i + 1).padStart(2, '0')}</div>
              <div class="showcase-icon">
                <i class="fas fa-${getSectionIcon(f)}"></i>
              </div>
              <h3>${f}</h3>
              <p>Revolutionary ${f.toLowerCase()} that transforms how you work.</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`
  },

  pricing: {
    cards: () => `
    <section class="pricing-section" id="pricing">
      <div class="container">
        <h2>Choose Your Plan</h2>
        <p class="section-subtitle">Flexible pricing for teams of all sizes</p>
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Starter</h3>
              <div class="price"><span class="currency">$</span>9<span class="period">/mo</span></div>
            </div>
            <ul class="pricing-features">
              <li><i class="fas fa-check"></i> Up to 10 projects</li>
              <li><i class="fas fa-check"></i> Basic support</li>
              <li><i class="fas fa-check"></i> 5GB storage</li>
              <li><i class="fas fa-times"></i> Advanced features</li>
            </ul>
            <button class="btn-secondary">Get Started</button>
          </div>
          <div class="pricing-card featured">
            <div class="featured-badge">Most Popular</div>
            <div class="pricing-header">
              <h3>Pro</h3>
              <div class="price"><span class="currency">$</span>29<span class="period">/mo</span></div>
            </div>
            <ul class="pricing-features">
              <li><i class="fas fa-check"></i> Unlimited projects</li>
              <li><i class="fas fa-check"></i> Priority support</li>
              <li><i class="fas fa-check"></i> 100GB storage</li>
              <li><i class="fas fa-check"></i> Advanced features</li>
            </ul>
            <button class="btn-primary">Get Started</button>
          </div>
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Enterprise</h3>
              <div class="price"><span class="currency">$</span>99<span class="period">/mo</span></div>
            </div>
            <ul class="pricing-features">
              <li><i class="fas fa-check"></i> Unlimited everything</li>
              <li><i class="fas fa-check"></i> 24/7 support</li>
              <li><i class="fas fa-check"></i> Unlimited storage</li>
              <li><i class="fas fa-check"></i> Custom features</li>
            </ul>
            <button class="btn-secondary">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>`,

    comparison: () => `
    <section class="pricing-comparison">
      <div class="container">
        <h2>Feature Comparison</h2>
        <div class="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Starter</th>
                <th>Pro</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Projects</td>
                <td>10</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Storage</td>
                <td>5GB</td>
                <td>100GB</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Basic</td>
                <td>Priority</td>
                <td>24/7</td>
              </tr>
              <tr>
                <td>Custom Features</td>
                <td><i class="fas fa-times"></i></td>
                <td><i class="fas fa-check"></i></td>
                <td><i class="fas fa-check"></i></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>`
  },

  testimonials: {
    grid: () => `
    <section class="testimonials-grid" id="testimonials">
      <div class="container">
        <h2>What Our Customers Say</h2>
        <p class="section-subtitle">Trusted by industry leaders worldwide</p>
        <div class="testimonials">
          <div class="testimonial-card">
            <div class="testimonial-stars">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
            <p>"This platform has completely transformed how we manage our projects. The automation saves us hours every week!"</p>
            <div class="testimonial-author">
              <div class="author-avatar"><i class="fas fa-user"></i></div>
              <div>
                <h4>Sarah Johnson</h4>
                <p>CEO, TechCorp</p>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-stars">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
            <p>"Incredible tool! The responsive design system generates professional-quality websites instantly."</p>
            <div class="testimonial-author">
              <div class="author-avatar"><i class="fas fa-user"></i></div>
              <div>
                <h4>Michael Chen</h4>
                <p>Lead Developer, StartupXYZ</p>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-stars">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
            <p>"Best investment we've made. The AI-powered features are game-changing for our workflow."</p>
            <div class="testimonial-author">
              <div class="author-avatar"><i class="fas fa-user"></i></div>
              <div>
                <h4>Emily Rodriguez</h4>
                <p>Product Manager, Innovation Labs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    slider: () => `
    <section class="testimonials-slider">
      <div class="container">
        <h2>Customer Stories</h2>
        <div class="slider-container">
          <div class="slider-track">
            <div class="testimonial-slide">
              <blockquote>
                <p>"Outstanding platform with exceptional support. Highly recommended!"</p>
                <footer>— Alex Thompson, Designer</footer>
              </blockquote>
            </div>
          </div>
          <div class="slider-controls">
            <button class="slider-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="slider-next"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </section>`
  },

  contact: {
    form: () => `
    <section class="contact-form" id="contact">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-left">
            <h2>Get In Touch</h2>
            <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>hello@example.com</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Address</h4>
                  <p>123 Main St, City, Country</p>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-right">
            <form class="contact-form-fields">
              <div class="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" required />
              </div>
              <div class="form-group">
                <label>Message</label>
                <textarea rows="5" placeholder="Your message" required></textarea>
              </div>
              <button type="submit" class="btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>`,

    minimal: () => `
    <section class="contact-minimal">
      <div class="container">
        <h2>Let's Talk</h2>
        <p>Ready to get started? Drop us a line.</p>
        <form class="minimal-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit" class="btn-primary">Contact Us</button>
        </form>
      </div>
    </section>`
  },

  cta: {
    centered: () => `
    <section class="cta-centered">
      <div class="container">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of users already using our platform</p>
        <div class="cta-actions">
          <button class="btn-primary">Start Free Trial</button>
          <button class="btn-secondary">Contact Sales</button>
        </div>
      </div>
    </section>`,

    split: () => `
    <section class="cta-split">
      <div class="container">
        <div class="cta-grid">
          <div class="cta-left">
            <h2>Transform Your Workflow Today</h2>
            <p>No credit card required. Start in minutes.</p>
          </div>
          <div class="cta-right">
            <form class="cta-form">
              <input type="email" placeholder="Enter your email" />
              <button class="btn-primary">Get Started →</button>
            </form>
          </div>
        </div>
      </div>
    </section>`,

    banner: () => `
    <section class="cta-banner">
      <div class="container">
        <div class="banner-content">
          <i class="fas fa-rocket fa-3x"></i>
          <div>
            <h3>Launch Your Project Now</h3>
            <p>Everything you need to succeed</p>
          </div>
          <button class="btn-primary">Get Started</button>
        </div>
      </div>
    </section>`
  },

  footer: {
    comprehensive: (project) => `
    <footer class="footer-comprehensive">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h3><i class="fas fa-${getSectionIcon(project.name)}"></i> ${project.name}</h3>
            <p>${project.description || 'Building the future, one project at a time.'}</p>
            <div class="footer-social">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-linkedin"></i></a>
              <a href="#"><i class="fab fa-github"></i></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Updates</a></li>
              <li><a href="#">Beta</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 ${project.name}. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>`
  }
};

/**
 * Get component styles for library components
 */
function getComponentStyles() {
  return `
/* ============================================== */
/* COMPONENT LIBRARY STYLES */
/* ============================================== */

/* Hero Modern */
.hero-modern {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0000 0%, #330000 100%);
  overflow: hidden;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(204,0,0,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: particleMove 20s linear infinite;
}

@keyframes particleMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(50px); }
}

.hero-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(204,0,0,0.1);
  border: 1px solid rgba(204,0,0,0.3);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 150px;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Hero Minimal */
.hero-minimal {
  text-align: center;
  padding: 6rem 2rem;
  background: var(--bg-primary);
}

.hero-badge {
  display: inline-block;
  background: rgba(204,0,0,0.1);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(204,0,0,0.2);
}

.btn-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s;
  display: inline-block;
  margin-top: 1rem;
}

.btn-link:hover {
  transform: translateX(5px);
}

/* Hero Split */
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem 2rem;
  align-items: center;
}

.hero-features-list {
  margin: 2rem 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
}

.feature-item i {
  color: var(--primary);
  font-size: 1.2rem;
}

.hero-image-placeholder {
  background: rgba(204,0,0,0.05);
  border: 2px dashed rgba(204,0,0,0.2);
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  color: rgba(204,0,0,0.3);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Hero Gradient */
.hero-gradient {
  position: relative;
  padding: 8rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #cc0000 0%, #660000 100%);
  color: white;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(0,0,0,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
  background-size: cover;
  opacity: 0.3;
}

.hero-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.9;
}

.hero-form {
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem auto;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-form input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
}

.hero-form input::placeholder {
  color: rgba(255,255,255,0.6);
}

.hero-trust {
  margin-top: 2rem;
  opacity: 0.8;
  font-size: 0.9rem;
}

/* Features Sections */
.features-grid, .features-timeline, .features-tabs, .features-showcase {
  padding: 4rem 2rem;
}

.section-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  margin-top: 0.5rem;
}

/* Timeline */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary), rgba(204,0,0,0.2));
  transform: translateX(-50%);
}

.timeline-item {
  margin: 3rem 0;
  position: relative;
}

.timeline-marker {
  position: absolute;
  top: 0;
  left: 50%;
  width: 20px;
  height: 20px;
  background: var(--primary);
  border: 4px solid var(--bg-primary);
  border-radius: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
}

.timeline-item.left .timeline-content {
  margin-right: 55%;
}

.timeline-item.right .timeline-content {
  margin-left: 55%;
}

.timeline-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 2rem 0;
  justify-content: center;
}

.tab {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.tab:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.tab.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.tab-content {
  margin-top: 2rem;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
  animation: fadeInUp 0.5s;
}

.tab-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.tab-left ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.tab-left li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.tab-left li i {
  color: var(--primary);
}

.tab-placeholder {
  background: rgba(204,0,0,0.05);
  border: 2px dashed rgba(204,0,0,0.2);
  border-radius: 12px;
  padding: 4rem;
  text-align: center;
  color: rgba(204,0,0,0.3);
}

/* Showcase */
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.showcase-item {
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  animation: fadeInUp 0.6s var(--delay) both;
}

.showcase-number {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--primary), #ff3333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.showcase-icon {
  font-size: 2.5rem;
  color: var(--primary);
  margin: 1rem 0;
}

/* Pricing */
.pricing-section, .pricing-comparison {
  padding: 4rem 2rem;
  background: var(--bg-primary);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.pricing-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(204,0,0,0.2);
}

.pricing-card.featured {
  border: 2px solid var(--primary);
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.pricing-header h3 {
  margin-bottom: 1rem;
}

.price {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary);
  margin: 1rem 0;
}

.currency, .period {
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.pricing-features .fa-check {
  color: #00cc00;
}

.pricing-features .fa-times {
  color: #cc0000;
  opacity: 0.4;
}

.comparison-table {
  overflow-x: auto;
  margin-top: 2rem;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.comparison-table th {
  background: rgba(204,0,0,0.1);
  color: var(--primary);
  font-weight: 600;
}

/* Testimonials */
.testimonials-grid, .testimonials-slider {
  padding: 4rem 2rem;
  background: var(--bg-primary);
}

.testimonials {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.testimonial-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
}

.testimonial-stars {
  color: #ffc107;
  margin-bottom: 1rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: rgba(204,0,0,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.testimonial-author h4 {
  margin: 0;
  font-size: 1rem;
}

.testimonial-author p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Contact */
.contact-form, .contact-minimal {
  padding: 4rem 2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 2rem;
}

.contact-info {
  margin-top: 2rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin: 1.5rem 0;
}

.contact-item i {
  font-size: 1.5rem;
  color: var(--primary);
  margin-top: 0.25rem;
}

.contact-item h4 {
  margin: 0 0 0.25rem 0;
}

.contact-item p {
  margin: 0;
  color: var(--text-secondary);
}

.contact-form-fields {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
}

.minimal-form {
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem auto;
  flex-wrap: wrap;
  justify-content: center;
}

.minimal-form input {
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* CTA Sections */
.cta-centered, .cta-split, .cta-banner {
  background: linear-gradient(135deg, rgba(204,0,0,0.1) 0%, rgba(204,0,0,0.05) 100%);
  padding: 4rem 2rem;
  border-radius: 16px;
  margin: 4rem 0;
}

.cta-centered {
  text-align: center;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.cta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.cta-form {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-form input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

/* Footer */
.footer-comprehensive {
  background: linear-gradient(to bottom, var(--bg-primary), #0a0000);
  padding: 4rem 2rem 2rem;
  margin-top: 4rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-col h3, .footer-col h4 {
  margin-bottom: 1rem;
}

.footer-col ul {
  list-style: none;
  padding: 0;
}

.footer-col li {
  margin: 0.5rem 0;
}

.footer-col a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-col a:hover {
  color: var(--primary);
}

.footer-social {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.footer-social a {
  width: 40px;
  height: 40px;
  background: rgba(204,0,0,0.1);
  border: 1px solid rgba(204,0,0,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: all 0.3s;
}

.footer-social a:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-3px);
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-split,
  .cta-grid,
  .contact-grid,
  .tab-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item.left .timeline-content,
  .timeline-item.right .timeline-content {
    margin-left: 50px;
    margin-right: 0;
  }
  
  .timeline-marker {
    left: 20px;
    transform: translate(0, 0);
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-card.featured {
    transform: scale(1);
  }
}
`;
}

// ========================= DATA PERSISTENCE & BACKUP =========================

/**
 * Advanced data backup and restore system
 */
const DATA_MANAGER = {
  // Storage keys
  BACKUP_KEY: 'pm_backup_v1',
  AUTOSAVE_KEY: 'pm_autosave_v1',
  VERSION_KEY: 'pm_version_v1',

  /**
   * Create full backup of all data
   */
  createBackup() {
    const timestamp = new Date().toISOString();
    const backup = {
      version: '1.0.0',
      timestamp,
      data: {
        projects: loadProjects(),
        history: JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'),
        settings: {
          theme: document.body.classList.contains('light-mode') ? 'light' : 'dark',
          lastSync: localStorage.getItem('pm_last_sync') || null
        }
      }
    };
    
    localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    return backup;
  },

  /**
   * Restore data from backup
   */
  restoreBackup(backupData) {
    try {
      const backup = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;
      
      if (backup.data.projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.data.projects));
      }
      
      if (backup.data.history) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(backup.data.history));
      }
      
      if (backup.data.settings) {
        if (backup.data.settings.theme === 'light') {
          document.body.classList.add('light-mode');
        }
      }
      
      return true;
    } catch (e) {
      console.error('Restore failed:', e);
      return false;
    }
  },

  /**
   * Export all data as downloadable file
   */
  exportAllData() {
    const backup = this.createBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-manager-backup-${backup.timestamp.split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    status('Backup exported successfully', 'good');
  },

  /**
   * Import data from file
   */
  importAllData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const text = await file.text();
      const success = this.restoreBackup(text);
      
      if (success) {
        status('Data imported successfully', 'good');
        setTimeout(() => location.reload(), 1000);
      } else {
        status('Import failed - invalid backup file', 'bad');
      }
    };
    input.click();
  },

  /**
   * Auto-save system with versioning
   */
  autoSave() {
    const autosave = {
      timestamp: new Date().toISOString(),
      projects: loadProjects()
    };
    localStorage.setItem(this.AUTOSAVE_KEY, JSON.stringify(autosave));
  },

  /**
   * Get storage statistics
   */
  getStorageStats() {
    const projects = loadProjects();
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    
    return {
      projectCount: projects.length,
      historyCount: history.length,
      storageUsed: (totalSize / 1024).toFixed(2) + ' KB',
      storageLimit: '5-10 MB (browser limit)',
      lastBackup: localStorage.getItem(this.BACKUP_KEY) ? 
        JSON.parse(localStorage.getItem(this.BACKUP_KEY)).timestamp : 'Never'
    };
  },

  /**
   * Clear old history entries to save space
   */
  cleanupHistory(keepRecent = 50) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (history.length > keepRecent) {
      const cleaned = history.slice(-keepRecent);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(cleaned));
      return history.length - cleaned.length;
    }
    return 0;
  }
};

/**
 * Initialize data management UI
 */
function initDataManagement() {
  // Auto-save every 2 minutes
  setInterval(() => DATA_MANAGER.autoSave(), 2 * 60 * 1000);
  
  // Save on page unload
  window.addEventListener('beforeunload', () => DATA_MANAGER.autoSave());
}

// ========================= BATCH OPERATIONS =========================

/**
 * Batch project operations for efficiency
 */
const BATCH_OPS = {
  /**
   * Sync all projects to GitHub
   */
  async syncAll() {
    const projects = loadProjects();
    if (projects.length === 0) {
      alert('No projects to sync');
      return;
    }
    
    const confirmed = confirm(`Sync ${projects.length} projects to GitHub?`);
    if (!confirmed) return;
    
    status(`Syncing ${projects.length} projects...`, 'warn');
    let success = 0;
    let failed = 0;
    
    for (const project of projects) {
      try {
        await syncSingleProject(project);
        success++;
      } catch (e) {
        failed++;
        console.error(`Failed to sync ${project.name}:`, e);
      }
    }
    
    status(`Sync complete: ${success} success, ${failed} failed`, success > 0 ? 'good' : 'bad');
  },

  /**
   * Update all projects with latest template
   */
  updateAll() {
    const projects = loadProjects();
    if (projects.length === 0) {
      alert('No projects to update');
      return;
    }
    
    const confirmed = confirm(`Regenerate files for ${projects.length} projects?`);
    if (!confirmed) return;
    
    projects.forEach(project => {
      project.updatedAt = new Date().toISOString();
    });
    
    saveProjects(projects);
    status(`${projects.length} projects updated`, 'good');
    renderProjects(projects);
  },

  /**
   * Delete projects not synced in X days
   */
  deleteUnused(days = 30) {
    const projects = loadProjects();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const toDelete = projects.filter(p => {
      const updated = new Date(p.updatedAt || p.createdAt);
      return updated < cutoff;
    });
    
    if (toDelete.length === 0) {
      alert('No unused projects found');
      return;
    }
    
    const confirmed = confirm(`Delete ${toDelete.length} projects unused for ${days}+ days?`);
    if (!confirmed) return;
    
    const remaining = projects.filter(p => !toDelete.includes(p));
    saveProjects(remaining);
    status(`${toDelete.length} projects deleted`, 'good');
    renderProjects(remaining);
  },

  /**
   * Export all projects as templates
   */
  exportAllTemplates() {
    const projects = loadProjects();
    const templates = projects.map(p => ({
      name: p.name,
      description: p.description,
      type: p.type,
      features: p.features,
      sections: p.sections
    }));
    
    const blob = new Blob([JSON.stringify(templates, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-templates-pack.json';
    a.click();
    URL.revokeObjectURL(url);
    status('Templates exported', 'good');
  }
};

// ========================= TEMPLATE PACKS SYSTEM =========================

/**
 * Pre-configured project templates for quick start
 */
const TEMPLATE_PACKS = {
  portfolio: {
    name: 'Professional Portfolio',
    description: 'Showcase your work and skills with a stunning portfolio website',
    type: 'Portfolio',
    features: [
      'Project Showcase',
      'Skills Display',
      'Work Experience',
      'Client Testimonials',
      'Contact Form',
      'Responsive Design'
    ],
    sections: [
      { name: 'About Me', description: 'Personal introduction and background' },
      { name: 'Portfolio', description: 'Featured projects and case studies' },
      { name: 'Skills', description: 'Technical and professional skills' },
      { name: 'Experience', description: 'Work history and achievements' },
      { name: 'Testimonials', description: 'Client reviews and feedback' },
      { name: 'Contact', description: 'Get in touch form' }
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Font Awesome'],
    colors: {
      primary: '#cc0000',
      secondary: '#333333',
      accent: '#ff6600'
    },
    layout: 'single-page',
    components: {
      hero: 'split',
      features: 'showcase',
      testimonials: 'grid',
      contact: 'form'
    }
  },

  landing: {
    name: 'SaaS Landing Page',
    description: 'High-converting landing page for SaaS products and startups',
    type: 'Landing Page',
    features: [
      'Hero Section',
      'Feature Highlights',
      'Pricing Tables',
      'Social Proof',
      'Email Capture',
      'Call-to-Action'
    ],
    sections: [
      { name: 'Hero', description: 'Attention-grabbing headline and CTA' },
      { name: 'Features', description: 'Product benefits and features' },
      { name: 'How It Works', description: 'Step-by-step process' },
      { name: 'Pricing', description: 'Transparent pricing plans' },
      { name: 'Testimonials', description: 'Customer success stories' },
      { name: 'FAQ', description: 'Common questions answered' },
      { name: 'Sign Up', description: 'Email capture and free trial' }
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Email API'],
    colors: {
      primary: '#cc0000',
      secondary: '#0066cc',
      accent: '#00cc66'
    },
    layout: 'single-page',
    components: {
      hero: 'gradient',
      features: 'tabs',
      pricing: 'cards',
      testimonials: 'slider',
      cta: 'split'
    }
  },

  blog: {
    name: 'Modern Blog',
    description: 'Clean and engaging blog platform for content creators',
    type: 'Blog',
    features: [
      'Article Grid',
      'Category Filter',
      'Search Functionality',
      'Author Profiles',
      'Social Sharing',
      'Newsletter Signup'
    ],
    sections: [
      { name: 'Latest Posts', description: 'Recent articles and updates' },
      { name: 'Categories', description: 'Browse by topic' },
      { name: 'Featured', description: 'Highlighted content' },
      { name: 'About Author', description: 'Writer bio and background' },
      { name: 'Newsletter', description: 'Subscribe for updates' }
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Markdown'],
    colors: {
      primary: '#cc0000',
      secondary: '#2c3e50',
      accent: '#e74c3c'
    },
    layout: 'multi-page',
    components: {
      hero: 'minimal',
      features: 'grid',
      contact: 'minimal',
      cta: 'banner'
    }
  },

  ecommerce: {
    name: 'E-Commerce Store',
    description: 'Complete online store with product showcase and shopping features',
    type: 'E-Commerce',
    features: [
      'Product Catalog',
      'Shopping Cart',
      'Product Filters',
      'Wishlist',
      'Customer Reviews',
      'Secure Checkout'
    ],
    sections: [
      { name: 'Shop', description: 'Browse all products' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Featured Products', description: 'Bestsellers and new arrivals' },
      { name: 'Deals', description: 'Special offers and discounts' },
      { name: 'Reviews', description: 'Customer testimonials' },
      { name: 'About Us', description: 'Store information' },
      { name: 'Contact', description: 'Customer support' }
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Payment API', 'Cart System'],
    colors: {
      primary: '#cc0000',
      secondary: '#ff9900',
      accent: '#00cc00'
    },
    layout: 'multi-page',
    components: {
      hero: 'modern',
      features: 'grid',
      pricing: 'cards',
      testimonials: 'grid',
      contact: 'form'
    }
  },

  docs: {
    name: 'Documentation Site',
    description: 'Professional documentation hub for APIs, libraries, and products',
    type: 'Documentation',
    features: [
      'Searchable Content',
      'Code Snippets',
      'Navigation Sidebar',
      'Version Selector',
      'Dark Mode Toggle',
      'API Reference'
    ],
    sections: [
      { name: 'Getting Started', description: 'Quick start guide' },
      { name: 'Installation', description: 'Setup instructions' },
      { name: 'API Reference', description: 'Complete API documentation' },
      { name: 'Examples', description: 'Code examples and tutorials' },
      { name: 'FAQ', description: 'Frequently asked questions' },
      { name: 'Changelog', description: 'Version history' },
      { name: 'Support', description: 'Help and community' }
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Markdown', 'Syntax Highlighter'],
    colors: {
      primary: '#cc0000',
      secondary: '#34495e',
      accent: '#3498db'
    },
    layout: 'multi-page',
    components: {
      hero: 'minimal',
      features: 'timeline',
      contact: 'minimal',
      cta: 'centered'
    }
  }
};

/**
 * Apply template pack to current project
 */
function applyTemplatePack(templateKey) {
  const template = TEMPLATE_PACKS[templateKey];
  if (!template) {
    status('Template not found', 'bad');
    return;
  }

  // Populate form fields
  document.getElementById('projectName').value = template.name;
  document.getElementById('projectDesc').value = template.description;

  // Generate and render plan
  const plan = {
    name: template.name,
    description: template.description,
    type: template.type,
    features: template.features,
    sections: template.sections,
    technologies: template.technologies,
    colors: template.colors,
    layout: template.layout,
    components: template.components,
    templateSource: templateKey
  };

  currentPlan = plan;
  renderPlan(plan);
  status(`Template "${template.name}" applied successfully!`, 'good');
}

/**
 * Show template selector modal
 */
function showTemplatePacks() {
  const modal = document.getElementById('templatePacksModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

/**
 * Close template selector modal
 */
function closeTemplatePacks() {
  const modal = document.getElementById('templatePacksModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Generate template pack HTML for UI
 */
function generateTemplatePackHTML(key, template) {
  return `
    <div class="template-pack-card" onclick="applyTemplatePack('${key}'); closeTemplatePacks();">
      <div class="template-pack-header">
        <h3><i class="fas fa-${getTemplateIcon(key)}"></i> ${template.name}</h3>
        <span class="template-badge">${template.type}</span>
      </div>
      <p class="template-description">${template.description}</p>
      <div class="template-features">
        <strong>Includes:</strong>
        <ul>
          ${template.features.slice(0, 3).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
        </ul>
      </div>
      <div class="template-meta">
        <span><i class="fas fa-layer-group"></i> ${template.sections.length} sections</span>
        <span><i class="fas fa-code"></i> ${template.technologies.length} techs</span>
      </div>
    </div>
  `;
}

/**
 * Get icon for template type
 */
function getTemplateIcon(type) {
  const icons = {
    portfolio: 'briefcase',
    landing: 'rocket',
    blog: 'blog',
    ecommerce: 'shopping-cart',
    docs: 'book'
  };
  return icons[type] || 'file';
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('DOMContentLoaded', initLivePreview);
window.addEventListener('DOMContentLoaded', initDataManagement);
