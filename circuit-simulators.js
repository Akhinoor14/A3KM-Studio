// Circuit Simulators - 6 Free Tools

const simulators = [
    {
        id: 1,
        name: 'Tinkercad Circuits',
        url: 'https://www.tinkercad.com/circuits',
        icon: '🔧',
        platforms: ['Web', 'Free'],
        difficulty: 'beginner',
        description: 'User-friendly Arduino and electronics simulator with drag-and-drop interface. Perfect for beginners learning circuits and Arduino programming.',
        features: [
            'Arduino simulation with code editor',
            'Breadboard view with realistic components',
            'Built-in oscilloscope and multimeter',
            'Export projects and generate PCB files',
            'Extensive component library'
        ],
        pros: [
            'Very beginner-friendly',
            'No installation needed',
            'Arduino support built-in',
            'Free Autodesk account'
        ],
        cons: [
            'Limited advanced features',
            'Requires internet',
            'Can be slow with large circuits'
        ],
        bestFor: 'Arduino projects, educational use, quick prototyping, and beginners learning electronics'
    },
    {
        id: 2,
        name: 'Falstad Circuit Simulator',
        url: 'https://www.falstad.com/circuit/',
        icon: '⚡',
        platforms: ['Web', 'Free', 'Open Source'],
        difficulty: 'beginner',
        description: 'Real-time interactive circuit simulator showing current flow with animations. Excellent for understanding circuit behavior visually.',
        features: [
            'Real-time current and voltage visualization',
            'Animated electron flow display',
            'Huge library of example circuits',
            'Oscilloscope and waveform analysis',
            'Export and share circuits easily'
        ],
        pros: [
            'Instant visual feedback',
            'Great for learning',
            'No sign-up required',
            'Very fast simulation'
        ],
        cons: [
            'Simple UI takes getting used to',
            'Limited PCB export',
            'No Arduino support'
        ],
        bestFor: 'Learning circuit fundamentals, AC/DC analysis, filter design, and visualizing circuit behavior'
    },
    {
        id: 3,
        name: 'CircuitLab',
        url: 'https://www.circuitlab.com/',
        icon: '📊',
        platforms: ['Web', 'Freemium'],
        difficulty: 'advanced',
        description: 'Professional-grade online SPICE simulator with schematic capture. Industry-standard simulation accuracy.',
        features: [
            'SPICE-level circuit simulation',
            'Time-domain and frequency analysis',
            'Professional schematic editor',
            'Monte Carlo and parameter sweeps',
            'Export high-quality schematics'
        ],
        pros: [
            'Professional accuracy',
            'Clean modern interface',
            'Advanced analysis tools',
            'Cloud-based projects'
        ],
        cons: [
            'Free tier has limitations',
            'Steeper learning curve',
            'Requires account'
        ],
        bestFor: 'Professional design, accurate simulations, analog circuits, and advanced analysis'
    },
    {
        id: 4,
        name: 'EasyEDA',
        url: 'https://easyeda.com/',
        icon: '🔬',
        platforms: ['Web', 'Free'],
        difficulty: 'advanced',
        description: 'Complete EDA suite with schematic capture, SPICE simulation, and PCB design. Direct PCB manufacturing integration.',
        features: [
            'Schematic editor + simulator + PCB design',
            'Mixed-signal SPICE simulation',
            'Large component library (millions)',
            'Direct JLCPCB manufacturing integration',
            'Collaborative project sharing'
        ],
        pros: [
            'All-in-one solution',
            'Free with no limits',
            'PCB manufacturing integration',
            'Active community'
        ],
        cons: [
            'Complex for beginners',
            'Chinese origin (privacy concerns)',
            'Cluttered interface'
        ],
        bestFor: 'Complete projects from design to PCB manufacturing, professional use, and collaboration'
    },
    {
        id: 5,
        name: 'LTspice',
        url: 'https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html',
        icon: '⚙️',
        platforms: ['Windows', 'Mac', 'Free'],
        difficulty: 'advanced',
        description: 'Industry-standard SPICE simulator from Analog Devices. The gold standard for analog circuit simulation.',
        features: [
            'Fast SPICE simulation engine',
            'Extensive component models',
            'Waveform viewer and analysis',
            'Thermal simulation support',
            'Completely free, no restrictions'
        ],
        pros: [
            'Industry standard',
            'Extremely fast',
            'Completely free',
            'Accurate models'
        ],
        cons: [
            'Desktop only (no web)',
            'Steep learning curve',
            'Interface feels dated',
            'Windows-focused'
        ],
        bestFor: 'Power supply design, analog circuits, professional simulations, and detailed analysis'
    },
    {
        id: 6,
        name: 'EveryCircuit',
        url: 'https://everycircuit.com/',
        icon: '🎯',
        platforms: ['Web', 'iOS', 'Android', 'Freemium'],
        difficulty: 'beginner',
        description: 'Interactive circuit simulator with stunning real-time animations. Beautiful visualizations make learning intuitive.',
        features: [
            'Real-time interactive simulation',
            'Beautiful animated visualizations',
            'Touch-optimized mobile apps',
            'Oscilloscope and multimeter tools',
            'Share and embed circuits'
        ],
        pros: [
            'Gorgeous interface',
            'Great mobile experience',
            'Intuitive and fun',
            'Excellent for learning'
        ],
        cons: [
            'Limited free tier',
            'Smaller component library',
            'No Arduino support',
            'Requires subscription for full features'
        ],
        bestFor: 'Mobile learning, visual learners, teaching electronics, and quick experiments'
    }
];

