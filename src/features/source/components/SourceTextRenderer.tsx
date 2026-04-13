import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function SourceTextRenderer({ content }: { content: object }) {
    const editor = useEditor({
        immediatelyRender: false,
        editable: false,
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
        content: content,
        editorProps: {
            attributes: {
                class: 'px-8 py-6',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col justify-start items-center pb-8">
            <div className="w-[325px] md:w-[900px] h-auto flex flex-col justify-start items-start overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
