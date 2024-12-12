
import "./profile.style.scss"
import ProfileBio from "../../components/profileBio/profileBio.component";
import { useNavigate } from "react-router-dom";
import MyFeeds from "../../components/myfeed/myfeed.component";
const Profile = () => {
    const navigate = useNavigate()
    const editProfileHandler = () => {
        navigate('/editProfile')
    }
    return (
        <div>
            <ProfileBio onClick={editProfileHandler} />
            <MyFeeds />
        </div>
    )
};

export default Profile;