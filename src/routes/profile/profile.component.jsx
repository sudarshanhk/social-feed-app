
import "./profile.style.scss"
import ProfileBio from "../../components/profileBio/profileBio.component";
import { useNavigate } from "react-router-dom";
import MyFeeds from "../../components/myfeed/myfeed.component";
import Back_arrow from "../../assets/back-arrow.png";
import CreateFeedButton from "../../components/caratefeedButton/createfeedButton.component";
const Profile = () => {
    const navigate = useNavigate()
    const editProfileHandler = () => {
        navigate('/editProfile')
    }
   
    const handleBack = () => {
        navigate('/feed')
    }
    return (
        <div className="profile-container">
         
            <span className="back-arrow" onClick={handleBack}>
                <img src={Back_arrow} alt="Back" />  Profile
            </span>
            <ProfileBio onClick={editProfileHandler} />
            {/* <CreateFeedButton /> */}
            <MyFeeds />
           
        </div>
    )
};

export default Profile;