import { useEffect, useState } from "react";
import {
    ArrowLeft,
    WalletCards,
    UserRound,
    CalendarDays,
    IndianRupee,
    Plus,
    Trash2,
    X,
    AlertTriangle,
    Pencil,
} from "lucide-react";

function AdminPayrollPage({ onBack, onNotify }) {

    const token = localStorage.getItem("token");

    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState("ALL");
    const [selectedMonth, setSelectedMonth] = useState("ALL");
    const [selectedYear, setSelectedYear] = useState("ALL");
    const [showForm, setShowForm] = useState(false);
    const [payrollToDelete, setPayrollToDelete] = useState(null);
    const [editingPayroll, setEditingPayroll] = useState(null);
    const [payrollForm, setPayrollForm] = useState({
        employeeId: "",
        month: "",
        year: "",
        basicSalary: "",
        hra: "",
        allowances: "",
        deductions: ""
    });

    const handlePayrollInputChange = (e) => {
        const { name, value } = e.target;

        setPayrollForm({
            ...payrollForm,
            [name]: value
        });
    };

    const closePayrollForm = () => {
        setShowForm(false);
        setEditingPayroll(null);

        setPayrollForm({
            employeeId: "",
            month: "",
            year: "",
            basicSalary: "",
            hra: "",
            allowances: "",
            deductions: ""
        });
    };
    const fetchPayrolls = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/payrolls",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setPayrolls(data);
            }

        } catch (error) {
            console.error("Payroll loading error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPayroll = async (e) => {
        e.preventDefault();

        try {
            const payrollData = {
                basicSalary: Number(payrollForm.basicSalary),
                hra: Number(payrollForm.hra),
                allowances: Number(payrollForm.allowances),
                deductions: Number(payrollForm.deductions),
                month: Number(payrollForm.month),
                year: Number(payrollForm.year)
            };

            let response;

            if (editingPayroll) {
                response = await fetch(
                    `http://localhost:8080/payrolls/${editingPayroll.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(payrollData)
                    }
                );
            } else {
                response = await fetch(
                    "http://localhost:8080/payrolls",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            ...payrollData,
                            employee: {
                                id: Number(payrollForm.employeeId)
                            }
                        })
                    }
                );
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                throw new Error(
                    errorData?.message ||
                    (editingPayroll
                        ? "Failed to update payroll"
                        : "Failed to add payroll")
                );
            }

            await fetchPayrolls();

            onNotify({
                type: "success",
                message: editingPayroll
                    ? "Payroll updated successfully!"
                    : "Payroll added successfully!"
            });

            setPayrollForm({
                employeeId: "",
                basicSalary: "",
                hra: "",
                allowances: "",
                deductions: "",
                month: "",
                year: ""
            });

            setEditingPayroll(null);
            setShowForm(false);

        } catch (error) {
            onNotify({
                type: "error",
                message: error.message
            });
        }
    };

    const handleDeletePayroll = async (id) => {

        try {

            const response = await fetch(
                `http://localhost:8080/payrolls/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete payroll");
            }

            const payrollResponse = await fetch(
                "http://localhost:8080/payrolls",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (payrollResponse.ok) {
                const payrollData = await payrollResponse.json();
                setPayrolls(payrollData);
            }

            onNotify({
                type: "success",
                message: "Payroll deleted successfully!"
            });

        } catch (error) {

            console.error("Delete payroll error:", error);

            onNotify({
                type: "error",
                message: "Failed to delete payroll."
            });
        }
    };

    const handleEditPayroll = (payroll) => {
        setEditingPayroll(payroll);

        setPayrollForm({
            employeeId: payroll.employee?.id?.toString() || "",
            month: payroll.month?.toString() || "",
            year: payroll.year?.toString() || "",
            basicSalary: payroll.basicSalary?.toString() || "",
            hra: payroll.hra?.toString() || "",
            allowances: payroll.allowances?.toString() || "",
            deductions: payroll.deductions?.toString() || ""
        });

        setShowForm(true);
    };

    useEffect(() => {

       

        fetchPayrolls();

    }, [token]);


    const formatAmount = (amount) => {

        if (amount === null || amount === undefined) {
            return "-";
        }

        return `₹${Number(amount).toLocaleString("en-IN")}`;
    };

    const employees = [
        ...new Map(
            payrolls
                .filter(payroll => payroll.employee)
                .map(payroll => [
                    payroll.employee.id,
                    payroll.employee
                ])
        ).values()
    ];

    const filteredPayrolls = payrolls.filter((payroll) => {

        const employeeMatch =
            selectedEmployee === "ALL" ||
            String(payroll.employee?.id) === selectedEmployee;

        const monthMatch =
            selectedMonth === "ALL" ||
            String(payroll.month) === selectedMonth;

        const yearMatch =
            selectedYear === "ALL" ||
            String(payroll.year) === selectedYear;

        return employeeMatch && monthMatch && yearMatch;
    });

    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" }
    ];

    const years = [
        ...new Set(payrolls.map((payroll) => payroll.year))
    ].sort((a, b) => b - a);

    const clearFilters = () => {
        setSelectedEmployee("ALL");
        setSelectedMonth("ALL");
        setSelectedYear("ALL");
    };

    return (

        <div className="admin-payroll-page">

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

            <div className="admin-payroll-header">

                <div className="admin-payroll-title">

                    <div className="admin-payroll-title-icon">
                        <WalletCards size={28} />
                    </div>

                    <div>

                        <h1>Payroll</h1>

                        <p>
                            View and manage employee payroll records
                        </p>

                    </div>

                </div>


                <div className="admin-payroll-header-actions">

                    <div className="admin-payroll-count">

                        <WalletCards size={18} />

                        <span>
                            {payrolls.length} Records
                        </span>

                    </div>

                    <button
                        type="button"
                        className="admin-payroll-add-button"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={18} />
                        Add Payroll
                    </button>

                </div>

            </div>

            {showForm && (
                <div className="admin-payroll-form-card">

                    <div className="admin-payroll-form-header">
                        <div>
                            <h2>{editingPayroll ? "Edit Payroll" : "Add Payroll"}</h2>

                            <p>
                                {editingPayroll
                                    ? "Update employee salary information"
                                    : "Enter employee salary information"}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="admin-payroll-form-close"
                            onClick={closePayrollForm}
                        >
                            ×
                        </button>
                    </div>

                    <div className="admin-payroll-form-grid">

                        <div className="admin-payroll-form-group">
                            <label>Employee ID</label>
                            <input
                                type="number"
                                name="employeeId"
                                value={payrollForm.employeeId}
                                onChange={handlePayrollInputChange}
                                placeholder="Enter employee ID"
                            />
                        </div>

                        <div className="admin-payroll-form-group">
                            <label>Month</label>
                            <input
                                type="number"
                                name="month"
                                min="1"
                                max="12"
                                value={payrollForm.month}
                                onChange={handlePayrollInputChange}
                                placeholder="1 - 12"
                            />
                        </div>

                        <div className="admin-payroll-form-group">
                            <label>Year</label>
                            <input
                                type="number"
                                name="year"
                                value={payrollForm.year}
                                onChange={handlePayrollInputChange}
                                placeholder="2026"
                            />
                        </div>

                        <div className="admin-payroll-form-group">
                            <label>Basic Salary</label>
                            <input
                                type="number"
                                name="basicSalary"
                                value={payrollForm.basicSalary}
                                onChange={handlePayrollInputChange}
                                placeholder="Enter basic salary"
                            />
                        </div>

                        <div className="admin-payroll-form-group">
                            <label>HRA</label>
                            <input
                                type="number"
                                name="hra"
                                value={payrollForm.hra}
                                onChange={handlePayrollInputChange}
                                placeholder="Enter HRA"
                            />
                        </div>

                        <div className="admin-payroll-form-group">
                            <label>Allowances</label>
                            <input
                                type="number"
                                name="allowances"
                                value={payrollForm.allowances}
                                onChange={handlePayrollInputChange}
                                placeholder="Enter allowances"
                            />
                        </div>

                        <div className="admin-payroll-form-group">
                            <label>Deductions</label>
                            <input
                                type="number"
                                name="deductions"
                                value={payrollForm.deductions}
                                onChange={handlePayrollInputChange}
                                placeholder="Enter deductions"
                            />
                        </div>

                    </div>

                    <div className="admin-payroll-form-actions">

                        <button
                            type="button"
                            className="admin-payroll-cancel-button"
                            onClick={closePayrollForm}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="admin-payroll-save-button"
                            onClick={handleAddPayroll}
                        >
                            {editingPayroll ? <Pencil size={17} /> : <Plus size={17} />}
                            {editingPayroll ? "Update Payroll" : "Add Payroll"}
                        </button>

                    </div>

                </div>
            )}


            {/* Payroll Card */}

            <div className="admin-payroll-card">

                <div className="admin-payroll-card-header">

                    <div>

                        <h2>Payroll Records</h2>

                        <p>
                            Complete employee salary information
                        </p>

                    </div>

                    <div className="admin-payroll-filter">

                        <UserRound size={16} />

                        <select
                            value={selectedEmployee}
                            onChange={(e) =>
                                setSelectedEmployee(e.target.value)
                            }
                        >
                            <option value="ALL">
                                All Employees
                            </option>

                            {employees.map((employee) => (
                                <option
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.name}
                                </option>
                            ))}
                        </select>

                        <div className="admin-payroll-filter">

                            <CalendarDays size={16} />

                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="ALL">All Months</option>

                                {months.map((month) => (
                                    <option
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.label}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="admin-payroll-filter">

                            <CalendarDays size={16} />

                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="ALL">All Years</option>

                                {years.map((year) => (
                                    <option
                                        key={year}
                                        value={year}
                                    >
                                        {year}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <button
                            type="button"
                            className="admin-payroll-clear-button"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>


                <div className="admin-payroll-table-container">

                    <table className="admin-payroll-table">

                        <thead>

                            <tr>

                                <th>
                                    <UserRound size={15} />
                                    EMPLOYEE
                                </th>

                                <th>
                                    <CalendarDays size={15} />
                                    PERIOD
                                </th>

                                <th>
                                    BASIC SALARY
                                </th>

                                <th>
                                    HRA
                                </th>

                                <th>
                                    ALLOWANCES
                                </th>

                                <th>
                                    DEDUCTIONS
                                </th>

                                <th>
                                    NET SALARY
                                </th>

                                <th>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="admin-payroll-message"
                                    >
                                        Loading payroll records...
                                    </td>

                                </tr>

                            ) : payrolls.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="admin-payroll-message"
                                    >
                                        No payroll records found.
                                    </td>

                                </tr>

                            ) : (

                                filteredPayrolls
                                    .slice()
                                    .reverse()
                                    .map((payroll) => (

                                        <tr key={payroll.id}>

                                            <td>

                                                <div className="admin-payroll-employee">

                                                    <div className="admin-payroll-avatar">

                                                        {payroll.employee?.name
                                                            ?.charAt(0)
                                                            .toUpperCase() || "?"}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {payroll.employee?.name || "Unknown"}
                                                        </strong>

                                                        <span>
                                                            ID #{payroll.employee?.id || "-"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="admin-payroll-period">

                                                    <CalendarDays size={15} />

                                                    {payroll.month}/{payroll.year}

                                                </div>

                                            </td>


                                            <td>
                                                {formatAmount(payroll.basicSalary)}
                                            </td>


                                            <td>
                                                {formatAmount(payroll.hra)}
                                            </td>


                                            <td>
                                                {formatAmount(payroll.allowances)}
                                            </td>


                                            <td>
                                                {formatAmount(payroll.deductions)}
                                            </td>


                                            <td>

                                                <div className="admin-payroll-net">

                                                    <IndianRupee size={15} />

                                                    <strong>
                                                        {formatAmount(payroll.netSalary)}
                                                    </strong>

                                                </div>

                                            </td>

                                            <td>
                                                <div className="admin-payroll-actions">

                                                    <button
                                                        type="button"
                                                        className="admin-payroll-edit-button"
                                                        onClick={() => handleEditPayroll(payroll)}
                                                    >
                                                        <Pencil size={15} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-payroll-delete-button"
                                                        onClick={() => setPayrollToDelete(payroll)}
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
            {payrollToDelete && (
                <div className="payroll-delete-overlay">

                    <div className="payroll-delete-modal">

                        <button
                            type="button"
                            className="payroll-delete-close"
                            onClick={() => setPayrollToDelete(null)}
                        >
                            <X size={18} />
                        </button>

                        <div className="payroll-delete-icon">
                            <AlertTriangle size={24} />
                        </div>

                        <h2>Delete Payroll?</h2>

                        <p>
                            Are you sure you want to delete this payroll record?
                        </p>

                        <div className="payroll-delete-actions">

                            <button
                                type="button"
                                className="payroll-cancel-button"
                                onClick={() => setPayrollToDelete(null)}
                            >
                                Cancel
                            </button>
    
                            <button
                                type="button"
                                className="payroll-confirm-delete-button"
                                onClick={async () => {
                                    await handleDeletePayroll(payrollToDelete.id);
                                    setPayrollToDelete(null);
                                }}
                            >
                                <Trash2 size={15} />
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminPayrollPage;