import type React from 'react';
import { textareaSizeStylesMap } from 'src/shared/constants/textarea-size-styles-map.constant';
import { TextareaSize } from 'src/shared/enums/textarea-size.enum';

export function Textarea({
    size = TextareaSize.MD,
    value,
    placeholder,
    onChange,
    rows,
}: {
    size?: TextareaSize;
    value?: string;
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}) {
    const sizeStyles = textareaSizeStylesMap.get(size);

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
