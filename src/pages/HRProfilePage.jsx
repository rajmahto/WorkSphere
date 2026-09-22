import {
    ArrowLeft,
    UserCircle,
    Mail,
    ShieldCheck,
    LockKeyhole,
    Building2
} from "lucide-react";

function HRProfilePage({ onBack }) {

    const email = localStorage.getItem("email") || "hr@worksphere.com";

    return (
        <div className="admin-settings-page hr-profile-page">

            <button
                type="button"
                className="back-dashboard-button"
                onClick={onBack}
            >
                <ArrowLeft size={17} />
                Back to Dashboard
            </button>

            <div className="admin-settings-header">

                <div className="admin-settings-title-icon">
                    <UserCircle size={32} />
                </div>

                <div>
                    <h1>HR Profile</h1>
                    <p>Manage your WorkSphere profile information</p>
                </div>

            </div>

            <div className="admin-settings-grid">

                {/* HR Profile */}

                <div className="admin-settings-card">

                    <div className="admin-settings-card-header">

                        <div className="admin-settings-card-icon">
                            <UserCircle size={24} />
                        </div>

                        <div>
                            <h2>HR Profile</h2>
                            <p>Current HR account</p>
                        </div>

                    </div>

                    <div className="admin-settings-row">
                        <span>
                            <Mail size={17} />
                            Email
                        </span>

                        <strong>{email}</strong>
                    </div>

                    <div className="admin-settings-row">
                        <span>
                            <ShieldCheck size={17} />
                            Role
                        </span>

                        <strong>HR</strong>
                    </div>

                </div>


                {/* Organization */}

                <div className="admin-settings-card">

                    <div className="admin-settings-card-header">

                        <div className="admin-settings-card-icon">
                            <Building2 size={24} />
                        </div>

                        <div>
                            <h2>Organization</h2>
                            <p>WorkSphere organization information</p>
                        </div>

                    </div>

                    <div className="admin-settings-row">
                        <span>Application</span>
                        <strong>WorkSphere</strong>
                    </div>

                    <div className="admin-settings-row">
                        <span>Platform</span>
                        <strong>Employee Management System</strong>
                    </div>

                </div>


                {/* Security */}

                <div className="admin-settings-card">

                    <div className="admin-settings-card-header">

                        <div className="admin-settings-card-icon">
                            <LockKeyhole size={24} />
                        </div>

                        <div>
                            <h2>Security</h2>
                            <p>Current authentication configuration</p>
                        </div>

                    </div>

                    <div className="admin-settings-row">
                        <span>Authentication</span>
                        <strong>JWT Authentication</strong>
                    </div>

                    <div className="admin-settings-row">
                        <span>Session</span>
                        <strong>Stateless</strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default HRProfilePage;