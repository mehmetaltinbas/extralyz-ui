import type React from 'react';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useClickOutside } from 'src/shared/hooks/use-click-outside.hook';

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
    useClickOutside(ref, onClose, !isHidden);
    return (
        <div
            ref={ref}
            className={`absolute border border-border px-4.5 py-5 bg-surface rounded-[10px] shadow-md z-10
            flex flex-col justify-center items-center gap-2
            ${isHidden && 'invisible'}`}
        >
            <div className='absolute top-0.5 right-1'>
                <Button
                    variant={ButtonVariant.ICON}
                    size={ButtonSize.SM}
                    onClick={() => onClose()}
                >
                    ✕
                </Button>
            </div>
            
            {children}
        </div>
    );
}
