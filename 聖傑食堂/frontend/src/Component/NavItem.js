import {NavLink} from "react-router-dom";

/*
Simple component in navigation bar using NavLink from react-router-dom
*/

const NavItem = (props) => {
    return (
        <NavLink to={props.path} className="navItem" activeClassName="clicked" exact strict>
            <div onClick={props.handleLogout}>
                <div>{props.text}</div>
            </div>
        </NavLink>
    );
}

export default NavItem;