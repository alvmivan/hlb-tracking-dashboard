import './Fields.css';

export type DateFieldProps = {
    date: Date;
}

export const DateField = (props: DateFieldProps) => {

    const {date} = props;

    //si date no es una instancia de date entonces es un string y tiene que ser parseado
    const dateObject = date instanceof Date ? date : new Date(date);
    
    
    
    const justData = dateObject.toLocaleDateString();
    const justHour = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    
    return (
        <div className={"fields-date-field"}>
            <div>{justData}</div>            
            <div>{justHour}</div>            
        </div>
    )

}