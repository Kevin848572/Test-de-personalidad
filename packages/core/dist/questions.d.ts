import type { Question, MBTILetter } from './types.js';
export declare const questions: Question[];
export declare const columnMap: Record<number, {
    A: MBTILetter;
    B: MBTILetter;
}>;
export declare const dimensionPairs: Array<{
    l: MBTILetter;
    r: MBTILetter;
    label: string;
}>;
