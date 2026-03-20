import React from 'react';
import { SourcePopupsProvider } from 'src/features/source/components/SourcePopupsProvider';
import { SourcePageContent } from 'src/features/source/pages/SourcePageContent';
import { type Source } from 'src/features/source/types/source.interface';

export function SourcePage({ source, isActiveComponent }: { source: Source; isActiveComponent: boolean }) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return source ? (
        <div
            ref={containerRef}
            className={`relative w-full h-full p-2 ${isActiveComponent ? 'block' : 'hidden'}`}
        >
            <SourcePopupsProvider containerRef={containerRef} source={source}>
                <SourcePageContent source={source} />
            </SourcePopupsProvider>
        </div>
    ) : (
        <div className={`${isActiveComponent ? 'block' : 'hidden'}`}>No source</div>
    );
}
