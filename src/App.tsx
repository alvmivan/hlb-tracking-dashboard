import {Route, Routes} from "react-router-dom";
import {LoginComponent} from "./Users/Login.tsx";
import {runInitialization} from "./Initialization/initializationSteps.ts";
import {HomeScreen} from "./Home/HomeScreen.tsx";
import {NavigationBar, NavigationElementData} from "./Navigation/NavigationBar.tsx";
import React, {useEffect, useState} from "react";
import {DeliveryNotesScreen} from "./DeliveryNotes/DeliveryNotesScreen.tsx";
import {UserProfile} from "./Users/UserProfile.tsx";

type RouteData = NavigationElementData & {
    element: React.ReactElement | React.ReactNode;
}

const navigationElements: (RouteData)[] = [
    {name: "Home", url: "/", element: <HomeScreen/>},
    {name: "About", url: "/about", element: <div>About</div>},
    {name: "Contact", url: "/contact", element: <div>Contact</div>},
    {name: "delivery_notes", url: "/delivery-notes", nameIsLocalizationKey: true, element: <DeliveryNotesScreen/>},
]

const elementsWithoutButton: (RouteData)[] = [
    {name: "See User", url: "/user/:userId", element:<UserProfile/>}
]

 

const AppContent = () => <>
    <NavigationBar
        elements={navigationElements}
    />
    <Routes>
        {navigationElements.map((element, index) =>
            <Route key={index} path={element.url} element={element.element}/>
        )}
        {elementsWithoutButton.map((element, index) =>
            <Route key={index} path={element.url} element={element.element}/>
        )}
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

    return <AppContent/>
};

export default App
