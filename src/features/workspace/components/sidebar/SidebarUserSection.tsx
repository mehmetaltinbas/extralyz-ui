import React from 'react';
import { UserActionMenu } from 'src/features/user/components/UserActionMenu';
import { LightDarkModeButton } from 'src/shared/components/LightDarkModeButton';
import { SendFeedbackButton } from 'src/shared/components/SendFeedbackButton';
import { useAppSelector } from 'src/store/hooks';

export function SidebarUserSection({ layout }: { layout: 'vertical' | 'horizontal' }) {
    const user = useAppSelector((state) => state.user);

    const [isActionMenuHidden, setIsActionMenuHidden] = React.useState(true);

    const profileButtonRef = React.useRef<HTMLDivElement>(null);
    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    const isVertical = layout === 'vertical';

    function toggleActionMenu(event: React.MouseEvent) {
        event.stopPropagation();

        if (!isActionMenuHidden) {
            setIsActionMenuHidden(true);
            return;
        }

        const userActionMenu = actionMenuRef.current;
        const profileButton = profileButtonRef.current;

        if (userActionMenu && profileButton) {
            const profileRect = profileButton.getBoundingClientRect();

            userActionMenu.style.position = 'fixed';
            userActionMenu.style.top = `${profileRect.top}px`;
            userActionMenu.style.left = `${profileRect.left + profileRect.width / 2}px`;
            userActionMenu.style.transform = 'translateY(-105%)';

            setIsActionMenuHidden(false);
        }
    }

    return (
        <div className={`w-full flex flex-col ${isVertical ? 'items-center' : 'items-start'} gap-3`}>
            <SendFeedbackButton />

            <LightDarkModeButton />

            <div className={`relative flex ${isVertical ? 'flex-col items-center gap-1' : 'flex-row items-center gap-2'}`}>
                <UserActionMenu
                    isHidden={isActionMenuHidden}
                    setIsHidden={setIsActionMenuHidden}
                    ref={actionMenuRef}
                />

                {user && (
                    <>
                        <div
                            ref={profileButtonRef}
                            onClick={toggleActionMenu}
                            className="w-8 h-8 rounded-full bg-btn-primary-bg text-btn-primary-text cursor-pointer flex justify-center items-center"
                        >
                            {user.userName.charAt(0).toUpperCase() ?? '?'}
                        </div>

                        <span className="text-sm text-text-secondary">
                            {user.creditBalance}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
