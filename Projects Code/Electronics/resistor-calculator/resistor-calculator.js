// Resistor Color Calculator - IEC 60062:2016 Standard
// Data Source: International Electrotechnical Commission

const colorData = {
    // Digit values (Band 1, 2, 3)
    digits: {
        black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
        green: 5, blue: 6, violet: 7, grey: 8, white: 9
    },
    // Multiplier values (Band 3/4)
    multipliers: {
        black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000,
        green: 100000, blue: 1000000, violet: 10000000, grey: 100000000,
        gold: 0.1, silver: 0.01
    },
    // Tolerance values (Band 4/5)
    tolerances: {
        brown: 1, red: 2, green: 0.5, blue: 0.25, violet: 0.1,
        grey: 0.05, gold: 5, silver: 10, none: 20
    },
    // Temperature coefficient (Band 6)
    tempCoeff: {
        brown: 100, red: 50, orange: 15, yellow: 25, blue: 10, violet: 5
    },
    // RGB values for visual display
    rgb: {
        black: '#000000', brown: '#8B4513', red: '#FF0000', orange: '#FF8C00',
        yellow: '#FFD700', green: '#008000', blue: '#0000FF', violet: '#8B00FF',
        grey: '#808080', white: '#FFFFFF', gold: '#FFD700', silver: '#C0C0C0', none: 'transparent'
    }
};

let currentBandMode = 5;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupBandMode();
    generateBandSelectors(5);
    updateVisualBands(5);
});

// Tab Switching
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Band Mode Selector
function setupBandMode() {
    const modeBtns = document.querySelectorAll('.band-mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const bands = parseInt(btn.dataset.bands);
            currentBandMode = bands;
            
            // Update button states
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Regenerate selectors
            generateBandSelectors(bands);
            updateVisualBands(bands);
            
            // Clear result
            document.getElementById('colorResult').innerHTML = '';
        });
    });
}

// Generate Band Selectors
function generateBandSelectors(bandCount) {
    const container = document.getElementById('bandSelectors');
    container.innerHTML = '';
    
    const bandNames = {
        4: ['1st Digit', '2nd Digit', 'Multiplier', 'Tolerance'],
        5: ['1st Digit', '2nd Digit', '3rd Digit', 'Multiplier', 'Tolerance'],
        6: ['1st Digit', '2nd Digit', '3rd Digit', 'Multiplier', 'Tolerance', 'Temp Coeff']
    };
    
    const bandColors = {
        digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'],
        multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'gold', 'silver'],
        tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'grey', 'gold', 'silver'],
        tempCoeff: ['brown', 'red', 'orange', 'yellow', 'blue', 'violet']
    };
    
    for (let i = 0; i < bandCount; i++) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        
        let colorOptions;
        if (i < bandCount - 3 || (bandCount === 4 && i < 2)) {
            colorOptions = bandColors.digit;
        } else if (i === bandCount - 3) {
            colorOptions = bandColors.multiplier;
        } else if (i === bandCount - 2) {
            colorOptions = bandColors.tolerance;
        } else {
            colorOptions = bandColors.tempCoeff;
        }
        
        card.innerHTML = `
            <div class="form-label">${bandNames[bandCount][i]}</div>
            <div class="color-grid" data-band="${i}">
                ${colorOptions.map(color => {
                    const value = getBandValue(color, i, bandCount);
                    return `
                        <div class="color-option" data-color="${color}" style="background: ${colorData.rgb[color]};" onclick="selectColor(${i}, '${color}')">
                            <span>${value}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        container.appendChild(card);
    }
}

// Get band value label
function getBandValue(color, bandIndex, bandCount) {
    if (bandIndex < bandCount - 3 || (bandCount === 4 && bandIndex < 2)) {
        return colorData.digits[color];
    } else if (bandIndex === bandCount - 3) {
        return colorData.multipliers[color] >= 1 ? 
            `×${formatMultiplier(colorData.multipliers[color])}` : 
            `×${colorData.multipliers[color]}`;
    } else if (bandIndex === bandCount - 2) {
        return `±${colorData.tolerances[color]}%`;
    } else {
        return `${colorData.tempCoeff[color]}ppm`;
    }
}

