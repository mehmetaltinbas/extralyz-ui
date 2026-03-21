import type React from 'react';
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { BodyModalPortalContext } from 'src/shared/contexts/body-modal-portal.context';

/**
 * Renders a modal inside the closest non-static container element with a dimmed overlay and centered content.
 * Uses a portal to render outside the scrolling container when available.
 */
export function BodyModal({
    isPopUpActive,
    components,
    zIndex,
    onOverlayClick,
    isOverlayClickDisabled,
}: {
    isPopUpActive: boolean;
    components: React.ReactNode[];
    zIndex?: number;
    onOverlayClick?: () => void;
    isOverlayClickDisabled?: boolean;
}) {
    const portalTargetRef = useContext(BodyModalPortalContext);
    const overlayZ = zIndex ? zIndex - 10 : 10;
    const popupZ = zIndex ?? 20;

    const content = (
        <>
            <div // overlay
                className={`${!isPopUpActive ? 'hidden' : ''} fixed inset-0 backdrop-blur-xs`}
                style={{ zIndex: overlayZ }}
                onClick={!isOverlayClickDisabled ? onOverlayClick : undefined}
            ></div>

            <div // pop up
                className={`${!isPopUpActive ? 'hidden' : ''} fixed inset-0`}
                style={{ zIndex: popupZ }}
                onClick={!isOverlayClickDisabled ? onOverlayClick : undefined}
            >
                <div
                    className="w-full h-[95%] h-[80%] flex justify-center items-center"
                 >
                    {components}
                </div>
            </div>
        </>
    );

    if (portalTargetRef?.current) {
        return createPortal(content, portalTargetRef.current);
    }

    return content;
}
