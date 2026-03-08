import React from 'react';
import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import { UserActionMenu } from 'src/features/user/components/UserActionMenu';
import { SidebarNavSection } from 'src/features/workspace/components/sidebar/SidebarNavSection';
import { Section } from 'src/features/workspace/enums/section.enum';
import { sidebarActions } from 'src/features/workspace/store/sidebar.slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function Sidebar() {
    const dispatch = useAppDispatch();
    const sidebar = useAppSelector((state) => state.sidebar);
    const sources = useAppSelector((state) => state.sources);
    const exerciseSets = useAppSelector((state) => state.exerciseSets);
    const user = useAppSelector((state) => state.user);

    const [isActionMenuHidden, setIsActionMenuHidden] = React.useState<boolean>(true);

    const isResizing = React.useRef(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const profileButtonRef = React.useRef<HTMLDivElement>(null);
    const actionMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        async function fetchItems() {
            dispatch(sourcesActions.fetchData());
            dispatch(exerciseSetsActions.fetchData());
        }

        fetchItems();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

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

        // 1. If we are closing it, just toggle and exit
        if (!isActionMenuHidden) {
            setIsActionMenuHidden(true);
            return;
        }

        // 2. If we are opening it, calculate position first
        const userActionMenu = actionMenuRef.current;
        const profileButton = profileButtonRef.current;
        const container = containerRef.current;

        if (userActionMenu && profileButton && container) {
            const containerRect = container.getBoundingClientRect();
            const profileRect = profileButton.getBoundingClientRect();

            // Calculate position relative to the sidebar container
            // We place it at the top of the profile button minus its own height
            const top = profileRect.top - containerRect.top;
            const left = profileRect.left - containerRect.left + profileRect.width/2;

            userActionMenu.style.top = `${top}px`;
            userActionMenu.style.left = `${left}px`;
            // Use transform to move it exactly above the button
            userActionMenu.style.transform = `translateY(-105%)`;

            setIsActionMenuHidden(false);
        }
    }

    return (
        <div
            className={`w-[${sidebar.width}px] h-full sticky z-20 shadow-xl
            flex`}
        >
            <div
                className={`w-[${sidebar.width - 10}px] h-full p-4 bg-[#F5F5F5]
                flex-shrink-0 flex flex-1 flex-col justify-between items-center`}
            >
                <div className="w-full flex flex-col items-center gap-4">
                    <div className="w-full flex justify-end">
                        {sidebar.isOpen ? (
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

                <div ref={containerRef} className={`relative w-full flex flex-col ${sidebar.isOpen ? 'items-start' : 'items-center'}`}>
                    {/* The Menu starts hidden and will be positioned by the function */}
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
                                    className="w-8 h-8 rounded-full bg-black text-white cursor-pointer flex justify-center items-center"
                                >
                                    {user.userName.charAt(0).toUpperCase() ?? '?'}
                                </div>

                                <span className="text-xs text-gray-600 cursor-pointer">
                                    {user.creditBalance}
                                </span>
                            </>
                            :
                            <>
                                <span className="text-xs text-gray-600 cursor-pointer">
                                    {user.creditBalance}
                                </span>

                                <div
                                    ref={profileButtonRef}
                                    className="w-8 h-8 rounded-full bg-black text-white cursor-pointer flex justify-center items-center"
                                >
                                    {user.userName.charAt(0).toUpperCase() ?? '?'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div
                onMouseDown={(event) => handleMouseDown(event)}
                className="w-[10px] h-full bg-[#F0F0F0] cursor-col-resize"
            ></div>
        </div>
    );
}
