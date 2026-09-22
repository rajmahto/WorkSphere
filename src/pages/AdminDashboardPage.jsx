import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    FileText,
    WalletCards,
    Settings,
    UserCircle,
    LogOut,
    UserRound,
    CalendarCheck,
    Clock3,
    ChevronRight,
    CheckCircle2,
    CircleAlert,
    ShieldCheck,
    UserPlus,
    ClipboardList,
    Activity,
    Database,
    Building2
} from "lucide-react";


import HRLeavePage from "./HRLeavePage";
import EmployeeManagementPage from "./EmployeeManagementPage";
import "../App.css";
import AdminAttendancePage from "./AdminAttendancePage";
import AdminPayrollPage from "./AdminPayrollPage";
import AdminSettingsPage from "./AdminSettingsPage";
import AdminDepartmentPage from "./AdminDepartmentPage";


function AdminDashboardPage({ onLogout, onNotify }) {

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("currentAdminPage") || "dashboard"
    );

    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [payrolls, setPayrolls] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        localStorage.setItem(
            "currentAdminPage",
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
                leavesResponse,
                payrollResponse
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
                ),

                fetch(
                    "http://localhost:8080/payrolls",
                    { headers }
                )
            ]);


            if (
                !employeesResponse.ok ||
                !attendanceResponse.ok ||
                !leavesResponse.ok ||
                !payrollResponse.ok
            ) {
                throw new Error(
                    "Unable to fetch admin dashboard data"
                );
            }


            const employeesData =
                await employeesResponse.json();

            const attendanceData =
                await attendanceResponse.json();

            const leavesData =
                await leavesResponse.json();

            const payrollData =
                await payrollResponse.json();


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

            setPayrolls(
                Array.isArray(payrollData)
                    ? payrollData
                    : []
            );


        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to load admin dashboard data."
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

        localStorage.removeItem(
            "currentAdminPage"
        );

        onLogout();
    };


    /* --------------------------------
       CHILD PAGES
    -------------------------------- */

    if (currentPage === "employees") {

        return (
            <EmployeeManagementPage
                onBack={() => navigate("dashboard")}
                onNotify={onNotify}
            />
        );
    }

    if (currentPage === "departments") {
        return (
            <AdminDepartmentPage
                onBack={() => setCurrentPage("dashboard")}
                onNotify={onNotify}
            />
        );
    }

    if (currentPage === "attendance") {
        return (
            <AdminAttendancePage
                onBack={() => setCurrentPage("dashboard")}
                
            />
        );
    }

    if (currentPage === "payroll") {
        return (
            <AdminPayrollPage
                onBack={() => setCurrentPage("dashboard")}
                onNotify={onNotify}
            />
        );
    }

    if (currentPage === "leave") {

        return (
            <HRLeavePage
                onBack={() =>
                    navigate("dashboard")
                }
                onNotify={onNotify}
            />
        );
    }

    if (currentPage === "settings") {
        return (
            <AdminSettingsPage
                onBack={() => setCurrentPage("dashboard")}
            />
        );
    }


    /* --------------------------------
       ADMIN DASHBOARD
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
                            Admin Portal
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
                        className={`hr-nav-item ${currentPage === "departments"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            navigate("departments")
                        }
                    >
                        <Building2 size={19} />

                        <span>
                            Departments
                        </span>
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() => setCurrentPage("attendance")}
                    >
                        <ClipboardCheck size={19} />

                        <span>
                            Attendance
                        </span>
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() =>
                            navigate("leave")
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
                        onClick={() => setCurrentPage("payroll")}
                    >
                        <WalletCards size={19} />

                        <span>
                            Payroll
                        </span>
                    </button>


                    <button
                        className="hr-nav-item"
                        onClick={() => setCurrentPage("settings")}
                    >
                        <Settings size={19} />

                        <span>
                            Settings
                        </span>
                    </button>

                </nav>


                {/* Sidebar Bottom */}

                <div className="hr-sidebar-bottom">

                    <div className="hr-sidebar-user">

                        <div className="hr-user-avatar">
                            <ShieldCheck size={18} />
                        </div>

                        <div className="hr-user-details">

                            <strong>
                                ADMIN
                            </strong>

                            <span>
                                {email || "Admin User"}
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
                            ADMIN PORTAL
                        </span>

                        <h1>
                            Dashboard
                        </h1>

                        <p className="hr-header-subtitle">
                            Manage your WorkSphere system and employee operations.
                        </p>

                    </div>


                    <div className="hr-user">

                        <div className="hr-user-avatar">
                            <ShieldCheck size={18} />
                        </div>

                        <div className="hr-user-details">

                            <strong>
                                ADMIN
                            </strong>

                            <span>
                                {email || "Admin User"}
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
                                Attendance Records
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : attendance.length}
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
                            navigate("leave")
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
                                Payroll Records
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : payrolls.length}
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={18}
                        />

                    </button>

                </section>


                {/* Admin Content */}

                <section className="hr-dashboard-grid">

                    {/* System Operations */}

                    <div className="hr-section">

                        <div className="hr-section-heading">

                            <div>

                                <h2>
                                    System Operations
                                </h2>

                                <p>
                                    Manage core WorkSphere operations
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
                                        View employee records and information
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
                                    navigate("leave")
                                }
                            >

                                <div className="hr-operation-icon leave">
                                    <FileText size={20} />
                                </div>

                                <div className="hr-operation-content">

                                    <strong>
                                        Manage Leave
                                    </strong>

                                    <span>
                                        Review and process leave requests
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
                                            "System settings are coming next."
                                    })
                                }
                            >

                                <div className="hr-operation-icon settings">
                                    <Settings size={20} />
                                </div>

                                <div className="hr-operation-content">

                                    <strong>
                                        System Settings
                                    </strong>

                                    <span>
                                        Configure WorkSphere settings
                                    </span>

                                </div>

                                <ChevronRight
                                    className="hr-operation-arrow"
                                    size={18}
                                />

                            </button>

                        </div>

                    </div>


                    {/* System Overview */}

                    <div className="hr-section">

                        <div className="hr-section-heading">

                            <div>

                                <h2>
                                    System Overview
                                </h2>

                                <p>
                                    Current platform activity
                                </p>

                            </div>

                        </div>


                        <div className="hr-activity-card">

                            <div className="hr-activity-item">

                                <div className="hr-activity-icon">
                                    <Database size={18} />
                                </div>

                                <div className="hr-activity-info">

                                    <strong>
                                        Employee Records
                                    </strong>

                                    <span>
                                        {employees.length} employee records available
                                    </span>

                                </div>

                                <span className="hr-status active">
                                    Active
                                </span>

                            </div>


                            <div className="hr-activity-item">

                                <div className="hr-activity-icon">
                                    <Activity size={18} />
                                </div>

                                <div className="hr-activity-info">

                                    <strong>
                                        Attendance
                                    </strong>

                                    <span>
                                        {presentRecords} present attendance records
                                    </span>

                                </div>

                                <span className="hr-status active">
                                    Active
                                </span>

                            </div>


                            <div className="hr-activity-item">

                                <div className="hr-activity-icon">
                                    {pendingLeaves > 0
                                        ? <CircleAlert size={18} />
                                        : <CheckCircle2 size={18} />
                                    }
                                </div>

                                <div className="hr-activity-info">

                                    <strong>
                                        Leave Requests
                                    </strong>

                                    <span>
                                        {pendingLeaves} pending requests
                                    </span>

                                </div>

                                <span
                                    className={`hr-status ${pendingLeaves > 0
                                        ? "pending"
                                        : "active"
                                        }`}
                                >
                                    {pendingLeaves > 0
                                        ? "Pending"
                                        : "Clear"}
                                </span>

                            </div>


                            <div className="hr-activity-item">

                                <div className="hr-activity-icon">
                                    <WalletCards size={18} />
                                </div>

                                <div className="hr-activity-info">

                                    <strong>
                                        Payroll
                                    </strong>

                                    <span>
                                        {payrolls.length} payroll records available
                                    </span>

                                </div>

                                <span className="hr-status active">
                                    Active
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboardPage;