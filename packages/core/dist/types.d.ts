export type DimensionPair = 'E/I' | 'S/N' | 'T/F' | 'J/P';
export type MBTILetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export type MBTICode = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
export interface Question {
    id: number;
    text: string;
    column: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    dim: DimensionPair;
}
export interface AnswerMap {
    [questionId: number]: 'A' | 'B';
}
export interface ScoreVector {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
}
export interface PersonalityInfo {
    titulo: string;
    descripcion: string;
    fortalezas: string[];
    debilidades: string[];
}
export interface TestResult {
    code: MBTICode;
    scores: ScoreVector;
    info: PersonalityInfo;
}
export interface SessionUser {
    name: string;
    email?: string;
}
