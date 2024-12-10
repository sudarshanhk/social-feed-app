
import { UserContext } from "../../../context/user.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './welcomeuser.style.scss';

const WelcomeUser = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    if (!currentUser) {
        navigate("/login");
        return null; 
    }
    const profilePageNavigation = () => {
        navigate("/profile")
    }
    const {  displayName, photoURL } = currentUser
    return (
        <div className="user-details-container" onClick={profilePageNavigation}>
            <div className="user-box">
                <span  className="user-image"><img src={photoURL} alt={`${displayName}`} /></span>
                <div>
                    <span className="welcome-text"> Welcome Back</span>
                    <div className="userName">{displayName}</div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeUser