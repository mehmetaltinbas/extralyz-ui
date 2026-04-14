import React from 'react';
import { PublicSourcePageContent } from 'src/features/source/pages/PublicSourcePageContent';
import type { Source } from 'src/features/source/types/source.interface';

export function PublicSourcePage({
    source,
    ownerUserName,
    isActiveComponent,
}: {
    source?: Source;
    ownerUserName: string;
    isActiveComponent: boolean;
}) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return source ? (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${isActiveComponent ? 'block' : 'hidden'}`}
        >
            <PublicSourcePageContent
                source={source}
                ownerUserName={ownerUserName}
            />
        </div>
    ) : (
        <div className={`${isActiveComponent ? 'block' : 'hidden'}`}>undefined</div>
    );
}
