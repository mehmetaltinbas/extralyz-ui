import React from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from 'src/features/auth/services/auth.service';
import { Button } from 'src/shared/components/Button';
import { Input } from 'src/shared/components/Input';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InputSize } from 'src/shared/enums/input-size.enum';

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? '';

    const [code, setCode] = React.useState('');
    const [isVerified, setIsVerified] = React.useState(false);

    const navigate = useNavigate();

    async function verify() {
        const response = await AuthService.verifyEmail({ email, code });

        alert(response.message);

        setIsVerified(response.isSuccess);
    }

    async function resend() {
        const response = await AuthService.resendVerification({ email });

        alert(response.message);
    }

    if (!email) {
        return <Navigate to="/sign-up" />;
    }

    return isVerified ? (
        <Navigate to="/sign-in" />
    ) : (
        <div className='h-[75%] flex justify-center items-center'>
            <p onClick={() => navigate('/')} className='absolute top-4 sm:left-8 left-4 sm:left-8 text-lg font-bold tracking-tight cursor-pointer'>Home</p>

            <div className="h-auto w-48 flex flex-col justify-center items-center gap-2">
                <p className="text-lg">Verify Email</p>
                <p className="text-sm text-center">
                    A verification code has been sent to {email}
                </p>
                <Input
                    onChange={(event) => setCode(event.target.value)}
                    size={InputSize.LG}
                    value={code}
                    placeholder="verification code..."
                />
                <Button variant={ButtonVariant.PRIMARY} onClick={verify}>
                    verify
                </Button>
                <Button variant={ButtonVariant.OUTLINE} onClick={resend}>
                    resend code
                </Button>
                <p>or</p>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={() => (window.location.href = '/sign-up')}
                >
                    sign up
                </Button>
            </div>
        </div>
    );
}
