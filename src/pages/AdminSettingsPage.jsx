import {
    ArrowLeft,
    UserRound,
    Building2,
    ShieldCheck,
    Server
} from "lucide-react";

function AdminSettingsPage({ onBack }) {

    const email =
        localStorage.getItem("email") ||
        "admin@worksphere.com";

    const role =
        localStorage.getItem("role") ||
        "ADMIN";


    return (

        <div className="admin-settings-page">

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

            <div className="admin-settings-header">

                <div className="admin-settings-title">

                    <div className="admin-settings-title-icon">
                        <ShieldCheck size={28} />
                    </div>

                    <div>

                        <h1>Settings</h1>

                        <p>
                            Manage WorkSphere system information
                        </p>

                    </div>

                </div>

            </div>


            {/* Settings Grid */}

            <div className="admin-settings-grid">


                {/* Admin Profile */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-icon">
                        <UserRound size={22} />
                    </div>

                    <div className="admin-settings-card-content">

                        <h2>Admin Profile</h2>

                        <p>
                            Current administrator account
                        </p>


                        <div className="admin-settings-info">

                            <div>

                                <span>Email</span>

                                <strong>
                                    {email}
                                </strong>

                            </div>


                            <div>

                                <span>Role</span>

                                <strong>
                                    {role}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* Organization */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-icon">
                        <Building2 size={22} />
                    </div>

                    <div className="admin-settings-card-content">

                        <h2>Organization</h2>

                        <p>
                            WorkSphere organization information
                        </p>


                        <div className="admin-settings-info">

                            <div>

                                <span>Application</span>

                                <strong>
                                    WorkSphere
                                </strong>

                            </div>


                            <div>

                                <span>Platform</span>

                                <strong>
                                    Employee Management System
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* Security */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-icon">
                        <ShieldCheck size={22} />
                    </div>

                    <div className="admin-settings-card-content">

                        <h2>Security</h2>

                        <p>
                            Current authentication configuration
                        </p>


                        <div className="admin-settings-info">

                            <div>

                                <span>Authentication</span>

                                <strong>
                                    JWT Authentication
                                </strong>

                            </div>


                            <div>

                                <span>Session</span>

                                <strong>
                                    Stateless
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* System Information */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-icon">
                        <Server size={22} />
                    </div>

                    <div className="admin-settings-card-content">

                        <h2>System Information</h2>

                        <p>
                            WorkSphere application environment
                        </p>


                        <div className="admin-settings-info">

                            <div>

                                <span>Backend</span>

                                <strong>
                                    Spring Boot
                                </strong>

                            </div>


                            <div>

                                <span>Database</span>

                                <strong>
                                    PostgreSQL
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default AdminSettingsPage;