import {createBrowserRouter} from 'react-router'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import Account from './pages/Account.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import TestPlayground from './pages/TestPlayground.jsx'
import AddDeck from './pages/AddDeck.jsx'
import Root from './components/layout/Root.jsx'
import Editor from './pages/Editor.jsx'

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

    /* --------- Decks --------- */
    {
      path: 'decks',
      children: [
        {index: true, Component: NotFound /* TODO: DeckList */},
        {path: 'new', Component: AddDeck},
        {path: ':id', Component: NotFound /* TODO: DeckView */},
        {path: ':id/edit', Component: AddDeck /* TODO: DeckEdit  */}
      ]
    },

    /* Fallback */
    {path: '*', Component: NotFound}
  ]
}]);