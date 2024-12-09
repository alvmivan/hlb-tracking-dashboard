import {fetchCompanyData} from "../../Companies/Companies.ts";
import {useEffect, useState} from "react";
import {Maybe, nothing} from "hlb-api-library/src/maybeMonad/Maybe";
import {CompanyData} from "hlb-api-library/src/companies/domain/companiesService.ts";

import {NavigableField} from "./NavigableField.tsx";


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