import {fetchUserData} from "../../Users/UsersData.ts";
import {useEffect, useState} from "react";
import {UserData} from "../../lib/hlb-api-library/src/auth/domain/userData";
import {Maybe, nothing} from "../../lib/hlb-api-library/src/maybeMonad/Maybe";
import {NavigableField} from "./NavigableField.tsx";


export const UserField = (props: { userId: string }) => {

    const {userId} = props;
    const [user, setUser] = useState<Maybe<UserData>>(nothing());
    const [alreadyAsked, setAlreadyAsked] = useState(false);


    useEffect(() => {
        if (alreadyAsked) return;
        setAlreadyAsked(true);
        user.doOnAbsent(() =>
            fetchUserData(userId).then(setUser).catch(console.error));
    }, [userId, setUser, user, alreadyAsked, setAlreadyAsked]);

    const field = user.map((userData: UserData) => (<>
        {userData.name} {userData.lastName}
    </>));

    return <NavigableField
        path={`/user/${userId}`}
        content={field}
    />

 
}