// Quick Reference - 15 Essential Electronics Formulas

// Helper function to format equations with proper mathematical notation
function formatEquation(equation, formulaId) {
    // Convert equations to proper HTML with mathematical notation
    const formattedEquations = {
        'V = I × R': '<span class="math-variable">V</span><span class="math-equals">=</span><span class="math-variable">I</span><span class="math-multiply">×</span><span class="math-variable">R</span>',
        'I = V / R': '<span class="math-variable">I</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V</span><span class="math-denominator">R</span></span>',
        'R = V / I': '<span class="math-variable">R</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V</span><span class="math-denominator">I</span></span>',
        'P = V × I': '<span class="math-variable">P</span><span class="math-equals">=</span><span class="math-variable">V</span><span class="math-multiply">×</span><span class="math-variable">I</span>',
        'P = I² × R': '<span class="math-variable">P</span><span class="math-equals">=</span><span class="math-variable">I<span class="math-power">2</span></span><span class="math-multiply">×</span><span class="math-variable">R</span>',
        'P = V² / R': '<span class="math-variable">P</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V<span class="math-power">2</span></span><span class="math-denominator">R</span></span>',
        'τ = R × C': '<span class="math-variable">τ</span><span class="math-equals">=</span><span class="math-variable">R</span><span class="math-multiply">×</span><span class="math-variable">C</span>',
        'Xc = 1 / (2π × f × C)': '<span class="math-variable">X<span class="math-subscript">C</span></span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">1</span><span class="math-denominator">2π × f × C</span></span>',
        'Z = √(R² + X²)': '<span class="math-variable">Z</span><span class="math-equals">=</span><span class="math-highlight">√(R<span class="math-power">2</span> + X<span class="math-power">2</span>)</span>',
        'f = 1.44 / ((R1 + 2×R2) × C)': '<span class="math-variable">f</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">1.44</span><span class="math-denominator">(R<span class="math-subscript">1</span> + 2R<span class="math-subscript">2</span>) × C</span></span>',
        'DC = R2 / (R1 + R2)': '<span class="math-variable">DC</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">R<span class="math-subscript">2</span></span><span class="math-denominator">R<span class="math-subscript">1</span> + R<span class="math-subscript">2</span></span></span>',
        'Gain = -Rf / Rin': '<span class="math-variable">Gain</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">-R<span class="math-subscript">f</span></span><span class="math-denominator">R<span class="math-subscript">in</span></span></span>',
        'fc = 1 / (2π × R × C)': '<span class="math-variable">f<span class="math-subscript">c</span></span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">1</span><span class="math-denominator">2π × R × C</span></span>',
        'XL = 2π × f × L': '<span class="math-variable">X<span class="math-subscript">L</span></span><span class="math-equals">=</span><span class="math-variable">2π</span><span class="math-multiply">×</span><span class="math-variable">f</span><span class="math-multiply">×</span><span class="math-variable">L</span>',
        'Vrms = Vpeak / √2': '<span class="math-variable">V<span class="math-subscript">rms</span></span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V<span class="math-subscript">peak</span></span><span class="math-denominator">√2</span></span>',
        'Vout = Vin × (R2 / (R1 + R2))': '<span class="math-variable">V<span class="math-subscript">out</span></span><span class="math-equals">=</span><span class="math-variable">V<span class="math-subscript">in</span></span><span class="math-multiply">×</span><span class="math-fraction"><span class="math-numerator">R<span class="math-subscript">2</span></span><span class="math-denominator">R<span class="math-subscript">1</span> + R<span class="math-subscript">2</span></span></span>',
        'I1 = Itotal × (R2 / (R1 + R2))': '<span class="math-variable">I<span class="math-subscript">1</span></span><span class="math-equals">=</span><span class="math-variable">I<span class="math-subscript">total</span></span><span class="math-multiply">×</span><span class="math-fraction"><span class="math-numerator">R<span class="math-subscript">2</span></span><span class="math-denominator">R<span class="math-subscript">1</span> + R<span class="math-subscript">2</span></span></span>',
        '1/Rtotal = 1/R1 + 1/R2': '<span class="math-fraction"><span class="math-numerator">1</span><span class="math-denominator">R<span class="math-subscript">total</span></span></span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">1</span><span class="math-denominator">R<span class="math-subscript">1</span></span></span><span class="math-multiply">+</span><span class="math-fraction"><span class="math-numerator">1</span><span class="math-denominator">R<span class="math-subscript">2</span></span></span>',
        'Ib = (Vin - Vbe) / Rb': '<span class="math-variable">I<span class="math-subscript">b</span></span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V<span class="math-subscript">in</span> - V<span class="math-subscript">be</span></span><span class="math-denominator">R<span class="math-subscript">b</span></span></span>',
        'Ic = β × Ib': '<span class="math-variable">I<span class="math-subscript">c</span></span><span class="math-equals">=</span><span class="math-variable">β</span><span class="math-multiply">×</span><span class="math-variable">I<span class="math-subscript">b</span></span>',
        'Gain = 1 + (Rf / Rin)': '<span class="math-variable">Gain</span><span class="math-equals">=</span><span class="math-variable">1</span><span class="math-multiply">+</span><span class="math-fraction"><span class="math-numerator">R<span class="math-subscript">f</span></span><span class="math-denominator">R<span class="math-subscript">in</span></span></span>',
        'Av = -Rc / Re': '<span class="math-variable">A<span class="math-subscript">v</span></span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">-R<span class="math-subscript">c</span></span><span class="math-denominator">R<span class="math-subscript">e</span></span></span>',
        'R = (Vcc - Vol) / Iol': '<span class="math-variable">R</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V<span class="math-subscript">cc</span> - V<span class="math-subscript">ol</span></span><span class="math-denominator">I<span class="math-subscript">ol</span></span></span>',
        'f = 1 / T': '<span class="math-variable">f</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">1</span><span class="math-denominator">T</span></span>',
        'Baud = Bits / Second': '<span class="math-variable">Baud</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">Bits</span><span class="math-denominator">Second</span></span>',
        'R = R0 × e^(β × (1/T - 1/T0))': '<span class="math-variable">R</span><span class="math-equals">=</span><span class="math-variable">R<span class="math-subscript">0</span></span><span class="math-multiply">×</span><span class="math-variable">e<span class="math-power">β(1/T - 1/T₀)</span></span>',
        'LSB = Vref / (2^n)': '<span class="math-variable">LSB</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V<span class="math-subscript">ref</span></span><span class="math-denominator">2<span class="math-power">n</span></span></span>',
        'V = (ADC_value / ADC_max) × Vref': '<span class="math-variable">V</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">ADC<span class="math-subscript">value</span></span><span class="math-denominator">ADC<span class="math-subscript">max</span></span></span><span class="math-multiply">×</span><span class="math-variable">V<span class="math-subscript">ref</span></span>',
        'Runtime = Capacity / Current': '<span class="math-variable">Runtime</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">Capacity</span><span class="math-denominator">Current</span></span>',
        'Energy = Voltage × Capacity': '<span class="math-variable">Energy</span><span class="math-equals">=</span><span class="math-variable">Voltage</span><span class="math-multiply">×</span><span class="math-variable">Capacity</span>',
        'Efficiency = (Pout / Pin) × 100%': '<span class="math-variable">η</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">P<span class="math-subscript">out</span></span><span class="math-denominator">P<span class="math-subscript">in</span></span></span><span class="math-multiply">×</span><span class="math-variable">100%</span>',
        'R = (Vs - Vf) / If': '<span class="math-variable">R</span><span class="math-equals">=</span><span class="math-fraction"><span class="math-numerator">V<span class="math-subscript">s</span> - V<span class="math-subscript">f</span></span><span class="math-denominator">I<span class="math-subscript">f</span></span></span>',
        'P = Vf × If': '<span class="math-variable">P</span><span class="math-equals">=</span><span class="math-variable">V<span class="math-subscript">f</span></span><span class="math-multiply">×</span><span class="math-variable">I<span class="math-subscript">f</span></span>'
    };
    
    return formattedEquations[equation] || equation;
}

