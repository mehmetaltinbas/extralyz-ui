import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import {
    tabsActions,
    type TabsStateElement,
} from 'src/features/workspace/features/tabs/store/tabsSlice';
import { Tab } from 'src/features/workspace/features/tabs/components/Tab';

export function WorkspaceTabsBar() {
    const dispatch = useAppDispatch();
    const tabs = useAppSelector((state) => state.tabs);
    const sidebar = useAppSelector((state) => state.sidebar);
    const widths = useAppSelector((state) => state.layoutDimensions);

    function onDragOver(event: React.DragEvent<HTMLDivElement>) {
        // not implemented yet
        event.preventDefault();
    }

    function onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();

        const dropTargetDataset = event.currentTarget.dataset.tabElement;
        let dropTargetTabIndex: number | undefined;
        if (dropTargetDataset) {
            const dropTarget = JSON.parse(dropTargetDataset) as TabsStateElement;
            // console.log(`dropTargetTabIndex: ${JSON.stringify(dropTarget)}`);
            // console.log("droptarget's index: ", dropTarget.index);
            dropTargetTabIndex = dropTarget.index !== undefined ? dropTarget.index : undefined;
        }
        const dataTransfer = event.dataTransfer.getData('text/plain');
        const droppedElement = JSON.parse(dataTransfer) as TabsStateElement;

        const rect = event.currentTarget.getBoundingClientRect();
        const middleX = rect.left + rect.width / 2;

        if (dropTargetTabIndex === undefined) {
            // if dropping onto empty tabsBar
            // console.log("1st block");
            dispatch(tabsActions.add({ element: droppedElement }));
        } else if (event.clientX < middleX) {
            // if dropping behind of drop target
            if (droppedElement.index === undefined) {
                // if dropping from sidebar
                // console.log("2nd block");
                dispatch(
                    tabsActions.add({ element: droppedElement, newIndex: dropTargetTabIndex })
                );
            } else if (dropTargetTabIndex > droppedElement.index) {
                // console.log("3rd block");
                dispatch(
                    tabsActions.add({
                        element: droppedElement,
                        newIndex: dropTargetTabIndex - 1,
                    })
                );
            } else if (dropTargetTabIndex < droppedElement.index) {
                // console.log("4th block");
                dispatch(
                    tabsActions.add({ element: droppedElement, newIndex: dropTargetTabIndex })
                );
            }
        } else if (event.clientX > middleX) {
            // if dropping forward of drop target
            if (droppedElement.index === undefined) {
                // if dropping from sidebar
                // console.log("5th block");
                dispatch(
                    tabsActions.add({
                        element: droppedElement,
                        newIndex: dropTargetTabIndex + 1,
                    })
                );
            } else if (dropTargetTabIndex > droppedElement.index) {
                // console.log("6th block");
                dispatch(
                    tabsActions.add({ element: droppedElement, newIndex: dropTargetTabIndex })
                );
            } else if (dropTargetTabIndex < droppedElement.index) {
                // console.log("7th block");
                dispatch(
                    tabsActions.add({
                        element: droppedElement,
                        newIndex: dropTargetTabIndex + 1,
                    })
                );
            }
        }
    }

    return (
        <div
            onDragOver={(event) => onDragOver(event)}
            onDrop={(event) => onDrop(event)}
            className={`w-[${widths.mainColumn.width}px] h-[40px] bg-[#F5F5F5] z-10
            flex flex-shrink-0 justify-start items-center
            border-1 border-white overflow-x-auto`}
        >
            {tabs.elements.map((tab, index) => (
                <Tab key={index} tab={tab} onDragOver={onDragOver} onDrop={onDrop} />
            ))}
        </div>
    );
}
