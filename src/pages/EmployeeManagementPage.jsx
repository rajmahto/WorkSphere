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
    UsersRound,
    UserPlus,
    Pencil,
    Trash2,
} from "lucide-react";

import "../App.css";


function EmployeeManagementPage({ onBack, onNotify }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeForm, setEmployeeForm] = useState({
        name: "",
        email: "",
        phone: "",
        designation: "",
        departmentId: "",
        joiningDate: "",
        salary: ""
    });
    const [departments, setDepartments] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);


    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
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

    const fetchDepartments = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/departments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch departments");
            }

            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setEmployeeForm({
            ...employeeForm,
            [name]: value
        });
    };

    const handleAddEmployee = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/employees",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: employeeForm.name,
                        email: employeeForm.email,
                        phone: employeeForm.phone,
                        designation: employeeForm.designation,
                        departmentId: Number(employeeForm.departmentId),
                        joiningDate: employeeForm.joiningDate,
                        salary: Number(employeeForm.salary)
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Unable to add employee"
                );
            }

            await fetchEmployees();

            setEmployeeForm({
                name: "",
                email: "",
                phone: "",
                designation: "",
                departmentId: "",
                joiningDate: "",
                salary: ""
            });

            setShowAddForm(false);

            onNotify({
                type: "success",
                message: "Employee added successfully!"
            });

        } catch (error) {

            console.error("Add employee error:", error);

            alert(error.message);
        }
    };

    const handleUpdateEmployee = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/employees/${editingEmployee.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: editingEmployee.name,
                        email: editingEmployee.email,
                        phone: editingEmployee.phone,
                        designation: editingEmployee.designation,
                        departmentId: editingEmployee.department?.id,
                        joiningDate: editingEmployee.joiningDate,
                        salary: Number(editingEmployee.salary)
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update employee");
            }

            await fetchEmployees();

            setShowEditForm(false);
            setEditingEmployee(null);

            onNotify({
                type: "success",
                message: "Employee updated successfully!"
            });

        } catch (error) {
            alert(error.message);
        }
    };


    const handleDeleteEmployee = async (employeeId, employeeName) => {
        try {
            const response = await fetch(
                `http://localhost:8080/employees/${employeeId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(
                    errorData.message || "Failed to delete employee"
                );
            }

            await fetchEmployees();

            onNotify({
                type: "success",
                message: `${employeeName} deleted successfully!`
            });

        } catch (error) {
            onNotify({
                type: "error",
                message: error.message
            });
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

                <button
                    className="add-employee-button"
                    onClick={() => setShowAddForm(true)}
                >
                    <UserPlus size={18} />
                    Add Employee
                </button>

            </div>

            {showAddForm && (
                <div className="add-employee-form-card">

                    <div className="add-employee-form-header">
                        <div>
                            <h2>Add Employee</h2>
                            <p>Enter employee information</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="add-employee-close"
                        >
                            ×
                        </button>
                    </div>

                    <div className="add-employee-form-grid">

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter employee name"
                                value={employeeForm.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter employee email"
                                value={employeeForm.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                value={employeeForm.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Designation</label>
                            <input
                                type="text"
                                name="designation"
                                placeholder="Enter designation"
                                value={employeeForm.designation}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>

                            <select
                                name="departmentId"
                                value={employeeForm.departmentId}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Department</option>

                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Joining Date</label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={employeeForm.joiningDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Salary</label>
                            <input
                                type="number"
                                name="salary"
                                placeholder="Enter salary"
                                value={employeeForm.salary}
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>

                    <div className="add-employee-form-actions">
                        <button
                            type="button"
                            className="cancel-employee-button"
                            onClick={() => setShowAddForm(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="save-employee-button"
                            onClick={handleAddEmployee}
                        >
                            Add Employee
                        </button>
                    </div>

                </div>
            )}

            {showEditForm && editingEmployee && (
                <div className="add-employee-form-card">
                    <div className="add-employee-form-header">
                        <div>
                            <h2>Edit Employee</h2>
                            <p>Update employee information</p>
                        </div>

                        <button
                            type="button"
                            className="add-employee-close"
                            onClick={() => {
                                setShowEditForm(false);
                                setEditingEmployee(null);
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div className="add-employee-form-grid">

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={editingEmployee.name || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={editingEmployee.email || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        email: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                value={editingEmployee.phone || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        phone: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Designation</label>
                            <input
                                type="text"
                                value={editingEmployee.designation || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        designation: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>

                            <select
                                value={editingEmployee.department?.id || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        department: {
                                            ...editingEmployee.department,
                                            id: Number(e.target.value)
                                        }
                                    })
                                }
                            >
                                <option value="">Select Department</option>

                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Joining Date</label>
                            <input
                                type="date"
                                value={editingEmployee.joiningDate || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        joiningDate: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Salary</label>
                            <input
                                type="number"
                                value={editingEmployee.salary || ""}
                                onChange={(e) =>
                                    setEditingEmployee({
                                        ...editingEmployee,
                                        salary: e.target.value
                                    })
                                }
                            />
                        </div>

                    </div>

                    <div className="add-employee-form-actions">
                        <button
                            type="button"
                            className="cancel-employee-button"
                            onClick={() => {
                                setShowEditForm(false);
                                setEditingEmployee(null);
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="save-employee-button"
                            onClick={handleUpdateEmployee}
                        >
                            Update Employee
                        </button>
                    </div>
                </div>
            )}

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

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
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
                                        colSpan="7"
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
                                            <td>
                                                <div className="employee-action-buttons">
                                                    <button
                                                        type="button"
                                                        className="edit-employee-button"
                                                        onClick={() => {
                                                            setEditingEmployee(employee);
                                                            setShowEditForm(true);
                                                        }}
                                                    >
                                                        <Pencil size={15} />
                                                        Edit
                                                    </button>

                                                    {role === "ADMIN" && (
                                                        <button
                                                            type="button"
                                                            className="delete-employee-button"
                                                            onClick={() => {
                                                                setSelectedEmployee(employee);
                                                                setShowDeleteModal(true);
                                                            }}
                                                        >
                                                            <Trash2 size={15} />
                                                            Delete
                                                        </button>
                                                    )}
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

            {showDeleteModal && selectedEmployee && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">

                        <button
                            type="button"
                            className="delete-modal-close"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setSelectedEmployee(null);
                            }}
                        >
                            ×
                        </button>

                        <div className="delete-modal-icon">
                            ⚠
                        </div>

                        <h2>Delete Employee?</h2>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{selectedEmployee.name}</strong>?
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="delete-modal-cancel"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedEmployee(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="delete-modal-confirm"
                                onClick={() => {
                                    if (!selectedEmployee) {
                                        return;
                                    }

                                    const employeeId = selectedEmployee.id;
                                    const employeeName = selectedEmployee.name;

                                    setShowDeleteModal(false);
                                    setSelectedEmployee(null);

                                    handleDeleteEmployee(employeeId, employeeName);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default EmployeeManagementPage;