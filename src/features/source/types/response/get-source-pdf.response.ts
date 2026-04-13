import type { ResponseBase } from "src/shared/types/response-base.interface";

export interface GetSourcePdfResponse extends ResponseBase {
    pdfBase64?: string;
}
