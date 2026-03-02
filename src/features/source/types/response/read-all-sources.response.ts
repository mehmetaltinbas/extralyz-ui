import type { ResponseBase } from 'src/shared/types/response-base';
import type { Source } from 'src/features/source/types/source.interface';

export interface ReadAllSourcesResponse extends ResponseBase {
    sources?: Source[];
}
