import { UserContext } from "../../../context/user.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './welcomeuser.style.scss';

const WelcomeUser = ( { text}) => {
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
            <div className="user-display-box">
                <div className="user-box">
                    <span className="user-image">
                        <img
                            src={profilePicUrl}
                            alt={`${displayName}`}
                            onError={(e) => e.target.src = 'default-image-url'} // Fallback if image fails to load
                        />
                    </span>
                    <div>
                        <span className="welcome-text">{text}</span>
                        <div className="userName">{displayName}</div>
                    </div>
                </div>
                <div>
                    <img src=" https://kringle-templates.s3.ap-southeast-1.amazonaws.com/development/10495/images/UEFA/Group_80%5B1%5D.png" alt="" />
                </div>
           </div>
        </div>
    );
}

export default WelcomeUser;
