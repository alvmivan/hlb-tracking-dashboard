import {ElementToRender} from "../../Tables/TableComponent.tsx";
import {Maybe} from "../../lib/hlb-api-library/src/maybeMonad/Maybe";
import {useNavigate} from "react-router-dom";
import {NavigationArrow} from "../../StandandaloneComponents/NavigationArrow";

const defaultElement = <div>Cargando...</div>;

export const NavigableField = (props: { content: Maybe<ElementToRender>, path: string, default?: ElementToRender }) => {
    const navigate = useNavigate();
    const nav = () => navigate(props.path)

    const containerStyle = {
        position: 'relative' as const,
        paddingRight: '4px',
        margin: '4px'
    }

    return props.content.map((content: ElementToRender) => (
        <div className={"navigable-field-entry-container style-cursor-clickable"} onClick={nav} style={containerStyle}>
            <div style={{width:"80%"}}>
                {content}
            </div>
            
            <div style={{width:"5%"}}>
                <NavigationArrow/>
            </div>
        </div>
    )).orElse(props.default || defaultElement)
}