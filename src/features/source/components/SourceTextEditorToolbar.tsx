import { type Editor, useEditorState } from '@tiptap/react';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function SourceTextEditorToolbar({
    editor,
    onSave,
    onCancel,
    isSaving,
}: {
    editor: Editor;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}) {
    const activeStates = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            h1: editor.isActive('heading', { level: 1 }),
            h2: editor.isActive('heading', { level: 2 }),
        }),
    });

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-border bg-surface-alt">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant={activeStates.bold ? ButtonVariant.SECONDARY : ButtonVariant.GHOST}
                size={ButtonSize.SM}
            >
                Bold
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant={activeStates.italic ? ButtonVariant.SECONDARY : ButtonVariant.GHOST}
                size={ButtonSize.SM}
            >
                Italic
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                variant={activeStates.h1 ? ButtonVariant.SECONDARY : ButtonVariant.GHOST}
                size={ButtonSize.SM}
            >
                Title
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                variant={activeStates.h2 ? ButtonVariant.SECONDARY : ButtonVariant.GHOST}
                size={ButtonSize.SM}
            >
                Subtitle
            </Button>

            <div className="flex gap-2 ml-auto">
                <Button
                    onClick={onSave}
                    disabled={isSaving}
                    variant={ButtonVariant.PRIMARY}
                    size={ButtonSize.SM}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>

                <Button
                    onClick={onCancel}
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
