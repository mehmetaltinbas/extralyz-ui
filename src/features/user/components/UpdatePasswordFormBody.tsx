import React from 'react';
import { UserService } from 'src/features/user/services/user.service';
import type { UpdateUserPasswordDto } from 'src/features/user/types/dto/update-user-password.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputType } from 'src/shared/enums/input-type.enum';


export function UpdatePasswordFormBody({ onSuccess }: { onSuccess?: () => void }) {
    const initialDto: UpdateUserPasswordDto = { oldPassword: '', newPassword: '' };
    const [dto, setDto] = React.useState<UpdateUserPasswordDto>(initialDto);
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    async function update() {
        if (dto.newPassword !== confirmNewPassword) {
            alert('New passwords do not match');
        } else {
            setIsSubmitting(true);
            try {
                const response = await UserService.updatePassword(dto);

                if (!response.isSuccess) {
                    alert(response.message);
                } else {
                    setDto(initialDto);
                    setConfirmNewPassword('');
                    alert('Password updated.');
                    onSuccess?.();
                }
            } catch {
                alert('internal error');
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center gap-2">
                    <p className="w-44 text-sm">Old Password:</p>
                    <Input
                        type={InputType.PASSWORD}
                        value={dto.oldPassword}
                        onChange={(e) => setDto({ ...dto, oldPassword: e.currentTarget.value })}
                    />
                </div>

                <div className="flex justify-start items-center gap-2">
                    <p className="w-44 text-sm">New Password:</p>
                    <Input
                        type={InputType.PASSWORD}
                        value={dto.newPassword}
                        onChange={(e) => setDto({ ...dto, newPassword: e.currentTarget.value })}
                    />
                </div>

                <div className="flex justify-start items-center gap-2">
                    <p className="w-44 text-sm">Confirm New Password:</p>
                    <Input
                        type={InputType.PASSWORD}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
                    />
                </div>
            </div>

            <Button variant={ButtonVariant.PRIMARY} onClick={update} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
        </div>
    );
}
