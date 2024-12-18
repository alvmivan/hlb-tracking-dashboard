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

    const [notes, setNotes] = React.useState(new Array<DeliveryNoteFullData>());


    useEffect(() => {

        const currentFilters: DeliveryNotesFilterData = {
            ...filters,
            page: currentPage
        };
        
        async function loadDeliveryNotes(){
            const data : PaginatedNotes = await getDeliveryNotes(currentFilters);
            setNotes(data.notes);
            setTotalPages(data.totalPages);
        }
        
        loadDeliveryNotes().then();       


    }, [currentPage, filters])


    return (<div className={"style-content-vertical-full"}>


            <h1><LocalizedLabel labelKey={"delivery_notes"}/>
            </h1>

            {
                notes.length===0 ? <LoadingComponent/> : <NotesTable data={notes} setNotes={setNotes}/>
            }
            

            <div className={"style-location-bottom"}>
                <PaginationView
                    currentPage={currentPage}
                    setCurrentPage={setPage}
                    buttonsBefore={2}
                    buttonsAfter={2}
                    totalPages={totalPages}
                />
            </div>
        </div>
    )


}