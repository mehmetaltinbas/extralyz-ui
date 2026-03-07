export function computeDropIndex(params: {
    dropTargetIndex: number | undefined;
    sourceIndex: number | undefined;
    dropSide: 'left' | 'right' | 'empty';
}): number | undefined {
    const { dropTargetIndex, sourceIndex, dropSide } = params;

    if (dropSide === 'empty' || dropTargetIndex === undefined) {
        return undefined;
    }

    if (sourceIndex === undefined) { // dropping from sidebar
        return dropSide === 'left' ? dropTargetIndex : dropTargetIndex + 1;
    }

    // reordering existing tab
    if (dropSide === 'left') {
        return dropTargetIndex > sourceIndex ? dropTargetIndex - 1 : dropTargetIndex;
    }
    
    // dropSide === 'right'
    return dropTargetIndex > sourceIndex ? dropTargetIndex : dropTargetIndex + 1;
}
