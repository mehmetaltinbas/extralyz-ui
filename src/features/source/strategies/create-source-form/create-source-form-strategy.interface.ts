import type { CreateSourceDto } from 'src/features/source/types/dto/create-source.dto';

export interface CreateSourceFormStrategy {
    readonly label: string;
    buildInitialDto(): CreateSourceDto;
    buildFormData(dto: CreateSourceDto, file?: File): FormData;
    renderFields(
        dto: CreateSourceDto,
        setDto: React.Dispatch<React.SetStateAction<CreateSourceDto>>,
        extra: { file?: File; setFile: (f?: File) => void; fileInputKey: number },
    ): React.ReactNode;
}
