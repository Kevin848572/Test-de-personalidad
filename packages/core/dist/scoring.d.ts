import type { AnswerMap, MBTICode, ScoreVector, TestResult } from './types.js';
import { dimensionPairs, questions } from './questions.js';
import { personalities } from './personalities.js';
export declare function buildScoreVector(answers: AnswerMap): ScoreVector;
export declare function resolveCode(scores: ScoreVector): MBTICode;
export declare function computeResult(answers: AnswerMap): TestResult;
export declare function getDimensionPairs(scores: ScoreVector): {
    pair: {
        l: import("./types.js").MBTILetter;
        r: import("./types.js").MBTILetter;
        label: string;
    };
    lS: number;
    rS: number;
    pct: number;
    winner: import("./types.js").MBTILetter;
}[];
export { dimensionPairs, personalities, questions };
