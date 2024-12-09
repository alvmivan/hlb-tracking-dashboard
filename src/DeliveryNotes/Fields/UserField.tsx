import {fetchUserData} from "../../Users/UsersData.ts";
import {useEffect, useState} from "react";
import {UserData} from "hlb-api-library/src/auth/domain/userData.ts";
import {Maybe, nothing} from "hlb-api-library/src/maybeMonad/Maybe";
import {useNavigate} from "react-router-dom";


export const UserField = (props: { userId: string }) => {

    const {userId} = props;
    const [user, setUser] = useState<Maybe<UserData>>(nothing());
    const navigate = useNavigate();
    useEffect(() => {
        (
            async () => {
                try {
                    setUser(await fetchUserData(userId));
                } catch (e) {
                    console.error(e);
                }
            }
        )()
    })
    const loading = <span className={"user-field"}>Cargando...</span>;

    const nav = () => {

        navigate(`/user/${userId}`);
    }

    return user
        .map((userData: UserData) =>
            <div className={"fields-user-entry-container"}>
                <span className={"fields-user-name"}>{userData.name} {userData.lastName}</span>
                <button className={"fields-see-user"} onClick={nav}>
                    <img src="public/rightarrow.png" alt="Navigate"/>
                </button>
            </div>
        )
        .orElse(loading)

}