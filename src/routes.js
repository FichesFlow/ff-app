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
import DeckGallery from './pages/DeckGallery.jsx'
import Root from './components/layout/Root.jsx'
import Editor from './pages/Editor.jsx'
import Contact from './pages/Contact.jsx'
import LegalTerms from './pages/LegalTerms.jsx'
import About from './pages/About.jsx'
import MyDecks from './pages/MyDecks.jsx'
import ReviewQueue from './pages/ReviewQueue.jsx';

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
    {path: '/legal/terms', Component: LegalTerms},
    {path: '/about', Component: About},
    {path: '/my-decks', Component: MyDecks},
    { path: '/review-queue', Component: ReviewQueue },

    /* --------- Decks --------- */
    {
      path: 'decks',
      children: [
        {index: true, Component: DeckGallery},
        {path: 'new', Component: DeckForm},
        {path: ':id', Component: DeckDetails},
        {path: ':id/edit', Component: DeckForm /* TODO: DeckEdit  */}
      ]
    },

    /* Fallback */
    {path: '*', Component: NotFound}
  ]
}]);