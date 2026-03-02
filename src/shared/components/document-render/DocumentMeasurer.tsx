import type React from 'react';
import type { DocumentNode } from 'src/features/source/types/document-node.interface';
import type { Styles } from 'src/features/source/types/styles.interface';

export function DocumentMeasurer({
    documentNode,
    blockNodesRef,
    constructTailwindClassNames,
    pageDimensions,
    padding,
}: {
    documentNode: DocumentNode;
    blockNodesRef: React.RefObject<(HTMLParagraphElement | null)[]>;
    constructTailwindClassNames(styles: Styles): string;
    pageDimensions: { width: number; height: number };
    padding: { x: number; y: number };
}) {
    return (
        <div
            className={`invisible w-[${pageDimensions.width}px] h-auto flex flex-col justify-start items-start shadow-[0_10px_20px_rgba(0,0,0,0.3)] px-[${padding.x}px] overflow-y-auto`}
        >
            {documentNode.content.map((blockNode, blockNodeIndex) => (
                <p
                    ref={(element) => {
                        blockNodesRef.current[blockNodeIndex] = element;
                    }}
                    id={`block-node-${blockNodeIndex}`}
                    key={`block-node-${blockNodeIndex}`}
                    className="flex gap-0 whitespace-pre"
                >
                    {blockNode.content.map((inlineNode, inlineNodeIndex) => (
                        <span
                            key={`block-node-${blockNodeIndex}/inline-node-${inlineNodeIndex}`}
                            className={`${constructTailwindClassNames(inlineNode.styles)}`}
                        >
                            {inlineNode.text}
                        </span>
                    ))}
                </p>
            ))}
        </div>
    );
}
