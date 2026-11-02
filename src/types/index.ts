export interface Chapter {
  id: number;
  name: string;
  start: number;
  end: number;
  icon: string;
  lab: string;
  detail: string;
  figure: number;
}

export interface Topic {
  id: string;
  ch: number;
  page: number;
  title: string;
  summary: string;
  quiz: string;
}

export interface Question {
  id: string;
  ch: number;
  page: number;
  q: string;
  a: string[];
  correct: number;
  explain: string;
  topic: string;
  source: string;
}

export interface AtlasModel {
  id: string;
  title: string;
  chapter: string;
  page: number;
  quality: string;
  url: string;
  license: string;
  source: string;
  description: string;
}

export interface ScenePart {
  0: string; // name
  1: string; // description
  2?: string; // mnemonic / formula
}

export interface Scene3D {
  id: string;
  ch: number;
  title: string;
  caption: string;
  page: number;
  mode: string;
  parts: [string, string, string?][];
}

export interface Experiment {
  id: string;
  name: string;
  chapter: number;
  page: number;
  states: string[];
  prompt: string;
  options: string[];
  right: number;
  explanation: string;
  flow?: string[];
  kind?: string;
  takeaway?: string;
}

export interface Diagram {
  id: string;
  page: number;
  chapter: number;
  title: string;
  labels: string[];
  src: string;
}

export interface MinisterialQuestion {
  id: string;
  chapter: number;
  pdfPage: number;
  question: string;
  answer: string;
  years?: (string | number)[];
  pageYears?: (string | number)[];
  ministerial?: boolean;
}

export interface VerifiedRecord {
  id: string;
  chapter: number;
  page: number;
  prompt: string;
  answer: string;
}

export interface RecallCard {
  id: string;
  ch: number;
  page: number;
  lab: string;
  q: string;
  a: string[];
  correct: number;
  why: string;
  evidence: string;
}

export interface AppState {
  points: number;
  tests: {
    date: string;
    chapter: number;
    score: number;
    total: number;
  }[];
  mistakes: Record<string, {
    question: string;
    chosen: string;
    correct: string;
    chapter: number;
    page: number;
    date: string;
  }>;
  cards: Record<string, number>;
  finishedTopics: Record<string, boolean>;
  homework: {
    id: string;
    title: string;
    chapter: number;
    done: boolean;
    dueDate: string;
  }[];
  studySessions: {
    date: string;
    durationMinutes: number;
    chapter: number;
  }[];
  dailyProgress: Record<string, number>;
  bookmarkedPages: number[];
  teacherVoiceSpeaker: 'B' | 'A';
  speechRate: number;
}
