import React, {useEffect} from "react";
import {PaginationView} from "../Pagination/PaginationView.tsx";
import {
    DeliveryNoteFullData,
    DeliveryNotesFilterData,
    getDeliveryNotes
} from "hlb-api-library/src/deliveryNotes/domain/deliveryNotesService.ts";
import {DateField} from "../Dates/DateField.tsx";
import {TableComponent} from "../Tables/TableComponent.tsx";

const initialPage = 1;


const NotesTable = (props: { notes: DeliveryNoteFullData[] }) => {

    const {notes} = props;

    const headers = [
        "Company",
        "Date",
        "Driver",
        "Operations",
        "Observations"
    ];

    const rows = notes.map(note => {
        return [
            note.companyId,
            <DateField date={note.date}/>,
            note.userId,
            note.operations.length,
            note.observations
        ]
    });

    const sizes = [3,3,3,5,6];

    return <TableComponent headers={headers} rows={rows} sizes={sizes}/>

}


export const DeliveryNotesScreen = () => {


    const [currentPage, setCurrentPage] = React.useState(initialPage);
    const setPage = (page: number) => setCurrentPage(page < 1 ? 1 : page)

    const [filters, setFilters] = React.useState({
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


    return (<>

            <div>
                <h1>Delivery Notes</h1>

                <NotesTable notes={notes}/>
            </div>

            <div className={"style-location-bottom"}>
                <PaginationView
                    currentPage={currentPage}
                    setCurrentPage={setPage}
                    buttonsBefore={2}
                    buttonsAfter={5}
                />
            </div>
        </>
    )


}