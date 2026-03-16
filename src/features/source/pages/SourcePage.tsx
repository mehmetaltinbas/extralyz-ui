import React from 'react';
import { SourcePopupsProvider } from 'src/features/source/components/SourcePopupsProvider';
import { SourcePageContent } from 'src/features/source/pages/SourcePageContent';
import { type Source } from 'src/features/source/types/source.interface';

export function SourcePage({ source, isActiveComponent }: { source: Source; isActiveComponent: boolean }) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className={`${isActiveComponent ? 'block' : 'hidden'} w-full h-full`}>
            {source ? (
                <div
                    ref={containerRef}
                    className={`w-full h-full relative p-2`}
                >
                    <SourcePopupsProvider containerRef={containerRef} source={source}>
                        <SourcePageContent source={source} />
                    </SourcePopupsProvider>
                </div>
            ) : (
                <div>No source</div>
            )}
        </div>
    );
}
