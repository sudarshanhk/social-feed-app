import "./feeds.style.scss";

import WelcomeUser from "../../components/user/welcomeuser/welcomeuser.component";
import CreateFeedButton from "../../components/caratefeedButton/createfeedButton.component";
const Feeds = () => {
    return (
        <div className="user-feed-container">
            {<WelcomeUser />}
            <h2>Feeds</h2>
            <div className="feed-create-button">
                <CreateFeedButton />
           </div>
        </div>
    )
}


export default Feeds