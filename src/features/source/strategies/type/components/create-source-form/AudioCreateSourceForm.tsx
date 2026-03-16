import type React from "react";
import type { CreateSourceDto } from "src/features/source/types/dto/create-source.dto";
import { Input } from "src/shared/components/Input";
import { InputSize } from "src/shared/enums/input-size.enum";

export function AudioCreateSourceForm({
    dto,
    setDto,
    extra
} : {
    dto: CreateSourceDto;
    setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>;
    extra: { file?: File; setFile: (f?: File) => void; fileInputKey: number };
}) {
    return (
        <>
            <div className={'flex justify-center items-center gap-2'}>
                <p>file: </p>
                <Input
                    inputKey={extra.fileInputKey}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        extra.setFile(file);
                    }}
                    type="file"
                    accept="audio/*"
                />
            </div>

            <div className={'flex justify-center items-center gap-2'}>
                <p>title: </p>
                <Input
                    onChange={(e) => setDto((prev) => ({ ...prev, title: e.target.value }))}
                    type="text"
                    size={InputSize.LG}
                    value={dto.title ?? ''}
                    placeholder="title..."
                />
            </div>
        </>
    );
}
