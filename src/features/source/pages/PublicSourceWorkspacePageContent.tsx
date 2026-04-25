import { useNavigate } from 'react-router-dom';
import { SourceTextRenderer } from 'src/features/source/components/SourceTextRenderer';
import { usePublicSourcePopups } from 'src/features/source/hooks/use-public-source-popups.hook';
import { PublicSourceService } from 'src/features/source/services/public-source.service';
import type { Source } from 'src/features/source/types/source.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function PublicSourceWorkspacePageContent({
    source,
    ownerUserName,
}: {
    source: Source;
    ownerUserName: string;
}) {
    const navigate = useNavigate();

    const { openCloneSourceForm } = usePublicSourcePopups();

    const content = JSON.parse(source.rawText) as object;

    function handleCopyPublicLink() {
        const uiUrl = import.meta.env.VITE_UI_URL || window.location.origin;
        const url = `${uiUrl}/user/${ownerUserName}/source/${encodeURIComponent(source.title)}`;
        navigator.clipboard.writeText(url);
        alert('Public link copied to clipboard!');
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

    return (
        <div
            className="absolute w-full h-full
            flex flex-col justify-start items-center gap-4 p-4 sm:p-8"
        >
            <div className="w-auto h-auto flex flex-col justify-start items-center gap-2">
                <p className="text-lg font-bold">{source.title}</p>

                <p className="text-text-secondary">
                    by{' '}
                    <span
                        onClick={() => navigate(`/user/${ownerUserName}`)}
                        className="cursor-pointer"
                    >
                        @{ownerUserName}
                    </span>
                </p>

                <div className="flex gap-2">
                    <p>
                        <span>Type: </span>
                        <span className="italic">{source.type}</span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button onClick={handleViewPdf}>View as PDF</Button>

                    <Button onClick={openCloneSourceForm}>
                        Clone to My Sources
                    </Button>

                    <Button variant={ButtonVariant.OUTLINE} onClick={handleCopyPublicLink}>
                        Copy Public Link
                    </Button>
                </div>
            </div>

            <SourceTextRenderer content={content} />
        </div>
    );
}
