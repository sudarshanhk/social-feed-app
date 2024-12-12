import { UserContext } from "../../../context/user.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './welcomeuser.style.scss';
// import DefaultImg from '../../assets/profileDefaule.png';
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
    const profilePicUrl = photoURL || currentUser.photoURL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD116U9ZCk8bEaanCeB5rSCC2uqY5Ka_2_EA&s' // Fallback to a default image if necessary

  

    return (
        <div className="user-details-container" onClick={profilePageNavigation}>
            <div className="user-display-box">
                <div className="user-box">
                    <span className="user-image">
                        <img
                            src={profilePicUrl ? profilePicUrl : currentUser.photoURL}
                           
                            onError={(e) => e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD116U9ZCk8bEaanCeB5rSCC2uqY5Ka_2_EA&s'} // Fallback if image fails to load
                        />
                    </span>
                    <div>
                        <span className="welcome-text">{text}</span>
                        <div className="userName">{displayName ? displayName : currentUser.displayName}</div>
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
