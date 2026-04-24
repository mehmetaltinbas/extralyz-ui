import { UserPopupsProvider } from 'src/features/user/components/UserPopupsProvider';
import { Sidebar } from 'src/features/workspace/components/sidebar/Sidebar';
import { WorkspaceBody } from 'src/features/workspace/components/WorkspaceBody';
import { WorkspaceTabsBar } from 'src/features/workspace/features/tabs/components/WorkspaceTabsBar';
import { sidebarActions } from 'src/features/workspace/store/sidebar.slice';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { useAppDispatch } from 'src/store/hooks';

export function WorkspacePage() {
    const dispatch = useAppDispatch();
    const { isDesktop } = useBreakpoint();

    return (
        <UserPopupsProvider>
            <div
                className="w-full h-full flex"
            >
                <Sidebar />

                <div className="w-full h-full flex flex-col min-w-0">
                    <div className="flex items-center min-w-0">
                        {!isDesktop && ( // mobile sidebar opener
                            <button
                                className="p-2 cursor-pointer flex-shrink-0"
                                onClick={() => dispatch(sidebarActions.open())}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
                                    />
                                </svg>
                            </button>
                        )}

                        <WorkspaceTabsBar />
                    </div>
                    <WorkspaceBody />
                </div>
            </div>
        </UserPopupsProvider>
    );
}