let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSimulators();
});

// Render Simulators
function renderSimulators() {
    const grid = document.getElementById('simulatorsGrid');
    grid.innerHTML = '';
    
    const filtered = filterList();
    
    filtered.forEach(sim => {
        const card = document.createElement('div');
        card.className = 'simulator-card';
        
        card.innerHTML = `
            <div class="simulator-header">
                <div class="simulator-logo">${sim.icon}</div>
                <div class="simulator-title-area">
                    <div class="simulator-name">${sim.name}</div>
                    <div class="simulator-platform">
                        ${sim.platforms.map(p => `<span class="platform-tag">${p}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="simulator-description">${sim.description}</div>
            
            <div class="features-list">
                ${sim.features.slice(0, 3).map(f => `
                    <div class="feature-item">
                        <i class="fas fa-check-circle feature-icon"></i>
                        <span class="feature-text">${f}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="pros-cons-grid">
                <div class="pros-box">
                    <div class="pros-title">✓ Pros</div>
                    <ul class="pros-list">
                        ${sim.pros.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
                <div class="cons-box">
                    <div class="cons-title">⚠ Cons</div>
                    <ul class="cons-list">
                        ${sim.cons.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="best-for-box">
                <div class="best-for-label">🎯 Best For</div>
                <div class="best-for-text">${sim.bestFor}</div>
            </div>
            
            <a href="${sim.url}" target="_blank" class="launch-btn">
                <i class="fas fa-external-link-alt"></i>
                <span>Launch ${sim.name}</span>
            </a>
        `;
        
        grid.appendChild(card);
    });
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="tool-card text-center">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 16px;"></i>
                <h3 style="color: var(--text-secondary);">No simulators match this filter</h3>
                <p style="color: var(--text-dim); margin-top: 8px;">Try a different filter option</p>
            </div>
        `;
    }
}

// Filter Simulators
function filterList() {
    if (currentFilter === 'all') {
        return simulators;
    } else if (currentFilter === 'beginner') {
        return simulators.filter(s => s.difficulty === 'beginner');
    } else if (currentFilter === 'advanced') {
        return simulators.filter(s => s.difficulty === 'advanced');
    } else if (currentFilter === 'free') {
        return simulators.filter(s => 
            s.platforms.includes('Free') && 
            !s.platforms.includes('Freemium')
        );
    }
    return simulators;
}

// Filter Simulators (Button Click)
function filterSimulators(filter) {
    currentFilter = filter;
    
    // Update buttons
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    // Re-render
    renderSimulators();
}
