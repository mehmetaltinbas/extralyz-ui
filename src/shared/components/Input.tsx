import type React from 'react';
import { inputSizeStylesMap } from 'src/shared/constants/input-size-styles-map.constant';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';

export function Input({
    type = InputType.TEXT,
    size = InputSize.MD,
    value,
    placeholder,
    onChange,
    disabled = false,
    name,
    accept,
    multiple,
    inputKey,
}: {
    type?: InputType;
    size?: InputSize;
    value?: string | number;
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    name?: string;
    accept?: string;
    multiple?: boolean;
    inputKey?: React.Key;
}) {
    const sizeStyles = inputSizeStylesMap.get(size);

    return (type === InputType.FILE ?
        <input
            key={inputKey}
            type="file"
            onChange={onChange}
            disabled={disabled}
            name={name}
            accept={accept}
            multiple={multiple}
            className="w-[200px] border border-border focus:outline-none rounded-[20px] px-2.5 py-1.5 cursor-pointer text-xs hover:bg-surface-hover"
        />
        :
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            name={name}
            className={`w-full border border-border focus:outline-none bg-surface text-text-primary ${type === InputType.CHECKBOX ? 'cursor-pointer' : 'cursor-text'} transition-colors ${sizeStyles}`}
        />
    );
}
