import "./LandingPage.css";
import logo from "../components/logo.svg";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="LandingPage-div">
            <img src={logo} alt="StudentReach logo" />

            <div>
                <button onClick={() => navigate("/login")} className="LandingPage-btn">
                    <span>NEXT</span>
                </button>
            </div>
        </div>
    );
}

export default LandingPage;