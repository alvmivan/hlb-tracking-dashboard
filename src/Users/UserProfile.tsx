import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {UserData} from "hlb-api-library/src/auth/domain/userData.ts";
import {Maybe, nothing} from "hlb-api-library/src/maybeMonad/Maybe";
import {getUserData} from "hlb-api-library/src/auth/domain/userServices.ts";

function UserInfo(props: { data: UserData }) {

    const {data} = props;
    return (
        <div>
            <div>Nombre: {data.name}</div>
            <div>Apellido: {data.lastName}</div>
            <div>Correo: {data.email}</div>
            <div>Usuario: {data.userName}</div>
            <div>DNI : {data.dni}</div>
        </div>
    )
}

export const UserProfile = () => {
    const nav = useNavigate();
    const {userId} = useParams<{ userId: string }>();

    const [userData, setUserData] = useState<Maybe<UserData>>(nothing());


    useEffect(() => {
        if (userId === undefined) {
            nav("/");
        } else if (userData.isNothing()) {
            getUserData(userId).then(setUserData);
        }
    }, [userId]);


    return userData
        .map((data: UserData) => <UserInfo data={data}/>)
        .orElse(<span>Cargando...</span>)
}