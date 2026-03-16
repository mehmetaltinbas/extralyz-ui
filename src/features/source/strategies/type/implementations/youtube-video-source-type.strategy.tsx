import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import { YoutubeVideoCreateSourceForm } from 'src/features/source/strategies/type/components/create-source-form/YoutubeVideoCreateSourceForm';
import type { SourceTypeStrategy } from 'src/features/source/strategies/type/source-type-strategy.interface';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export class YouTubeVideoSourceTypeStrategy implements SourceTypeStrategy {
    readonly sourceType = SourceType.YOUTUBE_VIDEO;

    buildInitialCreateSourceDto(): CreateSourceDto {
        return { type: SourceType.YOUTUBE_VIDEO, title: '', url: '' };
    }

    buildCreateSourceFormData(dto: CreateSourceDto): FormData {
        const formData = new FormData();
        if (dto.type) formData.append('type', dto.type);
        if (dto.title) formData.append('title', dto.title);
        if (dto.url) formData.append('url', dto.url);
        return formData;
    }

    renderCreateSourceFormFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
    ): React.ReactNode {
        return (
            <YoutubeVideoCreateSourceForm
                dto={dto}
                setDto={setDto}
            />
        );
    }
}
