import { ButtonSize } from 'src/shared/enums/button-size.enum';

export const iconButtonSizeStylesMap: Map<ButtonSize, string> = new Map([
    [ButtonSize.SM, 'p-0 w-5 h-5 rounded-full text-xs flex items-center justify-center'],
    [ButtonSize.MD, 'p-0 w-6 h-6 rounded-full text-sm flex items-center justify-center'],
    [ButtonSize.LG, 'p-0 w-8 h-8 rounded-full text-base flex items-center justify-center'],
]);
