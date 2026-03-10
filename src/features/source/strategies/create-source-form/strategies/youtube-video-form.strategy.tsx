import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import type { CreateSourceFormStrategy } from 'src/features/source/strategies/create-source-form/create-source-form-strategy.interface';
import { FIELD_ROW_CLASS, INPUT_CLASS } from 'src/features/source/strategies/create-source-form/form-field-styles.constant';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export class YouTubeVideoFormStrategy implements CreateSourceFormStrategy {
    readonly label = 'YouTube Video';

    buildInitialDto(): CreateSourceDto {
        return { type: SourceType.YOUTUBE_VIDEO, title: '', url: '' };
    }

    buildFormData(dto: CreateSourceDto): FormData {
        const formData = new FormData();
        if (dto.type) formData.append('type', dto.type);
        if (dto.title) formData.append('title', dto.title);
        if (dto.url) formData.append('url', dto.url);
        return formData;
    }

    renderFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
    ): React.ReactNode {
        return (
            <>
                <div className={FIELD_ROW_CLASS}>
                    <p>url: </p>
                    <input
                        onChange={(e) => setDto((prev) => ({ ...prev, url: e.target.value }))}
                        type="text"
                        value={dto.url ?? ''}
                        placeholder="https://youtube.com/watch?v=..."
                        className={INPUT_CLASS}
                    />
                </div>

                <div className={FIELD_ROW_CLASS}>
                    <p>title: </p>
                    <input
                        onChange={(e) => setDto((prev) => ({ ...prev, title: e.target.value }))}
                        type="text"
                        value={dto.title ?? ''}
                        placeholder="title..."
                        className={INPUT_CLASS}
                    />
                </div>
            </>
        );
    }
}
