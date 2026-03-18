import type { ResponseBase } from "src/shared/types/response-base.interface";

export interface GetPdfResponse extends ResponseBase {
    pdfBase64?: string;
}
