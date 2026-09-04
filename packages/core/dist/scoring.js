import { columnMap, dimensionPairs, questions } from './questions.js';
import { personalities } from './personalities.js';
const EMPTY_SCORES = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
function pickHigher(a, b, left, right) {
    return a >= b ? left : right;
}
export function buildScoreVector(answers) {
    const scores = { ...EMPTY_SCORES };
    for (const q of questions) {
        const val = answers[q.id];
        if (!val)
            continue;
        const map = columnMap[q.column];
        if (!map)
            continue;
        const letter = map[val];
        if (letter in scores)
            scores[letter]++;
    }
    return scores;
}
export function resolveCode(scores) {
    const e = pickHigher(scores.E, scores.I, 'E', 'I');
    const s = pickHigher(scores.S, scores.N, 'S', 'N');
    const t = pickHigher(scores.T, scores.F, 'T', 'F');
    const j = pickHigher(scores.J, scores.P, 'J', 'P');
    return (e + s + t + j);
}
export function computeResult(answers) {
    const scores = buildScoreVector(answers);
    const code = resolveCode(scores);
    const info = personalities[code];
    return { code, scores, info };
}
export function getDimensionPairs(scores) {
    return dimensionPairs.map((p) => {
        const lS = scores[p.l];
        const rS = scores[p.r];
        const tot = lS + rS || 1;
        const pct = (lS / tot) * 100;
        const winner = lS >= rS ? p.l : p.r;
        return { pair: p, lS, rS, pct, winner };
    });
}
export { dimensionPairs, personalities, questions };
