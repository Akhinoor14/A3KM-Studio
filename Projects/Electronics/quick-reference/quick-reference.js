// Quick Reference - 15 Essential Electronics Formulas

const formulas = [
    // BASIC LAWS (3)
    {
        id: 1,
        category: 'basic',
        icon: '⚡',
        name: "Ohm's Law (Voltage)",
        equation: 'V = I × R',
        description: 'Voltage equals current multiplied by resistance. The fundamental relationship in electrical circuits.',
        variables: [
            { symbol: 'V', meaning: 'Voltage (Volts)' },
            { symbol: 'I', meaning: 'Current (Amperes)' },
            { symbol: 'R', meaning: 'Resistance (Ohms)' }
        ],
        example: 'If 2A flows through 10Ω: V = 2 × 10 = 20V'
    },
    {
        id: 2,
        category: 'basic',
        icon: '⚡',
        name: "Ohm's Law (Current)",
        equation: 'I = V / R',
        description: 'Current equals voltage divided by resistance. Used to find current when voltage and resistance are known.',
        variables: [
            { symbol: 'I', meaning: 'Current (Amperes)' },
            { symbol: 'V', meaning: 'Voltage (Volts)' },
            { symbol: 'R', meaning: 'Resistance (Ohms)' }
        ],
        example: 'With 12V across 6Ω: I = 12 / 6 = 2A'
    },
    {
        id: 3,
        category: 'basic',
        icon: '⚡',
        name: "Ohm's Law (Resistance)",
        equation: 'R = V / I',
        description: 'Resistance equals voltage divided by current. Calculate required resistance for a given voltage and current.',
        variables: [
            { symbol: 'R', meaning: 'Resistance (Ohms)' },
            { symbol: 'V', meaning: 'Voltage (Volts)' },
            { symbol: 'I', meaning: 'Current (Amperes)' }
        ],
        example: 'LED circuit: 5V supply, 20mA LED needs R = (5-2) / 0.02 = 150Ω'
    },

    // POWER (3)
    {
        id: 4,
        category: 'power',
        icon: '💡',
        name: 'Electrical Power (VI)',
        equation: 'P = V × I',
        description: 'Power equals voltage multiplied by current. Most direct way to calculate power consumption.',
        variables: [
            { symbol: 'P', meaning: 'Power (Watts)' },
            { symbol: 'V', meaning: 'Voltage (Volts)' },
            { symbol: 'I', meaning: 'Current (Amperes)' }
        ],
        example: '12V circuit drawing 0.5A: P = 12 × 0.5 = 6W'
    },
    {
        id: 5,
        category: 'power',
        icon: '💡',
        name: 'Electrical Power (I²R)',
        equation: 'P = I² × R',
        description: 'Power dissipated in a resistor based on current. Used to select resistor power ratings.',
        variables: [
            { symbol: 'P', meaning: 'Power (Watts)' },
            { symbol: 'I', meaning: 'Current (Amperes)' },
            { symbol: 'R', meaning: 'Resistance (Ohms)' }
        ],
        example: '100mA through 100Ω: P = 0.1² × 100 = 1W (use 2W resistor)'
    },
    {
        id: 6,
        category: 'power',
        icon: '💡',
        name: 'Electrical Power (V²/R)',
        equation: 'P = V² / R',
        description: 'Power dissipated based on voltage across resistor. Useful for voltage divider calculations.',
        variables: [
            { symbol: 'P', meaning: 'Power (Watts)' },
            { symbol: 'V', meaning: 'Voltage (Volts)' },
            { symbol: 'R', meaning: 'Resistance (Ohms)' }
        ],
        example: '5V across 25Ω: P = 5² / 25 = 1W'
    },

    // PASSIVE COMPONENTS (3)
    {
        id: 7,
        category: 'passive',
        icon: '🔋',
        name: 'RC Time Constant',
        equation: 'τ = R × C',
        description: 'Time for capacitor to charge/discharge to 63.2%. Tau (τ) determines RC circuit response speed.',
        variables: [
            { symbol: 'τ', meaning: 'Time Constant (seconds)' },
            { symbol: 'R', meaning: 'Resistance (Ohms)' },
            { symbol: 'C', meaning: 'Capacitance (Farads)' }
        ],
        example: '10kΩ with 100µF: τ = 10,000 × 0.0001 = 1 second'
    },
    {
        id: 8,
        category: 'passive',
        icon: '💡',
        name: 'LED Current Resistor',
        equation: 'R = (Vs - Vf) / I',
        description: 'Calculate current-limiting resistor for LED. Ensures LED operates at safe current.',
        variables: [
            { symbol: 'R', meaning: 'Resistor (Ohms)' },
            { symbol: 'Vs', meaning: 'Supply Voltage (V)' },
            { symbol: 'Vf', meaning: 'LED Forward Voltage (V)' },
            { symbol: 'I', meaning: 'LED Current (Amperes)' }
        ],
        example: '5V supply, red LED (2V), 20mA: R = (5-2) / 0.02 = 150Ω'
    },
    {
        id: 9,
        category: 'passive',
        icon: '🔀',
        name: 'Voltage Divider',
        equation: 'Vout = Vin × (R2 / (R1 + R2))',
        description: 'Output voltage from resistive voltage divider. Used for level shifting and sensor interfaces.',
        variables: [
            { symbol: 'Vout', meaning: 'Output Voltage (V)' },
            { symbol: 'Vin', meaning: 'Input Voltage (V)' },
            { symbol: 'R1', meaning: 'Top Resistor (Ω)' },
            { symbol: 'R2', meaning: 'Bottom Resistor (Ω)' }
        ],
        example: '12V input, R1=10kΩ, R2=10kΩ: Vout = 12 × (10/(10+10)) = 6V'
    },

    // TIMER CIRCUITS (3)
    {
        id: 10,
        category: 'timer',
        icon: '⏱️',
        name: '555 Timer (Astable Frequency)',
        equation: 'f = 1.44 / ((R1 + 2×R2) × C)',
        description: '555 timer astable mode frequency. Creates continuous square wave oscillations.',
        variables: [
            { symbol: 'f', meaning: 'Frequency (Hertz)' },
            { symbol: 'R1', meaning: 'Resistor 1 (Ohms)' },
            { symbol: 'R2', meaning: 'Resistor 2 (Ohms)' },
            { symbol: 'C', meaning: 'Capacitor (Farads)' }
        ],
        example: 'R1=10kΩ, R2=47kΩ, C=10µF: f = 1.44/((10k+94k)×10µ) ≈ 1.4Hz'
    },
    {
        id: 11,
        category: 'timer',
        icon: '⏱️',
        name: '555 Timer (Monostable Pulse)',
        equation: 'T = 1.1 × R × C',
        description: '555 timer monostable mode output pulse width. One-shot pulse duration.',
        variables: [
            { symbol: 'T', meaning: 'Pulse Duration (seconds)' },
            { symbol: 'R', meaning: 'Timing Resistor (Ohms)' },
            { symbol: 'C', meaning: 'Timing Capacitor (Farads)' }
        ],
        example: 'R=100kΩ, C=10µF: T = 1.1 × 100,000 × 0.00001 = 11 seconds'
    },
    {
        id: 12,
        category: 'timer',
        icon: '⏱️',
        name: '555 Timer (Duty Cycle)',
        equation: 'D = (R1 + R2) / (R1 + 2×R2)',
        description: 'Duty cycle percentage for 555 astable mode. Ratio of high time to total period.',
        variables: [
            { symbol: 'D', meaning: 'Duty Cycle (0-1)' },
            { symbol: 'R1', meaning: 'Resistor 1 (Ohms)' },
            { symbol: 'R2', meaning: 'Resistor 2 (Ohms)' }
        ],
        example: 'R1=10kΩ, R2=47kΩ: D = (10+47)/(10+94) ≈ 0.548 = 54.8%'
    },

    // AC CIRCUITS (3)
    {
        id: 13,
        category: 'ac',
        icon: '〰️',
        name: 'Capacitive Reactance',
        equation: 'Xc = 1 / (2π × f × C)',
        description: 'AC impedance of a capacitor. Decreases with increasing frequency.',
        variables: [
            { symbol: 'Xc', meaning: 'Capacitive Reactance (Ω)' },
            { symbol: 'f', meaning: 'Frequency (Hertz)' },
            { symbol: 'C', meaning: 'Capacitance (Farads)' }
        ],
        example: '100Hz, 10µF: Xc = 1/(2π×100×0.00001) ≈ 159Ω'
    },
    {
        id: 14,
        category: 'ac',
        icon: '〰️',
        name: 'Inductive Reactance',
        equation: 'XL = 2π × f × L',
        description: 'AC impedance of an inductor. Increases with increasing frequency.',
        variables: [
            { symbol: 'XL', meaning: 'Inductive Reactance (Ω)' },
            { symbol: 'f', meaning: 'Frequency (Hertz)' },
            { symbol: 'L', meaning: 'Inductance (Henrys)' }
        ],
        example: '1kHz, 10mH: XL = 2π × 1000 × 0.01 ≈ 62.8Ω'
    },
    {
        id: 15,
        category: 'ac',
        icon: '〰️',
        name: 'RMS Voltage',
        equation: 'Vrms = Vpeak / √2',
        description: 'Root Mean Square voltage from peak voltage. Effective AC voltage equivalent to DC.',
        variables: [
            { symbol: 'Vrms', meaning: 'RMS Voltage (V)' },
            { symbol: 'Vpeak', meaning: 'Peak Voltage (V)' }
        ],
        example: '170V peak (US mains): Vrms = 170 / 1.414 ≈ 120V'
    }
];

