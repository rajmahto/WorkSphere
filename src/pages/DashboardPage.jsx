import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    ClipboardCheck,
    FileText,
    WalletCards,
    UserCircle,
    LogOut,
    ChevronRight,
    CheckCircle2,
    Clock3,
    Sparkles
} from "lucide-react";

import AttendancePage from "./AttendancePage";
import LeavePage from "./LeavePage";
import PayrollPage from "./PayrollPage";
import "../App.css";

function DashboardPage({ onLogout, onNotify }) {

    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    const [attendance, setAttendance] = useState([]);
    const [payroll, setPayroll] = useState(null);
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(
        () => localStorage.getItem("currentPage") || "dashboard"
    );

    useEffect(() => {
        localStorage.setItem("currentPage", currentPage);
    }, [currentPage]);

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [
                    attendanceResponse,
                    payrollResponse,
                    balanceResponse
                ] = await Promise.all([
                    fetch(
                        "http://localhost:8080/attendance/my",
                        { headers }
                    ),
                    fetch(
                        "http://localhost:8080/payrolls/my",
                        { headers }
                    ),
                    fetch(
                        "http://localhost:8080/leave-balances/my",
                        { headers }
                    )
                ]);

                if (attendanceResponse.ok) {

                    const attendanceData =
                        await attendanceResponse.json();

                    setAttendance(
                        Array.isArray(attendanceData)
                            ? attendanceData
                            : []
                    );
                }

                if (payrollResponse.ok) {

                    const payrollData =
                        await payrollResponse.json();

                    const payrollList =
                        Array.isArray(payrollData)
                            ? payrollData
                            : [payrollData];

                    if (payrollList.length > 0) {
                        setPayroll(
                            payrollList[payrollList.length - 1]
                        );
                    }
                }

                if (balanceResponse.ok) {

                    const balanceData =
                        await balanceResponse.json();

                    setBalances(
                        Array.isArray(balanceData)
                            ? balanceData
                            : []
                    );
                }

            } catch (error) {

                console.error(
                    "Dashboard data error:",
                    error
                );

                onNotify({
                    type: "error",
                    message: "Unable to load dashboard data."
                });

            } finally {

                setLoading(false);
            }
        };

        fetchDashboardData();

    }, [token, onNotify]);

    const latestAttendance =
        attendance.length > 0
            ? attendance[attendance.length - 1]
            : null;

    const attendanceStatus =
        latestAttendance?.status || "No Data";

    const latestSalary = payroll?.netSalary
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(payroll.netSalary)
        : "No Data";

    const totalRemainingLeaves =
        balances.reduce(
            (total, balance) =>
                total + (balance.remainingLeaves || 0),
            0
        );

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    /*
     * Employee sub-pages
     */

    if (currentPage === "attendance") {

        return (
            <AttendancePage
                onNotify={onNotify}
                onBack={() => setCurrentPage("dashboard")}
            />
        );
    }

    if (currentPage === "leave") {

        return (
            <LeavePage
                onNotify={onNotify}
                onBack={() => setCurrentPage("dashboard")}
            />
        );
    }

    if (currentPage === "payroll") {

        return (
            <PayrollPage
                onNotify={onNotify}
                onBack={() => setCurrentPage("dashboard")}
            />
        );
    }

    return (

        <div className="hr-dashboard-container">

            {/* Sidebar */}

            <aside className="hr-sidebar">

                <div className="hr-brand">
                    <div className="hr-brand-icon">WS</div>

                    <span>
                        WorkSphere
                    </span>
                </div>
                <nav className="hr-sidebar-nav">

                    <button
                        type="button"
                        className={`hr-nav-item ${currentPage === "dashboard"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleNavigation("dashboard")
                        }
                    >
                        <LayoutDashboard
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Dashboard</span>
                    </button>


                    <button
                        type="button"
                        className={`hr-nav-item ${currentPage === "attendance"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleNavigation("attendance")
                        }
                    >
                        <ClipboardCheck
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Attendance</span>
                    </button>


                    <button
                        type="button"
                        className={`hr-nav-item ${currentPage === "leave"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleNavigation("leave")
                        }
                    >
                        <FileText
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Leave</span>
                    </button>


                    <button
                        type="button"
                        className={`hr-nav-item ${currentPage === "payroll"
                                ? "active"
                                : ""
                            }`}
                        onClick={() =>
                            handleNavigation("payroll")
                        }
                    >
                        <WalletCards
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Payroll</span>
                    </button>


                    <button
                        type="button"
                        className="hr-nav-item"
                    >
                        <UserCircle
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Profile</span>
                    </button>

                </nav>


                <div className="hr-sidebar-bottom">

                    <button
                        type="button"
                        className="hr-logout-button"
                        onClick={onLogout}
                    >
                        <LogOut
                            size={19}
                            strokeWidth={2}
                        />

                        <span>Logout</span>
                    </button>

                </div>

            </aside>


            {/* Main Content */}

            <main className="hr-main">

                {/* Header */}

                <header className="hr-header">

                    <div>

                        <p className="hr-page-label">
                            WORKSPHERE
                        </p>

                        <h1>
                            Employee Dashboard
                        </h1>

                        <p className="hr-header-subtitle">
                            Manage your work and employee information
                        </p>

                    </div>


                    <div className="hr-user">

                        <div className="hr-user-avatar">
                            {email
                                ? email.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        <div className="hr-user-details">

                            <strong>
                                {email || "Employee"}
                            </strong>

                            <span>
                                EMPLOYEE
                            </span>

                        </div>

                    </div>

                </header>


                {/* Statistics */}

                <section className="hr-stat-grid">

                    <button
                        type="button"
                        className="hr-stat-card hr-stat-clickable"
                        onClick={() =>
                            handleNavigation("attendance")
                        }
                    >

                        <div className="hr-stat-icon attendance">
                            <ClipboardCheck size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Attendance
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : attendanceStatus}
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={19}
                        />

                    </button>


                    <button
                        type="button"
                        className="hr-stat-card hr-stat-clickable"
                        onClick={() =>
                            handleNavigation("leave")
                        }
                    >

                        <div className="hr-stat-icon leaves">
                            <FileText size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Leave Balance
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : `${totalRemainingLeaves} Days`}
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={19}
                        />

                    </button>


                    <button
                        type="button"
                        className="hr-stat-card hr-stat-clickable"
                        onClick={() =>
                            handleNavigation("payroll")
                        }
                    >

                        <div className="hr-stat-icon employees">
                            <WalletCards size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Latest Salary
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : latestSalary}
                            </strong>

                        </div>

                        <ChevronRight
                            className="hr-stat-arrow"
                            size={19}
                        />

                    </button>


                    <div className="hr-stat-card">

                        <div className="hr-stat-icon present">
                            <CheckCircle2 size={21} />
                        </div>

                        <div className="hr-stat-content">

                            <span>
                                Working Days
                            </span>

                            <strong>
                                {attendance.length}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* Employee Operations */}

                <section className="hr-section">

                    <div className="hr-section-heading">

                        <div>

                            <h2>
                                Employee Operations
                            </h2>

                            <p>
                                Quick access to your daily work information
                            </p>

                        </div>

                    </div>


                    <div className="hr-operation-grid">

                        <button
                            type="button"
                            className="hr-operation-card"
                            onClick={() =>
                                handleNavigation("attendance")
                            }
                        >

                            <div className="hr-operation-icon">
                                <ClipboardCheck size={23} />
                            </div>

                            <div className="hr-operation-content">

                                <h3>
                                    Attendance
                                </h3>

                                <p>
                                    Mark attendance and view your attendance history
                                </p>

                            </div>

                            <ChevronRight
                                size={19}
                                className="hr-operation-arrow"
                            />

                        </button>


                        <button
                            type="button"
                            className="hr-operation-card"
                            onClick={() =>
                                handleNavigation("leave")
                            }
                        >

                            <div className="hr-operation-icon">
                                <FileText size={23} />
                            </div>

                            <div className="hr-operation-content">

                                <h3>
                                    Leave Management
                                </h3>

                                <p>
                                    Apply for leave and check your leave balance
                                </p>

                            </div>

                            <ChevronRight
                                size={19}
                                className="hr-operation-arrow"
                            />

                        </button>


                        <button
                            type="button"
                            className="hr-operation-card"
                            onClick={() =>
                                handleNavigation("payroll")
                            }
                        >

                            <div className="hr-operation-icon">
                                <WalletCards size={23} />
                            </div>

                            <div className="hr-operation-content">

                                <h3>
                                    Payroll
                                </h3>

                                <p>
                                    View your salary and payroll details
                                </p>

                            </div>

                            <ChevronRight
                                size={19}
                                className="hr-operation-arrow"
                            />

                        </button>


                        <button
                            type="button"
                            className="hr-operation-card"
                        >

                            <div className="hr-operation-icon">
                                <UserCircle size={23} />
                            </div>

                            <div className="hr-operation-content">

                                <h3>
                                    Profile
                                </h3>

                                <p>
                                    View your employee information
                                </p>

                            </div>

                            <ChevronRight
                                size={19}
                                className="hr-operation-arrow"
                            />

                        </button>

                    </div>

                </section>


                {/* Recent Activity */}

                <section className="hr-section">

                    <div className="hr-section-heading">

                        <div>

                            <h2>
                                Recent Activity
                            </h2>

                            <p>
                                Your latest work activity
                            </p>

                        </div>

                        <button
                            type="button"
                            className="hr-view-all"
                            onClick={() =>
                                handleNavigation("attendance")
                            }
                        >
                            View attendance

                            <ChevronRight size={17} />

                        </button>

                    </div>


                    <div className="hr-activity-card">

                        {latestAttendance ? (

                            <div className="hr-activity-item">

                                <div className="hr-activity-icon">

                                    {latestAttendance.status ===
                                        "PRESENT" ? (
                                        <CheckCircle2 size={18} />
                                    ) : (
                                        <Clock3 size={18} />
                                    )}

                                </div>


                                <div className="hr-activity-info">

                                    <strong>
                                        Attendance marked
                                    </strong>

                                    <span>
                                        {latestAttendance.date}
                                        {" • "}
                                        {latestAttendance.status}
                                    </span>

                                </div>


                                <span
                                    className={`hr-status ${latestAttendance.status?.toLowerCase()
                                        }`}
                                >
                                    {latestAttendance.status}
                                </span>

                            </div>

                        ) : (

                            <div className="hr-empty-state">

                                <Clock3 size={22} />

                                <span>
                                    No attendance activity found.
                                </span>

                            </div>

                        )}


                        {payroll && (

                            <div className="hr-activity-item">

                                <div className="hr-activity-icon">
                                    <WalletCards size={18} />
                                </div>

                                <div className="hr-activity-info">

                                    <strong>
                                        Payroll available
                                    </strong>

                                    <span>
                                        {payroll.month}
                                        /
                                        {payroll.year}
                                    </span>

                                </div>

                                <span className="hr-status approved">
                                    AVAILABLE
                                </span>

                            </div>

                        )}

                    </div>

                </section>


                {/* AI Assistant */}

                <section className="hr-section">

                    <div className="hr-section-heading">

                        <div>

                            <h2>
                                WorkSphere Assistant
                            </h2>

                            <p>
                                Get help with your employee information
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="hr-operation-card ai-operation-card"
                    >

                        <div className="hr-operation-icon">

                            <Sparkles size={23} />

                        </div>

                        <div className="hr-operation-content">

                            <h3>
                                AI HR Assistant
                            </h3>

                            <p>
                                Ask about your leave balance, attendance,
                                salary or HR information.
                            </p>

                        </div>

                        <ChevronRight
                            size={19}
                            className="hr-operation-arrow"
                        />

                    </button>

                </section>

            </main>

        </div>
    );
}

export default DashboardPage;

