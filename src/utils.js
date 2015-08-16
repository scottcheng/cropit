export const exists = (v) => typeof v !== 'undefined';

export const round = (x) => +(Math.round(x * 1e2)  + 'e-2');

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
