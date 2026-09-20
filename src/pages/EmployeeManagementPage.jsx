import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Users,
    UserRound,
    Mail,
    Phone,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    IndianRupee,
    LoaderCircle,
    UsersRound
} from "lucide-react";

import "../App.css";


function EmployeeManagementPage({ onBack }) {

    const token = localStorage.getItem("token");

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchEmployees();
    }, []);


    const fetchEmployees = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/employees",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Unable to fetch employees"
                );
            }


            const data =
                await response.json();


            setEmployees(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Employee fetch error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    const formatDate = (date) => {

        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    const formatSalary = (salary) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(salary || 0);
    };


    const getInitials = (name) => {

        if (!name) return "U";

        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map(
                (part) =>
                    part.charAt(0).toUpperCase()
            )
            .join("");
    };


    return (

        <div className="employee-management-page">

            {/* Header */}

            <div className="employee-management-header">

                <div>

                    <button
                        type="button"
                        className="back-dashboard-button"
                        onClick={onBack}
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button>


                    <div className="employee-title-row">

                        <div className="employee-title-icon">
                            <Users size={24} />
                        </div>

                        <div>

                            <h1>
                                Employees
                            </h1>

                            <p>
                                View and manage employee information
                            </p>

                        </div>

                    </div>

                </div>


                <div className="employee-count">

                    <UsersRound size={17} />

                    <span>
                        {employees.length} Employees
                    </span>

                </div>

            </div>


            {/* Employee Card */}

            <section className="employee-management-card">

                <div className="employee-management-card-header">

                    <div>

                        <h2>
                            Employee Directory
                        </h2>

                        <p>
                            Complete list of employees in WorkSphere
                        </p>

                    </div>

                    <div className="employee-directory-icon">
                        <Users size={20} />
                    </div>

                </div>


                {/* Table */}

                <div className="employee-table-container">

                    <table className="employee-management-table">

                        <thead>

                            <tr>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Contact
                                </th>

                                <th>
                                    Designation
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Joining Date
                                </th>

                                <th>
                                    Salary
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >

                                        <div className="employee-table-state">

                                            <LoaderCircle
                                                size={21}
                                                className="loading-spinner"
                                            />

                                            <span>
                                                Loading employees...
                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : employees.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >

                                        <div className="employee-table-state">

                                            <Users
                                                size={21}
                                            />

                                            <div>

                                                <strong>
                                                    No employees found
                                                </strong>

                                                <span>
                                                    Employee records will appear here.
                                                </span>

                                            </div>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                employees.map(
                                    (employee) => (

                                        <tr
                                            key={employee.id}
                                        >

                                            {/* Employee */}

                                            <td>

                                                <div className="employee-table-name">

                                                    <div className="employee-table-avatar">
                                                        {getInitials(
                                                            employee.name
                                                        )}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {employee.name}
                                                        </strong>

                                                        <span>
                                                            ID #{employee.id}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Contact */}

                                            <td>

                                                <div className="employee-contact">

                                                    <div>

                                                        <Mail size={14} />

                                                        <span>
                                                            {employee.email ||
                                                                "—"}
                                                        </span>

                                                    </div>

                                                    <div>

                                                        <Phone size={14} />

                                                        <span>
                                                            {employee.phone ||
                                                                "—"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Designation */}

                                            <td>

                                                <div className="employee-info-cell">

                                                    <BriefcaseBusiness
                                                        size={16}
                                                    />

                                                    <span>
                                                        {employee.designation ||
                                                            "—"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* Department */}

                                            <td>

                                                <div className="employee-info-cell">

                                                    <Building2
                                                        size={16}
                                                    />

                                                    <span>
                                                        {employee.department?.name ||
                                                            "—"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* Joining Date */}

                                            <td>

                                                <div className="employee-info-cell">

                                                    <CalendarDays
                                                        size={16}
                                                    />

                                                    <span>
                                                        {formatDate(
                                                            employee.joiningDate
                                                        )}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* Salary */}

                                            <td>

                                                <div className="employee-salary">

                                                    <IndianRupee
                                                        size={15}
                                                    />

                                                    <strong>
                                                        {formatSalary(
                                                            employee.salary
                                                        )}
                                                    </strong>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
}

export default EmployeeManagementPage;