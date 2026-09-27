import "./LandingPage.css";
import logo from "../components/logo.svg";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
<<<<<<< HEAD
        <main className="landing-page">
            <img className="landing-logo" src={logo} alt="StudentReach logo" />

            <div className="landing-action">
                <button className="landing-next" onClick={() => navigate("/login")}>
=======
        <div className="LandingPage-div">
            <img src={logo} alt="StudentReach logo" />

            <div>
                <button onClick={() => navigate("/login")} className="LandingPage-btn">
>>>>>>> c83ab30d45a6693c9606a69de5c8e69b48394b60
                    <span>NEXT</span>
                </button>
            </div>
        </main>
    );
}

export default LandingPage;