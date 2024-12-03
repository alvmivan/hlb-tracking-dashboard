import React from "react";
import {PaginationView} from "../Pagination/PaginationView.tsx";


export const DeliveryNotesScreen = () => {


    const [currentPage, setCurrentPage] = React.useState(1);
    const setPage = (page: number) => setCurrentPage(page < 1 ? 1 : page)


    return (<>

            {/* el contenido de tu página*/}
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