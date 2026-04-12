import './App.css';
// import './socket/socket';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage } from 'src/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from 'src/features/auth/pages/ResetPasswordPage';
import { SignInPage } from 'src/features/auth/pages/SignInPage';
import { Home } from 'src/features/public-visit/pages/Home';
import { PublicExerciseSetViewPage } from 'src/features/public-visit/pages/PublicExerciseSetViewPage';
import { PublicProfilePage } from 'src/features/public-visit/pages/PublicProfilePage';
import { SignUpPage } from 'src/features/auth/pages/SignUpPage';
import { VerifyEmailPage } from 'src/features/user/components/VerifyEmailPage';
import { WorkspacePage } from 'src/features/workspace/pages/WorkspacePage';
import { ProtectedRoute } from 'src/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/user/:userName" element={<PublicProfilePage />} />
                <Route path="/user/:userName/exercise-set/:title" element={<PublicExerciseSetViewPage />} />
                <Route
                    path="/workspace"
                    element={<ProtectedRoute element={<WorkspacePage />} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
