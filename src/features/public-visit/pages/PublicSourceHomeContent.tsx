import { useNavigate } from 'react-router-dom';
import { SourceTextRenderer } from 'src/features/source/components/SourceTextRenderer';
import { usePublicSourcePopups } from 'src/features/source/hooks/use-public-source-popups.hook';
import { PublicSourceService } from 'src/features/source/services/public-source.service';
import type { Source } from 'src/features/source/types/source.interface';
import { Section } from 'src/features/workspace/enums/section.enum';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useAuth } from 'src/shared/hooks/use-auth.hook';
import { storeAuthRedirectUrl } from 'src/shared/utils/auth-redirect/store-auth-redirect-url.util';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

export function PublicSourceHomePageContent({
    source,
    userName,
}: {
    source: Source;
    userName: string;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user);
    const { isAuthenticated } = useAuth();

    const { openCloneSourceForm } = usePublicSourcePopups();

    const content = JSON.parse(source.rawText) as object;

    function openInWorkspaceOrRedirect() {
        if (!source || !userName) return;

        if (isAuthenticated) {
            const isOwner = user?.userName === userName;

            dispatch(
                tabsActions.openTab({
                    section: isOwner ? Section.SOURCE : Section.PUBLIC_SOURCE,
                    id: source._id,
                    title: source.title,
                    ...(isOwner ? {} : { meta: `@${userName}` }),
                })
            );

            navigate('/workspace');
        } else {
            storeAuthRedirectUrl(window.location.pathname);
            navigate('/sign-in');
        }
    }

    async function handleViewPdf() {
        const response = await PublicSourceService.getPdf(source._id);

        if (!response.isSuccess || !response.pdfBase64) {
            alert(response.message ?? 'Failed to load PDF');
            return;
        }

        const byteCharacters = atob(response.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');

        if (!newWindow) {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${source.title}.pdf`;
            a.click();
        }
    }

    function handleCopyPublicLink() {
        const uiUrl = import.meta.env.VITE_UI_URL || window.location.origin;
        const url = `${uiUrl}/user/${userName}/source/${encodeURIComponent(source.title)}`;
        navigator.clipboard.writeText(url);
        alert('Public link copied to clipboard!');
    }

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8">
            <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl font-bold">{source.title}</p>

                    <p className="text-text-secondary">
                        by{' '}
                        <span
                            onClick={() => navigate(`/user/${userName}`)}
                            className="cursor-pointer"
                        >
                            @{userName}
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <p>
                        <span>Type:</span> <span className="italic">{source.type}</span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <Button onClick={() => openInWorkspaceOrRedirect()}>
                        Open in Workspace
                    </Button>

                    <Button onClick={handleViewPdf}>View as PDF</Button>

                    <Button onClick={openCloneSourceForm}>
                        Clone to My Sources
                    </Button>

                    <Button
                        variant={ButtonVariant.OUTLINE}
                        onClick={handleCopyPublicLink}
                    >
                        Copy Public Link
                    </Button>
                </div>

                <div className="w-full mt-4">
                    <SourceTextRenderer content={content} />
                </div>
            </div>
        </main>
    );
}