// Format multiplier
function formatMultiplier(mult) {
    if (mult >= 1000000) return (mult / 1000000) + 'M';
    if (mult >= 1000) return (mult / 1000) + 'k';
    return mult;
}

// Select Color
let selectedColors = {};
function selectColor(bandIndex, color) {
    selectedColors[bandIndex] = color;
    
    // Update UI
    const grid = document.querySelector(`.color-grid[data-band="${bandIndex}"]`);
    grid.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    grid.querySelector(`[data-color="${color}"]`).classList.add('selected');
    
    // Update visual
    updateVisualBands(currentBandMode);
}

// Update Visual Bands
function updateVisualBands(bandCount) {
    const container = document.getElementById('visualBands');
    container.innerHTML = '';
    
    const positions = {
        4: ['25%', '40%', '60%', '85%'],
        5: ['20%', '32%', '44%', '56%', '80%'],
        6: ['18%', '28%', '38%', '48%', '58%', '78%']
    };
    
    for (let i = 0; i < bandCount; i++) {
        const band = document.createElement('div');
        band.className = 'band';
        band.style.position = 'absolute';
        band.style.left = positions[bandCount][i];
        band.style.transform = 'translateX(-50%)';
        
        const color = selectedColors[i] || (i === bandCount - 2 ? 'gold' : 'none');
        band.style.background = colorData.rgb[color];
        
        if (color === 'none') {
            band.style.border = '2px dashed rgba(255, 255, 255, 0.3)';
            band.style.background = 'transparent';
        }
        
        container.appendChild(band);
    }
}

// Calculate from Colors
function calculateFromColors() {
    const resultDiv = document.getElementById('colorResult');
    
    // Validate all bands selected
    for (let i = 0; i < currentBandMode; i++) {
        if (!selectedColors[i]) {
            resultDiv.innerHTML = `
                <div class="result-box error">
                    <div class="result-title">⚠️ Incomplete Selection</div>
                    <div class="result-value">Please select all bands</div>
                    <div class="result-details">You must select a color for each band to calculate the resistance value.</div>
                </div>
            `;
            return;
        }
    }
    
    // Calculate value
    let resistance;
    if (currentBandMode === 4) {
        const digit1 = colorData.digits[selectedColors[0]];
        const digit2 = colorData.digits[selectedColors[1]];
        const multiplier = colorData.multipliers[selectedColors[2]];
        resistance = (digit1 * 10 + digit2) * multiplier;
    } else {
        const digit1 = colorData.digits[selectedColors[0]];
        const digit2 = colorData.digits[selectedColors[1]];
        const digit3 = colorData.digits[selectedColors[2]];
        const multiplier = colorData.multipliers[selectedColors[3]];
        resistance = (digit1 * 100 + digit2 * 10 + digit3) * multiplier;
    }
    
    const tolerance = colorData.tolerances[selectedColors[currentBandMode - 2]];
    const tempCoeff = currentBandMode === 6 ? colorData.tempCoeff[selectedColors[5]] : null;
    
    // Format result
    const formatted = formatResistance(resistance);
    const range = formatResistanceRange(resistance, tolerance);
    
    let html = `
        <div class="result-box">
            <div class="result-title">✓ Calculated Resistance</div>
            <div class="result-value">${formatted}</div>
            <div class="result-details">
                <strong>Tolerance:</strong> ±${tolerance}%<br>
                <strong>Range:</strong> ${range.min} to ${range.max}
    `;
    
    if (tempCoeff) {
        html += `<br><strong>Temperature Coefficient:</strong> ${tempCoeff} ppm/°C`;
    }
    
    html += `
            </div>
        </div>
    `;
    
    resultDiv.innerHTML = html;
}

