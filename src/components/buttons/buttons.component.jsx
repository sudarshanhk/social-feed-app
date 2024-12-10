import "./buttons.style.scss"
const BUTTONS_TYPE = {
    primaryButton: "primaryButton",
    secondaryButton : "secondaryButton",
}

const Buttons = ({ brandLogo, buttonName, buttonType, onClick = () => { } }) => {
    return (
        <button onClick={onClick} className={`button-container ${BUTTONS_TYPE[buttonType]} `} >
            <span> {brandLogo ? <img src={brandLogo} alt="" /> : ''}</span>  <span type="button"> {buttonName} </span>
        </button>
    )
}


export default Buttons