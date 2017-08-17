export interface SentenceByStatusInterface {
    [status: string]: SentenceInterface
}

export interface SentenceInterface {
    titleSentenceSingle: string,
    titleSentencePlural: string,
    dateStatusSentence: string
}