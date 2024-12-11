import { UserContext } from "../../../context/user.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './welcomeuser.style.scss';

const WelcomeUser = () => {
    const navigate = useNavigate();
    const { currentUser, userDetails } = useContext(UserContext);

    if (!currentUser) {
        navigate("/");
        return null;
    }

    const profilePageNavigation = () => {
        navigate("/profile");
    }

    const { displayName, photoURL } = userDetails;
    const profilePicUrl = photoURL || currentUser.photoURL || 'default-image-url'; // Fallback to a default image if necessary

    console.log(userDetails);

    return (
        <div className="user-details-container" onClick={profilePageNavigation}>
            <div className="user-box">
                <span className="user-image">
                    <img
                        src={profilePicUrl}
                        alt={`${displayName}`}
                        onError={(e) => e.target.src = 'default-image-url'} // Fallback if image fails to load
                    />
                </span>
                <div>
                    <span className="welcome-text">Welcome Back</span>
                    <div className="userName">{displayName}</div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeUser;
