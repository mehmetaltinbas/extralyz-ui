import React from 'react';
import { SourceType } from 'src/features/source/enums/source-type.enum';
import type { CreateSourceFormStrategy } from 'src/features/source/strategies/create-source-form/create-source-form-strategy.interface';
import { FIELD_ROW_CLASS, INPUT_CLASS, TEXTAREA_CLASS } from 'src/features/source/strategies/create-source-form/form-field-styles.constant';
import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export class RawTextFormStrategy implements CreateSourceFormStrategy {
    readonly label = 'Text';

    buildInitialDto(): CreateSourceDto {
        return { type: SourceType.RAW_TEXT, title: '', rawText: '' };
    }

    buildFormData(dto: CreateSourceDto): FormData {
        const formData = new FormData();
        if (dto.type) formData.append('type', dto.type);
        if (dto.title) formData.append('title', dto.title);
        if (dto.rawText) formData.append('rawText', dto.rawText);
        return formData;
    }

    renderFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
    ): React.ReactNode {
        return (
            <>
                <div className={FIELD_ROW_CLASS}>
                    <p>text: </p>
                    <textarea
                        onChange={(e) => setDto((prev) => ({ ...prev, rawText: e.target.value }))}
                        value={dto.rawText ?? ''}
                        placeholder="paste your text..."
                        className={TEXTAREA_CLASS}
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
