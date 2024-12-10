
import "./profileBio.style.scss";
import Buttons from "../buttons/buttons.component";
import { UserContext } from "../../context/user.context";
import { use, useContext } from "react";
import  DefaultBgImage from "../../assets/default-bg.png"
const ProfileBio = () => {
    const { currentUser } = useContext(UserContext);
    if (!currentUser) return null;
    const { photoURL, displayName, email } = currentUser
    return (
        <div className="profile-bio-container">
            <div className="profile-bio-bgImage-container">
                <span className="profile-bg-image"><img src={currentUser.bg ? currentUser.bg  :DefaultBgImage} alt="" /></span>
                <span className="back-arrow"> <img src="" alt="" /></span>

            </div>
            <div className="edit-bio-section">
                <div className="profile-icon-section">
                    <span className="profile-image"> <img src={photoURL} alt="" /></span>
                    <Buttons buttonName={' Edit Profile '} buttonType={'secondaryButton'} />

                </div>
            </div>
            <div className="user-display-box">
                <div className="user-bio-name-text">{displayName}</div>
                <div className="user-bio-text">
                    {currentUser.bio ? currentUser.bio : "You have not added Your Bio Please set Your Bio on clicking Edit Profile"}
                </div>

            </div>

        </div>
    )
};

export default ProfileBio;