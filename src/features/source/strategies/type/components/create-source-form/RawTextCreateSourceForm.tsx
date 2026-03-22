import type React from "react";
import type { CreateSourceDto } from "src/features/source/types/dto/create-source.dto";
import { Input } from "src/shared/components/Input";
import { Textarea } from "src/shared/components/Textarea";
import { InputSize } from "src/shared/enums/input-size.enum";
import { TextareaSize } from "src/shared/enums/textarea-size.enum";

export function RawTextCreateSourceForm({
    dto,
    setDto,
} : {
    dto: CreateSourceDto;
    setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>;
}) {
    return (
        <>
            <div className={'w-72 sm:w-108 flex justify-center items-center gap-2'}>
                <p>text: </p>
                <Textarea
                    onChange={(e) => setDto((prev) => ({ ...prev, rawText: e.target.value }))}
                    value={dto.rawText ?? ''}
                    placeholder="paste your text..."
                    size={TextareaSize.LG}
                    rows={3}
                />
            </div>

            <div className={'flex justify-center items-center gap-2'}>
                <p>title: </p>
                <Input
                    onChange={(e) => setDto((prev) => ({ ...prev, title: e.target.value }))}
                    size={InputSize.LG}
                    value={dto.title ?? ''}
                    placeholder="title..."
                />
            </div>
        </>
    );
}
