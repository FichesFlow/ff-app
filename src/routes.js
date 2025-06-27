import {createBrowserRouter} from "react-router";
import Home from './pages/Home.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
]);