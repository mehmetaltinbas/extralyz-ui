import type React from 'react';
import { textareaSizeStylesMap } from 'src/shared/constants/textarea-size-styles-map.constant';
import { TextareaSize } from 'src/shared/enums/textarea-size.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';

export function Textarea({
    size = TextareaSize.MD,
    value,
    placeholder,
    onChange,
    rows = 2,
}: {
    size?: TextareaSize;
    value?: string;
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}) {
    const sizeStyles = textareaSizeStylesMap.get(size);

    const breakpoint = useBreakpoint();

    rows = breakpoint.isMobile ? 1 : rows;

    return (
        <textarea
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            rows={rows}
            className={`w-full border focus:outline-none ${sizeStyles}`}
        />
    );
}
