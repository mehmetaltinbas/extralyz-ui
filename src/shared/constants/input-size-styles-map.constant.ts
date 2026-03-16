import { InputSize } from 'src/shared/enums/input-size.enum';

export const inputSizeStylesMap: Map<InputSize, string> = new Map([
    [InputSize.SM, 'px-2 py-[2px] rounded-[10px] text-xs'],
    [InputSize.MD, 'p-2 rounded-[15px] text-sm'],
    [InputSize.LG, 'p-3 rounded-[20px] text-base'],
]);
