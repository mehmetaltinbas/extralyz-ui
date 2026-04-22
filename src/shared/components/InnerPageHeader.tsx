import { ArrowLeft } from 'lucide-react';
import type React from 'react';

export function InnerPageHeader({
    title,
    onBack,
    backLabel = 'Back to workspace',
    rightSlot,
}: {
    title: string;
    onBack?: () => void;
    backLabel?: string;
    rightSlot?: React.ReactNode;
}) {
    return (
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 md:px-6 py-3 bg-surface border-b border-border">
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {backLabel}
                </button>
            )}

            <h1 className="text-base font-semibold ml-2">{title}</h1>

            {rightSlot && <div className="ml-auto">{rightSlot}</div>}
        </div>
    );
}
