import {Link} from "react-router-dom";

/**
 *
 * This component used to quickly navigate each path in the admin dashboard
 *
 * @param link
 * @param title
 * @param svg
 * @param classname
 * @returns {JSX.Element}
 * @constructor
 */



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