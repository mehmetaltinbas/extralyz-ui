import React from 'react';
import { Sidebar } from 'src/features/workspace/components/sidebar/Sidebar';
import { WorkspaceBody } from 'src/features/workspace/components/WorkspaceBody';
import { WorkspaceTabsBar } from 'src/features/workspace/features/tabs/components/WorkspaceTabsBar';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { layoutDimensionsActions } from 'src/features/workspace/store/layout-dimensions.slice';

export function WorkspacePage() {
    const dispatch = useAppDispatch();
    const sidebar = useAppSelector((state) => state.sidebar);

    React.useEffect(() => {
        function handleResize() {
            dispatch(layoutDimensionsActions.updateWidthsBySidebarWidth(sidebar.width));
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [sidebar.width]);

    return (
        <div
            className="w-full h-full
            flex"
        >
            <Sidebar />
            <div className="w-full h-full flex flex-col">
                <WorkspaceTabsBar />
                <WorkspaceBody />
            </div>
        </div>
    );
}
