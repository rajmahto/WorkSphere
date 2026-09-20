import { useEffect, useState } from "react";
import {
    ArrowLeft,
    WalletCards,
    UserRound,
    CalendarDays,
    IndianRupee
} from "lucide-react";

function AdminPayrollPage({ onBack }) {

    const token = localStorage.getItem("token");

    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

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

                console.error(
                    "Payroll loading error:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        fetchPayrolls();

    }, [token]);


    const formatAmount = (amount) => {

        if (amount === null || amount === undefined) {
            return "-";
        }

        return `₹${Number(amount).toLocaleString("en-IN")}`;
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


                <div className="admin-payroll-count">

                    <WalletCards size={18} />

                    <span>
                        {payrolls.length} Records
                    </span>

                </div>

            </div>


            {/* Payroll Card */}

            <div className="admin-payroll-card">

                <div className="admin-payroll-card-header">

                    <div>

                        <h2>Payroll Records</h2>

                        <p>
                            Complete employee salary information
                        </p>

                    </div>

                    <WalletCards size={24} />

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

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="admin-payroll-message"
                                    >
                                        Loading payroll records...
                                    </td>

                                </tr>

                            ) : payrolls.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="admin-payroll-message"
                                    >
                                        No payroll records found.
                                    </td>

                                </tr>

                            ) : (

                                payrolls
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

                                        </tr>

                                    ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default AdminPayrollPage;