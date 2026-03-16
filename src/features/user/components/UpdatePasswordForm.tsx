import React from 'react';
import { UserService } from 'src/features/user/services/user.service';
import type { UpdateUserPasswordDto } from 'src/features/user/types/dto/update-user-password.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function UpdatePasswordForm({
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
    const initialDto: UpdateUserPasswordDto = {
        oldPassword: '',
        newPassword: '',
    };
    const [dto, setDto] = React.useState<UpdateUserPasswordDto>(initialDto);
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
            setConfirmNewPassword('');
        }
    }, [isHidden]);

    async function update() {
        if (dto.newPassword !== confirmNewPassword) {
            alert('New passwords do not match');
            return;
        }

        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await UserService.updatePassword(dto);

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
                <div className="w-full flex justify-center items-center gap-2">
                    <p>Old Password: </p>
                    <Input
                        type="password"
                        value={dto.oldPassword}
                        onChange={(e) =>
                            setDto({ ...dto, oldPassword: e.currentTarget.value })
                        }
                    />
                </div>

                <div className="w-full flex justify-center items-center gap-2">
                    <p>New Password: </p>
                    <Input
                        type="password"
                        value={dto.newPassword}
                        onChange={(e) =>
                            setDto({ ...dto, newPassword: e.currentTarget.value })
                        }
                    />
                </div>

                <div className="w-full flex justify-center items-center gap-2">
                    <p>Confirm New Password: </p>
                    <Input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
                    />
                </div>
            </div>

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async () => await update()}
            >
                Update Password
            </Button>
        </Modal>
    );
}
