import React from 'react';
import { PublicSourcePopupsProvider } from 'src/features/source/components/PublicSourcePopupsProvider';
import { PublicSourceWorkspacePageContent } from 'src/features/source/pages/PublicSourceWorkspacePageContent';
import type { Source } from 'src/features/source/types/source.interface';

export function PublicSourceWorkspacePage({
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
            <PublicSourcePopupsProvider source={source} ownerUserName={ownerUserName}>
                <PublicSourceWorkspacePageContent
                    source={source}
                    ownerUserName={ownerUserName}
                />
            </PublicSourcePopupsProvider>
        </div>
    ) : (
        <div className={`${isActiveComponent ? 'block' : 'hidden'}`}>undefined</div>
    );
}
