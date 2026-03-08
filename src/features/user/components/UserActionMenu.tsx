import type React from 'react';
import { AuthService } from 'src/features/auth/services/auth.service';
import { useUserPopups } from 'src/features/user/hooks/use-user-popups.hook';
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
    const { openUpdateUserForm, openUpdatePasswordForm } = useUserPopups();

    async function handleSignOut(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();

        await AuthService.signOut();

        window.location.href = '/';
    }

    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            <Button
                size={ButtonSize.SM}
                onClick={(event) => {
                    event.stopPropagation();
                    openUpdateUserForm();
                    setIsHidden(true);
                }}
            >
                Update Profile Info
            </Button>

            <Button
                size={ButtonSize.SM}
                onClick={(event) => {
                    event.stopPropagation();
                    openUpdatePasswordForm();
                    setIsHidden(true);
                }}
            >
                Change Password
            </Button>

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
