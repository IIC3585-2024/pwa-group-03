export const SimulatedConnection = {
    _isConnected: navigator.onLine,
    _isSimulationActive: false,

    get isConnected() {
        return this._isSimulationActive ? this._isConnected : navigator.onLine;
    },

    set isConnected(value) {
        this._isConnected = value;
        this._isSimulationActive = true;
        this.dispatchConnectionChanged();
    },

    resetSimulation() {
        this._isSimulationActive = false;
        this.dispatchConnectionChanged();
    },

    dispatchConnectionChanged() {
        const event = new CustomEvent('connectionChanged', { detail: { isConnected: this.isConnected } });
        window.dispatchEvent(event);
    }
};

window.addEventListener('online', () => !SimulatedConnection._isSimulationActive && SimulatedConnection.dispatchConnectionChanged());
window.addEventListener('offline', () => !SimulatedConnection._isSimulationActive && SimulatedConnection.dispatchConnectionChanged());
