import React, {useEffect} from 'react';
import {loginUser, validateSession} from "hlb-api-library/src/auth/domain/userServices.ts";
import {ErrorData, handleError, sendPost} from "hlb-api-library/src/shared/connectionUtils.ts";
import {LocalizedLabel} from "./LocalizedLabel.tsx";

import './Login.css';
import {localizeKey} from "./LocalizeKey.ts";

interface LoginComponentParams {
    setIsLogged: (isLogged: boolean) => void
}


export const LoginComponent = (props: LoginComponentParams) => {

    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const [isGettingCache, setIsGettingCache] = React.useState(true);


    useEffect(() => {

        const validate = async () => {
            try {
                const validation = await validateSession();
                if (validation) {
                    props.setIsLogged(true);
                }
            } catch (e) {
                console.error("error tratando de validar el cache de auth ", e);
            }
            setIsGettingCache(false);
        }

        if (isGettingCache) {
            validate().then();
        }
    }, [props, isGettingCache]);


    const handleSubmit = async () => {
        console.log("submitting login");
        try {
            // todo: hacer validaciones localmente (tengo que actualizar la tabla de labels)
            // todo: ver si le hago un highlight de error al campo que está mal, o solo uso el mensaje de error
            
            const result = await loginUser(userName, password);

            if (result === "ok") {
                props.setIsLogged(true);
                return;
            }

            if (result.errorCode === 401) {
                setError("invalid_pass");
                return;
            }

            setError("unknown_error");
        } catch (e) {
            console.error("error en login", e);
            setError("unknown_error");
        }

    }

    if (isGettingCache) {
        return <LocalizedLabel labelKey={"loading"}/>;
    }

    return (
        <div className={"login-card"}>
            <h1><LocalizedLabel labelKey={"login_title"}/></h1>

            <div className={"login-entry"}>
                <input
                    className={"login-entry-form"}
                    type="text"
                    placeholder={localizeKey("user_name")}
                    value={userName}
                    onChange={(e) => {
                        setUserName(e.target.value);
                        setError('');
                    }}
                    onSubmit={handleSubmit}
                />
            </div>
            <div className={"login-entry"}>

                <input
                    className={"login-entry-form"}
                    type="password"
                    placeholder={localizeKey("password")}
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                    }}
                    onSubmit={handleSubmit}
                />
            </div>

            <button onClick={handleSubmit}
                    className={"login-submit"}>

                <LocalizedLabel labelKey={"login_submit"}/>
            </button>

            {error &&
                <LocalizedLabel
                    labelKey={error}
                    className={"login-error"}
                />}

        </div>
    )


}
