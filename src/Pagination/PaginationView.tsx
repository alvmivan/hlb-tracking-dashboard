import "./PaginatedView.css"
import "../SharedStyle.css"

export type PaginatedViewConfig = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    buttonsBefore?: number;
    buttonsAfter?: number;
    totalPages: number;
}

const PaginationButton = (props: { text: string, page: number, setPage: (page: number) => void, active?: boolean }) => {
    const {setPage, active} = props;
    const {text, page} = props;

    if (page < 1) {
        return null;
    }

    const onClick = () => setPage(page);
    return (
        <button
            className={"style-card-10 style-no-border"}
            onClick={onClick}
            disabled={active === false}
        >
            {text}
        </button>
    )
}

const CurrentPageLabel = (props: { currentPage: number }) => {
    const {currentPage} = props;
    return (

        <button className={"style-card-30 style-no-border current-page-button"}>
            {currentPage}
        </button>

    )
}

export const PaginationView = (props: PaginatedViewConfig) => {
    const {currentPage, setCurrentPage, totalPages} = props;
    const amountButtonsBefore = props.buttonsBefore || 1;
    const amountButtonsAfter = props.buttonsAfter || 1;

    const buttons = [];
    
    // First page button
    buttons.push(
        <PaginationButton 
            key={10000000} 
            text={"«"} 
            page={1} 
            setPage={setCurrentPage}
            active={currentPage !== 1}
        />
    );

    // Previous page buttons
    for (let i = currentPage - amountButtonsBefore; i < currentPage; i++) {
        if (i >= 1) {
            buttons.push(
                <PaginationButton 
                    key={i*2+1} 
                    text={i.toString()} 
                    page={i} 
                    setPage={setCurrentPage}
                />
            );
        }
    }

    // Current page
    buttons.push(<CurrentPageLabel key={100000001} currentPage={currentPage}/>);

    // Next page buttons
    for (let i = currentPage + 1; i <= Math.min(currentPage + amountButtonsAfter, totalPages); i++) {
        buttons.push(
            <PaginationButton 
                key={i*2} 
                text={i.toString()} 
                page={i} 
                setPage={setCurrentPage}
            />
        );
    }

    // Last page button
    buttons.push(
        <PaginationButton 
            key={100000002} 
            text={"»"} 
            page={totalPages} 
            setPage={setCurrentPage}
            active={currentPage !== totalPages}
        />
    );

    return (
        <div className={"pagination-buttons-container"}>
            {buttons}
        </div>
    );
}