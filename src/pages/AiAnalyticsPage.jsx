import { useEffect, useState } from "react";

function AiAnalyticsPage({ onBack }) {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);

    const [error, setError] = useState("");
    const [aiResponse, setAiResponse] = useState("");

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                const response = await fetch(
                    "http://https://worksphere-f0vt.onrender.com/ai/analytics/attendance",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load analytics");
                }

                const data = await response.json();

                setAnalytics(data);

            } catch (error) {

                console.error(
                    "Analytics error:",
                    error
                );

                setError(
                    "Unable to load attendance analytics."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchAnalytics();

    }, []);


    const generateAiSummary = async () => {

        setAiLoading(true);
        setAiResponse("");

        try {

            const response = await fetch(
                "http://https://worksphere-f0vt.onrender.com/ai/analytics/attendance/explanation",
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data);
            }

            setAiResponse(data);

        } catch (error) {

            console.error(
                "AI Analytics error:",
                error
            );

            setAiResponse(
                "AI summary is currently unavailable. Please try again later."
            );

        } finally {

            setAiLoading(false);
        }
    };


    return (
        <div className="ai-assistant-page">

            {/* Back */}
            <button
                type="button"
                className="ai-back-button"
                onClick={onBack}
            >
                ← Back to Dashboard
            </button>


            {/* Header */}
            <div className="ai-assistant-header">

                <div>
                    <h1>
                        AI HR Analytics
                    </h1>

                    <p>
                        Understand your workforce attendance data
                    </p>
                </div>

                <span className="ai-badge">
                    AI
                </span>

            </div>


            {/* Main Card */}
            <div
                className="ai-chat-box"
                style={{
                    height: "auto",
                    minHeight: "500px",
                    padding: "30px",
                    boxSizing: "border-box"
                }}
            >

                {/* Analytics heading */}
                <div style={{ marginBottom: "25px" }}>

                    <h2
                        style={{
                            margin: "0 0 6px",
                            color: "#12395d"
                        }}
                    >
                        Attendance Overview
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#718294",
                            fontSize: "14px"
                        }}
                    >
                        {analytics
                            ? `${analytics.month} ${analytics.year}`
                            : "Loading current data..."}
                    </p>

                </div>


                {/* Loading */}
                {loading && (
                    <div className="ai-welcome-message">
                        <h2>
                            Loading Analytics...
                        </h2>

                        <p>
                            Fetching attendance data from WorkSphere.
                        </p>
                    </div>
                )}


                {/* Error */}
                {error && (
                    <div className="ai-welcome-message">

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>
                )}


                {/* Analytics Cards */}
                {analytics && !loading && !error && (

                    <>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, 1fr)",
                                gap: "18px",
                                marginBottom: "30px"
                            }}
                        >

                            <div
                                style={{
                                    padding: "22px",
                                    border: "1px solid #dce6ed",
                                    borderRadius: "14px",
                                    background: "#f8fbfa"
                                }}
                            >
                                <span
                                    style={{
                                        color: "#718294",
                                        fontSize: "13px"
                                    }}
                                >
                                    Total Employees
                                </span>

                                <h2
                                    style={{
                                        margin: "8px 0 0",
                                        color: "#12395d"
                                    }}
                                >
                                    {analytics.totalEmployees}
                                </h2>
                            </div>


                            <div
                                style={{
                                    padding: "22px",
                                    border: "1px solid #dce6ed",
                                    borderRadius: "14px",
                                    background: "#f8fbfa"
                                }}
                            >
                                <span
                                    style={{
                                        color: "#718294",
                                        fontSize: "13px"
                                    }}
                                >
                                    Attendance Records
                                </span>

                                <h2
                                    style={{
                                        margin: "8px 0 0",
                                        color: "#12395d"
                                    }}
                                >
                                    {
                                        analytics
                                            .totalAttendanceRecordsThisMonth
                                    }
                                </h2>
                            </div>


                            <div
                                style={{
                                    padding: "22px",
                                    border: "1px solid #dce6ed",
                                    borderRadius: "14px",
                                    background: "#f8fbfa"
                                }}
                            >
                                <span
                                    style={{
                                        color: "#718294",
                                        fontSize: "13px"
                                    }}
                                >
                                    Present Records
                                </span>

                                <h2
                                    style={{
                                        margin: "8px 0 0",
                                        color: "#12395d"
                                    }}
                                >
                                    {
                                        analytics
                                            .presentAttendanceRecordsThisMonth
                                    }
                                </h2>
                            </div>

                        </div>


                        {/* AI Section */}
                        <div
                            style={{
                                borderTop:
                                    "1px solid #e3e9ee",
                                paddingTop: "25px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    marginBottom: "15px"
                                }}
                            >

                                <div>

                                    <h2
                                        style={{
                                            margin: "0 0 5px",
                                            color: "#12395d"
                                        }}
                                    >
                                        AI Analytics Assistant
                                    </h2>

                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#718294",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Get an AI-generated summary
                                        of the current attendance data.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={generateAiSummary}
                                    disabled={aiLoading}
                                    style={{
                                        padding:
                                            "12px 20px",
                                        border: "none",
                                        borderRadius: "10px",
                                        background: "#12395d",
                                        color: "#fff",
                                        fontWeight: "600",
                                        cursor: aiLoading
                                            ? "not-allowed"
                                            : "pointer",
                                        opacity: aiLoading
                                            ? 0.7
                                            : 1
                                    }}
                                >
                                    {aiLoading
                                        ? "Generating..."
                                        : "Generate AI Summary"}
                                </button>

                            </div>


                            {/* AI Response */}
                            {aiResponse && (

                                <div
                                    style={{
                                        marginTop: "18px",
                                        padding: "18px",
                                        borderRadius: "12px",
                                        background: "#edf4f2",
                                        color: "#12395d",
                                        lineHeight: "1.6",
                                        fontSize: "14px"
                                    }}
                                >
                                    {aiResponse}
                                </div>

                            )}

                        </div>

                    </>
                )}

            </div>

        </div>
    );
}

export default AiAnalyticsPage;