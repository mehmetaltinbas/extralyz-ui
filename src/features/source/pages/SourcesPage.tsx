import React from 'react';
import { SourcesPopupsProvider } from 'src/features/source/components/SourcesPopupsProvider';
import { SourcesPageContent } from 'src/features/source/pages/SourcesPageContent';
import { sourcesActions } from 'src/features/source/store/sources.slice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function SourcesPage({ isActiveComponent }: { isActiveComponent: boolean }) {
    const dispatch = useAppDispatch();
    const sources = useAppSelector((state) => state.sources);

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        dispatch(sourcesActions.fetchData());
    }, []);

    return (
        <div
            id='source-page'
            ref={containerRef}
            className={`${isActiveComponent ? 'block' : 'hidden'} w-full h-full`}
        >
            <div className={`w-full h-full relative`}>
                <SourcesPopupsProvider containerRef={containerRef}>
                    <SourcesPageContent sources={sources} />
                </SourcesPopupsProvider>
            </div>
        </div>
    );
}
