import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarNavSection } from 'src/features/workspace/components/sidebar/SidebarNavSection';
import { SidebarPopupsProvider } from 'src/features/workspace/components/sidebar/SidebarPopupsProvider';
import { SidebarUserSection } from 'src/features/workspace/components/sidebar/SidebarUserSection';
import { Section } from 'src/features/workspace/enums/section.enum';
import { useAppSelector } from 'src/store/hooks';

export function SidebarOpenContent({ onClose }: { onClose: () => void }) {
    const sources = useAppSelector((state) => state.sources);
    const exerciseSets = useAppSelector((state) => state.exerciseSets);

    const navigate = useNavigate();

    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <div ref={containerRef} className="w-full flex-1 min-h-0 flex flex-col items-center gap-4">
                <div className="w-full flex justify-between">
                    <button className="cursor-pointer" onClick={onClose}>
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

                <SidebarPopupsProvider containerRef={containerRef}>
                    <SidebarNavSection section={Section.SOURCES} items={sources} />

                    <SidebarNavSection
                        section={Section.EXERCISE_SETS}
                        items={exerciseSets}
                    />
                </SidebarPopupsProvider>
            </div>

            <SidebarUserSection
                layout={'horizontal'}
            />
        </>
    );
}
