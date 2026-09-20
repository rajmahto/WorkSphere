import { useEffect, useState } from "react";
import AttendancePage from "./AttendancePage";
import "../App.css";

function DashboardPage({ onNotify }) {

    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    const [attendance, setAttendance] = useState([]);
    const [payroll, setPayroll] = useState(null);

    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(
        () => localStorage.getItem("currentPage") || "dashboard"
    );


    // Save current page
    useEffect(() => {
        localStorage.setItem("currentPage", currentPage);
    }, [currentPage]);


    // Fetch Dashboard Data
    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                // Attendance
                const attendanceResponse = await fetch(
                    "http://localhost:8080/attendance/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (attendanceResponse.ok) {

                    const attendanceData =
                        await attendanceResponse.json();

                    setAttendance(attendanceData);
                }


                // Payroll
                const payrollResponse = await fetch(
                    "http://localhost:8080/payrolls/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (payrollResponse.ok) {

                    const payrollData =
                        await payrollResponse.json();

                    if (payrollData.length > 0) {

                        // Latest payroll
                        const latestPayroll =
                            payrollData[payrollData.length - 1];

                        setPayroll(latestPayroll);
                    }
                }

            } catch (error) {

                console.error(
                    "Dashboard data error:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDashboardData();

    }, [token]);


    // Latest attendance record
    const latestAttendance =
        attendance.length > 0
            ? attendance[attendance.length - 1]
            : null;


    // Attendance status
    const attendanceStatus =
        latestAttendance?.status || "No Data";


    // Latest salary
    const latestSalary =
        payroll?.netSalary
            ? `₹${payroll.netSalary.toLocaleString("en-IN")}`
            : "No Data";


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("currentPage");

        window.location.reload();
    };


    // Attendance Page
    if (currentPage === "attendance") {

        return (
            <AttendancePage
                onNotify={onNotify}
                onBack={() => setCurrentPage("dashboard")}
            />
        );
    }


    return (
        <div className="dashboard-page">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="sidebar-logo">
                    WorkSphere
                </div>


                <nav className="sidebar-menu">

                    <button
                        className="menu-item active"
                        onClick={() => setCurrentPage("dashboard")}
                    >
                        Dashboard
                    </button>


                    <button
                        className="menu-item"
                        onClick={() => setCurrentPage("attendance")}
                    >
                        Attendance
                    </button>


                    <button className="menu-item">
                        Leave
                    </button>


                    <button className="menu-item">
                        Payroll
                    </button>


                    <button className="menu-item">
                        Profile
                    </button>

                </nav>


                <div className="sidebar-bottom">

                    <button className="menu-item">
                        Settings
                    </button>


                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* Main Content */}
            <main className="dashboard-content">

                {/* Top Bar */}
                <header className="dashboard-header">

                    <div>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome back to your workspace
                        </p>

                    </div>


                    <div className="user-info">

                        <div className="user-avatar">

                            {email
                                ? email.charAt(0).toUpperCase()
                                : "U"}

                        </div>


                        <div>

                            <strong>
                                {email}
                            </strong>

                            <span>
                                {role}
                            </span>

                        </div>

                    </div>

                </header>


                {/* Welcome Section */}
                <section className="welcome-section">

                    <h2>
                        Good to see you 👋
                    </h2>

                    <p>
                        Here's what's happening with your work today.
                    </p>

                </section>


                {/* Dashboard Cards */}
                <section className="dashboard-cards">


                    {/* Attendance */}
                    <div className="dashboard-card">

                        <div className="card-icon">
                            ✓
                        </div>

                        <div>

                            <span>
                                Attendance
                            </span>

                            <h3>
                                {loading
                                    ? "Loading..."
                                    : attendanceStatus}
                            </h3>

                        </div>

                    </div>


                    {/* Leave */}
                    <div className="dashboard-card">

                        <div className="card-icon">
                            🏖
                        </div>

                        <div>

                            <span>
                                Leave Balance
                            </span>

                            <h3>
                                12 Days
                            </h3>

                        </div>

                    </div>


                    {/* Salary */}
                    <div className="dashboard-card">

                        <div className="card-icon">
                            ₹
                        </div>

                        <div>

                            <span>
                                Latest Salary
                            </span>

                            <h3>
                                {loading
                                    ? "Loading..."
                                    : latestSalary}
                            </h3>

                        </div>

                    </div>


                    {/* Working Days */}
                    <div className="dashboard-card">

                        <div className="card-icon">
                            📅
                        </div>

                        <div>

                            <span>
                                Working Days
                            </span>

                            <h3>
                                {attendance.length} Days
                            </h3>

                        </div>

                    </div>

                </section>


                {/* Bottom Section */}
                <section className="dashboard-grid">


                    {/* Recent Activity */}
                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <h2>
                                Recent Activity
                            </h2>

                            <button>
                                View All
                            </button>

                        </div>


                        {latestAttendance && (

                            <div className="activity-item">

                                <span className="activity-dot success"></span>

                                <div>

                                    <strong>
                                        Attendance marked
                                    </strong>

                                    <p>
                                        {latestAttendance.date}
                                    </p>

                                </div>

                            </div>

                        )}


                        {payroll && (

                            <div className="activity-item">

                                <span className="activity-dot"></span>

                                <div>

                                    <strong>
                                        Payroll generated
                                    </strong>

                                    <p>
                                        {payroll.month}/{payroll.year}
                                    </p>

                                </div>

                            </div>

                        )}


                        <div className="activity-item">

                            <span className="activity-dot"></span>

                            <div>

                                <strong>
                                    Leave balance updated
                                </strong>

                                <p>
                                    Available in Leave section
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* AI Assistant */}
                    <div className="dashboard-panel ai-panel">

                        <div className="panel-header">

                            <h2>
                                AI Assistant
                            </h2>

                            <span className="ai-badge">
                                AI
                            </span>

                        </div>


                        <p>
                            Ask WorkSphere about your attendance,
                            leaves, salary or HR information.
                        </p>


                        <button className="ai-button">
                            Ask AI Assistant
                        </button>

                    </div>


                </section>

            </main>

        </div>
    );
}

export default DashboardPage;