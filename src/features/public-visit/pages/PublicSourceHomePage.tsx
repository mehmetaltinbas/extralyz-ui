import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicPageHeader } from 'src/features/public-visit/components/PublicPageHeader';
import { PublicSourceHomePageContent } from 'src/features/public-visit/pages/PublicSourceHomeContent';
import { PublicSourcePopupsProvider } from 'src/features/source/components/PublicSourcePopupsProvider';
import { PublicSourceService } from 'src/features/source/services/public-source.service';
import type { Source } from 'src/features/source/types/source.interface';
import { UserPopupsProvider } from 'src/features/user/components/UserPopupsProvider';
import { LoadingPage } from 'src/shared/pages/LoadingPage';

export function PublicSourceHomePage() {
    const { userName, title } = useParams<{ userName: string; title: string }>();

    const [source, setSource] = React.useState<Source | null>(null);

    const decodedTitle = title ? decodeURIComponent(title) : '';

    React.useEffect(() => {
        if (!userName || !decodedTitle) return;

        async function fetchData() {
            const sourcesResponse = await PublicSourceService.readAllPublicByUserName(userName!);

            if (!sourcesResponse.isSuccess || !sourcesResponse.sources) {
                return;
            }

            const found = sourcesResponse.sources.find((s) => s.title === decodedTitle);

            if (!found) {
                return;
            }

            setSource(found);
        }

        fetchData();
    }, [userName, decodedTitle]);

    return (
        <UserPopupsProvider>
            <div className="w-full min-h-screen flex flex-col justify-start items-center">
                <PublicPageHeader />

                {source && userName ? (
                    <PublicSourcePopupsProvider source={source} ownerUserName={userName}>
                        <PublicSourceHomePageContent
                            source={source}
                            userName={userName}
                        />
                    </PublicSourcePopupsProvider>
                ) : (
                    <LoadingPage />
                )}
            </div>
        </UserPopupsProvider>
    );
}
