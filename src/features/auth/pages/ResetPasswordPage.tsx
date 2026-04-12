import React from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import type { ResetPasswordDto } from 'src/features/auth/types/dto/reset-password.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';
import { InputType } from 'src/shared/enums/input-type.enum';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? '';

    const [dto, setDto] = React.useState<ResetPasswordDto>({
        email,
        code: 0,
        newPassword: '',
    });
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isReset, setIsReset] = React.useState(false);

    const navigate = useNavigate();

    async function handleSubmit() {
        if (dto.newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const response = await AuthService.resetPassword(dto);

        alert(response.message);

        setIsReset(response.isSuccess);
    }

    async function resendCode() {
        const response = await AuthService.forgotPassword({ email });

        alert(response.message);
    }

    if (!email) {
        return <Navigate to="/forgot-password" />;
    }

    if (isReset) {
        return <Navigate to="/sign-in" />;
    }

    return (
        <div className='h-[75%] flex justify-center items-center relative'>
            <p onClick={() => navigate('/')} className='absolute top-4 sm:left-8 left-4 sm:left-8 text-lg font-bold tracking-tight cursor-pointer'>Home</p>

            <div className="h-auto w-48 flex flex-col justify-center items-center gap-2">
                <p className="text-lg">Reset Password</p>
                <p className="text-sm text-center">
                    A reset code has been sent to {email}
                </p>
                <Input
                    onChange={(event) =>
                        setDto({
                            ...dto,
                            code: Number(event.target.value),
                        })
                    }
                    type={InputType.NUMBER}
                    size={InputSize.LG}
                    value={dto.code || ''}
                    placeholder="reset code..."
                />
                <Input
                    onChange={(event) =>
                        setDto({
                            ...dto,
                            newPassword: event.target.value,
                        })
                    }
                    type={InputType.PASSWORD}
                    size={InputSize.LG}
                    value={dto.newPassword}
                    placeholder="new password..."
                />
                <Input
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type={InputType.PASSWORD}
                    size={InputSize.LG}
                    value={confirmPassword}
                    placeholder="confirm password..."
                />
                <Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit}>
                    reset password
                </Button>
                <Button variant={ButtonVariant.OUTLINE} onClick={resendCode}>
                    resend code
                </Button>
                <p>or</p>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={() => (window.location.href = '/sign-in')}
                >
                    sign in
                </Button>
            </div>
        </div>
    );
}
