import React, {useEffect, useState} from "react";
import {PaginationView} from "../Pagination/PaginationView.tsx";
import {
    DeliveryNoteFullData,
    DeliveryNotesFilterData,
    getDeliveryNotes
} from "../lib/hlb-api-library/src/deliveryNotes/domain/deliveryNotesService";

import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";
import "./DeliveryNotes.css";
import {NotesTable} from "./NotesTable.tsx";


const initialPage = 1;


export const DeliveryNotesScreen = () => {


    const [currentPage, setCurrentPage] = useState(initialPage);
    const setPage = (page: number) => setCurrentPage(page < 1 ? 1 : page)


    const [filters] = useState({
        byCompanyId: [],
        dateRange: undefined,
        byApproval: undefined,
        byOperatorId: []
    })

    const [notes, setNotes] = React.useState(new Array<DeliveryNoteFullData>());


    useEffect(() => {

        const currentFilters: DeliveryNotesFilterData = {
            ...filters,
            page: currentPage
        };

        getDeliveryNotes(currentFilters).then(notes => setNotes(notes)).catch(e => console.error("error trayendo las delivery notes", e));


    }, [currentPage, filters])


    return (<div className={"style-content-vertical-full"}>


            <h1><LocalizedLabel labelKey={"delivery_notes"}/>
            </h1>


            <NotesTable data={notes} setNotes={setNotes}/>

            <div className={"style-location-bottom"}>
                <PaginationView
                    currentPage={currentPage}
                    setCurrentPage={setPage}
                    buttonsBefore={2}
                    buttonsAfter={5}
                />
            </div>
        </div>
    )


}