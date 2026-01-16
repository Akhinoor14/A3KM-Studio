// LED Current Calculator
// Data Source: Averaged from Vishay, Cree, OSRAM, Nichia datasheets

const ledTypes = {
    red: {
        name: 'Red',
        voltage: 2.0,
        color: '#FF0000',
        typical: '1.8-2.2V'
    },
    green: {
        name: 'Green',
        voltage: 2.1,
        color: '#00FF00',
        typical: '1.9-2.3V'
    },
    yellow: {
        name: 'Yellow',
        voltage: 2.1,
        color: '#FFD700',
        typical: '2.0-2.2V'
    },
    blue: {
        name: 'Blue',
        voltage: 3.2,
        color: '#0080FF',
        typical: '3.0-3.4V'
    },
    white: {
        name: 'White',
        voltage: 3.3,
        color: '#FFFFFF',
        typical: '3.0-3.6V'
    },
    uv: {
        name: 'UV',
        voltage: 3.5,
        color: '#9D00FF',
        typical: '3.2-3.8V'
    },
    infrared: {
        name: 'Infrared',
        voltage: 1.5,
        color: '#800000',
        typical: '1.2-1.8V'
    },
    amber: {
        name: 'Amber',
        voltage: 2.1,
        color: '#FFBF00',
        typical: '2.0-2.2V'
    },
    pink: {
        name: 'Pink',
        voltage: 3.3,
        color: '#FF69B4',
        typical: '3.0-3.6V'
    }
};

const powerRatings = [
    { watts: 0.125, label: '1/8W' },
    { watts: 0.25, label: '1/4W' },
    { watts: 0.5, label: '1/2W' },
    { watts: 1, label: '1W' }
];

let selectedLED = 'red';
let currentConfig = 'single';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateLEDTypes();
    updateConfigInputs();
    updateLEDVisual('red');
});

// Generate LED Type Buttons
function generateLEDTypes() {
    const grid = document.getElementById('ledTypeGrid');
    grid.innerHTML = '';
    
    Object.entries(ledTypes).forEach(([key, led]) => {
        const btn = document.createElement('div');
        btn.className = 'led-type-btn' + (key === 'red' ? ' selected' : '');
        btn.onclick = () => selectLEDType(key);
        
        btn.innerHTML = `
            <div class="led-color-dot" style="background: ${led.color}; color: ${led.color};"></div>
            <div class="led-type-label">${led.name}</div>
            <div class="led-type-voltage">${led.typical}</div>
        `;
        
        grid.appendChild(btn);
    });
}

