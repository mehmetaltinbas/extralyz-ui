import type React from 'react';
import { buttonVariantStylesMap } from 'src/shared/constants/button-variant-styles-map.constant';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';

export function Button({
    children,
    variant = ButtonVariants.PRIMARY,
    onClick,
    className,
}: {
    children: React.ReactNode;
    variant?: ButtonVariants;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
}) {
    const variantStyles = buttonVariantStylesMap.get(variant);

    return (
        <button
            onClick={onClick}
            className={`w-auto cursor-pointer px-2 pt-[2px] pb-[1px] border-[2px] rounded-[10px] text-xs transition-colors
                ${variantStyles}
                ${className ?? ''}
            `}
        >
            {children}
        </button>
    );
}
