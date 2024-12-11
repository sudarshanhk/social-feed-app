
import "./profile.style.scss"
import ProfileBio from "../../components/profileBio/profileBio.component";
import { useNavigate } from "react-router-dom";
const Profile = () => {
    const navigate = useNavigate()
    const editProfileHandler = () => {
        navigate('/editProfile')
    }
    return (
        <div>
           <ProfileBio onClick= { editProfileHandler} />
        </div>
    )
};

export default Profile;