let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderFormulas();
});

// Render Formulas
function renderFormulas() {
    const grid = document.getElementById('formulaGrid');
    grid.innerHTML = '';
    
    const filtered = currentFilter === 'all' ? 
        formulas : 
        formulas.filter(f => f.category === currentFilter);
    
    filtered.forEach(formula => {
        const card = document.createElement('div');
        card.className = 'formula-card';
        card.dataset.id = formula.id;
        card.onclick = () => toggleCard(formula.id);
        
        card.innerHTML = `
            <div class="formula-header">
                <div class="formula-icon">${formula.icon}</div>
                <div class="formula-title-area">
                    <div class="formula-name">${formula.name}</div>
                    <div class="formula-category">${formula.category}</div>
                </div>
                <div class="formula-expand-icon">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            <div class="formula-details">
                <div class="formula-equation">
                    <div class="formula-math">${formula.equation}</div>
                </div>
                <div class="formula-description">${formula.description}</div>
                <div class="formula-variables">
                    ${formula.variables.map(v => `
                        <div class="variable-row">
                            <span class="variable-symbol">${v.symbol}</span>
                            <span class="variable-meaning">${v.meaning}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="formula-example">
                    <div class="example-label">💡 Example</div>
                    <div class="example-text">${formula.example}</div>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Toggle Card Expansion
function toggleCard(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    card.classList.toggle('expanded');
}

// Filter by Category
function filterByCategory(category) {
    currentFilter = category;
    
    // Update buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Re-render
    renderFormulas();
}
