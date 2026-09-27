import "./LandingPage.css";
import logo from "../components/logo.svg";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <main className="landing-page">
            <img className="landing-logo" src={logo} alt="StudentReach logo" />

            <div className="landing-action">
                <button className="landing-next" onClick={() => navigate("/login")}>
                    <span>NEXT</span>
                </button>
            </div>
        </main>
    );
}

export default LandingPage;