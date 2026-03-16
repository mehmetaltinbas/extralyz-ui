import React from 'react';
import { SourcePageContent } from 'src/features/source/pages/SourcePageContent';
import { SourcePopupsProvider } from 'src/features/source/components/SourcePopupsProvider';
import { type Source } from 'src/features/source/types/source.interface';

export function SourcePage({ source, className }: { source: Source; className?: string }) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return source ? (
        <div
            ref={containerRef}
            className={`${className ?? ''} w-full h-full relative p-2`}
        >
            <SourcePopupsProvider containerRef={containerRef} source={source}>
                <SourcePageContent source={source} />
            </SourcePopupsProvider>
        </div>
    ) : (
        <>No source</>
    );
}

