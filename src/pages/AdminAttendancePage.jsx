import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ClipboardCheck,
    CalendarDays,
    Clock3,
    UserRound,
    Timer
} from "lucide-react";


function AdminAttendancePage({ onBack }) {

    const token = localStorage.getItem("token");

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchAttendance = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/attendance",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {

                    const data = await response.json();

                    setAttendance(data);
                }

            } catch (error) {

                console.error(
                    "Attendance loading error:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        fetchAttendance();

    }, [token]);


    const formatTime = (dateTime) => {

        if (!dateTime) {
            return "-";
        }

        return new Date(dateTime).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    const formatMinutes = (minutes) => {

        if (minutes === null || minutes === undefined) {
            return "-";
        }

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours === 0) {
            return `${mins} min`;
        }

        return `${hours}h ${mins}m`;
    };


    return (

        <div className="admin-attendance-page">

            {/* Back Button */}

            <button
                type="button"
                className="back-dashboard-button"
                onClick={onBack}
            >
                <ArrowLeft size={17} />
                Back to Dashboard
            </button>


            {/* Page Header */}

            <div className="admin-attendance-header">

                <div className="admin-attendance-title">

                    <div className="admin-attendance-title-icon">
                        <ClipboardCheck size={28} />
                    </div>

                    <div>
                        <h1>Attendance</h1>

                        <p>
                            View and monitor employee attendance records
                        </p>
                    </div>

                </div>


                <div className="admin-attendance-count">

                    <ClipboardCheck size={18} />

                    <span>
                        {attendance.length} Records
                    </span>

                </div>

            </div>


            {/* Attendance Table */}

            <div className="admin-attendance-card">

                <div className="admin-attendance-card-header">

                    <div>

                        <h2>Attendance Records</h2>

                        <p>
                            Complete employee attendance history
                        </p>

                    </div>

                    <ClipboardCheck size={24} />

                </div>


                <div className="admin-attendance-table-container">

                    <table className="admin-attendance-table">

                        <thead>

                            <tr>

                                <th>
                                    <UserRound size={15} />
                                    EMPLOYEE
                                </th>

                                <th>
                                    <CalendarDays size={15} />
                                    DATE
                                </th>

                                <th>
                                    <Clock3 size={15} />
                                    CHECK IN
                                </th>

                                <th>
                                    <Clock3 size={15} />
                                    CHECK OUT
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    <Timer size={15} />
                                    WORKING TIME
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="admin-attendance-message"
                                    >
                                        Loading attendance records...
                                    </td>

                                </tr>

                            ) : attendance.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="admin-attendance-message"
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

                                                <div className="admin-attendance-employee">

                                                    <div className="admin-attendance-avatar">

                                                        {record.employee?.name
                                                            ?.charAt(0)
                                                            .toUpperCase() || "?"}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {record.employee?.name || "Unknown"}
                                                        </strong>

                                                        <span>
                                                            ID #{record.employee?.id || "-"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                {record.date || "-"}
                                            </td>


                                            <td>
                                                {formatTime(record.checkIn)}
                                            </td>


                                            <td>
                                                {formatTime(record.checkOut)}
                                            </td>


                                            <td>

                                                <span
                                                    className={`admin-attendance-status ${record.status?.toLowerCase() || ""}`}
                                                >
                                                    {record.status || "-"}
                                                </span>

                                            </td>


                                            <td>

                                                <div className="admin-attendance-working-time">

                                                    <Timer size={15} />

                                                    {formatMinutes(
                                                        record.workingMinutes
                                                    )}

                                                </div>

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

export default AdminAttendancePage;