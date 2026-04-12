import React from 'react';
import { FeedbackService } from 'src/features/feedback/services/feedback.service';
import type { CreateFeedbackDto } from 'src/features/feedback/types/dto/create-feedback.dto';
import { Button } from 'src/shared/components/Button';
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
            <div className="w-full flex flex-col justify-center items-center gap-2">
                <div className="w-full flex flex-col justify-center items-center gap-2">
                    <p className='w-48 sm:w-72'>
                        Help us improve {APP_NAME}. Whether it is a bug report or a feature suggestion, we value your input. That is how we enhance our app, so please don't hesitate. We may reach out to you if we need more details.
                    </p>

                    <Textarea
                        value={dto.content}
                        onChange={(e) =>
                            setDto({ ...dto, content: e.currentTarget.value })
                        }
                        rows={4}
                    />
                </div>
            </div>

            <Button
                onClick={async () => await send()}
            >
                Send
            </Button>
        </Modal>
    );
}
