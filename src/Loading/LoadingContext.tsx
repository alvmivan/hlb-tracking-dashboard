import { createContext, ReactNode, useContext, useState } from "react";
import { LoadingComponent } from "./LoadingComponent";

export type LoadingProps = {
    loadingData: {
        isLoading: boolean;
        isOverlay: boolean;
    };
    setLoading: (isLoading: boolean, isOverlay?: boolean) => void;
};

const LoadingContext = createContext<LoadingProps | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOverlay, setIsOverlay] = useState(false);

    const setLoading = (loading: boolean, overlay: boolean = false) => {
        setIsLoading(loading);
        setIsOverlay(overlay);
    };

    return (
        <LoadingContext.Provider value={{ loadingData: { isLoading, isOverlay }, setLoading }}>
            {isLoading ? (
                isOverlay ? (
                    <LoadingComponent />
                ) : (
                    <>
                        {children}
                        <LoadingComponent />
                    </>
                )
            ) : (
                children
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = (): LoadingProps => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading debe ser usado dentro de un LoadingProvider");
    }
    return context;
};
