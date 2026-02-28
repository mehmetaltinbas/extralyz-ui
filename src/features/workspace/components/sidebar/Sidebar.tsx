import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Section } from '../../enums/sections.enum';
import { sidebarActions } from '../../store/sidebar.slice';
import { SidebarNavSection } from './SidebarNavSection';
import type { Source } from '../../../source/types/source.interface';
import type { ExerciseSet } from '../../../exercise-set/types/exercise-set.interface';
import { sourceService } from '../../../source/services/source.service';
import { exerciseSetService } from '../../../exercise-set/services/exercise-set.service';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import { exerciseSetsActions } from 'src/features/exercise-set/store/exercise-sets.slice';

export function Sidebar() {
    const dispatch = useAppDispatch();
    const sidebar = useAppSelector((state) => state.sidebar);
    const sources = useAppSelector((state) => state.sources);
    const exerciseSets = useAppSelector((state) => state.exerciseSets);
    const isResizing = useRef(false);

    useEffect(() => {
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
        if (!isResizing.current) return;
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

    return (
        <div
            className={`w-[${sidebar.width}px] h-full sticky z-10 shadow-xl
            flex`}
        >
            <div
                className={`w-[${sidebar.width - 10}px] h-full p-4 bg-[#F5F5F5] overflow-y-auto
                flex-shrink-0 flex flex-1 flex-col justify-start items-center gap-4`}
            >
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

            <div
                onMouseDown={(event) => handleMouseDown(event)}
                className="w-[10px] h-full bg-[#F0F0F0] cursor-col-resize"
            ></div>
        </div>
    );
}
