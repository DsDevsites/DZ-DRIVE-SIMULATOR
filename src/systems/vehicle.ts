export type PartId = 'turbo' | 'intercooler' | 'clutch' | 'tyres' | 'suspension' | 'exhaust' | 'brakes';
export type Setup = { color: string; turbo: string; boost: number; pipe: number; intercooler: boolean; clutch: boolean; tyres: boolean; suspension: boolean; exhaust: boolean; brakes: boolean };
export const DEFAULT_SETUP: Setup = { color: '#1769ff', turbo: 'T25 street', boost: 0.7, pipe: 2.5, intercooler: true, clutch: false, tyres: false, suspension: false, exhaust: false, brakes: false };
export function calculateStats(s: Setup) {
  const boost = Math.max(0, s.boost);
  const turboFactor = s.turbo === 'T3 médio' ? 1.08 : s.turbo === 'T4 grande' ? 1.18 : 1;
  const intercoolerFactor = s.intercooler ? 1.06 : 1;
  const exhaustFactor = s.exhaust ? 1.035 : 1;
  const power = Math.round((105 + boost * 72) * turboFactor * intercoolerFactor * exhaustFactor);
  const torque = Math.round((150 + boost * 105) * (s.turbo === 'T4 grande' ? 1.04 : 1));
  const weight = 1080 + (s.intercooler ? 12 : 0) + (s.brakes ? 8 : 0) + (s.suspension ? -8 : 0);
  const grip = 0.78 + (s.tyres ? 0.13 : 0) + (s.suspension ? 0.04 : 0);
  const zeroToHundred = Math.max(4.8, 11.8 - power / 32 - (grip - 0.78) * 10 + (s.clutch ? -0.25 : 0));
  const topSpeed = Math.round(165 + power * 0.48);
  const lag = Math.round((s.turbo === 'T4 grande' ? 1.65 : s.turbo === 'T3 médio' ? 1.05 : 0.62) * (1 + boost * 0.12) * 100) / 100;
  return { power, torque, weight, ratio: +(weight / power).toFixed(2), zeroToHundred: +zeroToHundred.toFixed(1), topSpeed, grip: +grip.toFixed(2), lag };
}
export const PARTS: {id:PartId;name:string;detail:string;key:keyof Setup;weight:number}[] = [
 {id:'turbo',name:'Turbina',detail:'T25 street • resposta rápida',key:'turbo',weight:0},
 {id:'intercooler',name:'Intercooler frontal',detail:'Reduz temperatura do ar admitido',key:'intercooler',weight:12},
 {id:'clutch',name:'Embreagem reforçada',detail:'Maior capacidade de transmissão de torque',key:'clutch',weight:0},
 {id:'tyres',name:'Pneus semi-slick',detail:'Mais aderência em aceleração e curvas',key:'tyres',weight:0},
 {id:'suspension',name:'Suspensão coilover',detail:'Altura e estabilidade aprimoradas',key:'suspension',weight:-8},
 {id:'exhaust',name:'Escape 3 polegadas',detail:'Menor restrição no fluxo de gases',key:'exhaust',weight:0},
 {id:'brakes',name:'Freios ventilados',detail:'Maior capacidade térmica de frenagem',key:'brakes',weight:8},
];
