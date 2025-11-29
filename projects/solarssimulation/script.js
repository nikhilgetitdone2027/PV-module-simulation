// --- 1. VIEW SWITCH LOGIC ---
function switchView(viewName) {
    const btnConceptual = document.getElementById('btn-conceptual');
    const btnSchematic = document.getElementById('btn-schematic');
    const viewConceptual = document.getElementById('view-conceptual');
    const viewSchematic = document.getElementById('view-schematic');
    const detailPanel = document.getElementById('detail-panel');

    if (viewName === 'conceptual') {
        btnConceptual.classList.add('bg-white', 'text-tech-900', 'shadow-sm');
        btnConceptual.classList.remove('text-gray-500');
        btnSchematic.classList.remove('bg-white', 'text-tech-900', 'shadow-sm');
        btnSchematic.classList.add('text-gray-500');
        viewConceptual.classList.remove('hidden');
        viewConceptual.classList.add('flex');
        viewSchematic.classList.add('hidden');
        viewSchematic.classList.remove('flex');
        detailPanel.classList.remove('opacity-50', 'pointer-events-none');
    } else {
        btnSchematic.classList.add('bg-white', 'text-tech-900', 'shadow-sm');
        btnSchematic.classList.remove('text-gray-500');
        btnConceptual.classList.remove('bg-white', 'text-tech-900', 'shadow-sm');
        btnConceptual.classList.add('text-gray-500');
        viewSchematic.classList.remove('hidden');
        viewSchematic.classList.add('flex');
        viewConceptual.classList.add('hidden');
        viewConceptual.classList.remove('flex');
        detailPanel.classList.add('opacity-50', 'pointer-events-none');
    }
}

// --- 2. CALCULATOR LOGIC ---
function updateCalculations() {
    const P = parseFloat(document.getElementById('in_P').value);
    const Vin = parseFloat(document.getElementById('in_Vin').value);
    const Vout = parseFloat(document.getElementById('in_Vout').value);
    const fs = parseFloat(document.getElementById('in_fs').value);

    if (Vin >= Vout) {
        alert("Boost Converter Error: Vout must be greater than Vin.");
        return;
    }

    const D = (Vout - Vin) / Vout;
    const Iout_max = (0.96 * P) / Vout;
    const delIL = 0.01 * Iout_max * (Vout / Vin);
    const delVout = 0.01 * Vout;
    const L = (Vin * (Vout - Vin)) / (delIL * fs * Vout);
    const C = (Iout_max * (1 - (Vin / Vout))) / (fs * delVout);
    const R = Vout / Iout_max;

    document.getElementById('out_D').textContent = D.toFixed(2);
    document.getElementById('bar_D').style.width = (D * 100) + '%';
    document.getElementById('out_L').textContent = (L * 1000).toFixed(2);
    document.getElementById('out_C').textContent = (C * 1000000).toFixed(0);
    document.getElementById('out_R').textContent = R.toFixed(1);
}

// --- 3. EXPANDED COMPONENT DETAILS ---
const details = {
    'pv': {
        title: 'Solar PV Array',
        func: 'Generates power based on irradiance and temperature.',
        reason: 'Simulates a real solar panel’s behavior under changing conditions.',
        work: 'Provides variable voltage and current as input to the MPPT and converter system.'
    },
    'boost': {
        title: 'Boost Converter',
        func: 'Steps up voltage using Inductor (L), Switch, Diode, and Capacitor (C).',
        reason: 'Core energy conversion stage to raise low PV voltage to target level.',
        work: 'Alternates between charging inductor (ON) and transferring energy to load (OFF). Regulates flow based on Duty Cycle.'
    },
    'load': {
        title: 'Load',
        func: 'Represents power consumption.',
        reason: 'Simulates application-specific resistance.',
        work: 'Absorbs power delivered by the system. Calculated as R = Vout / Iout_max.'
    },
    'measure': {
        title: 'V & I Measurement',
        func: 'Measures Voltage and Current sensors.',
        reason: 'Required to calculate instantaneous Power (P = V x I) and monitor system behavior.',
        work: 'Supplies real-time feedback data to the MPPT logic and Scopes for visualization.'
    },
    'math': {
        title: 'Math Blocks (Sum/Product)',
        func: 'Performs arithmetic operations on signals.',
        reason: 'Essential for MPPT algorithm to calculate Delta P and Delta V.',
        work: 'Calculates Power (P = V*I) and Error signals for P&O logic.'
    },
    'mppt': {
        title: 'MPPT (P&O)',
        func: 'Perturb & Observe Algorithm using Delays and Relational Operators.',
        reason: 'Solar output varies; logic finds the "Sweet spot" (Maximum Power Point).',
        work: 'Compares P(k) vs P(k-1). If power increases, it keeps adjusting duty cycle in that direction. Uses Switch block for decision making.'
    },
    'pid': {
        title: 'PID Controller',
        func: 'Proportional-Integral-Derivative Control.',
        reason: 'The raw system response is underdamped. Simple P&O oscillates too much.',
        work: 'Tuned (Kp=181.48, Ti=0.0576) to eliminate steady-state error and stabilize voltage at exactly 150V.'
    },
    'pwm': {
        title: 'PWM & Saturation',
        func: 'Generates switching pulses; Saturation limits duty cycle.',
        reason: 'Prevent duty cycle overflow (keeping it between 0 and 1) to avoid simulation crashes.',
        work: 'Converts analog control signal into digital ON/OFF pulses for the IGBT.'
    },
    'powergui': {
        title: 'PowerGUI',
        func: 'Simulation environment configuration.',
        reason: 'Required for discrete simulation in Simulink power systems.',
        work: 'Sets solver type and step size for the entire model.'
    },
    'scope': {
        title: 'Scope',
        func: 'Graphically displays signals over time.',
        reason: 'To monitor and analyze transient response and stability.',
        work: 'Displays real-time waveforms of Voltage, Current, and Power.'
    }
};

function loadDetail(key) {
    const data = details[key];
    const container = document.getElementById('detail-content');
    container.innerHTML = `
        <div class="animate-pulse-fast">
            <h4 class="text-2xl font-bold text-white mb-2">${data.title}</h4>
            <div class="h-1 w-12 bg-solar-500 mb-6 rounded"></div>
            
            <div class="space-y-6">
                <div class="bg-white/10 p-3 rounded-lg">
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Function</div>
                    <p class="text-sm text-gray-100">${data.func}</p>
                </div>
                <div class="bg-white/10 p-3 rounded-lg">
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reason</div>
                    <p class="text-sm text-gray-100">${data.reason}</p>
                </div>
                <div class="bg-solar-500/20 p-3 rounded-lg border border-solar-500/30">
                    <div class="text-[10px] font-bold text-solar-400 uppercase tracking-widest mb-1">Work Done</div>
                    <p class="text-sm text-white italic">"${data.work}"</p>
                </div>
            </div>
        </div>
    `;
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    updateCalculations();
});
