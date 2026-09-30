export const QUIZ_VERSION_REPOSITORY = Symbol('QUIZ_VERSION_REPOSITORY');
export const SCORING_STRATEGIES = Symbol('SCORING_STRATEGIES');

/** The quiz served by the funnel. */
export const DEFAULT_QUIZ_KEY = 'adhd';

export enum QuizVersionStatus {
  Draft = 'draft',
  Published = 'published',
  Retired = 'retired'
}

export enum TraitLevel {
  High = 'high',
  Low = 'low'
}
