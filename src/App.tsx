import './App.css';
// import './socket/socket';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignInPage } from 'src/features/auth/pages/SignInPage';
import { SignUpPage } from 'src/features/user/components/SignUpPage';
import { WorkspacePage } from 'src/features/workspace/pages/WorkspacePage';
import { ProtectedRoute } from 'src/ProtectedRoute';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { Home } from 'src/features/home/pages/Home';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route
                    path="/workspace"
                    element={<ProtectedRoute element={<WorkspacePage />} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
