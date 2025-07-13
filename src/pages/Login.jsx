import SignInCard from "../components/auth/SignInCard.jsx";
import {useDocumentTitle} from "../hooks/useDocumentTitle.js";

function Login() {
  useDocumentTitle("Connexion – FichesFlow");

  return (<SignInCard/>);
}

export default Login;