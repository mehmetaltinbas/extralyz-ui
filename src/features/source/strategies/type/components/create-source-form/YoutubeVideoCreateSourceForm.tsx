import type React from "react";
import type { CreateSourceDto } from "src/features/source/types/dto/create-source.dto";
import { Input } from "src/shared/components/Input";
import { InputSize } from "src/shared/enums/input-size.enum";

export function YoutubeVideoCreateSourceForm({
    dto,
    setDto
} : {
    dto: CreateSourceDto;
    setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>;
}) {
    return (
        <>
            <div className={'flex justify-center items-center gap-2'}>
                <p>url: </p>
                <Input
                    onChange={(e) => setDto((prev) => ({ ...prev, url: e.target.value }))}
                    size={InputSize.LG}
                    value={dto.url ?? ''}
                    placeholder="https://youtube.com/watch?v=..."
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