// Add breakdown steps for key formulas
function getFormulaBreakdown(formulaId) {
    const breakdowns = {
        2: { // I = V / R
            title: '📊 Formula Breakdown',
            steps: [
                'Divide voltage by resistance',
                'Higher voltage = more current',
                'Higher resistance = less current',
                'Result in Amperes (A)'
            ]
        },
        3: { // R = V / I
            title: '📊 Formula Breakdown',
            steps: [
                'Divide voltage by current',
                'Essential for LED resistor calculations',
                'Result in Ohms (Ω)',
                'Safety: Always round UP for resistor value'
            ]
        },
        5: { // P = I² × R
            title: '📊 Formula Breakdown',
            steps: [
                'Square the current first',
                'Multiply by resistance',
                'Critical for resistor power rating',
                'Use resistor rated 2× calculated power'
            ]
        },
        6: { // P = V² / R
            title: '📊 Formula Breakdown',
            steps: [
                'Square the voltage',
                'Divide by resistance',
                'Used in voltage divider power calculations',
                'Ensure resistor can handle dissipation'
            ]
        },
        16: { // Voltage Divider
            title: '📊 Formula Breakdown',
            steps: [
                'Calculate total resistance (R1 + R2)',
                'Find fraction: R2 / total',
                'Multiply by input voltage',
                'Output voltage is proportional to R2'
            ]
        },
        18: { // Parallel Resistance
            title: '📊 Formula Breakdown',
            steps: [
                'Add reciprocals: 1/R1 + 1/R2',
                'Take reciprocal of result',
                'For 2 equal resistors: R/2',
                'Parallel always < smallest resistor'
            ]
        },
        19: { // Transistor Base Current
            title: '📊 Formula Breakdown',
            steps: [
                'Subtract Vbe from input voltage',
                'Divide by base resistor',
                'Typical Vbe: 0.6-0.7V (silicon)',
                'Result in mA (milliamps) typically'
            ]
        },
        20: { // Transistor Ic
            title: '📊 Formula Breakdown',
            steps: [
                'Find β from transistor datasheet',
                'Multiply β by base current',
                'Typical β: 100-300',
                'Ensure Ic < max collector current'
            ]
        },
        27: { // ADC Resolution
            title: '📊 Formula Breakdown',
            steps: [
                'Calculate 2^n (2 to power of bits)',
                'Divide Vref by this value',
                'Result is voltage per count',
                '10-bit: 1024 steps, 12-bit: 4096 steps'
            ]
        },
        29: { // Battery Runtime
            title: '📊 Formula Breakdown',
            steps: [
                'Divide battery mAh by load mA',
                'Result is runtime in hours',
                'Actual runtime ≈ 80% of calculated',
                'Account for battery aging/temperature'
            ]
        },
        32: { // LED Resistor
            title: '📊 Formula Breakdown',
            steps: [
                'Subtract LED Vf from supply voltage',
                'Divide by desired LED current',
                'Round UP to nearest standard value',
                'Check resistor power rating'
            ]
        }
    };
    
    return breakdowns[formulaId] || null;
}

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
    },

    // VOLTAGE DIVIDERS (3)
    {
        id: 16,
        category: 'dividers',
        icon: '🔌',
        name: 'Voltage Divider Output',
        equation: 'Vout = Vin × (R2 / (R1 + R2))',
        description: 'Calculate output voltage from resistive voltage divider. Essential for sensor circuits and reference voltages.',
        variables: [
            { symbol: 'Vout', meaning: 'Output Voltage (V)' },
            { symbol: 'Vin', meaning: 'Input Voltage (V)' },
            { symbol: 'R1', meaning: 'Top Resistor (Ω)' },
            { symbol: 'R2', meaning: 'Bottom Resistor (Ω)' }
        ],
        example: '12V input, R1=10kΩ, R2=10kΩ: Vout = 12 × (10k/(10k+10k)) = 6V'
    },
    {
        id: 17,
        category: 'dividers',
        icon: '🔌',
        name: 'Current Divider',
        equation: 'I1 = Itotal × (R2 / (R1 + R2))',
        description: 'Calculate current through parallel resistor branch. Current divides inversely proportional to resistance.',
        variables: [
            { symbol: 'I1', meaning: 'Current through R1 (A)' },
            { symbol: 'Itotal', meaning: 'Total Current (A)' },
            { symbol: 'R1', meaning: 'Resistor 1 (Ω)' },
            { symbol: 'R2', meaning: 'Resistor 2 (Ω)' }
        ],
        example: '1A total, R1=100Ω, R2=100Ω: I1 = 1 × (100/200) = 0.5A'
    },
    {
        id: 18,
        category: 'dividers',
        icon: '🔌',
        name: 'Parallel Resistance',
        equation: '1/Rtotal = 1/R1 + 1/R2',
        description: 'Total resistance of parallel resistors. Parallel resistance is always less than smallest individual resistor.',
        variables: [
            { symbol: 'Rtotal', meaning: 'Total Resistance (Ω)' },
            { symbol: 'R1', meaning: 'Resistor 1 (Ω)' },
            { symbol: 'R2', meaning: 'Resistor 2 (Ω)' }
        ],
        example: 'Two 100Ω resistors in parallel: 1/R = 1/100 + 1/100, R = 50Ω'
    },

    // TRANSISTOR & AMPLIFIERS (4)
    {
        id: 19,
        category: 'transistor',
        icon: '🔺',
        name: 'Transistor Base Current',
        equation: 'Ib = (Vin - Vbe) / Rb',
        description: 'Calculate base current for BJT transistor. Vbe typically 0.6-0.7V for silicon transistors.',
        variables: [
            { symbol: 'Ib', meaning: 'Base Current (A)' },
            { symbol: 'Vin', meaning: 'Input Voltage (V)' },
            { symbol: 'Vbe', meaning: 'Base-Emitter Voltage (V)' },
            { symbol: 'Rb', meaning: 'Base Resistor (Ω)' }
        ],
        example: '5V input, Vbe=0.7V, Rb=10kΩ: Ib = (5-0.7)/10000 = 0.43mA'
    },
    {
        id: 20,
        category: 'transistor',
        icon: '🔺',
        name: 'Transistor Collector Current',
        equation: 'Ic = β × Ib',
        description: 'Collector current from base current and transistor gain (hFE/β). Typically β = 100-300.',
        variables: [
            { symbol: 'Ic', meaning: 'Collector Current (A)' },
            { symbol: 'β', meaning: 'Current Gain (hFE)' },
            { symbol: 'Ib', meaning: 'Base Current (A)' }
        ],
        example: 'Ib=0.43mA, β=100: Ic = 100 × 0.00043 = 43mA'
    },
    {
        id: 21,
        category: 'transistor',
        icon: '🔺',
        name: 'Non-Inverting Op-Amp Gain',
        equation: 'Gain = 1 + (Rf / Rin)',
        description: 'Voltage gain of non-inverting op-amp configuration. Always ≥1, in-phase output.',
        variables: [
            { symbol: 'Gain', meaning: 'Voltage Gain (V/V)' },
            { symbol: 'Rf', meaning: 'Feedback Resistor (Ω)' },
            { symbol: 'Rin', meaning: 'Input Resistor (Ω)' }
        ],
        example: 'Rf=10kΩ, Rin=1kΩ: Gain = 1 + (10k/1k) = 11 (20.8dB)'
    },
    {
        id: 22,
        category: 'transistor',
        icon: '🔺',
        name: 'Common Emitter Gain',
        equation: 'Av = -Rc / Re',
        description: 'Voltage gain of common emitter amplifier. Negative sign indicates phase inversion.',
        variables: [
            { symbol: 'Av', meaning: 'Voltage Gain (V/V)' },
            { symbol: 'Rc', meaning: 'Collector Resistor (Ω)' },
            { symbol: 'Re', meaning: 'Emitter Resistor (Ω)' }
        ],
        example: 'Rc=4.7kΩ, Re=470Ω: Av = -4700/470 = -10 (inverted)'
    },

    // DIGITAL & LOGIC (3)
    {
        id: 23,
        category: 'digital',
        icon: '💾',
        name: 'Pull-up/Pull-down Resistor',
        equation: 'R = (Vcc - Vol) / Iol',
        description: 'Calculate pull-up resistor value. Typically 1kΩ-10kΩ for most applications.',
        variables: [
            { symbol: 'R', meaning: 'Resistor Value (Ω)' },
            { symbol: 'Vcc', meaning: 'Supply Voltage (V)' },
            { symbol: 'Vol', meaning: 'Output Low Voltage (V)' },
            { symbol: 'Iol', meaning: 'Output Low Current (A)' }
        ],
        example: '5V logic, Vol=0.4V, Iol=2mA: R = (5-0.4)/0.002 = 2.3kΩ → use 2.2kΩ'
    },
    {
        id: 24,
        category: 'digital',
        icon: '💾',
        name: 'Clock Frequency',
        equation: 'f = 1 / T',
        description: 'Frequency from period. Essential for timing calculations and clock generation.',
        variables: [
            { symbol: 'f', meaning: 'Frequency (Hz)' },
            { symbol: 'T', meaning: 'Period (seconds)' }
        ],
        example: '1ms period: f = 1 / 0.001 = 1000Hz = 1kHz'
    },
    {
        id: 25,
        category: 'digital',
        icon: '💾',
        name: 'Data Rate (Baud)',
        equation: 'Baud = Bits / Second',
        description: 'Serial communication speed. Common rates: 9600, 19200, 38400, 57600, 115200 baud.',
        variables: [
            { symbol: 'Baud', meaning: 'Symbols per second' },
            { symbol: 'Bits', meaning: 'Number of bits' },
            { symbol: 'Second', meaning: 'Time period (s)' }
        ],
        example: '115200 baud = 115200 bits/sec ≈ 14.4 KB/s'
    },

    // SENSORS & MEASUREMENTS (3)
    {
        id: 26,
        category: 'sensors',
        icon: '📡',
        name: 'Thermistor Temperature (Simplified)',
        equation: 'R = R0 × e^(β × (1/T - 1/T0))',
        description: 'NTC thermistor resistance vs temperature. β typically 3000-4000K for common thermistors.',
        variables: [
            { symbol: 'R', meaning: 'Resistance at T (Ω)' },
            { symbol: 'R0', meaning: 'Resistance at T0 (Ω)' },
            { symbol: 'β', meaning: 'Beta coefficient (K)' },
            { symbol: 'T', meaning: 'Temperature (Kelvin)' }
        ],
        example: 'R0=10kΩ@25°C, β=3950K, measure R to find temperature'
    },
    {
        id: 27,
        category: 'sensors',
        icon: '📡',
        name: 'ADC Resolution',
        equation: 'LSB = Vref / (2^n)',
        description: 'Least Significant Bit voltage for ADC. Smaller LSB = better resolution.',
        variables: [
            { symbol: 'LSB', meaning: 'Voltage per bit (V)' },
            { symbol: 'Vref', meaning: 'Reference Voltage (V)' },
            { symbol: 'n', meaning: 'Number of bits' }
        ],
        example: '10-bit ADC, 5V ref: LSB = 5 / 1024 = 4.88mV per count'
    },
    {
        id: 28,
        category: 'sensors',
        icon: '📡',
        name: 'Voltage from ADC Reading',
        equation: 'V = (ADC_value / ADC_max) × Vref',
        description: 'Convert ADC digital reading to actual voltage. Essential for all analog sensor readings.',
        variables: [
            { symbol: 'V', meaning: 'Measured Voltage (V)' },
            { symbol: 'ADC_value', meaning: 'Digital reading' },
            { symbol: 'ADC_max', meaning: 'Maximum ADC value' },
            { symbol: 'Vref', meaning: 'Reference Voltage (V)' }
        ],
        example: '10-bit ADC reads 512: V = (512/1023) × 5V = 2.5V'
    },

    // ENERGY & BATTERY (3)
    {
        id: 29,
        category: 'energy',
        icon: '🔋',
        name: 'Battery Capacity (mAh)',
        equation: 'Runtime = Capacity / Current',
        description: 'Calculate battery runtime from capacity and load current. Consider 80% usable capacity.',
        variables: [
            { symbol: 'Runtime', meaning: 'Operating time (hours)' },
            { symbol: 'Capacity', meaning: 'Battery capacity (mAh)' },
            { symbol: 'Current', meaning: 'Load current (mA)' }
        ],
        example: '2000mAh battery, 100mA load: Runtime = 2000/100 = 20 hours'
    },
    {
        id: 30,
        category: 'energy',
        icon: '🔋',
        name: 'Battery Energy (Wh)',
        equation: 'Energy = Voltage × Capacity',
        description: 'Energy storage in Watt-hours. Convert mAh to Ah before calculating.',
        variables: [
            { symbol: 'Energy', meaning: 'Energy storage (Wh)' },
            { symbol: 'Voltage', meaning: 'Nominal voltage (V)' },
            { symbol: 'Capacity', meaning: 'Capacity (Ah)' }
        ],
        example: '3.7V 2000mAh LiPo: Energy = 3.7 × 2 = 7.4Wh'
    },
    {
        id: 31,
        category: 'energy',
        icon: '🔋',
        name: 'Efficiency',
        equation: 'Efficiency = (Pout / Pin) × 100%',
        description: 'Power conversion efficiency percentage. Always less than 100% due to losses.',
        variables: [
            { symbol: 'Efficiency', meaning: 'Efficiency percentage (%)' },
            { symbol: 'Pout', meaning: 'Output Power (W)' },
            { symbol: 'Pin', meaning: 'Input Power (W)' }
        ],
        example: 'Regulator: 5V@1A out, 12V@0.5A in: η = (5/6) × 100 = 83.3%'
    },

    // LED & LIGHTING (2)
    {
        id: 32,
        category: 'led',
        icon: '💡',
        name: 'LED Series Resistor',
        equation: 'R = (Vs - Vf) / If',
        description: 'Calculate current-limiting resistor for LED. Most common electronics calculation.',
        variables: [
            { symbol: 'R', meaning: 'Resistor value (Ω)' },
            { symbol: 'Vs', meaning: 'Supply voltage (V)' },
            { symbol: 'Vf', meaning: 'LED forward voltage (V)' },
            { symbol: 'If', meaning: 'LED forward current (A)' }
        ],
        example: 'Red LED (2V, 20mA) on 5V: R = (5-2)/0.02 = 150Ω'
    },
    {
        id: 33,
        category: 'led',
        icon: '💡',
        name: 'LED Power Dissipation',
        equation: 'P = Vf × If',
        description: 'Power consumed by LED. Typical 5mm LEDs: 50-100mW, High-power: 1-3W+.',
        variables: [
            { symbol: 'P', meaning: 'Power (Watts)' },
            { symbol: 'Vf', meaning: 'Forward voltage (V)' },
            { symbol: 'If', meaning: 'Forward current (A)' }
        ],
        example: 'White LED: 3.2V × 0.02A = 0.064W = 64mW'
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
        
        const breakdown = getFormulaBreakdown(formula.id);
        const breakdownHTML = breakdown ? `
            <div class="formula-breakdown">
                <div class="breakdown-title">${breakdown.title}</div>
                ${breakdown.steps.map((step, idx) => `
                    <div class="breakdown-step">
                        <span class="step-num">${idx + 1}</span>
                        <span class="step-text">${step}</span>
                    </div>
                `).join('')}
            </div>
        ` : '';
        
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
                    <div class="formula-math">${formatEquation(formula.equation, formula.id)}</div>
                </div>
                ${breakdownHTML}
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
