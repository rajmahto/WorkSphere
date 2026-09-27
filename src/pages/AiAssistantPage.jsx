import { useState } from "react";

function AiAssistantPage({ onBack }) {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {

        if (!message.trim()) {
            return;
        }

        const userMessage = message.trim();

        setMessages((prev) => [
            ...prev,
            {
                type: "user",
                text: userMessage
            }
        ]);

        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:8080/ai/hr-assistant/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        message: userMessage
                    })
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data);
            }

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    text: data
                }
            ]);

        } catch (error) {

            setMessages((prev) => [
                ...prev,
                {
                    type: "ai",
                    text: "Sorry, I couldn't process your request right now."
                }
            ]);

            console.error("AI Assistant error:", error);
        }
    };

    return (
        <div className="ai-assistant-page">

            <button
                type="button"
                className="ai-back-button"
                onClick={onBack}
            >
                ← Back to Dashboard
            </button>

            <div className="ai-assistant-header">
                <div>
                    <h1>AI HR Assistant</h1>
                    <p>Ask WorkSphere about your HR information</p>
                </div>

                <span className="ai-badge">
                    AI
                </span>
            </div>

            <div className="ai-chat-box">

                <div className="ai-chat-messages">

                    {messages.length === 0 && (
                        <div className="ai-welcome-message">
                            <h2>👋 Hello!</h2>
                            <p>
                                I can help you with your leaves,
                                attendance, salary and other HR information.
                            </p>
                        </div>
                    )}

                    {messages.map((item, index) => (
                        <div
                            key={index}
                            className={`ai-message ${item.type}`}
                        >
                            {item.text}
                        </div>
                    ))}

                </div>

                <div className="ai-chat-input">

                    <input
                        type="text"
                        placeholder="Ask your HR question..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={sendMessage}
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AiAssistantPage;