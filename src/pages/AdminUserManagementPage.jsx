import { useEffect, useState } from "react";
import {
    Users,
    UserPlus,
    ChevronLeft,
    ShieldCheck,
    Trash2,
    X
} from "lucide-react";

function AdminUserManagementPage({ onBack, onNotify }) {

    const token = localStorage.getItem("token");

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("EMPLOYEE");

    const [userToDelete, setUserToDelete] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);

    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editRole, setEditRole] = useState("EMPLOYEE");

    const fetchUsers = async () => {

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch users");
            }

            const data = await response.json();

            setUsers(
                Array.isArray(data) ? data : []
            );

        } catch (error) {

            console.error(
                "User management error:",
                error
            );

            onNotify({
                type: "error",
                message: "Unable to load users."
            });

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (event) => {

        event.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create user"
                );
            }

            onNotify({
                type: "success",
                message: "User created successfully."
            });

            setEmail("");
            setPassword("");
            setRole("EMPLOYEE");
            setShowForm(false);

            fetchUsers();

        } catch (error) {

            console.error(
                "Create user error:",
                error
            );

            onNotify({
                type: "error",
                message: error.message || "Unable to create user."
            });
        }
    };

    const handleDeleteUser = async () => {

        if (!userToDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/users/${userToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || "Unable to delete user"
                );
            }

            onNotify({
                type: "success",
                message: "User deleted successfully."
            });

            setUserToDelete(null);

            fetchUsers();

        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );

            onNotify({
                type: "error",
                message: error.message || "Unable to delete user."
            });
        }
    };

    const openEditUser = (user) => {
        setUserToEdit(user);
        setEditEmail(user.email);
        setEditPassword("");
        setEditRole(user.role);
    };

    const handleUpdateUser = async () => {

        if (!userToEdit) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/users/${userToEdit.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: editEmail,
                        password: editPassword,
                        role: editRole
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update user.");
            }

            onNotify({
                type: "success",
                message: "User updated successfully."
            });

            setUserToEdit(null);
            setEditPassword("");

            fetchUsers();

        } catch (error) {

            onNotify({
                type: "error",
                message: error.message || "Unable to update user."
            });
        }
    };

    return (
        <div className="hr-dashboard-container admin-users-page">

            <main className="hr-main">

                {/* Header */}

                <header className="hr-header">

                    <div>

                        <button
                            type="button"
                            className="hr-back-button"
                            onClick={onBack}
                        >
                            <ChevronLeft size={18} />
                            Back
                        </button>

                        <span className="hr-page-label">
                            ADMIN PORTAL
                        </span>

                        <h1>
                            User Management
                        </h1>

                        <p className="hr-header-subtitle">
                            Manage WorkSphere user accounts and roles.
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
                                {localStorage.getItem("email") || "Admin User"}
                            </span>

                        </div>

                    </div>

                </header>


                {/* Actions */}

                <section className="hr-section">

                    <div className="hr-section-heading">

                        <div>

                            <h2>
                                Users
                            </h2>

                            <p>
                                View and create system user accounts.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="hr-primary-button"
                            onClick={() =>
                                setShowForm(!showForm)
                            }
                        >
                            <UserPlus size={18} />
                            Add User
                        </button>

                    </div>


                    {/* Create User Form */}

                    {showForm && (

                        <form
                            className="hr-form-card"
                            onSubmit={handleCreateUser}
                        >

                            <div className="hr-form-grid">

                                <div className="hr-form-group">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="user@worksphere.com"
                                        required
                                    />

                                </div>


                                <div className="hr-form-group">

                                    <label>
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter password"
                                        required
                                    />

                                </div>


                                <div className="hr-form-group">

                                    <label>
                                        Role
                                    </label>

                                    <select
                                        value={role}
                                        onChange={(event) =>
                                            setRole(event.target.value)
                                        }
                                    >
                                        <option value="EMPLOYEE">
                                            EMPLOYEE
                                        </option>

                                        <option value="HR">
                                            HR
                                        </option>

                                        <option value="ADMIN">
                                            ADMIN
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="hr-form-actions">

                                <button
                                    type="submit"
                                    className="hr-primary-button"
                                >
                                    Create User
                                </button>

                                <button
                                    type="button"
                                    className="hr-secondary-button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    )}

                </section>


                {/* User Table */}

                <section className="hr-section">

                    <div className="hr-section-heading">

                        <div>

                            <h2>
                                User Accounts
                            </h2>

                            <p>
                                {users.length} user accounts available
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="hr-empty-state">
                            Loading users...
                        </div>

                    ) : users.length === 0 ? (

                        <div className="hr-empty-state">
                            No users found.
                        </div>

                    ) : (

                        <div className="hr-table-container">

                            <table className="hr-table">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {users.map((user) => (

                                        <tr key={user.id}>

                                            <td>
                                                {user.id}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>

                                                <span className="hr-status active">
                                                    {user.role}
                                                </span>

                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="admin-user-edit-button"
                                                    onClick={() => openEditUser(user)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-user-delete-button"
                                                    onClick={() => setUserToDelete(user)}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>


            {/* Delete Confirmation Modal */}

            {userToDelete && (

                <div className="admin-user-modal-overlay">

                    <div className="admin-user-delete-modal">

                        <button
                            type="button"
                            className="admin-user-modal-close"
                            onClick={() =>
                                setUserToDelete(null)
                            }
                        >
                            <X size={20} />
                        </button>

                        <div className="admin-user-delete-icon">
                            <Trash2 size={24} />
                        </div>

                        <h2>
                            Delete User?
                        </h2>

                        <p>
                            Are you sure you want to delete
                            <strong> {userToDelete.email}</strong>?
                        </p>

                        <span className="admin-user-delete-warning">
                            This action cannot be undone.
                        </span>

                        <div className="admin-user-modal-actions">

                            <button
                                type="button"
                                className="hr-secondary-button"
                                onClick={() =>
                                    setUserToDelete(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-user-confirm-delete"
                                onClick={handleDeleteUser}
                            >
                                Delete User
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {userToEdit && (
                <div className="admin-user-modal-overlay">
                    <div className="admin-user-modal">

                        <button
                            type="button"
                            className="admin-user-modal-close"
                            onClick={() => setUserToEdit(null)}
                        >
                            ×
                        </button>

                        <h2>Edit User</h2>

                        <p className="admin-user-modal-subtitle">
                            Update user account details.
                        </p>

                        <div className="admin-user-form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                            />
                        </div>

                        <div className="admin-user-form-group">
                            <label>New Password</label>

                            <input
                                type="password"
                                placeholder="Leave blank to keep current password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                            />
                        </div>

                        <div className="admin-user-form-group">
                            <label>Role</label>

                            <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                            >
                                <option value="EMPLOYEE">EMPLOYEE</option>
                                <option value="HR">HR</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div className="admin-user-modal-actions">

                            <button
                                type="button"
                                className="admin-user-cancel-button"
                                onClick={() => setUserToEdit(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-user-update-button"
                                onClick={handleUpdateUser}
                            >
                                Update User
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminUserManagementPage;