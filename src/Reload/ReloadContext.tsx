import {createContext, ReactNode} from "react";

// 1. Define la forma del contexto
export type ReloadContextType = {
    reloadKey: number;
    reload: () => void;
};

// 2. Crea el contexto con un valor inicial por defecto
export const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

export type ReloadProviderProps = {
    children: ReactNode;
};

// Ejemplo de uso: componente que se recarga con `reloadKey`
// const ReloadableComponent = () => {
//     const { reloadKey, reload } = useReload();
//
//     return (
//         <div key={reloadKey}>
//             <p>Componente recargado con key: {reloadKey}</p>
//             <button onClick={reload}>Recargar</button>
//         </div>
//     );
// }; 


// Uso en la aplicación principal
// const App = () => (
//     <ReloadProvider>
//         <ReloadableComponent />
//     </ReloadProvider>
// );