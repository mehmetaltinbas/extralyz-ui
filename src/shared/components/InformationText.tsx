import { InformationTextSize } from "src/shared/enums/information-text-size.enum";

export function InformationText({ text, size = InformationTextSize.MD }: { text: string; size?: InformationTextSize }) {
    const textSizeStyle = size === InformationTextSize.SM ? 'text-xs' : size === InformationTextSize.MD ? 'text-sm' : 'text-base';

    return (
        <p className={`w-auto ${textSizeStyle} text-center opacity-60 max-w-72 sm:max-w-96`}>
            {text}
        </p>
    );
}
