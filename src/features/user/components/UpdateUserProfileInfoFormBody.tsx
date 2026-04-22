import React from 'react';
import { AuthService } from 'src/features/auth/services/auth.service';
import { UserService } from 'src/features/user/services/user.service';
import { userActions } from 'src/features/user/store/user.slice';
import type { UpdateUserDto } from 'src/features/user/types/dto/update-user.dto';
import type { User } from 'src/features/user/types/user.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpdateUserProfileInfoFormBody({
    user,
    onSuccess,
}: {
    user: User;
    onSuccess?: () => void;
}) {
    const dispatch = useAppDispatch();

    const [dto, setDto] = React.useState<UpdateUserDto>({
        userName: user.userName,
        email: user.email,
    });
    const [pendingEmail, setPendingEmail] = React.useState<string | null>(null);
    const [verificationCode, setVerificationCode] = React.useState(0);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    async function update() {
        setIsSubmitting(true);
        try {
            const response = await UserService.updateByToken(dto);

            if (!response.isSuccess) {
                alert(response.message);
            } else if (response.emailVerificationRequired) {
                setPendingEmail(dto.email ?? null);
            } else {
                dispatch(userActions.fetchData());
                onSuccess?.();
            }
        } catch {
            alert('internal error');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function verifyEmail() {
        if (pendingEmail) {
            setIsSubmitting(true);
            try {
                const response = await AuthService.verifyEmail({
                    email: pendingEmail,
                    code: verificationCode,
                });

                if (!response.isSuccess) {
                    alert(response.message);
                } else {
                    setPendingEmail(null);
                    setVerificationCode(0);
                    dispatch(userActions.fetchData());
                    onSuccess?.();
                }
            } catch {
                alert('internal error');
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    async function resendCode() {
        if (pendingEmail) {
            const response = await AuthService.resendVerification({ email: pendingEmail });
            alert(response.message);
        }
    }

    return (
        <div className="w-full max-w-md flex flex-col gap-4">
            {pendingEmail ? (
                <>
                    <p className="text-sm text-center">
                        A verification code has been sent to {pendingEmail}
                    </p>
                    <div className="flex justify-center items-center gap-2">
                        <p>code: </p>
                        <Input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(Number(e.currentTarget.value))}
                        />
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={verifyEmail}
                            disabled={isSubmitting}
                        >
                            Verify
                        </Button>
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            onClick={resendCode}
                            disabled={isSubmitting}
                        >
                            Resend Code
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-start items-center gap-2">
                            <p className="w-24 text-sm">userName:</p>
                            <Input
                                value={dto.userName}
                                onChange={(e) =>
                                    setDto({ ...dto, userName: e.currentTarget.value })
                                }
                            />
                        </div>

                        <div className="flex justify-start items-center gap-2">
                            <p className="w-24 text-sm">email:</p>
                            <Input
                                value={dto.email}
                                onChange={(e) =>
                                    setDto({ ...dto, email: e.currentTarget.value })
                                }
                            />
                        </div>
                    </div>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={update}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                </>
            )}
        </div>
    );
}
