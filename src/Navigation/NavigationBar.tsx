import "./Navigation.css"
import {useNavigate} from "react-router-dom";

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

    return (
        <div className={"nav-bar"}>
            <div>
                Nav Bar Title
            </div>
            <div className={"nav-buttons-container"}>
                {props.elements.map((element, index) => {
                    return <NavigationElement key={index} element={element}/>
                })}
            </div>
        </div>
    )
}