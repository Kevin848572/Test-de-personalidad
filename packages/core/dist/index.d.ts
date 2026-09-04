export type { DimensionPair, MBTILetter, MBTICode, Question, AnswerMap, ScoreVector, PersonalityInfo, TestResult, SessionUser } from './types.js';
export { questions, columnMap, dimensionPairs } from './questions.js';
export { personalities } from './personalities.js';
export { buildScoreVector, resolveCode, computeResult, getDimensionPairs } from './scoring.js';
