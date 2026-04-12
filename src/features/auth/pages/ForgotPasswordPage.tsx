import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import type { ForgotPasswordDto } from 'src/features/auth/types/dto/forgot-password.dto';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';

export function ForgotPasswordPage() {
    const [dto, setDto] = React.useState<ForgotPasswordDto>({
        email: '',
    });
    const [redirectEmail, setRedirectEmail] = React.useState<string | null>(null);

    const navigate = useNavigate();

    async function handleSubmit() {
        const response = await AuthService.forgotPassword(dto);

        alert(response.message);

        if (response.isSuccess) {
            setRedirectEmail(dto.email);
        }
    }

    if (redirectEmail) {
        return <Navigate to={`/reset-password?email=${encodeURIComponent(redirectEmail)}`} />;
    }

    return (
        <div className='h-[75%] flex justify-center items-center relative'>
            <p onClick={() => navigate('/')} className='absolute top-4 sm:left-8 left-4 sm:left-8 text-lg font-bold tracking-tight cursor-pointer'>Home</p>

            <div className="h-auto w-48 flex flex-col justify-center items-center gap-2">
                <p className="text-lg">Forgot Password</p>
                <Input
                    onChange={(event) =>
                        setDto({
                            ...dto,
                            email: event.target.value,
                        })
                    }
                    size={InputSize.LG}
                    value={dto.email}
                    placeholder="email..."
                />
                <Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit}>
                    send code
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
