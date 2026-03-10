import type { InlineNode } from 'src/features/source/types/source-text-node/inline-node.interface';

export interface BlockNode {
    content: InlineNode[];
}
