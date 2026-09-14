function DashboardPage() {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    return (
        <div className="dashboard-page">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="sidebar-logo">
                    WorkSphere
                </div>

                <nav className="sidebar-menu">

                    <button className="menu-item active">
                        Dashboard
                    </button>

                    <button className="menu-item">
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

                    <button className="logout-button">
                        Logout
                    </button>

                </div>

            </aside>


            {/* Main Content */}
            <main className="dashboard-content">

                {/* Top Bar */}
                <header className="dashboard-header">

                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back to your workspace</p>
                    </div>

                    <div className="user-info">

                        <div className="user-avatar">
                            {email ? email.charAt(0).toUpperCase() : "U"}
                        </div>

                        <div>
                            <strong>{email}</strong>
                            <span>{role}</span>
                        </div>

                    </div>

                </header>


                {/* Welcome Section */}
                <section className="welcome-section">

                    <h2>Good to see you 👋</h2>

                    <p>
                        Here's what's happening with your work today.
                    </p>

                </section>


                {/* Dashboard Cards */}
                <section className="dashboard-cards">

                    <div className="dashboard-card">

                        <div className="card-icon">
                            ✓
                        </div>

                        <div>
                            <span>Attendance</span>
                            <h3>Present</h3>
                        </div>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            🏖
                        </div>

                        <div>
                            <span>Leave Balance</span>
                            <h3>12 Days</h3>
                        </div>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            ₹
                        </div>

                        <div>
                            <span>Latest Salary</span>
                            <h3>₹62,000</h3>
                        </div>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            📅
                        </div>

                        <div>
                            <span>Working Days</span>
                            <h3>22 Days</h3>
                        </div>

                    </div>

                </section>


                {/* Bottom Section */}
                <section className="dashboard-grid">

                    <div className="dashboard-panel">

                        <div className="panel-header">
                            <h2>Recent Activity</h2>
                            <button>View All</button>
                        </div>

                        <div className="activity-item">
                            <span className="activity-dot success"></span>
                            <div>
                                <strong>Attendance marked</strong>
                                <p>Today at 9:15 AM</p>
                            </div>
                        </div>

                        <div className="activity-item">
                            <span className="activity-dot"></span>
                            <div>
                                <strong>Payroll generated</strong>
                                <p>September 2026</p>
                            </div>
                        </div>

                        <div className="activity-item">
                            <span className="activity-dot"></span>
                            <div>
                                <strong>Leave balance updated</strong>
                                <p>2 days ago</p>
                            </div>
                        </div>

                    </div>


                    <div className="dashboard-panel ai-panel">

                        <div className="panel-header">
                            <h2>AI Assistant</h2>
                            <span className="ai-badge">AI</span>
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