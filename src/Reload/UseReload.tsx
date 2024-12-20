// 4. Hook para usar el contexto
import {useContext} from "react";
import {ReloadContext, ReloadContextType} from "./ReloadContext.tsx";

export const useReload = (): ReloadContextType => {
    const context = useContext(ReloadContext);
    if (!context) {
        throw new Error("useReload debe ser usado dentro de un ReloadProvider");
    }
    return context;
};