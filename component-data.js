// Component Database - 103 Components Across 6 Categories
// Data Sources: Official datasheets from TI, ST, ON Semi, Vishay, Fairchild, Atmel, Espressif

const componentDatabase = [
    // ========== VOLTAGE REGULATORS (12) ==========
    {
        name: '7805',
        category: 'Voltage Regulator',
        description: 'Fixed +5V linear regulator, 1.5A max output',
        voltage: '5V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: 'Basic 5V power supplies',
        specs: { inputMax: '35V', dropout: '2V', efficiency: 'Low' }
    },
    {
        name: '7812',
        category: 'Voltage Regulator',
        description: 'Fixed +12V linear regulator, 1.5A max output',
        voltage: '12V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: '12V motor/relay circuits',
        specs: { inputMax: '35V', dropout: '2V', efficiency: 'Low' }
    },
    {
        name: '7809',
        category: 'Voltage Regulator',
        description: 'Fixed +9V linear regulator, 1.5A output',
        voltage: '9V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: '9V audio/guitar pedals',
        specs: { inputMax: '35V', dropout: '2V', efficiency: 'Low' }
    },
    {
        name: 'LM317',
        category: 'Voltage Regulator',
        description: 'Adjustable 1.25-37V regulator, 1.5A output',
        voltage: '1.25-37V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: 'Variable voltage supplies',
        specs: { inputMax: '40V', dropout: '3V', efficiency: 'Medium' }
    },
    {
        name: 'LM7805',
        category: 'Voltage Regulator',
        description: '5V regulator with thermal protection',
        voltage: '5V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: 'Arduino/microcontroller power',
        specs: { inputMax: '35V', dropout: '2V', efficiency: 'Low' }
    },
    {
        name: 'AMS1117-3.3',
        category: 'Voltage Regulator',
        description: 'Low dropout 3.3V LDO, 1A output',
        voltage: '3.3V',
        current: '1A',
        package: 'SOT-223',
        bestFor: 'ESP8266/ESP32 power',
        specs: { inputMax: '15V', dropout: '1.3V', efficiency: 'Medium' }
    },
    {
        name: 'LM2596',
        category: 'Voltage Regulator',
        description: 'Buck switching regulator, 3A adjustable',
        voltage: '1.25-37V',
        current: '3A',
        package: 'TO-220',
        bestFor: 'High-efficiency DC-DC conversion',
        specs: { inputMax: '40V', dropout: '0.5V', efficiency: 'High (92%)' }
    },
    {
        name: 'LM7808',
        category: 'Voltage Regulator',
        description: 'Fixed +8V linear regulator',
        voltage: '8V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: '8V specialized circuits',
        specs: { inputMax: '35V', dropout: '2V', efficiency: 'Low' }
    },
    {
        name: 'LM7815',
        category: 'Voltage Regulator',
        description: 'Fixed +15V linear regulator',
        voltage: '15V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: 'Op-amp dual supply',
        specs: { inputMax: '35V', dropout: '2V', efficiency: 'Low' }
    },
    {
        name: 'LM337',
        category: 'Voltage Regulator',
        description: 'Adjustable negative voltage regulator',
        voltage: '-1.25 to -37V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: 'Negative voltage supplies',
        specs: { inputMin: '-40V', dropout: '3V', efficiency: 'Medium' }
    },
    {
        name: 'L7806',
        category: 'Voltage Regulator',
        description: 'Fixed +6V linear regulator',
        voltage: '6V',
        current: '1.5A',
        package: 'TO-220',
        bestFor: '6V specialized applications',
        specs: { inputMax: '35V', dropout: '2V', efficiency: 'Low' }
    },
    {
        name: 'XL6009',
        category: 'Voltage Regulator',
        description: 'Boost converter 3-32V to 5-35V, 4A',
        voltage: '5-35V',
        current: '4A',
        package: 'TO-252',
        bestFor: 'Step-up voltage conversion',
        specs: { inputMin: '3V', dropout: 'N/A', efficiency: 'High (94%)' }
    },

    // ========== TRANSISTORS - NPN (10) ==========
    {
        name: 'BC547',
        category: 'Transistor (NPN)',
        description: 'General purpose NPN, most common',
        voltage: '45V',
        current: '100mA',
        package: 'TO-92',
        bestFor: 'Small signal switching',
        specs: { hFE: '110-800', power: '500mW', speed: 'Medium' }
    },
    {
        name: '2N2222',
        category: 'Transistor (NPN)',
        description: 'Popular NPN switching transistor',
        voltage: '40V',
        current: '800mA',
        package: 'TO-92',
        bestFor: 'LED/relay drivers',
        specs: { hFE: '100-300', power: '500mW', speed: 'Fast' }
    },
    {
        name: 'BC337',
        category: 'Transistor (NPN)',
        description: 'NPN with higher current than BC547',
        voltage: '45V',
        current: '800mA',
        package: 'TO-92',
        bestFor: 'Medium power switching',
        specs: { hFE: '100-600', power: '625mW', speed: 'Medium' }
    },
    {
        name: '2N3904',
        category: 'Transistor (NPN)',
        description: 'General purpose NPN, US equivalent of BC547',
        voltage: '40V',
        current: '200mA',
        package: 'TO-92',
        bestFor: 'Amplification/switching',
        specs: { hFE: '100-300', power: '625mW', speed: 'Fast' }
    },
    {
        name: 'BD139',
        category: 'Transistor (NPN)',
        description: 'Medium power NPN transistor',
        voltage: '80V',
        current: '1.5A',
        package: 'TO-126',
        bestFor: 'Motor drivers, relays',
        specs: { hFE: '40-250', power: '12.5W', speed: 'Medium' }
    },
    {
        name: 'TIP120',
        category: 'Transistor (NPN)',
        description: 'Darlington power transistor',
        voltage: '60V',
        current: '5A',
        package: 'TO-220',
        bestFor: 'High current loads',
        specs: { hFE: '1000', power: '65W', speed: 'Slow' }
    },
    {
        name: '2N5551',
        category: 'Transistor (NPN)',
        description: 'High voltage NPN transistor',
        voltage: '160V',
        current: '600mA',
        package: 'TO-92',
        bestFor: 'High voltage switching',
        specs: { hFE: '80-250', power: '625mW', speed: 'Fast' }
    },
    {
        name: 'BC548',
        category: 'Transistor (NPN)',
        description: 'Low noise NPN, audio applications',
        voltage: '30V',
        current: '100mA',
        package: 'TO-92',
        bestFor: 'Audio preamps',
        specs: { hFE: '110-800', power: '500mW', speed: 'Medium' }
    },
    {
        name: 'MPSA42',
        category: 'Transistor (NPN)',
        description: 'High voltage NPN for switching',
        voltage: '300V',
        current: '500mA',
        package: 'TO-92',
        bestFor: 'Flyback/boost converters',
        specs: { hFE: '80-250', power: '625mW', speed: 'Medium' }
    },
    {
        name: 'C945',
        category: 'Transistor (NPN)',
        description: 'Asian market NPN equivalent to BC547',
        voltage: '50V',
        current: '150mA',
        package: 'TO-92',
        bestFor: 'General switching',
        specs: { hFE: '120-700', power: '400mW', speed: 'Medium' }
    },

    // ========== TRANSISTORS - PNP (10) ==========
    {
        name: 'BC557',
        category: 'Transistor (PNP)',
        description: 'Complementary to BC547, most common PNP',
        voltage: '-45V',
        current: '-100mA',
        package: 'TO-92',
        bestFor: 'Complementary push-pull',
        specs: { hFE: '110-800', power: '500mW', speed: 'Medium' }
    },
    {
        name: '2N2907',
        category: 'Transistor (PNP)',
        description: 'Complementary to 2N2222',
        voltage: '-60V',
        current: '-600mA',
        package: 'TO-92',
        bestFor: 'High-side switching',
        specs: { hFE: '100-300', power: '600mW', speed: 'Fast' }
    },
    {
        name: 'BC327',
        category: 'Transistor (PNP)',
        description: 'Complementary to BC337',
        voltage: '-45V',
        current: '-800mA',
        package: 'TO-92',
        bestFor: 'Medium power PNP',
        specs: { hFE: '100-600', power: '625mW', speed: 'Medium' }
    },
    {
        name: '2N3906',
        category: 'Transistor (PNP)',
        description: 'Complementary to 2N3904',
        voltage: '-40V',
        current: '-200mA',
        package: 'TO-92',
        bestFor: 'General PNP switching',
        specs: { hFE: '100-300', power: '625mW', speed: 'Fast' }
    },
    {
        name: 'BD140',
        category: 'Transistor (PNP)',
        description: 'Complementary to BD139',
        voltage: '-80V',
        current: '-1.5A',
        package: 'TO-126',
        bestFor: 'Power amplifiers',
        specs: { hFE: '40-250', power: '12.5W', speed: 'Medium' }
    },
    {
        name: 'TIP125',
        category: 'Transistor (PNP)',
        description: 'Darlington power PNP',
        voltage: '-60V',
        current: '-5A',
        package: 'TO-220',
        bestFor: 'High current PNP loads',
        specs: { hFE: '1000', power: '65W', speed: 'Slow' }
    },
    {
        name: '2N5401',
        category: 'Transistor (PNP)',
        description: 'High voltage PNP',
        voltage: '-150V',
        current: '-600mA',
        package: 'TO-92',
        bestFor: 'High voltage PNP circuits',
        specs: { hFE: '60-250', power: '625mW', speed: 'Fast' }
    },
    {
        name: 'BC558',
        category: 'Transistor (PNP)',
        description: 'Low noise PNP audio transistor',
        voltage: '-30V',
        current: '-100mA',
        package: 'TO-92',
        bestFor: 'Audio circuits',
        specs: { hFE: '110-800', power: '500mW', speed: 'Medium' }
    },
    {
        name: 'MPSA92',
        category: 'Transistor (PNP)',
        description: 'High voltage PNP',
        voltage: '-300V',
        current: '-500mA',
        package: 'TO-92',
        bestFor: 'High voltage PNP switching',
        specs: { hFE: '60-250', power: '625mW', speed: 'Medium' }
    },
    {
        name: 'A1015',
        category: 'Transistor (PNP)',
        description: 'Asian market PNP, complementary to C945',
        voltage: '-50V',
        current: '-150mA',
        package: 'TO-92',
        bestFor: 'General PNP applications',
        specs: { hFE: '70-400', power: '400mW', speed: 'Medium' }
    },

    // ========== MOSFETs (10) ==========
    {
        name: 'IRF540N',
        category: 'MOSFET (N-Channel)',
        description: 'Power N-channel MOSFET, 33A',
        voltage: '100V',
        current: '33A',
        package: 'TO-220',
        bestFor: 'High current switching',
        specs: { rdsOn: '44mΩ', vgs: '10V', power: '130W' }
    },
    {
        name: 'IRF520',
        category: 'MOSFET (N-Channel)',
        description: 'Popular N-channel for Arduino',
        voltage: '100V',
        current: '9.7A',
        package: 'TO-220',
        bestFor: 'Arduino motor control',
        specs: { rdsOn: '200mΩ', vgs: '10V', power: '60W' }
    },
    {
        name: '2N7000',
        category: 'MOSFET (N-Channel)',
        description: 'Small signal N-channel',
        voltage: '60V',
        current: '200mA',
        package: 'TO-92',
        bestFor: 'Logic level switching',
        specs: { rdsOn: '5Ω', vgs: '3V', power: '400mW' }
    },
    {
        name: 'IRF9540',
        category: 'MOSFET (P-Channel)',
        description: 'Power P-channel MOSFET',
        voltage: '-100V',
        current: '-23A',
        package: 'TO-220',
        bestFor: 'High-side switching',
        specs: { rdsOn: '117mΩ', vgs: '-10V', power: '140W' }
    },
    {
        name: 'IRLZ44N',
        category: 'MOSFET (N-Channel)',
        description: 'Logic level N-channel, 47A',
        voltage: '55V',
        current: '47A',
        package: 'TO-220',
        bestFor: '5V/3.3V logic switching',
        specs: { rdsOn: '22mΩ', vgs: '5V', power: '110W' }
    },
    {
        name: 'BS170',
        category: 'MOSFET (N-Channel)',
        description: 'Small signal logic level',
        voltage: '60V',
        current: '500mA',
        package: 'TO-92',
        bestFor: 'Small load switching',
        specs: { rdsOn: '5Ω', vgs: '4.5V', power: '830mW' }
    },
    {
        name: 'IRF3205',
        category: 'MOSFET (N-Channel)',
        description: 'Very high current N-channel',
        voltage: '55V',
        current: '110A',
        package: 'TO-220',
        bestFor: 'Very high current loads',
        specs: { rdsOn: '8mΩ', vgs: '10V', power: '200W' }
    },
    {
        name: 'FQP30N06L',
        category: 'MOSFET (N-Channel)',
        description: 'Logic level 60V, 32A',
        voltage: '60V',
        current: '32A',
        package: 'TO-220',
        bestFor: 'High current 5V logic',
        specs: { rdsOn: '35mΩ', vgs: '5V', power: '79W' }
    },
    {
        name: 'AO3400',
        category: 'MOSFET (N-Channel)',
        description: 'SMD logic level N-channel',
        voltage: '30V',
        current: '5.8A',
        package: 'SOT-23',
        bestFor: 'PCB space-constrained',
        specs: { rdsOn: '48mΩ', vgs: '2.5V', power: '1.4W' }
    },
    {
        name: 'IRF9Z34N',
        category: 'MOSFET (P-Channel)',
        description: 'Logic level P-channel',
        voltage: '-55V',
        current: '-19A',
        package: 'TO-220',
        bestFor: 'High-side 5V logic',
        specs: { rdsOn: '150mΩ', vgs: '-5V', power: '140W' }
    },

    // ========== DIODES (15) ==========
    {
        name: '1N4007',
        category: 'Diode',
        description: 'General purpose rectifier, most common',
        voltage: '1000V',
        current: '1A',
        package: 'DO-41',
        bestFor: 'AC-DC rectification',
        specs: { vf: '1.1V', recovery: 'Slow', temp: '175°C' }
    },
    {
        name: '1N4148',
        category: 'Diode',
        description: 'Fast switching signal diode',
        voltage: '100V',
        current: '200mA',
        package: 'DO-35',
        bestFor: 'Signal clamping/switching',
        specs: { vf: '1V', recovery: 'Fast (4ns)', temp: '175°C' }
    },
    {
        name: '1N5819',
        category: 'Schottky Diode',
        description: 'Schottky barrier, low dropout',
        voltage: '40V',
        current: '1A',
        package: 'DO-41',
        bestFor: 'Low voltage rectification',
        specs: { vf: '0.45V', recovery: 'Very fast', temp: '125°C' }
    },
    {
        name: '1N4001',
        category: 'Diode',
        description: 'Lower voltage rectifier',
        voltage: '50V',
        current: '1A',
        package: 'DO-41',
        bestFor: 'Low voltage rectification',
        specs: { vf: '1.1V', recovery: 'Slow', temp: '175°C' }
    },
    {
        name: '1N4004',
        category: 'Diode',
        description: 'Medium voltage rectifier',
        voltage: '400V',
        current: '1A',
        package: 'DO-41',
        bestFor: 'Mains rectification',
        specs: { vf: '1.1V', recovery: 'Slow', temp: '175°C' }
    },
    {
        name: '1N5408',
        category: 'Diode',
        description: 'High current rectifier',
        voltage: '1000V',
        current: '3A',
        package: 'DO-201',
        bestFor: 'High current rectification',
        specs: { vf: '1.2V', recovery: 'Slow', temp: '175°C' }
    },
    {
        name: 'UF4007',
        category: 'Fast Recovery Diode',
        description: 'Ultra-fast recovery rectifier',
        voltage: '1000V',
        current: '1A',
        package: 'DO-41',
        bestFor: 'Switching power supplies',
        specs: { vf: '1.7V', recovery: 'Fast (75ns)', temp: '150°C' }
    },
    {
        name: '1N5822',
        category: 'Schottky Diode',
        description: 'High current Schottky',
        voltage: '40V',
        current: '3A',
        package: 'DO-201',
        bestFor: 'Buck converter output',
        specs: { vf: '0.55V', recovery: 'Very fast', temp: '125°C' }
    },
    {
        name: '1N4733',
        category: 'Zener Diode',
        description: '5.1V Zener voltage reference',
        voltage: '5.1V',
        current: '1W',
        package: 'DO-41',
        bestFor: 'Voltage regulation/reference',
        specs: { tolerance: '±5%', power: '1W', temp: '175°C' }
    },
    {
        name: '1N4740',
        category: 'Zener Diode',
        description: '10V Zener regulator',
        voltage: '10V',
        current: '1W',
        package: 'DO-41',
        bestFor: '10V references',
        specs: { tolerance: '±5%', power: '1W', temp: '175°C' }
    },
    {
        name: 'BAT85',
        category: 'Schottky Diode',
        description: 'Small signal Schottky',
        voltage: '30V',
        current: '200mA',
        package: 'DO-35',
        bestFor: 'RF/high-speed switching',
        specs: { vf: '0.5V', recovery: 'Very fast', temp: '150°C' }
    },
    {
        name: 'MBR1045',
        category: 'Schottky Diode',
        description: 'Power Schottky rectifier',
        voltage: '45V',
        current: '10A',
        package: 'TO-220',
        bestFor: 'High current low voltage',
        specs: { vf: '0.7V', recovery: 'Very fast', temp: '150°C' }
    },
    {
        name: 'FR107',
        category: 'Fast Recovery Diode',
        description: 'Fast recovery 1A',
        voltage: '1000V',
        current: '1A',
        package: 'DO-41',
        bestFor: 'SMPS/inverters',
        specs: { vf: '1.5V', recovery: 'Fast (500ns)', temp: '150°C' }
    },
    {
        name: '1N4728',
        category: 'Zener Diode',
        description: '3.3V Zener for logic',
        voltage: '3.3V',
        current: '1W',
        package: 'DO-41',
        bestFor: '3.3V logic protection',
        specs: { tolerance: '±5%', power: '1W', temp: '175°C' }
    },
    {
        name: 'SS34',
        category: 'Schottky Diode',
        description: 'SMD Schottky 3A',
        voltage: '40V',
        current: '3A',
        package: 'SMA',
        bestFor: 'PCB buck converters',
        specs: { vf: '0.5V', recovery: 'Very fast', temp: '125°C' }
    },

    // ========== INTEGRATED CIRCUITS (18) ==========
    {
        name: 'NE555',
        category: 'Timer IC',
        description: 'Legendary timer IC, astable/monostable',
        voltage: '4.5-16V',
        current: '200mA',
        package: 'DIP-8',
        bestFor: 'Timers, oscillators, PWM',
        specs: { frequency: '500kHz', outputs: '1', accuracy: '±1%' }
    },
    {
        name: 'LM358',
        category: 'Op-Amp',
        description: 'Dual op-amp, general purpose',
        voltage: '3-32V',
        current: '±30mA',
        package: 'DIP-8',
        bestFor: 'Audio/signal amplification',
        specs: { channels: '2', bandwidth: '1MHz', slew: '0.6V/µs' }
    },
    {
        name: 'LM324',
        category: 'Op-Amp',
        description: 'Quad op-amp, 4 channels',
        voltage: '3-32V',
        current: '±30mA',
        package: 'DIP-14',
        bestFor: 'Multi-channel amplifiers',
        specs: { channels: '4', bandwidth: '1MHz', slew: '0.5V/µs' }
    },
    {
        name: 'TL071',
        category: 'Op-Amp',
        description: 'Low noise JFET op-amp',
        voltage: '±18V',
        current: '±50mA',
        package: 'DIP-8',
        bestFor: 'Audio preamps',
        specs: { channels: '1', bandwidth: '3MHz', slew: '13V/µs' }
    },
    {
        name: 'TL072',
        category: 'Op-Amp',
        description: 'Dual low noise JFET op-amp',
        voltage: '±18V',
        current: '±50mA',
        package: 'DIP-8',
        bestFor: 'Stereo audio',
        specs: { channels: '2', bandwidth: '3MHz', slew: '13V/µs' }
    },
    {
        name: 'TL074',
        category: 'Op-Amp',
        description: 'Quad low noise JFET op-amp',
        voltage: '±18V',
        current: '±50mA',
        package: 'DIP-14',
        bestFor: 'Multi-channel audio',
        specs: { channels: '4', bandwidth: '3MHz', slew: '13V/µs' }
    },
    {
        name: 'LM741',
        category: 'Op-Amp',
        description: 'Classic general purpose op-amp',
        voltage: '±15V',
        current: '±25mA',
        package: 'DIP-8',
        bestFor: 'Learning/basic circuits',
        specs: { channels: '1', bandwidth: '1MHz', slew: '0.5V/µs' }
    },
    {
        name: 'L293D',
        category: 'Motor Driver',
        description: 'Dual H-bridge motor driver',
        voltage: '4.5-36V',
        current: '600mA',
        package: 'DIP-16',
        bestFor: 'Small DC motor control',
        specs: { channels: '2', protection: 'Diodes', pwm: 'Yes' }
    },
    {
        name: 'L298N',
        category: 'Motor Driver',
        description: 'Dual H-bridge, high current',
        voltage: '5-46V',
        current: '2A',
        package: 'Multiwatt-15',
        bestFor: 'High current motors',
        specs: { channels: '2', protection: 'Yes', pwm: 'Yes' }
    },
    {
        name: 'ULN2003',
        category: 'Darlington Array',
        description: '7-channel Darlington driver',
        voltage: '50V',
        current: '500mA',
        package: 'DIP-16',
        bestFor: 'Relay/stepper drivers',
        specs: { channels: '7', clampDiodes: 'Yes', current: '500mA' }
    },
    {
        name: '74HC595',
        category: 'Shift Register',
        description: '8-bit serial-in parallel-out',
        voltage: '2-6V',
        current: '35mA',
        package: 'DIP-16',
        bestFor: 'GPIO expansion',
        specs: { bits: '8', cascade: 'Yes', latch: 'Yes' }
    },
    {
        name: 'CD4017',
        category: 'Decade Counter',
        description: '10-stage decade counter/divider',
        voltage: '3-18V',
        current: '10mA',
        package: 'DIP-16',
        bestFor: 'LED chasers, sequencing',
        specs: { outputs: '10', clock: 'Yes', reset: 'Yes' }
    },
    {
        name: 'ATmega328P',
        category: 'Microcontroller',
        description: 'Arduino Uno heart, 8-bit AVR',
        voltage: '1.8-5.5V',
        current: '200mA',
        package: 'DIP-28',
        bestFor: 'Arduino projects',
        specs: { flash: '32KB', ram: '2KB', io: '23 pins' }
    },
    {
        name: 'ESP8266',
        category: 'WiFi Module',
        description: 'WiFi SoC with microcontroller',
        voltage: '3.3V',
        current: '80mA',
        package: 'Module',
        bestFor: 'IoT WiFi projects',
        specs: { wifi: '802.11', flash: '4MB', io: '17 pins' }
    },
    {
        name: 'ESP32',
        category: 'WiFi/BT Module',
        description: 'WiFi+Bluetooth dual-core',
        voltage: '3.3V',
        current: '160mA',
        package: 'Module',
        bestFor: 'Advanced IoT',
        specs: { wifi: '802.11', bt: 'Yes', cores: '2' }
    },
    {
        name: 'ATtiny85',
        category: 'Microcontroller',
        description: 'Tiny 8-bit AVR, 8-pin',
        voltage: '2.7-5.5V',
        current: '10mA',
        package: 'DIP-8',
        bestFor: 'Space-constrained projects',
        specs: { flash: '8KB', ram: '512B', io: '6 pins' }
    },
    {
        name: 'Arduino Nano',
        category: 'Microcontroller',
        description: 'Compact Arduino board',
        voltage: '5V',
        current: '500mA',
        package: 'Module',
        bestFor: 'Compact Arduino projects',
        specs: { flash: '32KB', ram: '2KB', io: '22 pins' }
    },
    {
        name: 'STM32F103',
        category: 'Microcontroller',
        description: '32-bit ARM Cortex-M3',
        voltage: '2-3.6V',
        current: '50mA',
        package: 'LQFP-48',
        bestFor: 'Advanced ARM projects',
        specs: { flash: '64KB', ram: '20KB', speed: '72MHz' }
    },

    // ========== SENSORS (15) ==========
    {
        name: 'DHT11',
        category: 'Temperature Sensor',
        description: 'Digital temperature + humidity',
        voltage: '3-5.5V',
        current: '2.5mA',
        package: 'Module',
        bestFor: 'Basic temp/humidity',
        specs: { range: '0-50°C', accuracy: '±2°C', protocol: 'Digital' }
    },
    {
        name: 'DHT22',
        category: 'Temperature Sensor',
        description: 'Accurate temp + humidity',
        voltage: '3-5.5V',
        current: '2.5mA',
        package: 'Module',
        bestFor: 'Accurate weather stations',
        specs: { range: '-40 to 80°C', accuracy: '±0.5°C', protocol: 'Digital' }
    },
    {
        name: 'DS18B20',
        category: 'Temperature Sensor',
        description: 'Digital 1-wire temperature',
        voltage: '3-5.5V',
        current: '1.5mA',
        package: 'TO-92',
        bestFor: 'Multiple sensor networks',
        specs: { range: '-55 to 125°C', accuracy: '±0.5°C', protocol: '1-Wire' }
    },
    {
        name: 'LM35',
        category: 'Temperature Sensor',
        description: 'Analog temperature sensor',
        voltage: '4-30V',
        current: '60µA',
        package: 'TO-92',
        bestFor: 'Simple analog temp sensing',
        specs: { range: '-55 to 150°C', output: '10mV/°C', analog: 'Yes' }
    },
    {
        name: 'HC-SR04',
        category: 'Ultrasonic Sensor',
        description: 'Ultrasonic distance sensor',
        voltage: '5V',
        current: '15mA',
        package: 'Module',
        bestFor: 'Obstacle detection',
        specs: { range: '2-400cm', accuracy: '3mm', angle: '15°' }
    },
    {
        name: 'HC-SR501',
        category: 'Motion Sensor',
        description: 'PIR motion detector',
        voltage: '5-20V',
        current: '65mA',
        package: 'Module',
        bestFor: 'Motion detection',
        specs: { range: '7m', angle: '110°', output: 'Digital' }
    },
    {
        name: 'MQ-2',
        category: 'Gas Sensor',
        description: 'Combustible gas sensor',
        voltage: '5V',
        current: '150mA',
        package: 'Module',
        bestFor: 'Gas leak detection',
        specs: { gases: 'LPG/Smoke', analog: 'Yes', preheat: '24h' }
    },
    {
        name: 'MQ-135',
        category: 'Air Quality Sensor',
        description: 'Air quality/CO2 sensor',
        voltage: '5V',
        current: '150mA',
        package: 'Module',
        bestFor: 'Air quality monitoring',
        specs: { gases: 'CO2/NH3/Benzene', analog: 'Yes', preheat: '24h' }
    },
    {
        name: 'BMP180',
        category: 'Pressure Sensor',
        description: 'Barometric pressure + temp',
        voltage: '3.3V',
        current: '5µA',
        package: 'Module',
        bestFor: 'Weather stations',
        specs: { range: '300-1100hPa', accuracy: '±0.12hPa', i2c: 'Yes' }
    },
    {
        name: 'MPU6050',
        category: 'IMU Sensor',
        description: '6-axis gyro + accelerometer',
        voltage: '3-5V',
        current: '3.8mA',
        package: 'Module',
        bestFor: 'Motion tracking',
        specs: { axes: '6', dof: '6', i2c: 'Yes' }
    },
    {
        name: 'ADXL345',
        category: 'Accelerometer',
        description: '3-axis digital accelerometer',
        voltage: '2-3.6V',
        current: '140µA',
        package: 'Module',
        bestFor: 'Tilt/vibration sensing',
        specs: { axes: '3', range: '±16g', i2c: 'Yes' }
    },
    {
        name: 'HX711',
        category: 'Load Cell Amplifier',
        description: '24-bit ADC for load cells',
        voltage: '2.6-5.5V',
        current: '1.5mA',
        package: 'Module',
        bestFor: 'Weight/force measurement',
        specs: { resolution: '24-bit', gain: '128', channels: '2' }
    },
    {
        name: 'TCS3200',
        category: 'Color Sensor',
        description: 'RGB color sensor',
        voltage: '3-5V',
        current: '15mA',
        package: 'Module',
        bestFor: 'Color detection',
        specs: { colors: 'RGB', output: 'Frequency', filters: '4' }
    },
    {
        name: 'TSL2561',
        category: 'Light Sensor',
        description: 'Digital light intensity',
        voltage: '2.7-3.6V',
        current: '0.5mA',
        package: 'Module',
        bestFor: 'Light level sensing',
        specs: { range: '0.1-40000 Lux', i2c: 'Yes', ir: 'Yes' }
    },
    {
        name: 'Hall Effect A3144',
        category: 'Magnetic Sensor',
        description: 'Digital Hall effect switch',
        voltage: '4.5-24V',
        current: '10mA',
        package: 'TO-92',
        bestFor: 'Magnetic proximity',
        specs: { type: 'Digital', operate: '50-150G', output: 'Open collector' }
    },

    // ========== DISPLAYS (8) ==========
    {
        name: '7-Segment (Common Cathode)',
        category: 'Display',
        description: 'Single digit LED display',
        voltage: '2-5V',
        current: '20mA/seg',
        package: 'Module',
        bestFor: 'Numeric displays',
        specs: { digits: '1', type: 'LED', color: 'Red' }
    },
    {
        name: '7-Segment 4-Digit',
        category: 'Display',
        description: '4-digit multiplexed display',
        voltage: '3-5V',
        current: '80mA',
        package: 'Module',
        bestFor: 'Clocks/counters',
        specs: { digits: '4', type: 'LED', multiplex: 'Yes' }
    },
    {
        name: 'LCD 16x2',
        category: 'Display',
        description: '16 char × 2 line alphanumeric',
        voltage: '5V',
        current: '50mA',
        package: 'Module',
        bestFor: 'Text displays',
        specs: { chars: '16x2', backlight: 'Yes', i2c: 'Optional' }
    },
    {
        name: 'LCD 20x4',
        category: 'Display',
        description: '20 char × 4 line display',
        voltage: '5V',
        current: '60mA',
        package: 'Module',
        bestFor: 'Large text displays',
        specs: { chars: '20x4', backlight: 'Yes', i2c: 'Optional' }
    },
    {
        name: 'OLED 0.96" 128x64',
        category: 'Display',
        description: 'Small OLED graphic display',
        voltage: '3.3-5V',
        current: '20mA',
        package: 'Module',
        bestFor: 'Compact graphics',
        specs: { resolution: '128x64', color: 'White/Blue', i2c: 'Yes' }
    },
    {
        name: 'OLED 1.3" 128x64',
        category: 'Display',
        description: 'Larger OLED display',
        voltage: '3.3-5V',
        current: '25mA',
        package: 'Module',
        bestFor: 'Graphics + text',
        specs: { resolution: '128x64', color: 'White/Blue', spi: 'Yes' }
    },
    {
        name: 'TFT 1.8" 128x160',
        category: 'Display',
        description: 'Color TFT LCD touchscreen',
        voltage: '3.3-5V',
        current: '100mA',
        package: 'Module',
        bestFor: 'Color graphics',
        specs: { resolution: '128x160', color: '65K', spi: 'Yes' }
    },
    {
        name: 'MAX7219 8x8 LED Matrix',
        category: 'Display',
        description: 'Dot matrix LED with driver',
        voltage: '5V',
        current: '320mA',
        package: 'Module',
        bestFor: 'LED animations',
        specs: { resolution: '8x8', cascade: 'Yes', spi: 'Yes' }
    },

    // ========== COMMUNICATION MODULES (12) ==========
    {
        name: 'HC-05',
        category: 'Bluetooth Module',
        description: 'Bluetooth 2.0 serial module',
        voltage: '3.3-6V',
        current: '50mA',
        package: 'Module',
        bestFor: 'Wireless serial communication',
        specs: { version: 'BT 2.0', range: '10m', uart: 'Yes' }
    },
    {
        name: 'HC-06',
        category: 'Bluetooth Module',
        description: 'Slave-only Bluetooth module',
        voltage: '3.3-6V',
        current: '50mA',
        package: 'Module',
        bestFor: 'BT slave devices',
        specs: { version: 'BT 2.0', range: '10m', mode: 'Slave' }
    },
    {
        name: 'NRF24L01',
        category: 'Wireless Module',
        description: '2.4GHz wireless transceiver',
        voltage: '1.9-3.6V',
        current: '12.6mA',
        package: 'Module',
        bestFor: 'Low power RF',
        specs: { frequency: '2.4GHz', range: '100m', spi: 'Yes' }
    },
    {
        name: 'RFM69',
        category: 'Wireless Module',
        description: 'Long range RF transceiver',
        voltage: '1.8-3.6V',
        current: '45mA',
        package: 'Module',
        bestFor: 'Long range wireless',
        specs: { frequency: '433/868/915MHz', range: '500m', spi: 'Yes' }
    },
    {
        name: 'SIM800L',
        category: 'GSM Module',
        description: 'GSM/GPRS cellular module',
        voltage: '3.7-4.2V',
        current: '2A peak',
        package: 'Module',
        bestFor: 'SMS/calls/mobile data',
        specs: { bands: 'Quad', gprs: 'Yes', uart: 'Yes' }
    },
    {
        name: 'DS3231',
        category: 'RTC Module',
        description: 'Real-time clock with battery',
        voltage: '2.3-5.5V',
        current: '200µA',
        package: 'Module',
        bestFor: 'Timekeeping',
        specs: { accuracy: '±2ppm', battery: 'Yes', i2c: 'Yes' }
    },
    {
        name: 'MicroSD Card Module',
        category: 'Storage Module',
        description: 'SD card reader/writer',
        voltage: '3.3-5V',
        current: '100mA',
        package: 'Module',
        bestFor: 'Data logging',
        specs: { cards: 'MicroSD', spi: 'Yes', speed: 'Class 10' }
    },
    {
        name: 'RC522 RFID',
        category: 'RFID Module',
        description: '13.56MHz RFID reader',
        voltage: '3.3V',
        current: '13-26mA',
        package: 'Module',
        bestFor: 'Access control',
        specs: { frequency: '13.56MHz', range: '5cm', spi: 'Yes' }
    },
    {
        name: 'GPS NEO-6M',
        category: 'GPS Module',
        description: 'GPS receiver module',
        voltage: '2.7-5V',
        current: '45mA',
        package: 'Module',
        bestFor: 'Location tracking',
        specs: { channels: '50', accuracy: '2.5m', uart: 'Yes' }
    },
    {
        name: '5V Relay Module',
        category: 'Relay Module',
        description: 'Optocoupled 5V relay board',
        voltage: '5V',
        current: '70mA',
        package: 'Module',
        bestFor: 'AC/DC switching',
        specs: { load: '10A 250VAC', isolation: 'Yes', led: 'Yes' }
    },
    {
        name: 'WS2812B LED',
        category: 'RGB LED Module',
        description: 'Addressable RGB LED',
        voltage: '5V',
        current: '60mA',
        package: '5050 SMD',
        bestFor: 'RGB lighting',
        specs: { colors: '16M', cascade: 'Yes', protocol: 'WS2812' }
    },
    {
        name: 'LoRa SX1278',
        category: 'LoRa Module',
        description: 'Long range LoRa transceiver',
        voltage: '1.8-3.7V',
        current: '120mA',
        package: 'Module',
        bestFor: 'Ultra long range IoT',
        specs: { frequency: '433/868/915MHz', range: '10km', spi: 'Yes' }
    }
];
