import React from 'react';
import { CloneSourceForm } from 'src/features/source/components/CloneSourceForm';
import { PublicSourcePopupsContext } from 'src/features/source/contexts/public-source-popups.context';
import type { Source } from 'src/features/source/types/source.interface';
import { tabsActions } from 'src/features/workspace/features/tabs/store/tabs.slice';
import { BodyModal } from 'src/shared/components/BodyModal';
import { LoadingPage } from 'src/shared/pages/LoadingPage';
import { useAppDispatch } from 'src/store/hooks';

export function PublicSourcePopupsProvider({
    children,
    source,
    ownerUserName,
}: {
    children: React.ReactNode;
    source: Source,
    ownerUserName: string;
}) {
    const dispatch = useAppDispatch();

    const [isPopUpActive, setIsPopUpActive] = React.useState(false);
    const [isLoadingPageHidden, setIsLoadingPageHidden] = React.useState(true);

    const [isOpenCloneSourceFormHidden, setIsOpenCloneSourceFormHidden] = React.useState(true);

    function refreshData() {
        if (!source?._id) {
            return;
        }

        dispatch(tabsActions.invalidateTabPropsById(source._id));
    }

    function openCloneSourceForm() {
        setIsPopUpActive(true);
        setIsOpenCloneSourceFormHidden(false);
    }

    function closePopups() {
        setIsPopUpActive(false);

        setIsOpenCloneSourceFormHidden(true);
    }

    return (
        <PublicSourcePopupsContext value={{ openCloneSourceForm }}>
            {children}

            <BodyModal
                isPopUpActive={isPopUpActive}
                onOverlayClick={closePopups}
                isOverlayClickDisabled={!isLoadingPageHidden}
                components={[
                    <CloneSourceForm
                        key='clone-source-form'
                        isHidden={isOpenCloneSourceFormHidden}
                        setIsHidden={setIsOpenCloneSourceFormHidden}
                        setIsPopUpActive={setIsPopUpActive}
                        setIsLoadingPageHidden={setIsLoadingPageHidden}
                        onClose={closePopups}
                        source={source}
                    />,
                    <LoadingPage key='loading-page' isHidden={isLoadingPageHidden} />,
                ]}
            />
        </PublicSourcePopupsContext>
    );
}
