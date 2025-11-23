import {menuItems} from '../../common/menu';
import './Menu.css';
import {Link} from 'react-router';
import {useSelector} from "react-redux";

export default function Menu() {
useSelector (state => state.user.userData);
    return (
        <nav>
            <ul>
                {menuItems.map(item => (
                    !item.hideInMenu && <li key={item.path}>
                        <Link to={item.path}>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}