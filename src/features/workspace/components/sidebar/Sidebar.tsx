import React from 'react';
import { useNavigate } from 'react-router-dom';
import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import { UserActionMenu } from 'src/features/user/components/UserActionMenu';
import { SidebarNavSection } from 'src/features/workspace/components/sidebar/SidebarNavSection';
import { Section } from 'src/features/workspace/enums/section.enum';
import { sidebarActions } from 'src/features/workspace/store/sidebar.slice';
import { LightDarkModeButton } from 'src/shared/components/LightDarkModeButton';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function Sidebar() {
    const dispatch = useAppDispatch();
    const sidebar = useAppSelector((state) => state.sidebar);
    const sources = useAppSelector((state) => state.sources);
    const exerciseSets = useAppSelector((state) => state.exerciseSets);
    const user = useAppSelector((state) => state.user);

    const { isDesktop } = useBreakpoint();

    const navigate = useNavigate();

    const [isActionMenuHidden, setIsActionMenuHidden] = React.useState<boolean>(true);

    const isResizing = React.useRef(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const profileButtonRef = React.useRef<HTMLDivElement>(null);
    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        dispatch(sidebarActions.setMode(isDesktop ? 'sidebar' : 'drawer'));
    }, [isDesktop]);

    React.useEffect(() => {
        async function fetchItems() {
            dispatch(sourcesActions.fetchData());
            dispatch(exerciseSetsActions.fetchData());
        }

        fetchItems();

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

    function toggleActionMenu(event: React.MouseEvent) {
        event.stopPropagation();

        if (!isActionMenuHidden) {
            setIsActionMenuHidden(true);
            return;
        }

        const userActionMenu = actionMenuRef.current;
        const profileButton = profileButtonRef.current;
        const container = containerRef.current;

        if (userActionMenu && profileButton && container) {
            const containerRect = container.getBoundingClientRect();
            const profileRect = profileButton.getBoundingClientRect();

            const top = profileRect.top - containerRect.top;
            const left = profileRect.left - containerRect.left + profileRect.width/2;

            userActionMenu.style.top = `${top}px`;
            userActionMenu.style.left = `${left}px`;
            userActionMenu.style.transform = `translateY(-105%)`;

            setIsActionMenuHidden(false);
        }
    }

    // Drawer mode (mobile/tablet)
    if (!isDesktop) {
        if (!sidebar.isOpen) return null;

        return (
            <div className="fixed inset-0 z-40 flex">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/30"
                    onClick={() => dispatch(sidebarActions.close())}
                />

                {/* Drawer panel */}
                <div
                    className="relative w-[300px] h-full bg-surface-alt shadow-xl z-50
                    flex flex-col justify-between p-4"
                >
                    <div className="w-full flex flex-col items-center gap-4">
                        <div className="w-full flex justify-between">
                            <button className="cursor-pointer" onClick={() => dispatch(sidebarActions.close())}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"
                                    />
                                </svg>
                            </button>

                            <p onClick={() => navigate('/')} className='text-lg font-bold tracking-tight cursor-pointer'>Home</p>
                        </div>

                        <SidebarNavSection section={Section.SOURCES} items={sources} />
                        <SidebarNavSection section={Section.EXERCISE_SETS} items={exerciseSets} />
                    </div>

                    <div className="w-full flex flex-col items-start gap-3">
                        <LightDarkModeButton />

                        <div ref={containerRef} className="relative w-full flex flex-col items-start">
                            <UserActionMenu
                                isHidden={isActionMenuHidden}
                                setIsHidden={setIsActionMenuHidden}
                                ref={actionMenuRef}
                            />

                            <div
                                className="flex flex-row items-center gap-2"
                                onClick={toggleActionMenu}
                            >
                                {user && (
                                    <>
                                        <div
                                            ref={profileButtonRef}
                                            className="w-8 h-8 rounded-full bg-btn-primary-bg text-btn-primary-text cursor-pointer flex justify-center items-center"
                                        >
                                            {user.userName.charAt(0).toUpperCase() ?? '?'}
                                        </div>
                                        <span className="text-xs text-text-secondary cursor-pointer">
                                            {user.creditBalance}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop mode — original sidebar
    return (
        <div
            className={`w-[${sidebar.width}px] h-full sticky z-20 shadow-xl
            flex`}
        >
            <div
                className={`w-[${sidebar.width - 10}px] h-full p-4 bg-surface-alt
                flex-shrink-0 flex flex-1 flex-col justify-between items-center`}
            >
                <div className="w-full flex flex-col items-center gap-4">
                    <div className={`w-full flex justify-${sidebar.isOpen ? 'between' : 'center'}`}>
                        {sidebar.isOpen ? (
                            <>
                                <button className="cursor-pointer" onClick={toggleSidebar}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className="w-6 h-6 bi bi-arrow-bar-left"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"
                                        />
                                    </svg>
                                </button>

                                <p onClick={() => navigate('/')} className='text-lg font-bold tracking-tight cursor-pointer'>Home</p>
                            </>
                        ) : (
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
                        )}
                    </div>

                    {sidebar.isOpen && (
                        <>
                            <SidebarNavSection section={Section.SOURCES} items={sources} />

                            <SidebarNavSection
                                section={Section.EXERCISE_SETS}
                                items={exerciseSets}
                            />
                        </>
                    )}
                </div>

                <div className={`w-full flex flex-col ${sidebar.isOpen ? 'items-start' : 'items-center'} gap-3`}>
                    <LightDarkModeButton />

                <div ref={containerRef} className={`relative w-full flex flex-col ${sidebar.isOpen ? 'items-start' : 'items-center'}`}>
                    <UserActionMenu
                        isHidden={isActionMenuHidden}
                        setIsHidden={setIsActionMenuHidden}
                        ref={actionMenuRef}
                    />

                    <div
                        className={`flex ${sidebar.isOpen ? 'flex-row items-center gap-2' : 'flex-col items-center gap-1'}`}
                        onClick={toggleActionMenu}
                    >
                        {user && (
                            sidebar.isOpen ?
                            <>
                                <div
                                    ref={profileButtonRef}
                                    className="w-8 h-8 rounded-full bg-btn-primary-bg text-btn-primary-text cursor-pointer flex justify-center items-center"
                                >
                                    {user.userName.charAt(0).toUpperCase() ?? '?'}
                                </div>

                                <span className="text-xs text-text-secondary cursor-pointer">
                                    {user.creditBalance}
                                </span>
                            </>
                            :
                            <>
                                <span className="text-xs text-text-secondary cursor-pointer">
                                    {user.creditBalance}
                                </span>

                                <div
                                    ref={profileButtonRef}
                                    className="w-8 h-8 rounded-full bg-btn-primary-bg text-btn-primary-text cursor-pointer flex justify-center items-center"
                                >
                                    {user.userName.charAt(0).toUpperCase() ?? '?'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                </div>
            </div>

            <div
                onMouseDown={(event) => handleMouseDown(event)}
                className="w-[10px] h-full bg-surface-muted cursor-col-resize"
            ></div>
        </div>
    );
}
