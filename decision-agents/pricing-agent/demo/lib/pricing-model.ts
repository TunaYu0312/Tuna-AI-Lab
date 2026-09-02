export const baseline = {
  price: 39,
  cost: 16.6,
  adtc: 428,
  uph: 18.6,
};

export type PricingSimulation = {
  priceChange: number;
  demandChange: number;
  units: number;
  gp: number;
  gpChange: number;
  incremental28d: number;
  gm: number;
  mix: number;
};

export function simulatePricing({
  price,
  elasticity,
  trafficPercent,
  stores = 20,
  days = 28,
}: {
  price: number;
  elasticity: number;
  trafficPercent: number;
  stores?: number;
  days?: number;
}): PricingSimulation {
  const priceChange = price / baseline.price - 1;
  const priceResponse = 1 + elasticity * priceChange;
  const demandFactor = Math.max(0.55, priceResponse) * (1 + trafficPercent / 100);
  const baseUnits = baseline.adtc * baseline.uph / 100;
  const units = baseUnits * demandFactor;
  const gp = units * (price - baseline.cost);
  const baseGp = baseUnits * (baseline.price - baseline.cost);

  return {
    priceChange: priceChange * 100,
    demandChange: (demandFactor - 1) * 100,
    units,
    gp,
    gpChange: (gp / baseGp - 1) * 100,
    incremental28d: (gp - baseGp) * stores * days,
    gm: (price - baseline.cost) / price * 100,
    mix: baseline.uph * demandFactor,
  };
}
