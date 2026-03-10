import type { Source } from 'src/features/source/types/source.interface';
import type { ResponseBase } from 'src/shared/types/response-base';

export interface ReadAllSourcesResponse extends ResponseBase {
    sources?: Source[];
}
