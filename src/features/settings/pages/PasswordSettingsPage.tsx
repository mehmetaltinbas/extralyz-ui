import { UpdatePasswordFormBody } from 'src/features/user/components/UpdatePasswordFormBody';

export function PasswordSettingsPage() {
    return (
        <div className="w-full max-w-2xl flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-semibold">Password</h2>
                <p className="text-sm text-text-secondary">Change your account password.</p>
            </div>
            <UpdatePasswordFormBody />
        </div>
    );
}
