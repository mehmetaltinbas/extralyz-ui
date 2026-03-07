import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function ActionMenu({
    isHidden,
    onClose,
    ref,
    children,
}: {
    isHidden: boolean;
    onClose: () => void;
    ref: React.RefObject<HTMLDivElement | null>;
    children: React.ReactNode;
}) {
    return (
        <div
            ref={ref}
            className={`absolute border px-4 py-5  bg-white rounded-[10px] shadow-md z-10
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'hidden'}`}
        >
            <Button
                variant={ButtonVariant.ICON}
                size={ButtonSize.SM}
                className="absolute top-0.5 right-0.5"
                onClick={() => onClose()}
            >
                ✕
            </Button>
            {children}
        </div>
    );
}
