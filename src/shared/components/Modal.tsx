import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function Modal({
    isHidden,
    onClose,
    children,
}: {
    isHidden: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`${isHidden ? 'hidden' : ''} relative border border-border px-5 py-5.5 bg-surface rounded-[10px] max-w-[90vw]
            flex flex-col justify-center items-center gap-2 shadow-lg`}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className='absolute top-1 right-1.5'>
                <Button
                    variant={ButtonVariant.ICON}
                    onClick={() => onClose()}
                >
                    ✕
                </Button>
            </div>
            
            {children}
        </div>
    );
}
