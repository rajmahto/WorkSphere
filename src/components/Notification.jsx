import { useEffect } from "react";

function Notification({ type = "success", message, onClose }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>

            <div className="notification-icon">
                {type === "success" && "✓"}
                {type === "error" && "!"}
                {type === "info" && "i"}
            </div>

            <div className="notification-content">
                <strong>
                    {type === "success" && "Success"}
                    {type === "error" && "Error"}
                    {type === "info" && "Information"}
                </strong>

                <p>{message}</p>
            </div>

            <button
                className="notification-close"
                onClick={onClose}
            >
                ×
            </button>

        </div>
    );
}

export default Notification;