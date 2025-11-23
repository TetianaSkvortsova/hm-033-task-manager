import './AuthForm.css';
import {useDispatch, useSelector} from "react-redux";
import {getUserAsync} from "../../store/features/user.js";
import {menuItems} from "../../common/menu.js";

export default function AuthForm() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);

        const credentials = {
            login: data.get('login'),
            password: data.get('password'),
        }
        dispatch(getUserAsync(credentials));
    }

    const handleExit = () => {
        localStorage.removeItem('authToken');
        menuItems.forEach(item => {
            if (item.title !== 'Main') item.hideInMenu = true;
        });
        window.location.reload();
    }

    return (
        <div className="AuthForm">
            {userData && Object.keys(userData).length > 0
                ? <div>
                    <span>Welcome, {userData.user.name}</span>
                    <button type = "button" onClick={handleExit}>Exit</button>
                </div>
                : <form onSubmit={handleSubmit}>
                    <input type="text" name="login" placeholder="Login"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <button type="submit">Sing in</button>
                </form>
            }
        </div>
    )
}