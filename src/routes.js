import {createBrowserRouter} from "react-router";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Account from './pages/Account.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import TestPlayground from './pages/TestPlayground.jsx';
import Root from "./components/layout/Root.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {index: true, Component: Home},
      {path: "/account", Component: Account},
      {path: "/leaderboard", Component: Leaderboard},
      {path: "/playground", Component: TestPlayground},
      {path: "/register", Component: Register},
      {path: "/login", Component: Login},
      {path: "*", Component: NotFound},
    ]
  }
]);