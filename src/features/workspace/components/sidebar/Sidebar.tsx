import React from 'react';
import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import { SidebarOpenContent } from 'src/features/workspace/components/sidebar/SidebarOpenContent';
import { sidebarActions } from 'src/features/workspace/store/sidebar.slice';
import { LightDarkModeButton } from 'src/shared/components/LightDarkModeButton';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function Sidebar() {
    const dispatch = useAppDispatch();
    const sidebar = useAppSelector((state) => state.sidebar);
    const user = useAppSelector((state) => state.user);

    const { isDesktop } = useBreakpoint();

    const isResizing = React.useRef(false);

    React.useEffect(() => {
        dispatch(sidebarActions.setMode(isDesktop ? 'sidebar' : 'drawer'));
    }, [isDesktop]);

    React.useEffect(() => {
        dispatch(sourcesActions.fetchData());
        dispatch(exerciseSetsActions.fetchData());

        if (isDesktop) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDesktop]);

    function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        event.preventDefault();
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isResizing.current) {
            return;
        }
        dispatch(sidebarActions.resize(event.clientX));
    }

    function handleMouseUp(event: MouseEvent) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }

    function toggleSidebar() {
        if (sidebar.isOpen) {
            dispatch(sidebarActions.close());
        } else if (!sidebar.isOpen) {
            dispatch(sidebarActions.open());
        }
    }

    return !isDesktop ? ( // mobile
            !sidebar.isOpen ? null : 
                <div className="fixed inset-0 z-40 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30"
                        onClick={() => dispatch(sidebarActions.close())}
                    />

                    {/* Drawer panel */}
                    <div
                        className="relative w-[300px] h-full bg-surface-alt shadow-xl z-50
                        flex flex-col justify-between p-2 overflow-hidden"
                    >
                        <SidebarOpenContent onClose={() => dispatch(sidebarActions.close())} />
                    </div>
                </div>
        ) : ( 
            <div // Desktop
                style={{ width: `${sidebar.width}px` }}
                className="h-full sticky z-20 shadow-xl flex flex-shrink-0 overflow-hidden"
            >
                <div
                    style={{ width: `${sidebar.width - 10}px` }}
                    className={`h-full bg-surface-alt py-4 ${sidebar.isOpen && 'px-2'}
                    flex-shrink-0 flex flex-1 flex-col justify-between items-center overflow-hidden`}
                >
                    {sidebar.isOpen ? (
                        <SidebarOpenContent onClose={toggleSidebar} />
                    ) : (
                        <>
                            <div className="w-full flex justify-center">
                                <button className="cursor-pointer" onClick={toggleSidebar}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="w-6 h-6 bi bi-arrow-bar-left"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="w-full flex flex-col items-center gap-3">
                                <LightDarkModeButton />

                                <div className="flex flex-col items-center gap-1">
                                    {user && (
                                        <>
                                            <span className="text-xs text-text-secondary cursor-pointer">
                                                {user.creditBalance}
                                            </span>

                                            <div
                                                className="w-8 h-8 rounded-full bg-btn-primary-bg text-btn-primary-text cursor-pointer flex justify-center items-center"
                                            >
                                                {user.userName.charAt(0).toUpperCase() ?? '?'}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div
                    onMouseDown={(event) => handleMouseDown(event)}
                    className="w-[10px] h-full bg-surface-muted cursor-col-resize"
                ></div>
            </div>
        )
    ;
}
