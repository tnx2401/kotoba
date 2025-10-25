export function getNextReview(
  grade: 0 | 1 | 2 | 3,
  EF: number,
  interval: number,
  repetition: number
) {
  let newEF = EF;
  let newInterval = 1;
  let newRepetition = repetition;

  if (grade === 0) {
    newRepetition = 0;
    newInterval = 1;
  } else {
    newRepetition += 1;
    if (newRepetition === 1) {
      newInterval = 1;
    } else if (newRepetition === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * EF);
    }
  }

  const q = grade + 2;
  newEF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  return {
    EF: parseFloat(newEF.toFixed(2)),
    interval: newInterval,
    repetition: newRepetition,
  };
}
