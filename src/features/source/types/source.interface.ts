import type { SourceVisibility } from 'src/features/source/enums/source-visibility.enum';

export interface Source {
    _id: string;
    userId: string;
    type: string;
    rawText: string;
    locationType: string;
    location: string;
    title: string;
    visibility: SourceVisibility;
}
