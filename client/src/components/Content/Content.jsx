import { Route, Routes } from 'react-router';
import './Content.css';
import { menuItems } from '../../common/menu';
import PrivateRoute from "../PrivateRoute/PrivateRoute.jsx";

export default function Content() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {menuItems.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
    </Routes>
  )
}