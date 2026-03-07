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
            className={`${isHidden ? 'hidden' : ''} relative border px-4.5 py-5.5 bg-white rounded-[10px]
            flex flex-col justify-center items-center gap-2 shadow-lg`}
        >
            <Button
                variant={ButtonVariant.ICON}
                className="absolute top-1 right-1"
                onClick={() => onClose()}
            >
                ✕
            </Button>
            {children}
        </div>
    );
}