// Calculate from Value (Reverse)
function calculateFromValue() {
    const value = parseFloat(document.getElementById('reverseValue').value);
    const unit = parseFloat(document.getElementById('reverseUnit').value);
    const tolerance = document.getElementById('reverseTolerance').value;
    const resultDiv = document.getElementById('reverseResult');
    
    if (!value || value <= 0) {
        resultDiv.innerHTML = `
            <div class="result-box error">
                <div class="result-title">⚠️ Invalid Input</div>
                <div class="result-value">Enter a valid resistance</div>
                <div class="result-details">Value must be greater than 0</div>
            </div>
        `;
        return;
    }
    
    const resistance = value * unit;
    const bands = findColorBands(resistance, tolerance);
    
    if (!bands) {
        resultDiv.innerHTML = `
            <div class="result-box error">
                <div class="result-title">⚠️ Not a Standard Value</div>
                <div class="result-value">Cannot encode ${formatResistance(resistance)}</div>
                <div class="result-details">This value doesn't match standard E-series resistors. Try: 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2 (or multiples of 10)</div>
            </div>
        `;
        return;
    }
    
    // Display result with visual
    resultDiv.innerHTML = `
        <div class="result-box">
            <div class="result-title">✓ Color Bands (5-Band)</div>
            <div style="background: rgba(245, 245, 245, 0.05); border-radius: 12px; padding: 20px; margin: 16px 0;">
                <div style="display: flex; justify-content: space-around; align-items: center; gap: 8px;">
                    ${bands.map((color, idx) => `
                        <div style="text-align: center;">
                            <div style="width: 40px; height: 60px; background: ${colorData.rgb[color]}; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 8px; box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);"></div>
                            <div style="font-size: 0.75rem; margin-top: 6px; color: var(--text-secondary);">${color}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="result-details">
                <strong>Bands:</strong> ${bands.slice(0, 3).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' - ')} (digits), 
                ${bands[3].charAt(0).toUpperCase() + bands[3].slice(1)} (×${colorData.multipliers[bands[3]]}), 
                ${bands[4].charAt(0).toUpperCase() + bands[4].slice(1)} (±${colorData.tolerances[bands[4]]}%)
            </div>
        </div>
    `;
}

// Find color bands for value (5-band)
function findColorBands(resistance, tolerance) {
    // Find appropriate multiplier
    let significantFigures = resistance;
    let multiplierPower = 0;
    
    while (significantFigures >= 1000 && multiplierPower < 8) {
        significantFigures /= 10;
        multiplierPower++;
    }
    
    while (significantFigures < 100 && multiplierPower > -2) {
        significantFigures *= 10;
        multiplierPower--;
    }
    
    // Round to 3 significant figures
    const rounded = Math.round(significantFigures);
    
    // Extract digits
    const digit1 = Math.floor(rounded / 100);
    const digit2 = Math.floor((rounded % 100) / 10);
    const digit3 = rounded % 10;
    
    // Find multiplier color
    const multiplierValue = Math.pow(10, multiplierPower);
    let multiplierColor = null;
    
    for (const [color, mult] of Object.entries(colorData.multipliers)) {
        if (mult === multiplierValue) {
            multiplierColor = color;
            break;
        }
    }
    
    if (!multiplierColor) return null;
    
    // Find digit colors
    const colorKeys = Object.keys(colorData.digits);
    const band1 = colorKeys.find(c => colorData.digits[c] === digit1);
    const band2 = colorKeys.find(c => colorData.digits[c] === digit2);
    const band3 = colorKeys.find(c => colorData.digits[c] === digit3);
    
    if (!band1 || !band2 || !band3) return null;
    
    return [band1, band2, band3, multiplierColor, tolerance];
}

// Format resistance value
function formatResistance(ohms) {
    if (ohms >= 1000000) {
        return (ohms / 1000000).toFixed(2) + ' MΩ';
    } else if (ohms >= 1000) {
        return (ohms / 1000).toFixed(2) + ' kΩ';
    } else {
        return ohms.toFixed(2) + ' Ω';
    }
}

// Format resistance range
function formatResistanceRange(ohms, tolerancePercent) {
    const delta = ohms * (tolerancePercent / 100);
    return {
        min: formatResistance(ohms - delta),
        max: formatResistance(ohms + delta)
    };
}
