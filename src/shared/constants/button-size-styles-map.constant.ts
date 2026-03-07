import { ButtonSize } from 'src/shared/enums/button-size.enum';

export const buttonSizeStylesMap: Map<ButtonSize, string> = new Map([
    [ButtonSize.SM, 'px-1.5 pt-[1px] pb-[0px] rounded-[8px] text-[10px]'],
    [ButtonSize.MD, 'px-2 pt-[2px] pb-[1px] rounded-[10px] text-xs'],
    [ButtonSize.LG, 'px-3 pt-[3px] pb-[2px] rounded-[12px] text-sm'],
]);
