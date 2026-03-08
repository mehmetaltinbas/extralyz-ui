import type React from 'react';

/**
 * Renders a modal inside the closest non-static container element with a dimmed overlay and centered content.
 * @param isPopUpActive - Whether the pop-up modal is visible.
 * @param components - Array of React nodes to render inside the modal.
 */
export function BodyModal({
    isPopUpActive,
    components,
    zIndex,
}: {
    isPopUpActive: boolean;
    components: React.ReactNode[];
    zIndex?: number;
}) {
    const overlayZ = zIndex ? zIndex - 10 : 10;
    const popupZ = zIndex ?? 20;

    return (
        <>
            <div // overlay
                className={`${!isPopUpActive ? 'hidden' : ''} fixed inset-0 backdrop-blur-xs`}
                style={{ zIndex: overlayZ }}
            ></div>

            <div // pop up
                className={`${!isPopUpActive ? 'hidden' : ''} fixed inset-0`}
                style={{ zIndex: popupZ }}
            >
                <div className="w-full h-[75%] flex justify-center items-center">
                    {components}
                </div>
            </div>
        </>
    );
}
