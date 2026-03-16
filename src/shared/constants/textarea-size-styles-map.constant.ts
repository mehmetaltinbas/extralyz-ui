import { TextareaSize } from 'src/shared/enums/textarea-size.enum';

export const textareaSizeStylesMap: Map<TextareaSize, string> = new Map([
    [TextareaSize.SM, 'px-2 py-[2px] rounded-[10px] text-xs'],
    [TextareaSize.MD, 'p-2 rounded-[10px] text-sm'],
    [TextareaSize.LG, 'p-3 rounded-[10px] text-base'],
]);
