
import "./profileBio.style.scss";
import Buttons from "../buttons/buttons.component";
import { UserContext } from "../../context/user.context";
import { use, useContext } from "react";
import  DefaultBgImage from "../../assets/default-bg.png"
const ProfileBio = ( {onClick} ) => {
    const { currentUser, userDetails } = useContext(UserContext);
    console.log(userDetails)
    if (!currentUser) return null;
    const { photoURL, displayName, email, bg, bio } = userDetails
    return (
        <div className="profile-bio-container">
            <div className="profile-bio-bgImage-container">
                <span className="profile-bg-image"><img src={bg ? bg : DefaultBgImage}  alt="" /></span>
                <span className="back-arrow"> <img src="" alt="" /></span>

            </div>
            <div className="edit-bio-section">
                <div className="profile-icon-section">
                    <span className="profile-image"> <img src={photoURL ? photoURL : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD116U9ZCk8bEaanCeB5rSCC2uqY5Ka_2_EA&s'} alt="" onError={(e) => e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD116U9ZCk8bEaanCeB5rSCC2uqY5Ka_2_EA&s'} /></span>
                    <Buttons onClick={onClick} buttonName={' Edit Profile '} buttonType={'secondaryButton'} />

                </div>
            </div>
            <div className="user-display-box">
                <div className="user-bio-name-text">{displayName}</div>
                <div className="user-bio-text">
                    {bio ? bio : "You have not added Your Bio Please set Your Bio on clicking Edit Profile"}
                </div>

            </div>

        </div>
    )
};

export default ProfileBio;