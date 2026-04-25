import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'src/App.css';
import { ForgotPasswordPage } from 'src/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from 'src/features/auth/pages/ResetPasswordPage';
import { SignInPage } from 'src/features/auth/pages/SignInPage';
import { SignUpPage } from 'src/features/auth/pages/SignUpPage';
import { Home } from 'src/features/public-visit/pages/Home';
import { PublicExerciseSetHomePage } from 'src/features/public-visit/pages/PublicExerciseSetHomePage';
import { PublicProfilePage } from 'src/features/public-visit/pages/PublicProfilePage';
import { PublicSourceHomePage } from 'src/features/public-visit/pages/PublicSourceHomePage';
import { BillingSettingsPage } from 'src/features/settings/pages/BillingSettingsPage';
import { PasswordSettingsPage } from 'src/features/settings/pages/PasswordSettingsPage';
import { ProfileSettingsPage } from 'src/features/settings/pages/ProfileSettingsPage';
import { SettingsLayout } from 'src/features/settings/pages/SettingsLayout';
import { VerifyEmailPage } from 'src/features/user/components/VerifyEmailPage';
import { WorkspacePage } from 'src/features/workspace/pages/WorkspacePage';
import { ProtectedRoute } from 'src/ProtectedRoute';
import { AuthProvider } from 'src/shared/components/AuthProvider';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/user/:userName" element={<PublicProfilePage />} />
                    <Route path="/user/:userName/exercise-set/:title" element={<PublicExerciseSetHomePage />} />
                    <Route path="/user/:userName/source/:title" element={<PublicSourceHomePage />} />

                    {/* protected routes */}
                    <Route
                        path="/workspace"
                        element={<ProtectedRoute element={<WorkspacePage />} />}
                    />
                    <Route
                        path="/settings"
                        element={<ProtectedRoute element={<SettingsLayout />} />}
                    >
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<ProfileSettingsPage />} />
                        <Route path="password" element={<PasswordSettingsPage />} />
                        <Route path="billing" element={<BillingSettingsPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
