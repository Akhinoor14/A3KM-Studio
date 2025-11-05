// Capacitor Value Decoder - IEC 60384 Standard
// Data Source: International Electrotechnical Commission

const toleranceCodes = {
    'B': { value: 0.1, unit: 'pF', name: 'B (±0.1 pF)' },
    'C': { value: 0.25, unit: 'pF', name: 'C (±0.25 pF)' },
    'D': { value: 0.5, unit: 'pF', name: 'D (±0.5 pF)' },
    'F': { value: 1, unit: '%', name: 'F (±1%)' },
    'G': { value: 2, unit: '%', name: 'G (±2%)' },
    'J': { value: 5, unit: '%', name: 'J (±5%)' },
    'K': { value: 10, unit: '%', name: 'K (±10%)' },
    'M': { value: 20, unit: '%', name: 'M (±20%)' },
    'Z': { value: 80, unit: '%', name: 'Z (-20% +80%)' }
};

let currentCodeType = 'digit';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Auto-decode on input
    document.getElementById('digitCode').addEventListener('input', (e) => {
        if (e.target.value.length === 3) {
            decode3Digit();
        }
    });

    document.getElementById('letterCode').addEventListener('input', (e) => {
        const val = e.target.value.toUpperCase();
        e.target.value = val;
        if (val.length >= 4) {
            decodeLetterCode();
        }
    });
});

