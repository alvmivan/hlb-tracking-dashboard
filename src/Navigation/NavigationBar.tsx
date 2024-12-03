import "./Navigation.css"
import {useNavigate} from "react-router-dom";
import {LocalizedLabel} from "../Localization/LocalizedLabel.tsx";

export type NavigationElementData = {
    name: string;
    url: string;
    nameIsLocalizationKey?: boolean;
}


export const NavigationElement = (props: { element: NavigationElementData }) => {
    const navigate = useNavigate();

    const name = props.element.nameIsLocalizationKey ?
        <LocalizedLabel labelKey={props.element.name}/> : props.element.name;

    return (
        <button
            className={"nav-button"}
            onClick={() => navigate(props.element.url)}
        >
            {name}

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
        <div className={"nav-bar style-card-05 style-content-flex "}>
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