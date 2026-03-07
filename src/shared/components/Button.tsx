import type React from 'react';
import { buttonSizeStylesMap } from 'src/shared/constants/button-size-styles-map.constant';
import { buttonVariantStylesMap } from 'src/shared/constants/button-variant-styles-map.constant';
import { iconButtonSizeStylesMap } from 'src/shared/constants/icon-button-size-styles-map.constant';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function Button({
    children,
    variant = ButtonVariant.PRIMARY,
    size = ButtonSize.MD,
    onClick,
    className,
}: {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
}) {
    const variantStyles = buttonVariantStylesMap.get(variant);
    const isIcon = variant === ButtonVariant.ICON;
    const baseStyles = isIcon
        ? iconButtonSizeStylesMap.get(size)
        : buttonSizeStylesMap.get(size);

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
