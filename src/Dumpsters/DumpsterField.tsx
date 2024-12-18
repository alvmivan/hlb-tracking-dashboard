import {useNavigate} from "react-router-dom";
import {getDumpster} from "./DumpstersData.ts";
import {DumpsterDataMini} from "./DumpstersScreen.tsx";


export const DumpsterField = (props: { dumpsterId: number, stateChange?: string }) => {

    const {dumpsterId, stateChange} = props;
    const nav = useNavigate();
    const data = getDumpster(dumpsterId);

    const selectDumpster = () => {
        nav(`/dumpsters/${dumpsterId}`);
    }

    if (data)
        return (
            <DumpsterDataMini
                dumpster={data}
                onClick={selectDumpster}
                stateChange={stateChange}
            />
        );

    return <>ID {dumpsterId} inválido</>;
}