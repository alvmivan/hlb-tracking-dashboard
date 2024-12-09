import "./PaginatedView.css"
import "../SharedStyle.css"

export type PaginatedViewConfig = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    buttonsBefore?: number;
    buttonsAfter?: number;
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

    const {currentPage, setCurrentPage} = props;


    const buttonBegin = 1;
    const buttonPlus10 = currentPage + 10;
    const amountButtonsBefore = props.buttonsBefore || 1;
    const amountButtonsAfter = props.buttonsAfter || 1;

    const buttons = [];
    buttons.push(<PaginationButton key={10000000} text={"«"} page={buttonBegin} setPage={setCurrentPage}/>)
    for (let i = currentPage - amountButtonsBefore; i < currentPage; i++) {
        buttons.push(<PaginationButton key={i*2+1} text={i.toString()} page={i} setPage={setCurrentPage}/>)
    }

    buttons.push(<CurrentPageLabel key={100000001} currentPage={currentPage}/>)

    for (let i = currentPage + 1; i <= currentPage + amountButtonsAfter; i++) {
        buttons.push(<PaginationButton key={i*2} text={i.toString()} page={i} setPage={setCurrentPage}/>)
    }

    buttons.push(<PaginationButton key={100000002} text={"»"} page={buttonPlus10} setPage={setCurrentPage}/>)

    return (
        <div className={"pagination-buttons-container"}>
            {
                buttons
            }
        </div>
    )
}