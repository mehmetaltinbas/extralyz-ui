import type React from 'react';
import type { PaginatedDocument } from 'src/shared/types/paginated-document.interface';
import type { Styles } from 'src/features/source/types/styles.interface';

export function DocumentViewMode({
    paginatedDocument,
    pageDimensions,
    constructTailwindClassNames,
    padding,
}: {
    paginatedDocument: PaginatedDocument;
    pageDimensions: {
        width: number;
        height: number;
    };
    constructTailwindClassNames(styles: Styles): string;
    padding: { x: number; y: number };
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4">
            {paginatedDocument.pages.map((page, pageIndex) => (
                <div
                    key={`page-${pageIndex}`}
                    className={`w-[${pageDimensions.width}px] h-[${pageDimensions.height}px] flex flex-col justify-start items-start shadow-[0_10px_20px_rgba(0,0,0,0.3)] px-[${padding.x}px] py-[${padding.y}px]`}
                >
                    {page.blockNodes.map((blockNode, blockNodeIndex) => (
                        <p
                            key={`page-${pageIndex}/block-node-${blockNodeIndex}`}
                            className="w-full flex gap-0 whitespace-pre "
                        >
                            {blockNode.content.map((inlineNode, inlineNodeIndex) => (
                                <span
                                    key={`page-${pageIndex}/block-node-${blockNodeIndex}/inline-node-${inlineNodeIndex}`}
                                    className={`${constructTailwindClassNames(inlineNode.styles)}`}
                                >
                                    {inlineNode.text}
                                </span>
                            ))}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
}
