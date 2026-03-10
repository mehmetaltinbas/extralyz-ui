import { SourceType } from 'src/features/source/enums/source-type.enum';
import type { CreateSourceFormStrategy } from 'src/features/source/strategies/create-source-form/create-source-form-strategy.interface';
import { AudioFormStrategy } from 'src/features/source/strategies/create-source-form/strategies/audio-form.strategy';
import { DocumentFormStrategy } from 'src/features/source/strategies/create-source-form/strategies/document-form.strategy';
import { RawTextFormStrategy } from 'src/features/source/strategies/create-source-form/strategies/raw-text-form.strategy';
import { YouTubeVideoFormStrategy } from 'src/features/source/strategies/create-source-form/strategies/youtube-video-form.strategy';

export const createSourceFormStrategyMap = new Map<SourceType, CreateSourceFormStrategy>([
    [SourceType.DOCUMENT, new DocumentFormStrategy()],
    [SourceType.RAW_TEXT, new RawTextFormStrategy()],
    [SourceType.YOUTUBE_VIDEO, new YouTubeVideoFormStrategy()],
    [SourceType.AUDIO, new AudioFormStrategy()],
]);

export function selectCreateSourceFormStrategy(type: SourceType): CreateSourceFormStrategy | undefined {
    return createSourceFormStrategyMap.get(type);
}
