import type React from 'react';
import { authService } from 'src/features/auth/services/auth.service';
import { ActionMenu } from 'src/shared/components/ActionMenu';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function UserActionMenu({
    isHidden,
    setIsHidden,
    ref,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    ref: React.RefObject<HTMLDivElement | null>;
}) {
    async function handleSignOut(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();

        await authService.signOut();
        
        window.location.href = '/';
    }

    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            <Button
                variant={ButtonVariant.DANGER}
                size={ButtonSize.SM}
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
        </ActionMenu>
    );
}
