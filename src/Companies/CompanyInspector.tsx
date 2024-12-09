import {useNavigate, useParams} from "react-router-dom";
import {Maybe, nothing} from "hlb-api-library/src/maybeMonad/Maybe";
import {CompanyData} from "hlb-api-library/src/companies/domain/companiesService.ts";
import {useEffect, useState} from "react";
import {fetchCompanyData} from "./Companies.ts";

export const CompanyInspector = () => {

    const {companyId} = useParams<{ companyId: number }>();
    const nav = useNavigate();


    // example with user
    // const [userData, setUserData] = useState<Maybe<UserData>>(nothing());
    //
    //
    // useEffect(() => {
    //     if (userId === undefined) {
    //         nav("/");
    //     } else if (userData.isNothing()) {
    //         getUserData(userId).then(setUserData);
    //     }
    // }, [userId]);
    //
    //
    // return userData
    //     .map((data: UserData) => <UserInfo data={data}/>)
    //     .orElse(<span>Cargando...</span>)*/


    const [companyData, setCompanyData] = useState<Maybe<CompanyData>>(nothing());
    const [alreadyAsked, setAlreadyAsked] = useState(false);

    useEffect(() => {
        if (companyId === undefined) {
            nav("/");
            return;
        }

        if (alreadyAsked) return;
        setAlreadyAsked(true);
        companyData.doOnAbsent(() =>
            fetchCompanyData(companyId).then(setCompanyData).catch(console.error)
        );

    });


    return companyData.map((companyData: CompanyData) => (
        <div>
            <div>Nombre: {companyData.clientName}</div>
            <div>Dirección: {companyData.address}</div>
            <div>Identificador: {companyData.companyId}</div>
        </div>
    )).orElse(<span>Cargando...</span>)

}