import { useEffect, useState } from "react";
import "../App.css";

function AttendancePage({ onNotify, onBack }) {

    const token = localStorage.getItem("token");

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);


    useEffect(() => {
        fetchAttendance();
    }, [token]);


    const fetchAttendance = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/attendance/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                throw new Error("Unable to fetch attendance");
            }


            const data = await response.json();

            setAttendance(data);

        } catch (error) {

            console.error("Attendance error:", error);

            onNotify({
                type: "error",
                message: "Unable to load attendance records."
            });

        } finally {

            setLoading(false);
        }
    };


    const today = new Date()
        .toISOString()
        .split("T")[0];


    const todayAttendance =
        attendance
            .filter(record => record.date === today)
            .sort(
                (a, b) =>
                    new Date(b.checkIn || 0) -
                    new Date(a.checkIn || 0)
            )[0] || null;


    const formatTime = (dateTime) => {

        if (!dateTime) return "--";

        const date = new Date(dateTime);

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };


    const formatWorkingHours = (workingMinutes) => {

        if (
            workingMinutes === null ||
            workingMinutes === undefined
        ) {
            return "--";
        }

        const hours = Math.floor(
            workingMinutes / 60
        );

        const minutes =
            workingMinutes % 60;

        return `${hours}h ${minutes}m`;
    };


    const handleMarkAttendance = async () => {

        if (marking) return;

        setMarking(true);

        try {

            const response = await fetch(
                "http://localhost:8080/attendance/my",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );


            const data = await response.json();


            if (!response.ok) {

                onNotify({
                    type: "error",
                    message:
                        data.message ||
                        "Unable to mark attendance."
                });

                return;
            }


            await fetchAttendance();


            onNotify({
                type: "success",
                message:
                    "Your attendance has been marked successfully."
            });


        } catch (error) {

            console.error(
                "Mark attendance error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to connect to server."
            });

        } finally {

            setMarking(false);
        }
    };


    const handleCheckOut = async () => {

        if (checkingOut) return;

        setCheckingOut(true);

        try {

            const response = await fetch(
                "http://localhost:8080/attendance/my/checkout",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();


            if (!response.ok) {

                onNotify({
                    type: "error",
                    message:
                        data.message ||
                        "Unable to check out."
                });

                return;
            }


            await fetchAttendance();


            onNotify({
                type: "success",
                message:
                    "You have checked out successfully."
            });


        } catch (error) {

            console.error(
                "Check out error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to connect to server."
            });

        } finally {

            setCheckingOut(false);
        }
    };


    const renderAttendanceButton = () => {

        if (loading) {

            return (
                <button
                    className="mark-attendance-button"
                    disabled
                >
                    Loading...
                </button>
            );
        }


        if (!todayAttendance) {

            return (
                <button
                    className="mark-attendance-button"
                    onClick={handleMarkAttendance}
                    disabled={marking}
                >
                    {marking
                        ? "Marking..."
                        : "+ Mark Attendance"}
                </button>
            );
        }


        if (
            todayAttendance.checkIn &&
            !todayAttendance.checkOut
        ) {

            return (
                <button
                    className="mark-attendance-button"
                    onClick={handleCheckOut}
                    disabled={checkingOut}
                >
                    {checkingOut
                        ? "Checking Out..."
                        : "Check Out"}
                </button>
            );
        }


        return (
            <button
                className="mark-attendance-button"
                disabled
            >
                Attendance Completed
            </button>
        );
    };


    return (
        <div className="attendance-page">

            <div className="attendance-header">

                <div>

                    <button
                        className="back-dashboard-button"
                        onClick={onBack}
                    >
                        ← Back to Dashboard
                    </button>


                    <h1>
                        Attendance
                    </h1>


                    <p>
                        Track your attendance and working hours
                    </p>

                </div>


                {renderAttendanceButton()}

            </div>


            <div className="attendance-summary">


                {/* Today's Status */}
                <div className="attendance-status-card">

                    <div className="attendance-icon">
                        ✓
                    </div>


                    <div>

                        <span>
                            Today's Status
                        </span>


                        <h2>

                            {loading
                                ? "Loading..."
                                : todayAttendance?.status ||
                                "NOT MARKED"}

                        </h2>

                    </div>

                </div>


                {/* Check In */}
                <div className="attendance-time-card">

                    <div className="time-icon">
                        🕘
                    </div>


                    <div>

                        <span>
                            Check In
                        </span>


                        <h2>

                            {formatTime(
                                todayAttendance?.checkIn
                            )}

                        </h2>

                    </div>

                </div>


                {/* Check Out */}
                <div className="attendance-time-card">

                    <div className="time-icon">
                        🕘
                    </div>


                    <div>

                        <span>
                            Check Out
                        </span>


                        <h2>

                            {formatTime(
                                todayAttendance?.checkOut
                            )}

                        </h2>

                    </div>

                </div>


                {/* Working Hours */}
                <div className="attendance-time-card">

                    <div className="time-icon">
                        ⏱️
                    </div>


                    <div>

                        <span>
                            Working Hours
                        </span>


                        <h2>

                            {formatWorkingHours(
                                todayAttendance?.workingMinutes
                            )}

                        </h2>

                    </div>

                </div>


            </div>


            {/* Attendance History */}
            <div className="attendance-history">


                <div className="attendance-history-header">

                    <div>

                        <h2>
                            Attendance History
                        </h2>


                        <p>
                            Your recent attendance records
                        </p>

                    </div>

                </div>


                <div className="attendance-table-container">

                    <table className="attendance-table">


                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Check In
                                </th>

                                <th>
                                    Check Out
                                </th>

                                <th>
                                    Working Hours
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >
                                        Loading attendance...
                                    </td>

                                </tr>


                            ) : attendance.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >
                                        No attendance records found.
                                    </td>

                                </tr>


                            ) : (

                                attendance
                                    .slice()
                                    .reverse()
                                    .map((record) => (

                                        <tr key={record.id}>


                                            <td>
                                                {record.date}
                                            </td>


                                            <td>

                                                {formatTime(
                                                    record.checkIn
                                                )}

                                            </td>


                                            <td>

                                                {formatTime(
                                                    record.checkOut
                                                )}

                                            </td>


                                            <td>

                                                {formatWorkingHours(
                                                    record.workingMinutes
                                                )}

                                            </td>


                                            <td>

                                                <span
                                                    className={`status-badge ${record.checkOut
                                                            ? "completed"
                                                            : record.status?.toLowerCase()
                                                        }`}
                                                >
                                                    {record.checkOut
                                                        ? "COMPLETED"
                                                        : record.status}
                                                </span>

                                            </td>


                                        </tr>

                                    ))
                            )}


                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}


export default AttendancePage;