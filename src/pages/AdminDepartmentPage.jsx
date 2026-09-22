import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Building2,
    Plus,
    Pencil,
    Trash2
} from "lucide-react";
import "../App.css";

function AdminDepartmentPage({ onBack, onNotify }) {

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [deleteDepartment, setDeleteDepartment] = useState(null);

    const token = localStorage.getItem("token");

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
            onNotify({
                type: "error",
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddDepartment = async () => {
        const name = departmentName.trim();

        if (!name) {
            onNotify({
                type: "error",
                message: "Please enter department name."
            });
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/departments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: name
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to add department"
                );
            }

            await fetchDepartments();

            setDepartmentName("");
            setShowForm(false);

            onNotify({
                type: "success",
                message: "Department added successfully!"
            });

        } catch (error) {
            onNotify({
                type: "error",
                message: error.message
            });
        }
    };

    const handleEditDepartment = (department) => {
        setEditingDepartment(department);
        setDepartmentName(department.name);
        setShowForm(true);
    };

    const handleUpdateDepartment = async () => {
        const name = departmentName.trim();

        if (!name) {
            onNotify({
                type: "error",
                message: "Please enter department name."
            });
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/departments/${editingDepartment.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: name
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to update department"
                );
            }

            await fetchDepartments();

            setDepartmentName("");
            setEditingDepartment(null);
            setShowForm(false);

            onNotify({
                type: "success",
                message: "Department updated successfully!"
            });

        } catch (error) {
            onNotify({
                type: "error",
                message: error.message
            });
        }
    };

    const handleDeleteDepartment = async (department) => {
        try {
            const response = await fetch(
                `http://localhost:8080/departments/${department.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    errorText || "Failed to delete department"
                );
            }

            await fetchDepartments();

            onNotify({
                type: "success",
                message: `${department.name} deleted successfully!`
            });

        } catch (error) {
            onNotify({
                type: "error",
                message: error.message
            });
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="department-page">

            <div className="employee-management-header">

                <div>
                    <button
                        className="back-dashboard-button"
                        onClick={onBack}
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button>

                    <div className="employee-title-row">

                        <div className="employee-title-icon">
                            <Building2 size={24} />
                        </div>

                        <div>
                            <h1>Departments</h1>
                            <p>View and manage company departments</p>
                        </div>

                    </div>
                </div>

                <div className="employee-count">
                    <Building2 size={17} />
                    <span>
                        {departments.length}{" "}
                        {departments.length === 1 ? "Department" : "Departments"}
                    </span>
                </div>

                <button
                    className="add-employee-button"
                    onClick={() => {
                        setEditingDepartment(null);
                        setDepartmentName("");
                        setShowForm(true);
                    }}
                >
                    <Plus size={18} />
                    Add Department
                </button>

            </div>


            {showForm && (
                <div className="add-employee-form-card">

                    <div className="add-employee-form-header">

                        <div>
                            <h2>
                                {editingDepartment ? "Edit Department" : "Add Department"}
                            </h2>

                            <p>
                                {editingDepartment
                                    ? "Update department information"
                                    : "Create a new department"}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="add-employee-close"
                            onClick={() => {
                                setShowForm(false);
                                setDepartmentName("");
                            }}
                        >
                            ×
                        </button>

                    </div>

                    <div className="form-group">

                        <label>Department Name</label>

                        <input
                            type="text"
                            placeholder="Enter department name"
                            value={departmentName}
                            onChange={(e) =>
                                setDepartmentName(e.target.value)
                            }
                        />

                    </div>

                    <div className="add-employee-form-actions">

                        <button
                            type="button"
                            className="cancel-employee-button"
                            onClick={() => {
                                setShowForm(false);
                                setDepartmentName("");
                                setEditingDepartment(null);
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="save-employee-button"
                            onClick={
                                editingDepartment
                                    ? handleUpdateDepartment
                                    : handleAddDepartment
                            }
                        >
                            {editingDepartment ? "Update Department" : "Add Department"}
                        </button>

                    </div>

                </div>
            )}


            <div className="department-directory-card">

                <div className="department-directory-header">

                    <div>
                        <h2>Department Directory</h2>
                        <p>All departments in WorkSphere</p>
                    </div>

                    <div className="employee-title-icon">
                        <Building2 size={22} />
                    </div>

                </div>


                <div className="department-table-container">

                    <table className="department-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="3"
                                        className="table-message"
                                    >
                                        Loading departments...
                                    </td>
                                </tr>

                            ) : departments.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="3"
                                        className="table-message"
                                    >
                                        No departments found.
                                    </td>
                                </tr>

                            ) : (

                                departments.map((department) => (

                                    <tr key={department.id}>

                                        <td>
                                            #{department.id}
                                        </td>

                                        <td>
                                            <div className="department-name-cell">

                                                <div className="department-avatar">
                                                    {department.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <strong>
                                                    {department.name}
                                                </strong>

                                            </div>
                                        </td>

                                        <td>

                                            <div className="department-action-buttons">

                                                <button
                                                    type="button"
                                                    className="department-edit-button"
                                                    onClick={() => handleEditDepartment(department)}
                                                >
                                                    <Pencil size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="department-delete-button"
                                                    onClick={() => setDeleteDepartment(department)}
                                                >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {deleteDepartment && (
                <div className="department-delete-modal-overlay">
                    <div className="department-delete-modal">

                        <button
                            type="button"
                            className="department-delete-modal-close"
                            onClick={() => setDeleteDepartment(null)}
                        >
                            ×
                        </button>

                        <div className="department-delete-modal-icon">
                            ⚠
                        </div>

                        <h2>Delete Department?</h2>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{deleteDepartment.name}</strong>?
                        </p>

                        <div className="department-delete-modal-actions">

                            <button
                                type="button"
                                className="department-delete-modal-cancel"
                                onClick={() => setDeleteDepartment(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="department-delete-modal-confirm"
                                onClick={async () => {
                                    const department = deleteDepartment;

                                    setDeleteDepartment(null);

                                    await handleDeleteDepartment(department);
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

export default AdminDepartmentPage;