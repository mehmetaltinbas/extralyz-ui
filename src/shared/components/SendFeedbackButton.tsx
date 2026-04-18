import { MessageSquare } from 'lucide-react';
import { useUserPopups } from 'src/features/user/hooks/use-user-popups.hook';
import { USER_SECTION_BUTTON_ICON_SIZE } from 'src/shared/constants/user-section-button-icon-size.constant';
import { USER_SECTION_BUTTON_STLES } from 'src/shared/constants/user-section-button-styles.constant';

export function SendFeedbackButton() {
    const { openSendFeedbackForm } = useUserPopups();

    return (
        <button
            onClick={() => openSendFeedbackForm()}
            className={USER_SECTION_BUTTON_STLES}
        >
            <MessageSquare size={USER_SECTION_BUTTON_ICON_SIZE} />
        </button>
    );
}
