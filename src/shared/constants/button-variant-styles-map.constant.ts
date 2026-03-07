import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export const buttonVariantStylesMap: Map<ButtonVariant, string> = new Map([
    [
        ButtonVariant.PRIMARY,
        'bg-black text-white border-black hover:bg-white hover:text-black',
    ], // Main call-to-action
    [ButtonVariant.SECONDARY, 'bg-white text-black border-black hover:bg-gray-200'], //  Less prominent actions
    [
        ButtonVariant.OUTLINE,
        'bg-transparent text-black border-black hover:bg-black hover:text-white',
    ], // Border-only style
    [ButtonVariant.GHOST, 'bg-transparent text-black border-transparent hover:bg-gray-100'], // Minimal/text-only style
    [
        ButtonVariant.DANGER,
        'bg-[#9B1B30] text-white border-[#9B1B30] hover:bg-white hover:text-[#9B1B30]',
    ], // Destructive actions
    [ButtonVariant.ICON, 'bg-transparent text-gray-400 border-transparent hover:text-black'], // Icon-only button
]);
