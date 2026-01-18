import type React from 'react';
import { useEffect, useState } from 'react';
import type { PaginatedDocument } from 'src/shared/types/paginated-document.interface';
import type { SelectedInlineNodeIndices } from 'src/shared/types/selected-inline-node-indices.interface';

export function Toolbar({ 
    paginatedDocument,
    setPaginatedDocument,
    selectedInlineNodeIndices,
    setIsPaginatedDocumentFlowChanged,
    triggerTextAreaConstruction
}: { 
    paginatedDocument: PaginatedDocument 
    setPaginatedDocument: React.Dispatch<React.SetStateAction<PaginatedDocument | undefined>>;
    selectedInlineNodeIndices: SelectedInlineNodeIndices;
    setIsPaginatedDocumentFlowChanged: React.Dispatch<React.SetStateAction<boolean>>;
    triggerTextAreaConstruction(selectedIndices: SelectedInlineNodeIndices, trigger: "click" | "enter"): void
}) {
    const [selectedInlineNode, setSelectedInlineNode] = useState(paginatedDocument.pages[selectedInlineNodeIndices.pageIndex].blockNodes[selectedInlineNodeIndices.blockNodeIndex].content[selectedInlineNodeIndices.inlineNodeIndex]);

    useEffect(() => {
        setSelectedInlineNode(paginatedDocument.pages[selectedInlineNodeIndices.pageIndex].blockNodes[selectedInlineNodeIndices.blockNodeIndex].content[selectedInlineNodeIndices.inlineNodeIndex]);
    }, [paginatedDocument, selectedInlineNodeIndices]);

    function setFontSize(event: React.ChangeEvent<HTMLInputElement>) {
        const htmlInputElement = event.currentTarget;
        const value = Number(htmlInputElement.value) * 72 / import.meta.env.VITE_DPI;
        setPaginatedDocument(prev => {
            const clone = structuredClone(prev);
            const selectedInlineNodeLocal = clone?.pages[selectedInlineNodeIndices.pageIndex].blockNodes[selectedInlineNodeIndices.blockNodeIndex].content[selectedInlineNodeIndices.inlineNodeIndex].styles; 
            selectedInlineNodeLocal!.fontSize = value;
            return clone;
        });
        triggerTextAreaConstruction(selectedInlineNodeIndices, 'click');
        setIsPaginatedDocumentFlowChanged(true);
    }

    function toggleBoldness() {
        setPaginatedDocument(prev => {
            const clone = structuredClone(prev);
            const selectedInlineNodeLocal = clone?.pages[selectedInlineNodeIndices.pageIndex].blockNodes[selectedInlineNodeIndices.blockNodeIndex].content[selectedInlineNodeIndices.inlineNodeIndex].styles; 
            selectedInlineNodeLocal!.bold = !selectedInlineNode.styles.bold;
            return clone;
        });
        triggerTextAreaConstruction(selectedInlineNodeIndices, 'click');
    }

    function toggleItalicness() {
        setPaginatedDocument(prev => {
            const clone = structuredClone(prev);
            const selectedInlineNodeLocal = clone?.pages[selectedInlineNodeIndices.pageIndex].blockNodes[selectedInlineNodeIndices.blockNodeIndex].content[selectedInlineNodeIndices.inlineNodeIndex].styles; 
            selectedInlineNodeLocal!.italic = !selectedInlineNode.styles.italic;
            return clone;
        });
        triggerTextAreaConstruction(selectedInlineNodeIndices, 'click');
    }

    return (
        <div className="h-full fixed right-0 top-0 p-2 flex flex-col justify-center pointer-events-none">
            <div className="px-2 py-1 border flex flex-col justify-center items-center gap-2 bg-white rounded-[10px] pointer-events-auto">
                <p className='text-xl underline'>toolbar</p>
                <div className='flex justify-center items-center gap-1'>
                    <p>font-size</p>
                    <input 
                        type='number' 
                        onChange={event => setFontSize(event)}
                        value={Math.floor((selectedInlineNode.styles.fontSize * import.meta.env.VITE_DPI) / 72)}
                        className='border w-[40px] h-auto rounded-[2px]'
                    />
                </div>
                <p 
                    onClick={toggleBoldness}
                    className={`${selectedInlineNode.styles.bold ? 'font-bold' : ''} cursor-pointer`}
                >boldness</p>
                <p 
                    onClick={toggleItalicness}
                    className={`${selectedInlineNode.styles.italic ? 'italic' : ''} cursor-pointer`}
                >italic</p>
            </div>
        </div>
    );
}
