import type React from 'react';
import { inputSizeStylesMap } from 'src/shared/constants/input-size-styles-map.constant';
import { InputSize } from 'src/shared/enums/input-size.enum';

export function Input({
    type = 'text',
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
    type?: 'text' | 'number' | 'password' | 'file';
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
    if (type === 'file') {
        return (
            <input
                key={inputKey}
                type="file"
                onChange={onChange}
                disabled={disabled}
                name={name}
                accept={accept}
                multiple={multiple}
                className="w-[200px] border rounded-[20px] p-1 cursor-pointer text-xs hover:bg-gray-100"
            />
        );
    }

    const sizeStyles = inputSizeStylesMap.get(size);

    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            name={name}
            className={`w-full border cursor-text transition-colors ${sizeStyles}`}
        />
    );
}
