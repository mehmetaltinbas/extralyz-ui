import React from 'react';
import { FeedbackService } from 'src/features/feedback/services/feedback.service';
import type { CreateFeedbackDto } from 'src/features/feedback/types/dto/create-feedback.dto';
import { Button } from 'src/shared/components/Button';
import { InformationText } from 'src/shared/components/InformationText';
import { Modal } from 'src/shared/components/Modal';
import { Textarea } from 'src/shared/components/Textarea';
import { APP_NAME } from 'src/shared/constants/app-name.constant';

export function SendFeedbackForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
}) {
    const initialDto: CreateFeedbackDto = {
        content: ''
    };
    const [dto, setDto] = React.useState<CreateFeedbackDto>(initialDto);
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
            setConfirmNewPassword('');
        }
    }, [isHidden]);

    async function send() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await FeedbackService.create(dto);

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                setDto(initialDto);
                setConfirmNewPassword('');
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            isSubmittingRef.current = false;
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="w-full flex flex-col items-center gap-4 py-2">
                <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-gray-900">
                        Help shape {APP_NAME}
                    </h3>

                    <InformationText
                        text="Share your bugs or ideas. Your input drives our growth, so please don't hesitate. We may contact you if needed."
                    />
                </div>

                <Textarea
                    value={dto.content}
                    placeholder="Type your feedback here..."
                    onChange={(e) => setDto({ ...dto, content: e.currentTarget.value })}
                    rows={4}
                />

                <Button 
                    onClick={async () => await send()}
                >
                    Send Feedback
                </Button>
            </div>
        </Modal>
    );
}
