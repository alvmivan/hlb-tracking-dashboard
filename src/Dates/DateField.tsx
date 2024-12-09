export type DateFieldProps = {
    date: Date;
}

export const DateField = (props: DateFieldProps) => {

    const {date} = props;

    //si date no es una instancia de date entonces es un string y tiene que ser parseado
    const dateObject = date instanceof Date ? date : new Date(date);
    
    const dateText = dateObject.toLocaleDateString() + " " + dateObject.toLocaleTimeString();
    
    return (
        <span className={"date-field"}>

            {dateText}
        </span>
    )

}