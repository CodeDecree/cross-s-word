interface PopupProps {
    message: string;
    disable: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, disable }) => {
    return (
        <div className="overlay">
            <div className="popup">
                <div className="popupContent">
                    <p>{message}</p>
                </div>
                <button style={{width: '100%'}} className="btn ctr" onClick={disable}>OK</button>
            </div>
        </div>
    );
};

export default Popup;