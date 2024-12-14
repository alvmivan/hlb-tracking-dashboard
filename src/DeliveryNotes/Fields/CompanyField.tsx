import {fetchCompanyData} from "../../Companies/Companies.ts";
import {useEffect, useState} from "react";
import {Maybe, nothing} from "../../lib/hlb-api-library/src/maybeMonad/Maybe";
import {CompanyData} from "../../lib/hlb-api-library/src/companies/domain/companiesService";

import {NavigableField} from "./NavigableField.tsx";
import {data} from "react-router-dom";


export const CompanyField = (props: { companyId: number }) => {

    const [companyData, setCompanyData] = useState<Maybe<CompanyData>>(nothing());
    const [alreadyAsked, setAlreadyAsked] = useState(false);


    useEffect(() => {
        if (alreadyAsked) return;
        setAlreadyAsked(true);
        companyData.doOnAbsent(() =>
            fetchCompanyData(props.companyId).then(setCompanyData).catch(console.error)
        );
    }, [props.companyId, setCompanyData, companyData, alreadyAsked, setAlreadyAsked]);


    return <NavigableField
        content={companyData.map((companyData: CompanyData) => companyData.clientName)}
        path={`/company/${props.companyId}`}
    />

}

export const CompanyNameField = (props: { companyId: number }) => {
    const [companyData, setCompanyData] = useState<Maybe<CompanyData>>(nothing());
    const [alreadyAsked, setAlreadyAsked] = useState(false);


    useEffect(() => {
        if (alreadyAsked) return;   
        setAlreadyAsked(true);
        companyData.doOnAbsent(() =>
            fetchCompanyData(props.companyId).then(setCompanyData).catch(console.error)
        );
    }, [props.companyId, setCompanyData, companyData, alreadyAsked, setAlreadyAsked]);

    return <>{companyData.map((data: CompanyData) => data.clientName).orElse("")}</>

}