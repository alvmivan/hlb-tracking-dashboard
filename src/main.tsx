import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './rootStyle.css'
import App from './App.tsx'
import {configSettings} from "./lib/hlb-api-library/src/shared/appContext";
import { initializeStorage } from './config/storage';

import {BrowserRouter} from 'react-router-dom'

initializeStorage();

configSettings(
    {
        IsDebug: false,
        config:
            {
                API_URL: "https://hlb-tracking-backend.vercel.app/api",
                //API_URL: "http://localhost:3000/api",
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