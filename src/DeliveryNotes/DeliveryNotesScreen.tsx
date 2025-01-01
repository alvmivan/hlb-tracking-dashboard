import React, {useEffect, useState} from "react";
import {PaginationView} from "../Pagination/PaginationView.tsx";
import {
    DeliveryNoteFullData,
    DeliveryNotesFilterData,
    getDeliveryNotes, PaginatedNotes
} from "../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService";

import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import "./DeliveryNotes.css";
import {NotesTable} from "./NotesTable.tsx";
import {LoadingComponent} from "../Loading/LoadingComponent.tsx";

import {ReloadProvider} from "../Reload/ReloadProvider.tsx";
import {just, Maybe, maybeOf, nothing} from "../lib/hlb-api-library/src/maybeMonad/Maybe.ts";


const initialPage = 1;

export const DeliveryNotesScreen = () => {


    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const setPage = (page: number) => setCurrentPage(page < 1 ? 1 : page)


    const [filters] = useState({
        byCompanyId: [],
        dateRange: undefined,
        byApproval: undefined,
        byOperatorId: []
    })

    const [notes, setNotes] = React.useState<Maybe<DeliveryNoteFullData[]>>(nothing());
    const [delayedReloadFlag, setDelayedReloadFlag] = useState(false);


    useEffect(() => {

        const currentFilters: DeliveryNotesFilterData = {
            ...filters,
            page: currentPage,
            byApproval: ["PENDING"]
        };

        async function loadDeliveryNotes() {

            if (delayedReloadFlag) {
                setDelayedReloadFlag(false);
                setNotes(nothing());
                //wait 1 second
                await new Promise(r => setTimeout(r, 1000));
            }
            const data: PaginatedNotes = await getDeliveryNotes(currentFilters);
            setNotes(just(data.notes));
            setTotalPages(data.totalPages);


        }

        loadDeliveryNotes().then();


    }, [currentPage, filters, notes, delayedReloadFlag])

    const reload = () => {
        setDelayedReloadFlag(true);
    }


    return (<div className={"style-content-vertical-full"}>


            <h1><LocalizedLabel labelKey={"delivery_notes"}/>
            </h1>

            {
                notes.map(deliveryNotes => deliveryNotes.length > 0 ?

                    <NotesTable data={deliveryNotes} setNotes={n => setNotes(just(n))} reload={reload}/> :

                    <LocalizedLabel labelKey={"no_pending_delivery_notes"}></LocalizedLabel>  )

                    .orElse(<LoadingComponent/>)
            }


            {
                totalPages > 1 ?
                    <div className={"style-location-bottom"}>
                        <PaginationView
                            currentPage={currentPage}
                            setCurrentPage={setPage}
                            buttonsBefore={2}
                            buttonsAfter={2}
                            totalPages={totalPages}
                        />
                    </div>
                    : null
            }

        </div>
    )


}
