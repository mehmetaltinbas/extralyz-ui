import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import { ActionMenu } from 'src/shared/components/ActionMenu';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { useAppSelector } from 'src/store/hooks';

export function UserActionMenu({
    isHidden,
    setIsHidden,
    ref,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    ref: React.RefObject<HTMLDivElement | null>;
}) {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    const { setIsAuthenticated } = useAuth();

    async function handleSignOut(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();

        await AuthService.signOut();

        setIsAuthenticated(false);

        window.location.href = '/';
    }

    function handleCopyPublicLink() {
        if (!user) return;

        const uiUrl = import.meta.env.VITE_UI_URL || window.location.origin;
        const url = `${uiUrl}/user/${user.userName}`;

        navigator.clipboard.writeText(url);

        alert('Public link copied to clipboard!');
    }

    return (
        <ActionMenu isHidden={isHidden} onClose={() => setIsHidden(true)} ref={ref}>
            <Button
                size={ButtonSize.SM}
                onClick={(event) => {
                    event.stopPropagation();
                    navigate('/settings');
                    setIsHidden(true);
                }}
            >
                Settings
            </Button>

            <Button
                size={ButtonSize.SM}
                onClick={(event) => {
                    event.stopPropagation();
                    handleCopyPublicLink();
                    setIsHidden(true);
                }}
            >
                Copy Public Link
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
