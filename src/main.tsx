import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './rootStyle.css'
import App from './App.tsx'
import {configSettings} from "./lib/hlb-api-library/src/shared/appContext";
import {initializeStorage} from './config/storage';
import {BrowserRouter} from 'react-router-dom'

initializeStorage();

const isProd = import.meta.env.VITE_IS_PROD === 'true';
const apiUrl = isProd
    ? "https://hlb-tracking-backend.vercel.app/api"
    : "http://localhost:3000/api";

console.log('isProd', isProd);
console.log('apiUrl', apiUrl);

configSettings(
    {
        IsDebug: !isProd,
        config: {
            API_URL: apiUrl,
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
