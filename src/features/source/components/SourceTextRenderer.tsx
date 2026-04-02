import { FontSize } from 'src/features/source/enums/font-size.enum';
import type { SourceTextNode } from 'src/features/source/types/source-text-node/source-text-node.interface';
import type { Styles } from 'src/features/source/types/source-text-node/styles.interface';

export function SourceTextRenderer({ sourceTextNode }: { sourceTextNode: SourceTextNode }) {
    function constructTailwindClassNames(styles: Styles): string {
        let className = '';

        if (styles.bold !== undefined && styles.bold === true) {
            className += `font-bold `;
        }

        if (styles.italic !== undefined && styles.italic === true) {
            className += `italic `;
        }

        const fontSizeClass: Record<FontSize, string> = {
            [FontSize.TITLE]: 'text-2xl',
            [FontSize.SUB_TITLE]: 'text-xl',
            [FontSize.BODY]: 'text-base',
        };
        className += fontSizeClass[styles.fontSize];

        return className;
    }

    return (
        <div className="flex flex-col justify-start items-center pb-8">
            <div
                className={`w-[325px] md:w-[900px] h-auto flex flex-col justify-start items-start overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.3)] px-8 py-6`}
            >
                {sourceTextNode.content.map((blockNode, blockNodeIndex) => (
                    <p
                        key={`block-node-${blockNodeIndex}`}
                        className="w-full whitespace-pre-wrap break-words pb-4 text-sm md:text-base"
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
        </div>
    );
}
