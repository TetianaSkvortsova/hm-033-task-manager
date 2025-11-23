import { BrowserRouter } from 'react-router'
import './App.css'
import Content from './components/Content/Content'
import Header from './components/Header/Header'
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {getUserAsync} from "./store/features/user.js";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        dispatch(getUserAsync({
            login: '',
            password: '',
            token: token,
        }));
    }, [dispatch]);
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Header />
        <Content />
      </BrowserRouter>
    </>
  )
}

export default App
