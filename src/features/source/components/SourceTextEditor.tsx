import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { SourceTextEditorToolbar } from 'src/features/source/components/SourceTextEditorToolbar';

export function SourceTextEditor({
    initialContent,
    onSave,
    onCancel,
    isSaving,
}: {
    initialContent: object;
    onSave: (content: object) => void;
    onCancel: () => void;
    isSaving: boolean;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2] },
                blockquote: false,
                bulletList: false,
                orderedList: false,
                codeBlock: false,
                code: false,
                horizontalRule: false,
                listItem: false,
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[300px] px-8 py-6',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col justify-start items-center pb-8 w-[325px] md:w-[900px]">
            <div className="sticky top-0 z-10 w-full">
                <SourceTextEditorToolbar
                    editor={editor}
                    onSave={() => onSave(editor.getJSON())}
                    onCancel={onCancel}
                    isSaving={isSaving}
                />
            </div>
            <div className="w-full h-auto shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
