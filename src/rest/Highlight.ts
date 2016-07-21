
export interface IHighlight {
  offset: number;
  length: number;
  dataHighlightGroup?: number
  dataHighlightGroupTerm?: string
}

export interface IHighlightTerm {
  [originalTerm: string]: string[]
}


export interface IHighlightPhrase {
  [phrase: string]: IHighlightTerm
}
