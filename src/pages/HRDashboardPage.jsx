import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    FileText,
    WalletCards,
    UserCircle,
    LogOut,
    UserRound,
    CalendarCheck,
    Clock3,
    ChevronRight,
    CheckCircle2,
    CircleAlert,
    UserPlus,
    ClipboardList
} from "lucide-react";

import "../App.css";
import HRLeavePage from "./HRLeavePage";
import EmployeeManagementPage from "./EmployeeManagementPage";


function HRDashboardPage({ onLogout, onNotify }) {

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("currentHRPage") || "dashboard"
    );

    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        localStorage.setItem(
            "currentHRPage",
            currentPage
        );
    }, [currentPage]);


    useEffect(() => {
        if (currentPage === "dashboard") {
            fetchDashboardData();
        }
    }, [currentPage]);


    const fetchDashboardData = async () => {

        setLoading(true);

        try {

            const headers = {
                Authorization: `Bearer ${token}`
            };


            const [
                employeesResponse,
                attendanceResponse,
                leavesResponse
            ] = await Promise.all([

                fetch(
                    "http://localhost:8080/employees",
                    { headers }
                ),

                fetch(
                    "http://localhost:8080/attendance",
                    { headers }
                ),

                fetch(
                    "http://localhost:8080/leaves",
                    { headers }
                )
            ]);


            if (
                !employeesResponse.ok ||
                !attendanceResponse.ok ||
                !leavesResponse.ok
            ) {
                throw new Error(
                    "Unable to fetch HR dashboard data"
                );
            }


            const employeesData =
                await employeesResponse.json();

            const attendanceData =
                await attendanceResponse.json();

            const leavesData =
                await leavesResponse.json();


            setEmployees(
                Array.isArray(employeesData)
                    ? employeesData
                    : []
            );

            setAttendance(
                Array.isArray(attendanceData)
                    ? attendanceData
                    : []
            );

            setLeaves(
                Array.isArray(leavesData)
                    ? leavesData
                    : []
            );


        } catch (error) {

            console.error(
                "HR dashboard error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to load HR dashboard data."
            });

        } finally {

            setLoading(false);
        }
    };


    const pendingLeaves =
        leaves.filter(
            (leave) =>
                leave.status === "PENDING"
        ).length;


    const presentRecords =
        attendance.filter(
            (record) =>
                record.status === "PRESENT"
        ).length;


    const navigate = (page) => {
        setCurrentPage(page);
    };


    const handleLogout = () => {

        localStorage.removeItem("currentHRPage");

        onLogout();
    };


    /* --------------------------------
       CHILD PAGES
    -------------------------------- */

    if (currentPage === "employees") {

        return (
            <EmployeeManagementPage
                onBack={() =>
                    navigate("dashboard")
                }
            />
        );
    }


    if (currentPage === "hr-leave") {

        return (
            <HRLeavePage
                onBack={() =>
                    navigate("dashboard")
                }
                onNotify={onNotify}
            />
        );
    }


    /* --------------------------------
       HR DASHBOARD
    -------------------------------- */

    return (

        <div className="hr-dashboard-container">

            {/* Sidebar */}

            <aside className="hr-sidebar">

                <div className="hr-brand">

                    <div className="hr-brand-mark">
                        WS
                    </div>

                    <div>
                        <strong>
                            WorkSphere
                        </strong>

                        <span>
                            HR Portal
                        </span>
                    </div>

                </div>


                {/* Navigation */}

                <nav className="hr-sidebar-nav">

                    <button
                        className={`hr-nav-item ${currentPage === "dashboard"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            navigate("dashboard")
                        }
                    >
                        <LayoutDashboard size={19} />

                        <span>
                            Dashboard
                        </span>
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() =>
                            navigate("employees")
                        }
                    >
                        <Users size={19} />

                        <span>
                            Employees
                        </span>

                        <span className="hr-nav-badge">
                            {employees.length}
                        </span>
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() =>
                            onNotify({
                                type: "info",
                                message:
                                    "Attendance management is coming next."
                            })
                        }
                    >
                        <ClipboardCheck size={19} />

                        <span>
                            Attendance
                        </span>
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() =>
                            navigate("hr-leave")
                        }
                    >
                        <FileText size={19} />

                        <span>
                            Leave Requests
                        </span>

                        {pendingLeaves > 0 && (
                            <span className="hr-nav-badge alert">
                                {pendingLeaves}
                            </span>
                        )}
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() =>
                            onNotify({
                                type: "info",
                                message:
                                    "Payroll management is coming next."
                            })
                        }
                    >
                        <WalletCards size={19} />

                        <span>
                            Payroll
                        </span>
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() =>
                            onNotify({
                                type: "info",
                                message:
                                    "Profile management is coming next."
                            })
                        }
                    >
                        <UserCircle size={19} />

                        <span>
                            Profile
                        </span>
                    </button>

                </nav>


                {/* Sidebar Bottom */}

                <div className="hr-sidebar-bottom">

                    <div className="hr-sidebar-user">

                        <div className="hr-user-avatar">
                            <UserRound size={18} />
                        </div>

                        <div className="hr-user-details">

                            <strong>
                                HR
                            </strong>

                            <span>
                                {email || "HR User"}
                            </span>

                        </div>

                    </div>


                    <button
                        className="hr-logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>


            {/* Main */}

            <main className="hr-main">

                {/* Header */}

                <header className="hr-header">

                    <div>

                        <span className="hr-page-label">
                            HR PORTAL
                        </span>

                        <h1>
                            Dashboard
                        </h1>

                        <p className="hr-header-subtitle">
                            Manage employees, attendance and leave requests.
                        </p>

                    </div>


                    <div className="hr-user">

                        <div className="hr-user-avatar">
                            <UserRound size={18} />
                        </div>

                        <div className="hr-user-details">

                            <strong>
                                HR
                            </strong>

                            <span>
                                {email || "HR User"}
                            </span>

                        </div>

                    </div>

                </header>


                {/* Stats */}

                <section className="hr-stat-grid">

                    <button
                        className="hr-stat-card hr-stat-clickable"
                        onClick={() =>
                            navigate("employees")
                        }
                    >

                        <div className="hr-stat-icon employees">
                            <Users size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Total Employees
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : employees.length}
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={18}
                        />

                    </button>


                    <button
                        className="hr-stat-card"
                        onClick={() =>
                            onNotify({
                                type: "info",
                                message:
                                    "Attendance details will be available here."
                            })
                        }
                    >

                        <div className="hr-stat-icon attendance">
                            <CalendarCheck size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Present Records
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : presentRecords}
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={18}
                        />

                    </button>


                    <button
                        className="hr-stat-card hr-stat-clickable"
                        onClick={() =>
                            navigate("hr-leave")
                        }
                    >

                        <div className="hr-stat-icon leave">
                            <ClipboardList size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Pending Leaves
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : pendingLeaves}
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={18}
                        />

                    </button>


                    <button
                        className="hr-stat-card"
                        onClick={() =>
                            onNotify({
                                type: "info",
                                message:
                                    "Payroll management is coming next."
                            })
                        }
                    >

                        <div className="hr-stat-icon payroll">
                            <WalletCards size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Payroll
                            </span>

                            <strong>
                                Active
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={18}
                        />

                    </button>

                </section>


                {/* Main Content */}

                <section className="hr-dashboard-grid">

                    {/* Quick Operations */}

                    <div className="hr-section">

                        <div className="hr-section-heading">

                            <div>

                                <h2>
                                    Quick Operations
                                </h2>

                                <p>
                                    Common HR actions
                                </p>

                            </div>

                        </div>


                        <div className="hr-operation-grid">

                            <button
                                className="hr-operation-card"
                                onClick={() =>
                                    navigate("employees")
                                }
                            >

                                <div className="hr-operation-icon employees">
                                    <UserPlus size={20} />
                                </div>

                                <div className="hr-operation-content">

                                    <strong>
                                        Manage Employees
                                    </strong>

                                    <span>
                                        View and manage employee records
                                    </span>

                                </div>

                                <ChevronRight
                                    className="hr-operation-arrow"
                                    size={18}
                                />

                            </button>


                            <button
                                className="hr-operation-card"
                                onClick={() =>
                                    navigate("hr-leave")
                                }
                            >

                                <div className="hr-operation-icon leave">
                                    <FileText size={20} />
                                </div>

                                <div className="hr-operation-content">

                                    <strong>
                                        Review Leave Requests
                                    </strong>

                                    <span>
                                        Approve or reject pending requests
                                    </span>

                                </div>

                                <ChevronRight
                                    className="hr-operation-arrow"
                                    size={18}
                                />

                            </button>


                            <button
                                className="hr-operation-card"
                                onClick={() =>
                                    onNotify({
                                        type: "info",
                                        message:
                                            "Attendance management is coming next."
                                    })
                                }
                            >

                                <div className="hr-operation-icon attendance">
                                    <Clock3 size={20} />
                                </div>

                                <div className="hr-operation-content">

                                    <strong>
                                        Attendance
                                    </strong>

                                    <span>
                                        Monitor employee attendance
                                    </span>

                                </div>

                                <ChevronRight
                                    className="hr-operation-arrow"
                                    size={18}
                                />

                            </button>

                        </div>

                    </div>


                    {/* Recent Activity */}

                    <div className="hr-section">

                        <div className="hr-section-heading">

                            <div>

                                <h2>
                                    Recent Activity
                                </h2>

                                <p>
                                    Latest HR activity
                                </p>

                            </div>

                            {leaves.length > 0 && (
                                <button
                                    className="hr-view-all"
                                    onClick={() =>
                                        navigate("hr-leave")
                                    }
                                >
                                    View all
                                    <ChevronRight size={16} />
                                </button>
                            )}

                        </div>


                        <div className="hr-activity-card">

                            {loading ? (

                                <div className="hr-empty-state">

                                    <Clock3 size={20} />

                                    <span>
                                        Loading activity...
                                    </span>

                                </div>

                            ) : leaves.length === 0 ? (

                                <div className="hr-empty-state">

                                    <CheckCircle2 size={20} />

                                    <div>

                                        <strong>
                                            No leave activity
                                        </strong>

                                        <span>
                                            There are no leave requests yet.
                                        </span>

                                    </div>

                                </div>

                            ) : (

                                leaves
                                    .slice()
                                    .reverse()
                                    .slice(0, 5)
                                    .map((leave) => (

                                        <div
                                            className="hr-activity-item"
                                            key={leave.id}
                                        >

                                            <div className="hr-activity-icon">

                                                {leave.status === "PENDING" ? (
                                                    <CircleAlert size={18} />
                                                ) : (
                                                    <CheckCircle2 size={18} />
                                                )}

                                            </div>


                                            <div className="hr-activity-info">

                                                <strong>
                                                    {leave.employee?.name ||
                                                        "Employee"}
                                                </strong>

                                                <span>
                                                    {leave.leaveType} leave
                                                    {" · "}
                                                    {leave.status}
                                                </span>

                                            </div>


                                            <span
                                                className={`hr-status ${leave.status?.toLowerCase()
                                                    }`}
                                            >
                                                {leave.status}
                                            </span>

                                        </div>

                                    ))

                            )}

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default HRDashboardPage;