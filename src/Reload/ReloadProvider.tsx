// 3. Proveedor del contexto
import {useState} from "react";
import {ReloadContext, ReloadProviderProps} from "./ReloadContext.tsx";

export const ReloadProvider = ({children}: ReloadProviderProps) => {
    const [reloadKey, setReloadKey] = useState(0);

    const reload = () => {
        console.log("Reloading");
        setReloadKey((prevKey) => prevKey + 1); // Incrementa la key para forzar un "reload"
    };

    return (
        <ReloadContext.Provider value={{reloadKey, reload}}>
            {children}
        </ReloadContext.Provider>
    );
};