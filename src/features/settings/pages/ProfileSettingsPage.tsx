import { UpdateUserProfileInfoFormBody } from 'src/features/user/components/UpdateUserProfileInfoFormBody';
import { useAppSelector } from 'src/store/hooks';

export function ProfileSettingsPage() {
    const user = useAppSelector((state) => state.user);

    return (
        <div className="w-full max-w-2xl flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-semibold">Profile</h2>
                <p className="text-sm text-text-secondary">Update your account information.</p>
            </div>
            {user && <UpdateUserProfileInfoFormBody user={user} />}
        </div>
    );
}
