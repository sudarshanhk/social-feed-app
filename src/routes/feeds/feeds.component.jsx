import "./feeds.style.scss";

import WelcomeUser from "../../components/user/welcomeuser/welcomeuser.component";
import CreateFeedButton from "../../components/caratefeedButton/createfeedButton.component";
import { useNavigate } from "react-router-dom";
import FeedList from "../../components/feedslist/feedslist.component";
const Feeds = () => {
    const navigate = useNavigate()
    const createPostHandler = () => {
        navigate('/createpost')
    }
    return (
        <div className="user-feed-container">
            {<WelcomeUser />}
            <h2>Feeds</h2>
            <FeedList />
            <div className="feed-create-button" onClick={createPostHandler}>
                <CreateFeedButton  />
           </div>
        </div>
    )
}


export default Feeds