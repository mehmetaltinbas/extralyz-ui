import { SourceCard } from 'src/features/source/components/SourceCard';
import { useSourcesPopups } from 'src/features/source/hooks/use-sources-popups.hook';
import type { Source } from 'src/features/source/types/source.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function SourcesPageContent({ sources }: { sources: Source[] }) {
    const { openCreateSourceForm } = useSourcesPopups();

    return (
        <div
            className={`absolute w-full h-auto p-4
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`}
        >
            <div
                className="relative w-full h-auto p-4 col-span-1 sm:col-span-2 lg:col-span-3
                flex flex justify-center items-center gap-2"
            >
                <p className="text-2xl font-bold">Sources</p>

                <Button variant={ButtonVariant.PRIMARY} onClick={openCreateSourceForm}>
                    New Source
                </Button>
            </div>

            {sources.map((source) => (
                <div key={`source-card-${source._id}`} className="flex justify-center items-center">
                    <SourceCard
                        source={source}
                    />
                </div>
            ))}
        </div>
    );
}
