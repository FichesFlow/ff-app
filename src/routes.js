import {createBrowserRouter} from "react-router";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Account from './pages/Account.jsx';
import TestPlayground from './pages/TestPlayground.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/account",
    Component: Account,
  },
  {
    path: "/playground",
    Component: TestPlayground,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);