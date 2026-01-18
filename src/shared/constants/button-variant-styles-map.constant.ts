import { ButtonVariants } from "src/shared/enums/button-variants.enum";

export const buttonVariantStylesMap: Map<ButtonVariants, string> = new Map([
    [ButtonVariants.PRIMARY, "bg-black text-white border-black hover:bg-white hover:text-black"], // Main call-to-action
    [ButtonVariants.SECONDARY, "bg-white text-black border-black hover:bg-gray-100"], //  Less prominent actions
    [ButtonVariants.OUTLINE, "bg-transparent text-black border-black hover:bg-black hover:text-white"], // Border-only style
    [ButtonVariants.GHOST, "bg-transparent text-black border-transparent hover:bg-gray-100"], // Minimal/text-only style
    [ButtonVariants.DANGER, "bg-[#9B1B30] text-white border-[#9B1B30] hover:bg-white hover:text-[#9B1B30]"] // Destructive actions
]);
