import React from 'react';
import { UserService } from 'src/features/user/services/user.service';
import type { UpdateUserPasswordDto } from 'src/features/user/types/dto/update-user-password.dto';
import { Button } from 'src/shared/components/Button';
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

    React.useEffect(() => {
        setDto(initialDto);
        setConfirmNewPassword('');
    }, [isHidden]);

    async function update() {
        if (dto.newPassword !== confirmNewPassword) {
            alert('New passwords do not match');
            return;
        }

        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await UserService.updatePassword(dto);

            if (!response.isSuccess) {
                alert(response.message);
                setIsHidden(false);
            } else {
                setDto(initialDto);
                setConfirmNewPassword('');
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
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
                    <input
                        type="password"
                        value={dto.oldPassword}
                        onChange={(e) =>
                            setDto({ ...dto, oldPassword: e.currentTarget.value })
                        }
                        className="w-64 py-[2px] px-2 border rounded-[10px]"
                    />
                </div>

                <div className="w-full flex justify-center items-center gap-2">
                    <p>New Password: </p>
                    <input
                        type="password"
                        value={dto.newPassword}
                        onChange={(e) =>
                            setDto({ ...dto, newPassword: e.currentTarget.value })
                        }
                        className="w-64 py-[2px] px-2 border rounded-[10px]"
                    />
                </div>

                <div className="w-full flex justify-center items-center gap-2">
                    <p>Confirm New Password: </p>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
                        className="w-64 py-[2px] px-2 border rounded-[10px]"
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
