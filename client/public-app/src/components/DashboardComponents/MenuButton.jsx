import {Link} from "react-router-dom";


export const MenuButton = ({link, title, svg, classname}) => {

    return (
        <Link to={link}>
            <div className={classname}>
                <h2>{title}</h2>
                {svg}
            </div>
        </Link>
    )
}