import { useState } from "react";
import {
    ArrowLeft,
    UserRound,
    Building2,
    ShieldCheck,
    Server,
    LockKeyhole
} from "lucide-react";

function AdminSettingsPage({ onBack }) {

    const email =
        localStorage.getItem("email") ||
        "admin@worksphere.com";

    const role =
        localStorage.getItem("role") ||
        "ADMIN";

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");


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

                        <button
                            type="button"
                            className="admin-settings-password-button"
                            onClick={() => {
                                setPasswordMessage("");
                                setPasswordError("");
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                                setShowPasswordForm(true);
                            }}
                        >
                            <LockKeyhole size={16} />
                            Change Password
                        </button>

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

            {showPasswordForm && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal password-modal">
                        <button
                            type="button"
                            className="delete-modal-close"
                            onClick={() => setShowPasswordForm(false)}
                        >
                            ×
                        </button>

                        <div className="delete-modal-icon">
                            <LockKeyhole size={24} />
                        </div>

                        <h2>Change Password</h2>
                        <p>Update your account password</p>

                        {passwordMessage && (
                            <div className="password-success-message">
                                {passwordMessage}
                            </div>
                        )}

                        {passwordError && (
                            <div className="password-error-message">
                                {passwordError}
                            </div>
                        )}

                        <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="delete-modal-cancel"
                                onClick={() => setShowPasswordForm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="password-change-button"
                                onClick={async () => {
                                    if (newPassword !== confirmPassword) {
                                        setPasswordError("New passwords do not match");
                                        setPasswordMessage("");
                                        return;
                                    }

                                    try {
                                        const response = await fetch("https://worksphere-f0vt.onrender.com/users/password", {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${localStorage.getItem("token")}`
                                            },
                                            body: JSON.stringify({
                                                currentPassword,
                                                newPassword
                                            })
                                        });

                                        const data = await response.text();

                                        if (!response.ok) {
                                            throw new Error(data);
                                        }

                                        setPasswordMessage("Password changed successfully");
                                        setPasswordError("");

                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        // setShowPasswordForm(false);

                                    } catch (error) {
                                        setPasswordError(error.message || "Failed to change password");
                                        setPasswordMessage("");
                                    }
                                }}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminSettingsPage;