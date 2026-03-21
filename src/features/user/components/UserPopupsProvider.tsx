import React from 'react';
import { UpdatePasswordForm } from 'src/features/user/components/UpdatePasswordForm';
import { UpdateUserProfileInfoForm } from 'src/features/user/components/UpdateUserProfileInfoForm';
import { UserPopupsContext } from 'src/features/user/contexts/user-popups.context';
import { BodyModal } from 'src/shared/components/BodyModal';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppSelector } from 'src/store/hooks';

export function UserPopupsProvider({ children }: { children: React.ReactNode }) {
    const user = useAppSelector((state) => state.user);

    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);
    const [isUpdateUserFormHidden, setIsUpdateUserFormHidden] = React.useState(true);
    const [isUpdatePasswordFormHidden, setIsUpdatePasswordFormHidden] = React.useState(true);

    function openUpdateUserForm() {
        setIsPopUpActive(true);
        setIsUpdateUserFormHidden(false);
        setIsUpdatePasswordFormHidden(true);
    }

    function openUpdatePasswordForm() {
        setIsPopUpActive(true);
        setIsUpdatePasswordFormHidden(false);
        setIsUpdateUserFormHidden(true);
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsUpdateUserFormHidden(true);
        setIsUpdatePasswordFormHidden(true);
    }

    return (
        <UserPopupsContext.Provider value={{ openUpdateUserForm, openUpdatePasswordForm }}>
            {children}

            <BodyModal
                isPopUpActive={isPopUpActive}
                zIndex={50}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                components={[
                    ...[user &&
                        <UpdateUserProfileInfoForm
                            key="update-user"
                            isHidden={isUpdateUserFormHidden}
                            setIsHidden={setIsUpdateUserFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                            user={user}
                        />,
                    ],
                    ...[user &&
                        <UpdatePasswordForm
                            key="update-password"
                            isHidden={isUpdatePasswordFormHidden}
                            setIsHidden={setIsUpdatePasswordFormHidden}
                            setIsPopUpActive={setIsPopUpActive}
                            setIsLoadingPageHidden={setIsLoadingPageHidden}
                            onClose={closePopups}
                        />,
                    ],
                    <LoadingPage
                        key="loading"
                        isHidden={isLoadingPageHidden}
                    />,
                ]}
            />
        </UserPopupsContext.Provider>
    );
}
