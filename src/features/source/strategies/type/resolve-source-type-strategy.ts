import { SourceType } from 'src/features/source/enums/source-type.enum';
import { AudioSourceTypeStrategy } from 'src/features/source/strategies/type/implementations/audio-source-type.strategy';
import { DocumentSourceTypeStrategy } from 'src/features/source/strategies/type/implementations/document-source-type.strategy';
import { RawTextSourceTypeStrategy } from 'src/features/source/strategies/type/implementations/raw-text-source-type.strategy';
import { YouTubeVideoSourceTypeStrategy } from 'src/features/source/strategies/type/implementations/youtube-video-source-type.strategy';
import type { SourceTypeStrategy } from 'src/features/source/strategies/type/source-type-strategy.interface';

const map = new Map<SourceType, SourceTypeStrategy>([
    [SourceType.DOCUMENT, new DocumentSourceTypeStrategy()],
    [SourceType.RAW_TEXT, new RawTextSourceTypeStrategy()],
    [SourceType.YOUTUBE_VIDEO, new YouTubeVideoSourceTypeStrategy()],
    [SourceType.AUDIO, new AudioSourceTypeStrategy()],
]);

export function resolveSourceTypeStrategy(type: SourceType): SourceTypeStrategy | undefined {
    return map.get(type);
}
