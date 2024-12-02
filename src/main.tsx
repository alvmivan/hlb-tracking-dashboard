import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './rootStyle.css'
import App from './App.tsx'
import {configSettings} from "hlb-api-library/src/shared/appContext.ts";


import {BrowserRouter} from 'react-router-dom'


configSettings(
    {
        IsDebug: true,
        config:
            {
                API_URL: "http://localhost:3000/api"
            }
    }
);


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </StrictMode>,
)