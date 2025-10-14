// =============================================================================
// SCORE2 + SCORE2-OP 10-year cardiovascular risk calculator (ESC 2021)
// Supports all regions: low / moderate / high / very-high
// Automatically selects SCORE2 (<70y) or SCORE2-OP (≥70y)
// =============================================================================

export type Sex = "male" | "female";
export type Region = "low" | "moderate" | "high" | "very-high";

export interface Score2Input {
  sex: Sex;
  region: Region;
  age: number; // 40–89 years
  sbp: number; // systolic BP (mmHg)
  nonHdl: number; // mmol/L
  hdl: number; // mmol/L
  smoker: boolean;
}

export interface Score2Result {
  model: "SCORE2" | "SCORE2-OP";
  risk10yr: number; // fraction (e.g. 0.075)
  percent: number; // percent (e.g. 7.5)
}

/* -------------------------------------------------------------------------- */
/*                             SCORE2 (age 40–69)                             */
/* -------------------------------------------------------------------------- */

const SCORE2_COEFFS = {
  male: {
    lnAge: 3.112,
    lnSBP: 1.123,
    lnNonHDL: 0.9,
    lnHDL: -0.537,
    smoker: 0.653,
  },
  female: {
    lnAge: 2.721,
    lnSBP: 1.02,
    lnNonHDL: 0.59,
    lnHDL: -0.718,
    smoker: 0.618,
  },
};

const SCORE2_BASELINES = {
  male: {
    low: { S0: 0.97763, meanL: 12.618 },
    moderate: { S0: 0.97412, meanL: 12.618 },
    high: { S0: 0.97048, meanL: 12.618 },
    "very-high": { S0: 0.96532, meanL: 12.618 },
  },
  female: {
    low: { S0: 0.98847, meanL: 12.109 },
    moderate: { S0: 0.98605, meanL: 12.109 },
    high: { S0: 0.98328, meanL: 12.109 },
    "very-high": { S0: 0.97917, meanL: 12.109 },
  },
};

/* -------------------------------------------------------------------------- */
/*                           SCORE2-OP (age 70–89)                            */
/* -------------------------------------------------------------------------- */

const SCORE2_OP_COEFFS = {
  male: {
    lnAge: 1.739,
    lnSBP: 1.598,
    lnNonHDL: 0.948,
    lnHDL: -0.543,
    smoker: 0.502,
  },
  female: {
    lnAge: 2.019,
    lnSBP: 1.49,
    lnNonHDL: 0.755,
    lnHDL: -0.657,
    smoker: 0.469,
  },
};

const SCORE2_OP_BASELINES = {
  male: {
    low: { S0: 0.9061, meanL: 14.776 },
    moderate: { S0: 0.8785, meanL: 14.776 },
    high: { S0: 0.8501, meanL: 14.776 },
    "very-high": { S0: 0.8078, meanL: 14.776 },
  },
  female: {
    low: { S0: 0.9366, meanL: 14.01 },
    moderate: { S0: 0.9154, meanL: 14.01 },
    high: { S0: 0.892, meanL: 14.01 },
    "very-high": { S0: 0.858, meanL: 14.01 },
  },
};

/* -------------------------------------------------------------------------- */
/*                               Core functions                               */
/* -------------------------------------------------------------------------- */

function score2Model(
  sex: Sex,
  region: Region,
  age: number,
  sbp: number,
  nonHdl: number,
  hdl: number,
  smoker: boolean,
): Score2Result {
  const c = SCORE2_COEFFS[sex];
  const b = SCORE2_BASELINES[sex][region];

  const L =
    c.lnAge * Math.log(age) +
    c.lnSBP * Math.log(sbp) +
    c.lnNonHDL * Math.log(nonHdl) +
    c.lnHDL * Math.log(hdl) +
    c.smoker * (smoker ? 1 : 0);

  const risk = 1 - Math.pow(b.S0, Math.exp(L - b.meanL));
  return { model: "SCORE2", risk10yr: risk, percent: risk * 100 };
}

function score2OpModel(
  sex: Sex,
  region: Region,
  age: number,
  sbp: number,
  nonHdl: number,
  hdl: number,
  smoker: boolean,
): Score2Result {
  const c = SCORE2_OP_COEFFS[sex];
  const b = SCORE2_OP_BASELINES[sex][region];

  const L =
    c.lnAge * Math.log(age) +
    c.lnSBP * Math.log(sbp) +
    c.lnNonHDL * Math.log(nonHdl) +
    c.lnHDL * Math.log(hdl) +
    c.smoker * (smoker ? 1 : 0);

  const risk = 1 - Math.pow(b.S0, Math.exp(L - b.meanL));
  return { model: "SCORE2-OP", risk10yr: risk, percent: risk * 100 };
}

/* -------------------------------------------------------------------------- */
/*                            Public master function                           */
/* -------------------------------------------------------------------------- */

export function calcScore2Unified(input: Score2Input): Score2Result {
  const { age } = input;
  if (age < 40 || age > 89)
    throw new Error("Valid age range for SCORE2/SCORE2-OP: 40–89 years.");

  if (age < 70)
    return score2Model(
      input.sex,
      input.region,
      input.age,
      input.sbp,
      input.nonHdl,
      input.hdl,
      input.smoker,
    );
  else
    return score2OpModel(
      input.sex,
      input.region,
      input.age,
      input.sbp,
      input.nonHdl,
      input.hdl,
      input.smoker,
    );
}

/* -------------------------------------------------------------------------- */
/*                                   Example                                  */
/* -------------------------------------------------------------------------- */

const example1 = calcScore2Unified({
  sex: "male",
  region: "moderate",
  age: 55,
  sbp: 145,
  nonHdl: 4.5,
  hdl: 1.3,
  smoker: true,
});

console.log(`(${example1.model}) 10-yr risk: ${example1.percent.toFixed(1)}%`);

const example2 = calcScore2Unified({
  sex: "female",
  region: "low",
  age: 75,
  sbp: 160,
  nonHdl: 4.0,
  hdl: 1.4,
  smoker: false,
});

console.log(`(${example2.model}) 10-yr risk: ${example2.percent.toFixed(1)}%`);
