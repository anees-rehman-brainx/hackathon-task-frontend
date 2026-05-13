/**
 * @typedef {{ id: string, question: string }} ClarificationQuestion
 * @typedef {{ title: string, description: string, acceptanceCriteria: string[], dependencies?: string[], priority?: string, labels?: string[] }} PlainTicket
 * @typedef {{ outcome: 'clarifications_needed', questions: ClarificationQuestion[] } | { outcome: 'tickets_ready', tickets: PlainTicket[], notes?: string }} AnalyzeResponse
 * @typedef {{ outcome: 'tickets_ready', tickets: PlainTicket[], notes?: string }} FinalizeResponse
 */

export {};
