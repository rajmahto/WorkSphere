import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarCheck,
    Clock3,
    LogIn,
    LogOut,
    Timer,
    CheckCircle2,
    Circle
} from "lucide-react";

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

            setAttendance(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "Attendance error:",
                error
            );

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
            .filter(
                record => record.date === today
            )
            .sort(
                (a, b) =>
                    new Date(b.checkIn || 0) -
                    new Date(a.checkIn || 0)
            )[0] || null;


    const formatTime = (dateTime) => {

        if (!dateTime) {
            return "--";
        }

        const date = new Date(dateTime);

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );
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
                message: "Unable to connect to server."
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
                message: "Unable to connect to server."
            });

        } finally {

            setCheckingOut(false);
        }
    };


    const renderAttendanceButton = () => {

        if (loading) {

            return (
                <button
                    type="button"
                    className="attendance-primary-button"
                    disabled
                >
                    <Clock3 size={18} />
                    Loading...
                </button>
            );
        }


        if (!todayAttendance) {

            return (
                <button
                    type="button"
                    className="attendance-primary-button"
                    onClick={handleMarkAttendance}
                    disabled={marking}
                >
                    <CalendarCheck size={18} />

                    {marking
                        ? "Marking..."
                        : "Mark Attendance"}
                </button>
            );
        }


        if (
            todayAttendance.checkIn &&
            !todayAttendance.checkOut
        ) {

            return (
                <button
                    type="button"
                    className="attendance-primary-button"
                    onClick={handleCheckOut}
                    disabled={checkingOut}
                >
                    <LogOut size={18} />

                    {checkingOut
                        ? "Checking Out..."
                        : "Check Out"}
                </button>
            );
        }


        return (
            <button
                type="button"
                className="attendance-primary-button completed"
                disabled
            >
                <CheckCircle2 size={18} />
                Attendance Completed
            </button>
        );
    };


    return (

        <div className="attendance-page">

            {/* Header */}

            <div className="attendance-header">

                <div>

                    <button
                        type="button"
                        className="back-dashboard-button"
                        onClick={onBack}
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button>

                    <div className="attendance-title-row">

                        <div className="attendance-title-icon">
                            <CalendarCheck size={24} />
                        </div>

                        <div>

                            <h1>
                                Attendance
                            </h1>

                            <p>
                                Track your attendance and working hours
                            </p>

                        </div>

                    </div>

                </div>


                <div className="attendance-header-action">
                    {renderAttendanceButton()}
                </div>

            </div>


            {/* Today's Summary */}

            <section className="attendance-summary">

                {/* Status */}

                <div className="attendance-status-card">

                    <div className="attendance-summary-icon status">
                        {todayAttendance ? (
                            <CheckCircle2 size={22} />
                        ) : (
                            <Circle size={22} />
                        )}
                    </div>

                    <div className="attendance-summary-content">

                        <span>
                            Today's Status
                        </span>

                        <strong>
                            {loading
                                ? "Loading..."
                                : todayAttendance?.status ||
                                "NOT MARKED"}
                        </strong>

                    </div>

                </div>


                {/* Check In */}

                <div className="attendance-time-card">

                    <div className="attendance-summary-icon check-in">
                        <LogIn size={21} />
                    </div>

                    <div className="attendance-summary-content">

                        <span>
                            Check In
                        </span>

                        <strong>
                            {formatTime(
                                todayAttendance?.checkIn
                            )}
                        </strong>

                    </div>

                </div>


                {/* Check Out */}

                <div className="attendance-time-card">

                    <div className="attendance-summary-icon check-out">
                        <LogOut size={21} />
                    </div>

                    <div className="attendance-summary-content">

                        <span>
                            Check Out
                        </span>

                        <strong>
                            {formatTime(
                                todayAttendance?.checkOut
                            )}
                        </strong>

                    </div>

                </div>


                {/* Working Hours */}

                <div className="attendance-time-card">

                    <div className="attendance-summary-icon working-hours">
                        <Timer size={21} />
                    </div>

                    <div className="attendance-summary-content">

                        <span>
                            Working Hours
                        </span>

                        <strong>
                            {formatWorkingHours(
                                todayAttendance?.workingMinutes
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            {/* Attendance History */}

            <section className="attendance-history">

                <div className="attendance-history-header">

                    <div>

                        <h2>
                            Attendance History
                        </h2>

                        <p>
                            Your recent attendance records
                        </p>

                    </div>

                    <div className="attendance-history-count">
                        {attendance.length} Records
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

                                        <tr
                                            key={record.id}
                                        >

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

            </section>

        </div>
    );
}

export default AttendancePage;