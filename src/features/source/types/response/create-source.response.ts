import type { ResponseBase } from "src/shared/types/response-base.interface";

export interface CreateSourceResponse extends ResponseBase {
    sourceId?: string;
}
