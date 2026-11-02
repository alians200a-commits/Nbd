import chaptersData from './chapters.json';
import topicsData from './topics.json';
import questionsData from './questions.json';
import pagesData from './pages.json';
import figuresData from './figures.json';
import atlasModelsData from './atlasModels.json';
import scenesData from './scenes.json';
import experimentsData from './experiments.json';
import diagramsData from './diagrams.json';
import ministerialQsData from './ministerialQs.json';
import cardsData from './cards.json';
import verifiedRecordsData from './verifiedRecords.json';
import anatomyLibData from './anatomyLib.json';

import {
  Chapter,
  Topic,
  Question,
  AtlasModel,
  Scene3D,
  Experiment,
  Diagram,
  MinisterialQuestion,
  VerifiedRecord,
  RecallCard,
} from '../types';

export const CHAPTERS: Chapter[] = chaptersData as Chapter[];
export const TOPICS: Topic[] = topicsData as Topic[];
export const QUESTIONS: Question[] = questionsData as Question[];
export const PAGES: Record<string, string> = pagesData as Record<string, string>;
export const FIGURES: Record<string, string> = figuresData as Record<string, string>;
export const ATLAS_MODELS: AtlasModel[] = atlasModelsData as AtlasModel[];
export const SCENES: Scene3D[] = scenesData as Scene3D[];
export const EXPERIMENTS: Experiment[] = experimentsData as Experiment[];
export const DIAGRAMS: Diagram[] = diagramsData as Diagram[];
export const MINISTERIAL_QS: MinisterialQuestion[] = ministerialQsData as MinisterialQuestion[];
export const RECALL_CARDS: RecallCard[] = cardsData as RecallCard[];
export const VERIFIED_RECORDS: VerifiedRecord[] = verifiedRecordsData as VerifiedRecord[];
export const ANATOMY_LIB = anatomyLibData;
