import { useEffect, useState } from "react";
import {
    ArrowLeft,
    UserCircle,
    Mail,
    ShieldCheck,
    BriefcaseBusiness,
    Phone,
    CalendarDays
} from "lucide-react";

function EmployeeProfilePage({ onBack }) {

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {

        const fetchEmployeeProfile = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/employees/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load profile"
                    );
                }

                setEmployee(data);

            } catch (error) {

                console.error(
                    "Employee profile error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchEmployeeProfile();

    }, [token]);


    const formatJoiningDate = (date) => {

        if (!date) return "Not available";

        const formattedDate = new Date(date);

        return formattedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    if (loading) {

        return (
            <div className="employee-profile-page">

                <button
                    type="button"
                    className="back-dashboard-button"
                    onClick={onBack}
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </button>

                <div className="employee-profile-loading">
                    Loading profile...
                </div>

            </div>
        );
    }


    if (!employee) {

        return (
            <div className="employee-profile-page">

                <button
                    type="button"
                    className="back-dashboard-button"
                    onClick={onBack}
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </button>

                <div className="employee-profile-loading">
                    Unable to load employee profile.
                </div>

            </div>
        );
    }


    return (
        <div className="employee-profile-page">

            {/* Back Button */}

            <button
                type="button"
                className="back-dashboard-button"
                onClick={onBack}
            >
                <ArrowLeft size={17} />
                Back to Dashboard
            </button>


            {/* Header */}

            <div className="employee-profile-header">

                <div className="employee-profile-title-icon">
                    <UserCircle size={30} />
                </div>

                <div>

                    <h1>Employee Profile</h1>

                    <p>
                        View your WorkSphere profile information
                    </p>

                </div>

            </div>


            {/* Profile Cards */}

            <div className="employee-profile-grid">


                {/* Employee Profile */}

                <section className="employee-profile-card">

                    <div className="employee-profile-card-header">

                        <div className="employee-profile-card-icon">
                            <UserCircle size={23} />
                        </div>

                        <div>

                            <h2>Employee Profile</h2>

                            <p>
                                {employee.name || "Employee"}
                            </p>

                        </div>

                    </div>


                    <div className="employee-profile-info">

                        <div className="employee-profile-info-item">

                            <div className="employee-profile-label">

                                <Mail size={17} />

                                <span>Email</span>

                            </div>

                            <strong>
                                {employee.email}
                            </strong>

                        </div>


                        <div className="employee-profile-info-item">

                            <div className="employee-profile-label">

                                <ShieldCheck size={17} />

                                <span>Role</span>

                            </div>

                            <strong>
                                EMPLOYEE
                            </strong>

                        </div>

                    </div>

                </section>


                {/* Work Information */}

                <section className="employee-profile-card">

                    <div className="employee-profile-card-header">

                        <div className="employee-profile-card-icon">
                            <BriefcaseBusiness size={23} />
                        </div>

                        <div>

                            <h2>Work Information</h2>

                            <p>
                                Your employee information
                            </p>

                        </div>

                    </div>


                    <div className="employee-profile-info">

                        <div className="employee-profile-info-item">

                            <div className="employee-profile-label">

                                <BriefcaseBusiness size={17} />

                                <span>Designation</span>

                            </div>

                            <strong>
                                {employee.designation || "Not available"}
                            </strong>

                        </div>


                        <div className="employee-profile-info-item">

                            <div className="employee-profile-label">

                                <CalendarDays size={17} />

                                <span>Joining Date</span>

                            </div>

                            <strong>
                                {formatJoiningDate(
                                    employee.joiningDate
                                )}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* Contact */}

                <section className="employee-profile-card">

                    <div className="employee-profile-card-header">

                        <div className="employee-profile-card-icon">
                            <Phone size={23} />
                        </div>

                        <div>

                            <h2>Contact</h2>

                            <p>
                                Your contact information
                            </p>

                        </div>

                    </div>


                    <div className="employee-profile-info">

                        <div className="employee-profile-info-item">

                            <div className="employee-profile-label">

                                <Mail size={17} />

                                <span>Email</span>

                            </div>

                            <strong>
                                {employee.email}
                            </strong>

                        </div>


                        <div className="employee-profile-info-item">

                            <div className="employee-profile-label">

                                <Phone size={17} />

                                <span>Phone</span>

                            </div>

                            <strong>
                                {employee.phone || "Not available"}
                            </strong>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default EmployeeProfilePage;