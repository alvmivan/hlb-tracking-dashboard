import {ElementToRender} from "../../Tables/TableComponent.tsx";
import {Maybe} from "hlb-api-library/src/maybeMonad/Maybe";
import {useNavigate} from "react-router-dom";


const defaultElement = <div>Cargando...</div>;

export const NavigableField = (props: { content: Maybe<ElementToRender>, path: string, default?: ElementToRender }) => {

    const navigate = useNavigate();
    const nav = () => navigate(props.path)

    return props.content.map((content: ElementToRender) => (
        <div className={"navigable-field-entry-container"}>
            <span>{content}</span>
            <button className={"navigable-field-see "} onClick={nav}>
                <img src="public/rightarrow.png" alt="Navigate"/>
            </button>
        </div>

    )).orElse(props.default || defaultElement)

}