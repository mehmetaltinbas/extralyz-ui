import type { SourceVisibility } from "src/features/source/enums/source-visibility.enum";

export interface CloneSourceDto {
    title: string;
    visibility: SourceVisibility;
}