// Select LED Type
function selectLEDType(type) {
    selectedLED = type;
    
    // Update UI
    document.querySelectorAll('.led-type-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.closest('.led-type-btn').classList.add('selected');
    
    // Update visual
    updateLEDVisual(type);
    
    // Clear result
    document.getElementById('ledResult').innerHTML = '';
}

// Update LED Visual
function updateLEDVisual(type) {
    const led = ledTypes[type];
    const ledBody = document.getElementById('ledBody');
    const ledGlow = document.getElementById('ledGlow');
    
    ledBody.style.background = `linear-gradient(135deg, ${led.color} 0%, color-mix(in srgb, ${led.color} 70%, black) 100%)`;
    ledGlow.style.background = `radial-gradient(circle, ${led.color} 0%, transparent 70%)`;
}

// Select Configuration
function selectConfig(config) {
    currentConfig = config;
    
    // Update UI
    document.querySelectorAll('.config-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.closest('.config-btn').classList.add('selected');
    
    // Update inputs
    updateConfigInputs();
    
    // Clear result
    document.getElementById('ledResult').innerHTML = '';
}

// Update Configuration Inputs
function updateConfigInputs() {
    const container = document.getElementById('configInputs');
    
    if (currentConfig === 'single') {
        container.innerHTML = '';
    } else if (currentConfig === 'series') {
        container.innerHTML = `
            <div class="form-group">
                <label class="form-label">Number of LEDs in Series</label>
                <input type="number" id="numLEDs" class="form-input" placeholder="e.g., 2, 3, 4" step="1" min="1" value="2">
            </div>
        `;
    } else if (currentConfig === 'parallel') {
        container.innerHTML = `
            <div class="form-group">
                <label class="form-label">Number of LEDs in Parallel</label>
                <input type="number" id="numLEDs" class="form-input" placeholder="e.g., 2, 3, 4" step="1" min="1" value="2">
                <p class="text-small text-dim" style="margin-top: 6px;">⚠️ Each LED needs its own resistor in parallel configuration</p>
            </div>
        `;
    }
}

// Calculate LED Resistor
function calculateLED() {
    const resultDiv = document.getElementById('ledResult');
    const supplyVoltage = parseFloat(document.getElementById('supplyVoltage').value);
    const ledCurrent = parseFloat(document.getElementById('ledCurrent').value);
    const led = ledTypes[selectedLED];
    
    // Validation
    if (!supplyVoltage || supplyVoltage <= 0) {
        showError(resultDiv, 'Invalid Supply Voltage', 'Please enter a valid supply voltage greater than 0V');
        return;
    }
    
    if (!ledCurrent || ledCurrent <= 0) {
        showError(resultDiv, 'Invalid Current', 'Please enter a valid LED current greater than 0mA');
        return;
    }
    
    // Get number of LEDs for series/parallel
    let numLEDs = 1;
    if (currentConfig !== 'single') {
        numLEDs = parseInt(document.getElementById('numLEDs').value) || 1;
        if (numLEDs < 1) {
            showError(resultDiv, 'Invalid LED Count', 'Number of LEDs must be at least 1');
            return;
        }
    }
    
    // Calculate based on configuration
    let voltageDrop, totalCurrent, resistorValue;
    
    if (currentConfig === 'single') {
        voltageDrop = supplyVoltage - led.voltage;
        totalCurrent = ledCurrent / 1000; // Convert mA to A
        
        if (voltageDrop <= 0) {
            showError(resultDiv, 'Insufficient Voltage', 
                `Supply voltage (${supplyVoltage}V) must be greater than LED forward voltage (${led.voltage}V)`);
            return;
        }
        
        resistorValue = voltageDrop / totalCurrent;
        
    } else if (currentConfig === 'series') {
        const totalLEDVoltage = led.voltage * numLEDs;
        voltageDrop = supplyVoltage - totalLEDVoltage;
        totalCurrent = ledCurrent / 1000;
        
        if (voltageDrop <= 0) {
            showError(resultDiv, 'Insufficient Voltage', 
                `Supply voltage (${supplyVoltage}V) must be greater than total LED voltage (${totalLEDVoltage.toFixed(1)}V = ${numLEDs} × ${led.voltage}V)`);
            return;
        }
        
        resistorValue = voltageDrop / totalCurrent;
        
    } else { // parallel
        voltageDrop = supplyVoltage - led.voltage;
        totalCurrent = (ledCurrent / 1000) * numLEDs;
        
        if (voltageDrop <= 0) {
            showError(resultDiv, 'Insufficient Voltage', 
                `Supply voltage (${supplyVoltage}V) must be greater than LED forward voltage (${led.voltage}V)`);
            return;
        }
        
        // For parallel, calculate per-LED resistor
        resistorValue = voltageDrop / (ledCurrent / 1000);
    }
    
    // Find standard resistor value (E12 series)
    const standardValue = findStandardResistor(resistorValue);
    
    // Calculate actual current with standard resistor
    const actualCurrent = (voltageDrop / standardValue) * 1000; // in mA
    
    // Calculate power dissipation
    const powerDissipation = (voltageDrop * voltageDrop) / standardValue;
    
    // Determine recommended power rating
    const recommendedPower = findPowerRating(powerDissipation);
    
    // Update visual
    document.getElementById('resistorLabel').textContent = standardValue.toFixed(0) + ' Ω';
    
    // Display result
    let resultHTML = `
        <div class="result-box">
            <div class="result-title">✓ Calculated Resistor Value</div>
            <div class="result-value">${standardValue.toFixed(0)} Ω</div>
            <div class="result-details">
                <strong>Configuration:</strong> ${currentConfig.charAt(0).toUpperCase() + currentConfig.slice(1)}
                ${currentConfig !== 'single' ? `<br><strong>Number of LEDs:</strong> ${numLEDs}` : ''}
                <br><strong>Calculated:</strong> ${resistorValue.toFixed(1)} Ω (closest standard: ${standardValue} Ω)
                <br><strong>LED Type:</strong> ${led.name} (${led.voltage}V forward voltage)
                <br><strong>Actual Current:</strong> ${actualCurrent.toFixed(1)} mA
                ${currentConfig === 'parallel' ? `<br><strong>Total Current:</strong> ${(actualCurrent * numLEDs).toFixed(1)} mA` : ''}
                <br><strong>Power Dissipation:</strong> ${(powerDissipation * 1000).toFixed(0)} mW
                ${currentConfig === 'parallel' ? `<br><br>⚠️ <strong>Important:</strong> Use one ${standardValue}Ω resistor for EACH LED` : ''}
            </div>
        </div>
        
        <div class="tool-card" style="margin-top: 16px;">
            <div class="form-label">Recommended Power Rating</div>
            <div class="power-rating-display">
    `;
    
    powerRatings.forEach(rating => {
        const isRecommended = rating.watts === recommendedPower;
        const status = powerDissipation <= rating.watts ? '✓ Safe' : '⚠️ Too low';
        
        resultHTML += `
            <div class="power-option ${isRecommended ? 'recommended' : ''}">
                <div class="power-value">${rating.label}</div>
                <div class="power-status">${isRecommended ? '✓ Use This' : status}</div>
            </div>
        `;
    });
    
    resultHTML += `
            </div>
            <p class="text-small text-dim" style="margin-top: 12px;">
                ${recommendedPower === 0.125 ? '1/8W resistors are suitable for low-current applications' : ''}
                ${recommendedPower === 0.25 ? '1/4W resistors are most common for LEDs' : ''}
                ${recommendedPower === 0.5 ? '1/2W resistors recommended for higher current' : ''}
                ${recommendedPower === 1 ? '1W resistors needed for high-power applications' : ''}
            </p>
        </div>
    `;
    
    resultDiv.innerHTML = resultHTML;
}

// Find standard resistor value (E12 series)
function findStandardResistor(value) {
    const e12Series = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
    
    // Find appropriate magnitude
    let magnitude = 1;
    let normalized = value;
    
    while (normalized >= 10) {
        normalized /= 10;
        magnitude *= 10;
    }
    
    while (normalized < 1) {
        normalized *= 10;
        magnitude /= 10;
    }
    
    // Find closest E12 value
    let closest = e12Series[0];
    let minDiff = Math.abs(normalized - closest);
    
    e12Series.forEach(val => {
        const diff = Math.abs(normalized - val);
        if (diff < minDiff) {
            minDiff = diff;
            closest = val;
        }
    });
    
    return closest * magnitude;
}

// Find appropriate power rating
function findPowerRating(powerDissipation) {
    // Use 2x safety margin
    const requiredPower = powerDissipation * 2;
    
    for (const rating of powerRatings) {
        if (rating.watts >= requiredPower) {
            return rating.watts;
        }
    }
    
    return 1; // Default to 1W if all else fails
}

// Show error
function showError(container, title, message) {
    container.innerHTML = `
        <div class="result-box error">
            <div class="result-title">⚠️ ${title}</div>
            <div class="result-value">Cannot Calculate</div>
            <div class="result-details">${message}</div>
        </div>
    `;
}
