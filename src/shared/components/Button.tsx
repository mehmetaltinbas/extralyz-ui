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
    const isIcon = variant === ButtonVariants.ICON;
    const baseStyles = isIcon
        ? 'p-0 w-6 h-6 rounded-full text-sm flex items-center justify-center'
        : 'px-2 pt-[2px] pb-[1px] rounded-[10px] text-xs';

    return (
        <button
            onClick={onClick}
            className={`w-auto cursor-pointer border-[2px] transition-colors ${baseStyles}
                ${variantStyles}
                ${className ?? ''}
            `}
        >
            {children}
        </button>
    );
}
