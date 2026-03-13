import type { ResponseBase } from "src/shared/types/response-base";

export interface GetPdfResponse extends ResponseBase {
    pdfBase64?: string;
}
