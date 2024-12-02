import './App.css'
import {Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import {LoginComponent} from "./Auth/Login.tsx";
import {runInitialization} from "./Initialization/initializationSteps.ts";


function App() {

    const [preAuthInitializationCompleted, setPreAuthInitializationCompleted] = useState(false);
    const [postAuthInitializationCompleted, setPostAuthInitializationCompleted] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const initialization = async () => {
            if (!preAuthInitializationCompleted) {
                if (await runInitialization(false)) {
                    setPreAuthInitializationCompleted(true);
                } else {
                    console.error("error during pre-auth initialization");
                }
            }

            if (!postAuthInitializationCompleted && isLogged) {
                if (await runInitialization(true)) {
                    setPostAuthInitializationCompleted(true);
                } else {
                    console.error("error during post-auth initialization");
                }
            }
        }

        initialization().then();
    }, [preAuthInitializationCompleted, postAuthInitializationCompleted, isLogged]);

    if (!preAuthInitializationCompleted) {
        // esto no puede usar localization, porque no está inicializado aún 🥵
        return <div>Cargando...</div>
    }

    if (!isLogged) {
        return (
            <>
                <LoginComponent
                    setIsLogged={setIsLogged}
                />
            </>
        )
    }

    if (!postAuthInitializationCompleted) {
        return <div>Cargando...</div>
    }

    return (
        <Routes>
            {/*<Route path="/" element={<Home/>}/>*/}
            {/*<Route path="/about" element={<About/>}/>*/}
        </Routes>
    )
}

export default App
