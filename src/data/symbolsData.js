'use client';

// This file contains the data for P&ID symbols including SVG symbols from Edraw Max
const symbolsData = {
  categories: [
    { 
      id: 'pipe-type', 
      name: 'Pipe Type',
      symbols: [
        { 
          id: 'pipe-main', 
          name: 'Main Process', 
          type: 'svg-component',
          svgPath: '/symbols/pipe-main.svg',
          width: 80,
          height: 20
        },
        { 
          id: 'pipe-secondary', 
          name: 'Secondary', 
          type: 'svg-component',
          svgPath: '/symbols/pipe-secondary.svg',
          width: 80,
          height: 20
        },
        { 
          id: 'pipe-dashed', 
          name: 'Dashed Line', 
          type: 'svg-component',
          svgPath: '/symbols/pipe-dashed.svg',
          width: 80,
          height: 20
        },
        { 
          id: 'pipe-hydraulic', 
          name: 'Hydraulic', 
          type: 'svg-component',
          svgPath: '/symbols/pipe-hydraulic.svg',
          width: 80,
          height: 20
        },
        { 
          id: 'pipe-pneumatic', 
          name: 'Pneumatic', 
          type: 'svg-component',
          svgPath: '/symbols/pipe-pneumatic.svg',
          width: 80,
          height: 20
        },
        { 
          id: 'pipe-capillary', 
          name: 'Capillary', 
          type: 'svg-component',
          svgPath: '/symbols/pipe-capillary.svg',
          width: 80,
          height: 20
        }
      ]
    },
    { 
      id: 'inline-parts', 
      name: 'Inline Parts',
      symbols: [
        { 
          id: 'flange', 
          name: 'Flange', 
          type: 'svg-component',
          svgPath: '/symbols/flange.svg',
          width: 60,
          height: 20
        },
        { 
          id: 'reducer', 
          name: 'Reducer', 
          type: 'svg-component',
          svgPath: '/symbols/reducer.svg',
          width: 60,
          height: 20
        },
        { 
          id: 'expander', 
          name: 'Expander', 
          type: 'svg-component',
          svgPath: '/symbols/expander.svg',
          width: 60,
          height: 20
        },
        { 
          id: 'strainer', 
          name: 'Strainer', 
          type: 'svg-component',
          svgPath: '/symbols/strainer.svg',
          width: 60,
          height: 20
        },
        { 
          id: 'flow-meter', 
          name: 'Flow Meter', 
          type: 'svg-component',
          svgPath: '/symbols/flow-meter.svg',
          width: 60,
          height: 20
        },
        { 
          id: 'sight-glass', 
          name: 'Sight Glass', 
          type: 'svg-component',
          svgPath: '/symbols/sight-glass.svg',
          width: 60,
          height: 20
        }
      ]
    },
    { 
      id: 'valves-type1', 
      name: 'Valves Type1',
      symbols: [
        { 
          id: 'valve-gate', 
          name: 'Gate Valve', 
          type: 'svg-component',
          svgPath: '/symbols/gate-valve.svg',
          width: 40,
          height: 40
        },
        { 
          id: 'valve-globe', 
          name: 'Globe Valve', 
          type: 'svg-component',
          svgPath: '/symbols/globe-valve.svg',
          width: 40,
          height: 40
        },
        { 
          id: 'valve-check', 
          name: 'Check Valve', 
          type: 'svg-component',
          svgPath: '/symbols/valve-check.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-ball', 
          name: 'Ball Valve', 
          type: 'svg-component',
          svgPath: '/symbols/valve-ball.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-butterfly', 
          name: 'Butterfly Valve', 
          type: 'svg-component',
          svgPath: '/symbols/valve-butterfly.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-needle', 
          name: 'Needle Valve', 
          type: 'svg-component',
          svgPath: '/symbols/valve-needle.svg',
          width: 40,
          height: 20
        }
      ]
    },
    { 
      id: 'actuators', 
      name: 'Actuators',
      symbols: [
        { 
          id: 'actuator-manual', 
          name: 'Manual', 
          type: 'svg-component',
          svgPath: '/symbols/actuator-manual.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'actuator-motor', 
          name: 'Motor', 
          type: 'svg-component',
          svgPath: '/symbols/actuator-motor.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'actuator-solenoid', 
          name: 'Solenoid', 
          type: 'svg-component',
          svgPath: '/symbols/actuator-solenoid.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'actuator-diaphragm', 
          name: 'Diaphragm', 
          type: 'svg-component',
          svgPath: '/symbols/actuator-diaphragm.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'actuator-hydraulic', 
          name: 'Hydraulic', 
          type: 'svg-component',
          svgPath: '/symbols/actuator-hydraulic.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'actuator-pneumatic', 
          name: 'Pneumatic', 
          type: 'svg-component',
          svgPath: '/symbols/actuator-pneumatic.svg',
          width: 40,
          height: 20
        }
      ]
    },
    { 
      id: 'valves-other', 
      name: 'Valves Other',
      symbols: [
        { 
          id: 'valve-relief', 
          name: 'Relief Valve', 
          type: 'svg-component',
          svgPath: '/symbols/valve-relief.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-3way', 
          name: 'Three-Way', 
          type: 'svg-component',
          svgPath: '/symbols/valve-3way.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-4way', 
          name: 'Four-Way', 
          type: 'svg-component',
          svgPath: '/symbols/valve-4way.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-angle', 
          name: 'Angle Valve', 
          type: 'svg-component',
          svgPath: '/symbols/valve-angle.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-diaphragm', 
          name: 'Diaphragm', 
          type: 'svg-component',
          svgPath: '/symbols/valve-diaphragm.svg',
          width: 40,
          height: 20
        },
        { 
          id: 'valve-control', 
          name: 'Control Valve', 
          type: 'svg-component',
          svgPath: '/symbols/valve-control.svg',
          width: 40,
          height: 20
        }
      ]
    },
    // New category for SVG symbols from Edraw Max
    {
      id: 'svg-symbols',
      name: 'SVG Symbols',
      symbols: [
        { 
          id: 'svg-valve-gate', 
          name: 'Gate Valve SVG', 
          type: 'svg-component',
          svgPath: '/symbols/gate-valve.svg',
          width: 40,
          height: 40
        },
        { 
          id: 'svg-valve-globe', 
          name: 'Globe Valve SVG', 
          type: 'svg-component',
          svgPath: '/symbols/globe-valve.svg',
          width: 40,
          height: 40
        },
        { 
          id: 'svg-pump', 
          name: 'Pump SVG', 
          type: 'svg-component',
          svgPath: '/symbols/pump.svg',
          width: 50,
          height: 50
        },
        { 
          id: 'svg-tank', 
          name: 'Tank SVG', 
          type: 'svg-component',
          svgPath: '/symbols/tank.svg',
          width: 60,
          height: 80
        },
        { 
          id: 'svg-heat-exchanger', 
          name: 'Heat Exchanger SVG', 
          type: 'svg-component',
          svgPath: '/symbols/heat-exchanger.svg',
          width: 70,
          height: 40
        },
        { 
          id: 'svg-instrument', 
          name: 'Instrument SVG', 
          type: 'svg-component',
          svgPath: '/symbols/instrument.svg',
          width: 40,
          height: 40
        }
      ]
    }
  ]
};

export default symbolsData;