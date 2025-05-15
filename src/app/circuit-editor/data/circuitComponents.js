'use client';

export const circuitComponents = {
  categories: [
    {
      id: 'basic',
      name: 'Basic Components',
      components: [
        {
          id: 'resistor',
          type: 'resistor',
          label: 'Resistor',
          data: {
            label: 'Resistor',
            value: '1kΩ'
          }
        },
        {
          id: 'capacitor',
          type: 'capacitor',
          label: 'Capacitor',
          data: {
            label: 'Capacitor',
            value: '10μF'
          }
        },
        {
          id: 'inductor',
          type: 'inductor',
          label: 'Inductor',
          data: {
            label: 'Inductor',
            value: '10mH'
          }
        },
        {
          id: 'diode',
          type: 'diode',
          label: 'Diode',
          data: {
            label: 'Diode'
          }
        }
      ]
    },
    {
      id: 'sources',
      name: 'Power Sources',
      components: [
        {
          id: 'battery',
          type: 'battery',
          label: 'Battery',
          data: {
            label: 'Battery',
            voltage: '9V'
          }
        },
        {
          id: 'dc-source',
          type: 'battery',
          label: 'DC Source',
          data: {
            label: 'DC Source',
            voltage: '5V'
          }
        },
        {
          id: 'ground',
          type: 'ground',
          label: 'Ground',
          data: {
            label: 'Ground'
          }
        }
      ]
    },
    {
      id: 'switches',
      name: 'Switches',
      components: [
        {
          id: 'switch',
          type: 'switch',
          label: 'Switch',
          data: {
            label: 'Switch',
            state: 'closed'
          }
        },
        {
          id: 'push-button',
          type: 'switch',
          label: 'Push Button',
          data: {
            label: 'Push Button',
            state: 'open'
          }
        }
      ]
    },
    {
      id: 'integrated',
      name: 'Integrated Circuits',
      components: [
        {
          id: 'op-amp',
          type: 'ic',
          label: 'Op-Amp',
          data: {
            label: 'Op-Amp',
            inputs: 2,
            outputs: 1
          }
        },
        {
          id: 'and-gate',
          type: 'ic',
          label: 'AND Gate',
          data: {
            label: 'AND',
            inputs: 2,
            outputs: 1
          }
        },
        {
          id: 'or-gate',
          type: 'ic',
          label: 'OR Gate',
          data: {
            label: 'OR',
            inputs: 2,
            outputs: 1
          }
        },
        {
          id: 'not-gate',
          type: 'ic',
          label: 'NOT Gate',
          data: {
            label: 'NOT',
            inputs: 1,
            outputs: 1
          }
        },
        {
          id: 'flip-flop',
          type: 'ic',
          label: 'Flip-Flop',
          data: {
            label: 'Flip-Flop',
            inputs: 3,
            outputs: 2
          }
        }
      ]
    },
    {
      id: 'custom',
      name: 'Custom Components',
      components: [
        {
          id: 'custom-component',
          type: 'baseComponent',
          label: 'Custom Component',
          data: {
            label: 'Custom',
            borderColor: '#4CAF50',
            backgroundColor: '#E8F5E9'
          }
        }
      ]
    }
  ]
}; 