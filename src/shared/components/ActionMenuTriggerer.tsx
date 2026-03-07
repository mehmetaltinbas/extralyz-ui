import { MoreHorizontal } from "lucide-react";
import type React from "react";
import { Button } from "src/shared/components/Button";
import { ButtonSize } from "src/shared/enums/button-size.enum";
import { ButtonVariant } from "src/shared/enums/button-variant.enum";

export default function ActionMenuTriggerer({
    onClick,
    size = ButtonSize.MD,
}: {
    onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
    size: ButtonSize;
}) {
    const iconSize = size === ButtonSize.LG ? 22 : size === ButtonSize.MD ? 20 : 18;

    return (
        <Button
            variant={ButtonVariant.ICON}
            size={size}
            onClick={onClick}
        >
            <MoreHorizontal size={iconSize} />
        </Button>
    );
}
