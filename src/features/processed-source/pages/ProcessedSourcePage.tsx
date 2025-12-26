import { useEffect, useRef, useState } from 'react';
import type { ProcessedSource } from '../types/processed-source.interface';
import type { DocumentNode } from 'src/features/source/types/document-node.interface';
import { DocumentRenderer } from 'src/shared/components/document-render/DocumentRenderer';

export function ProcessedSourcePage({
    processedSource,
    className,
}: {
    processedSource: ProcessedSource;
    className?: string;
}) {
    const mainDiv = useRef<HTMLDivElement | null>(null);

    return processedSource ? (
        <div ref={mainDiv} className={`${className ?? ''} w-full h-full overflow-y-auto p-2`}>
            
            {mainDiv.current && <DocumentRenderer
                docNode={JSON.parse(processedSource.processedText) as DocumentNode}
                mode='view'
                mainDiv={mainDiv.current}
            />}
        </div>
    ) : (
        <></>
    );
}
