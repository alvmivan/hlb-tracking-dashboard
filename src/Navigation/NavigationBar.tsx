import "./Navigation.css"
import {useNavigate} from "react-router-dom";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";

export type NavigationElementData = {
    name: string;
    url: string;
}


export const NavigationElement = (props: { element: NavigationElementData }) => {
    const navigate = useNavigate();


    return (
        <button
            className={"nav-button"}
            onClick={() => navigate(props.element.url)}
        >
            {props.element.name}

        </button>
    )
}

export const NavigationBar = (props: { elements: NavigationElementData[] }) => {

    const elements = props.elements.map((element, index) =>
        <>
            <NavigationElement key={index} element={element}/>
        </>
    );
    return (
        <div className={"nav-bar"}>
            <div className={"nav-bar-title"}>
                <img src={"/hlb_mini.png"} className={"nav-bar-image"}/>
                <LocalizedLabel labelKey={"navigation_title"}/>
            </div>
            <div className={"nav-buttons-container"}>
                {elements}
            </div>
        </div>
    )
}