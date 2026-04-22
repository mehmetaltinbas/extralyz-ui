import React from 'react';
import { SendFeedbackForm } from 'src/features/feedback/components/SendFeedbackForm';
import { UserPopupsContext } from 'src/features/user/contexts/user-popups.context';
import { BodyModal } from 'src/shared/components/BodyModal';
import { LoadingPage } from 'src/shared/pages/LoadingPage';

export function UserPopupsProvider({ children }: { children: React.ReactNode }) {
    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);
    const [isSendFeedbackFormHidden, setIsSendFeedbackFormHidden] = React.useState(true);

    function openSendFeedbackForm() {
        setIsPopUpActive(true);
        setIsSendFeedbackFormHidden(false);
    }

    function closePopups() {
        setIsPopUpActive(false);
        setIsSendFeedbackFormHidden(true);
    }

    return (
        <UserPopupsContext.Provider value={{ openSendFeedbackForm }}>
            {children}

            <BodyModal
                isPopUpActive={isPopUpActive}
                zIndex={50}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                components={[
                    <SendFeedbackForm
                        key="send-feedback"
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
