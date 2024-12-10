import "./signin.style.scss";

import { signInWithGooglePopup } from "../../utils/firebase/firebase.utilities";

import Buttons from "../buttons/buttons.component";
import BrandLogo from "../../assets/bran-logo.png"
import GoogleLogo from "../../assets/google-logo.png"

const SignIn = () => {
    const signInWithGoogleHandler = async () => {
        const response = await signInWithGooglePopup();
       
    }
  
    return (
        <div className="sign-in-container">
            <div className="sign-in-box">
                <div className="login-option-box">
                    <div className="app-name-box">
                        <span className="app-logo"><img src={BrandLogo} alt="" /></span>
                        <h2>Vibesnap</h2>
                    </div>
                    <div className="login-description">Moment That matter , shared Forever</div>

                    <Buttons onClick={signInWithGoogleHandler} buttonType={'primaryButton'} brandLogo={GoogleLogo} buttonName={'Continue With Google'}  />
                   
                </div>
            </div>
        </div>

    )
};

export default SignIn;