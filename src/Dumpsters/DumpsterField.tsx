import {useNavigate} from "react-router-dom";
import {DumpsterData} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices.ts";
import {getDumpster} from "./DumpstersData.ts";
import {DumpsterDataMini} from "./DumpstersScreen.tsx";

let dumpstersCache: DumpsterData[] = [];

export const DumpsterField = (props: { dumpsterId: number }) => {

    const {dumpsterId} = props;
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
            />
        );

    return <>ID {props.dumpsterId} inválido</>;
}