import React from 'react';
import { SendFeedbackForm } from 'src/features/feedback/components/SendFeedbackForm';
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
    const [isSendFeedbackFormHidden, setIsSendFeedbackFormHidden] = React.useState(true);

    function openUpdateUserForm() {
        setIsPopUpActive(true);
        setIsUpdateUserFormHidden(false);
    }

    function openUpdatePasswordForm() {
        setIsPopUpActive(true);
        setIsUpdatePasswordFormHidden(false);
    }

    function openSendFeedbackForm() {
        setIsPopUpActive(true);
        setIsSendFeedbackFormHidden(false);
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsUpdateUserFormHidden(true);
        setIsUpdatePasswordFormHidden(true);
        setIsSendFeedbackFormHidden(true);
    }

    return (
        <UserPopupsContext.Provider value={{ openUpdateUserForm, openUpdatePasswordForm, openSendFeedbackForm }}>
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
                    <SendFeedbackForm
                        isHidden={isSendFeedbackFormHidden}
                        setIsHidden={setIsSendFeedbackFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                    />,
                    <LoadingPage
                        key="loading"
                        isHidden={isLoadingPageHidden}
                    />,
                ]}
            />
        </UserPopupsContext.Provider>
    );
}
