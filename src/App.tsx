import {Route, Routes} from "react-router-dom";
import {LoginComponent} from "./Users/Login.tsx";
import {runInitialization} from "./Initialization/initializationSteps.ts";
import {HomeScreen} from "./Home/HomeScreen.tsx";
import {NavigationBar, NavigationElementData} from "./Navigation/NavigationBar.tsx";
import React, {useEffect, useState} from "react";
import {DeliveryNotesScreen} from "./DeliveryNotes/DeliveryNotesScreen.tsx";
import {UserProfile} from "./Users/UserProfile.tsx";
import {CompanyInspector} from "./Companies/CompanyInspector.tsx";
import {DumpstersScreen} from "./Dumpsters/DumpstersScreen.tsx";
import {LoadingComponent} from "./Loading/LoadingComponent.tsx";
import "./Buttons.css"
import {ModalProvider} from "./Modal/ModalContext.tsx";
import {LoadingProvider} from "./Loading/LoadingContext.tsx";

type RouteData = NavigationElementData & {
    element: React.ReactElement | React.ReactNode;
}

const navigationElements: (RouteData)[] = [
    {url: "/", element: <HomeScreen/>, buttonNameKey: "home"},
    {url: "/delivery-notes", element: <DeliveryNotesScreen/>, buttonNameKey: "delivery_notes"},
    {url: "/dumpsters", element: <DumpstersScreen/>, buttonNameKey: "dumpsters"},
    {url: "/dumpsters/:dumpsterId", element: <DumpstersScreen/>},
    {url: "/user/:userId", element: <UserProfile/>},
    {url: "/company/:companyId", element: <CompanyInspector/>}
]


const AppContent = () => <>
    <NavigationBar
        elements={navigationElements.filter(element => element.buttonNameKey !== undefined)}
    />

    <Routes>
        {navigationElements.map((element, index) =>
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

    const loadingElement = <LoadingComponent/>;

    if (!preAuthInitializationCompleted) return loadingElement;
    if (!isLogged) return <LoginComponent setIsLogged={setIsLogged}/>;
    if (!postAuthInitializationCompleted) return loadingElement;

    return <>
        <LoadingProvider>
            <ModalProvider>
                <AppContent/>
            </ModalProvider>
        </LoadingProvider>
    </>;
};

export default App;