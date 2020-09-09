/**
 * A highlight structure, as returned by the index.
 * This structure can be used to do the actual highlighting job.
 */
export interface IHighlight {
  /**
   * The 0 based offset inside the string where the highlight should start.
   */
  offset: number;
  /**
   * The length of the offset.
   */
  length: number;
  /**
   * The group number for the highlight. A single string can have the same term highlighted multiple times.
   * This allows to regroup the different highlights.
   */
  dataHighlightGroup?: number;
  /**
   * The string that represent the highlight. A single string can have the same term highlighted multiple times.
   * This allows to regroup the different highlights.
   */
  dataHighlightGroupTerm?: string;
}

/**
 * The data about a single term to highlight.
 */
export interface IHighlightTerm {
  /**
   * The term that needs to be highlighted, as well as the list of stemming expansions.
   */
  [originalTerm: string]: string[];
}

/**
 * The data about a single phrase to highlight.
 */
export interface IHighlightPhrase {
  /**
   * The phrase that needs to be highlighted, with the different terms associated.
   */
  [phrase: string]: IHighlightTerm;
}
