import { Outlet, useNavigate } from 'react-router-dom';
import { SettingsNav } from 'src/features/settings/components/SettingsNav';
import { InnerPageHeader } from 'src/shared/components/InnerPageHeader';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';

export function SettingsLayout() {
    const navigate = useNavigate();
    const { isMobile } = useBreakpoint();

    return (
        <div className="w-full h-full flex flex-col">
            <InnerPageHeader title="Settings" onBack={() => navigate('/workspace')} />
            <div className={`flex-1 min-h-0 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden`}>
                <SettingsNav orientation={isMobile ? 'horizontal' : 'vertical'} />
                <div className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
