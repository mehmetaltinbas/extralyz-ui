import React from 'react';
import { SourcePopupsProvider } from 'src/features/source/components/SourcePopupsProvider';
import { SourceTextRenderer } from 'src/features/source/components/SourceTextRenderer';
import { useSourcePopups } from 'src/features/source/hooks/use-source-popups.hook';
import type { SourceTextNode } from 'src/features/source/types/source-text-node/source-text-node.interface';
import { type Source } from 'src/features/source/types/source.interface';
import ActionMenuTriggerer from 'src/shared/components/ActionMenuTriggerer';

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

function SourcePageContent({ source }: { source: Source }) {
    const { openSourceActionMenu } = useSourcePopups();

    return (
        <div
            className="w-full h-auto pb-4 absolute
            flex flex-col justify-start items-center gap-4"
        >
            <div className='w-auto h-auto flex flex-col justify-start items-center'>
                <p className='text-lg font-bold'>{source.title}</p>

                <p className='italic'>{source.type}</p>

                <ActionMenuTriggerer
                    onClick={(event) => openSourceActionMenu(event)}
                />
            </div>

            <SourceTextRenderer sourceTextNode={JSON.parse(source.rawText) as SourceTextNode} />
        </div>
    );
}
