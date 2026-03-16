import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export const buttonVariantStylesMap: Map<ButtonVariant, string> = new Map([
    [
        ButtonVariant.PRIMARY,
        'bg-btn-primary-bg text-btn-primary-text border-btn-primary-bg hover:bg-btn-primary-hover-bg hover:text-btn-primary-hover-text',
    ], // Main call-to-action
    [ButtonVariant.SECONDARY, 'bg-surface text-text-primary border-border-strong hover:bg-surface-hover'], //  Less prominent actions
    [
        ButtonVariant.OUTLINE,
        'bg-transparent text-text-primary border-border-strong hover:bg-btn-primary-bg hover:text-btn-primary-text',
    ], // Border-only style
    [ButtonVariant.GHOST, 'bg-transparent text-text-primary border-transparent hover:bg-surface-hover'], // Minimal/text-only style
    [
        ButtonVariant.DANGER,
        'bg-accent text-text-inverted border-accent hover:bg-accent-hover hover:text-accent',
    ], // Destructive actions
    [ButtonVariant.ICON, 'bg-transparent text-text-muted border-transparent hover:text-text-primary'], // Icon-only button
]);
