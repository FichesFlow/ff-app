import SignUpCard from "../components/auth/SignUpCard.jsx";
import {useDocumentTitle} from "../hooks/useDocumentTitle.js";

function Register() {
  useDocumentTitle("Inscription – FichesFlow");

  return (<SignUpCard/>)
}

export default Register;