// Select Code Type
function selectCodeType(type) {
    currentCodeType = type;
    
    // Update buttons
    document.querySelectorAll('.code-type-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.closest('.code-type-btn').classList.add('selected');
    
    // Update sections
    document.querySelectorAll('.tab-content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(type + '-section').classList.add('active');
    
    // Clear result
    document.getElementById('capResult').innerHTML = '';
    
    // Reset visual
    document.getElementById('capCode').textContent = type === 'digit' ? '104' : '475K';
    document.getElementById('capValue').textContent = type === 'digit' ? '100nF' : '4.7µF';
}

// Decode Example (3-digit)
function decodeExample(code) {
    document.getElementById('digitCode').value = code;
    decode3Digit();
}

// Decode Letter Example
function decodeLetterExample(code) {
    document.getElementById('letterCode').value = code;
    decodeLetterCode();
}

// Decode 3-Digit Code
function decode3Digit() {
    const code = document.getElementById('digitCode').value.trim();
    const resultDiv = document.getElementById('capResult');
    
    // Validation
    if (!/^\d{3}$/.test(code)) {
        showError(resultDiv, 'Invalid Code', 'Please enter a valid 3-digit code (e.g., 104, 223, 475)');
        return;
    }
    
    // Extract digits
    const digit1 = parseInt(code[0]);
    const digit2 = parseInt(code[1]);
    const multiplier = parseInt(code[2]);
    
    // Calculate value in picofarads
    const significantDigits = digit1 * 10 + digit2;
    const picofarads = significantDigits * Math.pow(10, multiplier);
    
    // Convert to appropriate unit
    const formatted = formatCapacitance(picofarads);
    
    // Update visual
    document.getElementById('capCode').textContent = code;
    document.getElementById('capValue').textContent = formatted.display;
    
    // Display result
    resultDiv.innerHTML = `
        <div class="result-box">
            <div class="result-title">✓ Decoded Capacitance</div>
            <div class="result-value">${formatted.display}</div>
            <div class="result-details">
                <strong>Code:</strong> ${code}<br>
                <strong>Calculation:</strong> ${significantDigits} × 10^${multiplier} pF<br>
                <strong>Value in pF:</strong> ${picofarads.toLocaleString()} pF<br>
                <strong>Common Name:</strong> ${formatted.commonName || formatted.display}<br>
                <br>
                <em>Note: 3-digit codes don't include tolerance. Typical tolerance is ±10% (K) or ±20% (M) for ceramic capacitors.</em>
            </div>
        </div>
    `;
}

// Decode Letter Code
function decodeLetterCode() {
    const code = document.getElementById('letterCode').value.trim().toUpperCase();
    const resultDiv = document.getElementById('capResult');
    
    // Validation
    if (!/^\d{3,4}[A-Z]$/.test(code)) {
        showError(resultDiv, 'Invalid Code', 'Please enter a valid letter code (e.g., 475K, 106M, 225J)');
        return;
    }
    
    // Extract parts
    const toleranceLetter = code[code.length - 1];
    const valueCode = code.substring(0, code.length - 1);
    
    // Check tolerance exists
    if (!toleranceCodes[toleranceLetter]) {
        showError(resultDiv, 'Unknown Tolerance', `Tolerance letter "${toleranceLetter}" is not recognized. Use: B, C, D, F, G, J, K, M, Z`);
        return;
    }
    
    // Decode value (same as 3-digit)
    if (valueCode.length !== 3) {
        showError(resultDiv, 'Invalid Value Code', 'Value portion must be 3 digits');
        return;
    }
    
    const digit1 = parseInt(valueCode[0]);
    const digit2 = parseInt(valueCode[1]);
    const multiplier = parseInt(valueCode[2]);
    
    const significantDigits = digit1 * 10 + digit2;
    const picofarads = significantDigits * Math.pow(10, multiplier);
    
    const formatted = formatCapacitance(picofarads);
    const tolerance = toleranceCodes[toleranceLetter];
    
    // Calculate tolerance range
    const range = calculateToleranceRange(picofarads, tolerance);
    
    // Update visual
    document.getElementById('capCode').textContent = code;
    document.getElementById('capValue').textContent = formatted.display;
    
    // Display result
    resultDiv.innerHTML = `
        <div class="result-box">
            <div class="result-title">✓ Decoded Capacitance</div>
            <div class="result-value">${formatted.display}</div>
            <div class="result-details">
                <strong>Code:</strong> ${code}<br>
                <strong>Value Code:</strong> ${valueCode} = ${significantDigits} × 10^${multiplier} pF<br>
                <strong>Tolerance:</strong> ${tolerance.name}<br>
                <strong>Nominal Value:</strong> ${picofarads.toLocaleString()} pF<br>
                ${range ? `<strong>Tolerance Range:</strong> ${range.min} to ${range.max}<br>` : ''}
                <strong>Common Name:</strong> ${formatted.commonName || formatted.display}
            </div>
        </div>
    `;
}

// Format capacitance to appropriate unit
function formatCapacitance(picofarads) {
    let display, commonName;
    
    if (picofarads < 1000) {
        // pF range
        display = picofarads.toFixed(0) + ' pF';
        commonName = null;
    } else if (picofarads < 1000000) {
        // nF range
        const nanofarads = picofarads / 1000;
        display = nanofarads.toFixed(nanofarads < 100 ? 1 : 0) + ' nF';
        
        // Common names
        if (picofarads === 1000) commonName = '1nF (1000pF)';
        else if (picofarads === 10000) commonName = '10nF (0.01µF)';
        else if (picofarads === 100000) commonName = '100nF (0.1µF)';
    } else if (picofarads < 1000000000) {
        // µF range
        const microfarads = picofarads / 1000000;
        display = microfarads.toFixed(microfarads < 100 ? 1 : 0) + ' µF';
        
        // Common names
        if (picofarads === 1000000) commonName = '1µF (1000nF)';
        else if (picofarads === 4700000) commonName = '4.7µF';
        else if (picofarads === 10000000) commonName = '10µF';
        else if (picofarads === 100000000) commonName = '100µF';
    } else {
        // mF range (rare)
        const millifarads = picofarads / 1000000000;
        display = millifarads.toFixed(1) + ' mF';
        commonName = null;
    }
    
    return { display, commonName };
}

// Calculate tolerance range
function calculateToleranceRange(picofarads, tolerance) {
    if (tolerance.unit === '%') {
        const delta = picofarads * (tolerance.value / 100);
        const min = formatCapacitance(picofarads - delta);
        const max = formatCapacitance(picofarads + delta);
        return { min: min.display, max: max.display };
    } else if (tolerance.unit === 'pF') {
        const min = formatCapacitance(picofarads - tolerance.value);
        const max = formatCapacitance(picofarads + tolerance.value);
        return { min: min.display, max: max.display };
    }
    return null;
}

// Show error
function showError(container, title, message) {
    container.innerHTML = `
        <div class="result-box error">
            <div class="result-title">⚠️ ${title}</div>
            <div class="result-value">Cannot Decode</div>
            <div class="result-details">${message}</div>
        </div>
    `;
    
    // Reset visual
    document.getElementById('capCode').textContent = '???';
    document.getElementById('capValue').textContent = '---';
}
