import React from 'react';
import { AuthService } from 'src/features/auth/services/auth.service';
import { UserService } from 'src/features/user/services/user.service';
import { userActions } from 'src/features/user/store/user.slice';
import type { UpdateUserDto } from 'src/features/user/types/dto/update-user.dto';
import type { User } from 'src/features/user/types/user.interface';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAppDispatch } from 'src/store/hooks';

export function UpdateUserProfileInfoForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    user,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    user: User;
}) {
    const dispatch = useAppDispatch();

    const initialDto: UpdateUserDto = {
        userName: user.userName,
        email: user.email,
    };
    const [dto, setDto] = React.useState<UpdateUserDto>(initialDto);
    const [pendingEmail, setPendingEmail] = React.useState<string | null>(null);
    const [verificationCode, setVerificationCode] = React.useState('');

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
            setPendingEmail(null);
            setVerificationCode('');
        }
    }, [isHidden, user]);

    async function update() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await UserService.updateByToken(dto);

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else if (response.emailVerificationRequired) {
                isSubmittingRef.current = false;
                setPendingEmail(dto.email ?? null);
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                dispatch(userActions.fetchData());
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

    async function verifyEmail() {
        if (!pendingEmail) return;

        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await AuthService.verifyEmail({ email: pendingEmail, code: verificationCode });

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                setPendingEmail(null);
                setVerificationCode('');
                dispatch(userActions.fetchData());
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

    async function resendCode() {
        if (!pendingEmail) return;

        const response = await AuthService.resendVerification({ email: pendingEmail });

        alert(response.message);
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            {pendingEmail ? (
                <>
                    <p className="text-sm text-center">
                        A verification code has been sent to {pendingEmail}
                    </p>
                    <div className="flex justify-center items-center gap-2">
                        <p>code: </p>
                        <Input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.currentTarget.value)}
                        />
                    </div>
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={verifyEmail}
                    >
                        Verify
                    </Button>
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        onClick={resendCode}
                    >
                        Resend Code
                    </Button>
                </>
            ) : (
                <>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center gap-2">
                            <p>userName: </p>
                            <Input
                                value={dto.userName}
                                onChange={(e) =>
                                    setDto({
                                        ...dto,
                                        userName: e.currentTarget.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex justify-center items-center gap-2">
                            <p>email: </p>
                            <Input
                                value={dto.email}
                                onChange={(e) =>
                                    setDto({
                                        ...dto,
                                        email: e.currentTarget.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={async (event) => await update()}
                    >
                        Update
                    </Button>
                </>
            )}
        </Modal>
    );
}
