import {createBrowserRouter} from 'react-router'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import Account from './pages/Account.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import TestPlayground from './pages/TestPlayground.jsx'
import DeckForm from './pages/DeckForm.jsx'
import DeckDetails from './pages/DeckDetails.jsx'
import Root from './components/layout/Root.jsx'
import Editor from './pages/Editor.jsx'
import Contact from './pages/Contact.jsx'

export const router = createBrowserRouter([{
  path: '/',
  Component: Root,
  children: [
    {index: true, Component: Home},

    /* Pages générales */
    {path: 'account', Component: Account},
    {path: 'leaderboard', Component: Leaderboard},
    {path: 'playground', Component: TestPlayground},
    {path: 'register', Component: Register},
    {path: 'login', Component: Login},
    {path: 'Edition', Component: Editor},
    {path: '/contact', Component: Contact},

    /* --------- Decks --------- */
    {
      path: 'decks',
      children: [
        {index: true, Component: NotFound /* TODO: DeckList */},
        {path: 'new', Component: DeckForm},
        {path: ':id', Component: DeckDetails},
        {path: ':id/edit', Component: DeckForm /* TODO: DeckEdit  */}
      ]
    },

    /* Fallback */
    {path: '*', Component: NotFound}
  ]
}]);