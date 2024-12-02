import {Route, Routes} from "react-router-dom";
import {LoginComponent} from "./Auth/Login.tsx";
import {runInitialization} from "./Initialization/initializationSteps.ts";
import {HomeScreen} from "./Home/HomeScreen.tsx";
import {NavigationBar} from "./Navigation/NavigationBar.tsx";
import {useEffect, useState} from "react";


const navigationElements = [
    {name: "Home", url: "/"},
    {name: "About", url: "/about"},
    {name: "Contact", url: "/contact"},
]

const AppContent = () => <>
    <NavigationBar
        elements={navigationElements}
    />
    <Routes>
        <Route path="/" element={<HomeScreen/>}/>
        <Route path="/about" element={<div>About</div>}/>
        <Route path="/contact" element={<div>Contact</div>}/>
    </Routes>
</>;

const App = () => {

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

    const loadingElement = <div>Cargando...</div>;

    if (!preAuthInitializationCompleted) return loadingElement
    if (!isLogged) return <LoginComponent setIsLogged={setIsLogged}/>
    if (!postAuthInitializationCompleted) return loadingElement
    return <AppContent></AppContent>
};

export default App
