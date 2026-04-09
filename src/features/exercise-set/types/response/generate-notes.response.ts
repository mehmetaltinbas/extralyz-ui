import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface GenerateNotesResponse extends ResponseBase {
    title?: string;
    rawText?: string;
}
