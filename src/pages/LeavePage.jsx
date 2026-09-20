import { useEffect, useState } from "react";
import {
    ArrowLeft,
    FileText,
    CalendarDays,
    ClipboardList,
    Send,
    CheckCircle2,
    Clock3,
    XCircle
} from "lucide-react";

import "../App.css";

function LeavePage({ onNotify, onBack }) {

    const token = localStorage.getItem("token");

    const [balances, setBalances] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const [leaveType, setLeaveType] = useState("CASUAL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [applying, setApplying] = useState(false);


    const fetchLeaveData = async () => {

        try {

            const [
                balanceResponse,
                leaveResponse
            ] = await Promise.all([

                fetch(
                    "http://localhost:8080/leave-balances/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ),

                fetch(
                    "http://localhost:8080/leaves/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

            ]);


            if (
                !balanceResponse.ok ||
                !leaveResponse.ok
            ) {
                throw new Error(
                    "Unable to fetch leave data"
                );
            }


            const balanceData =
                await balanceResponse.json();

            const leaveData =
                await leaveResponse.json();


            setBalances(
                Array.isArray(balanceData)
                    ? balanceData
                    : []
            );

            setLeaves(
                Array.isArray(leaveData)
                    ? leaveData
                    : []
            );


        } catch (error) {

            console.error(
                "Leave data error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to load leave information."
            });

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLeaveData();
    }, []);


    const handleApplyLeave = async (event) => {

        event.preventDefault();

        if (applying) return;


        if (
            !startDate ||
            !endDate ||
            !reason.trim()
        ) {

            onNotify({
                type: "error",
                message:
                    "Please fill all leave details."
            });

            return;
        }


        if (endDate < startDate) {

            onNotify({
                type: "error",
                message:
                    "End date cannot be before start date."
            });

            return;
        }


        setApplying(true);


        try {

            const response = await fetch(
                "http://localhost:8080/leaves/my",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        leaveType,
                        startDate,
                        endDate,
                        reason
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                onNotify({
                    type: "error",
                    message:
                        data.message ||
                        "Unable to apply for leave."
                });

                return;
            }


            setStartDate("");
            setEndDate("");
            setReason("");


            await fetchLeaveData();


            onNotify({
                type: "success",
                message:
                    "Leave request submitted successfully."
            });


        } catch (error) {

            console.error(
                "Apply leave error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to connect to server."
            });

        } finally {

            setApplying(false);
        }
    };


    const getStatusIcon = (status) => {

        switch (status) {

            case "APPROVED":
                return <CheckCircle2 size={15} />;

            case "REJECTED":
                return <XCircle size={15} />;

            default:
                return <Clock3 size={15} />;
        }
    };


    const getLeaveTypeLabel = (type) => {

        switch (type) {

            case "CASUAL":
                return "Casual Leave";

            case "SICK":
                return "Sick Leave";

            case "EARNED":
                return "Earned Leave";

            default:
                return type;
        }
    };


    return (

        <div className="leave-page">

            {/* Header */}

            <div className="leave-header">

                <div>

                    <button
                        type="button"
                        className="back-dashboard-button"
                        onClick={onBack}
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button>


                    <div className="leave-title-row">

                        <div className="leave-title-icon">
                            <FileText size={24} />
                        </div>

                        <div>

                            <h1>
                                Leave Management
                            </h1>

                            <p>
                                Manage your leave balance and requests
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Apply Leave */}

            <section className="leave-section">

                <div className="leave-section-header">

                    <div className="leave-section-title">

                        <div className="leave-section-icon">
                            <Send size={19} />
                        </div>

                        <div>

                            <h2>
                                Apply for Leave
                            </h2>

                            <p>
                                Submit a new leave request
                            </p>

                        </div>

                    </div>

                </div>


                <form
                    className="leave-form"
                    onSubmit={handleApplyLeave}
                >

                    <div className="leave-form-row">

                        <div className="leave-form-group">

                            <label>
                                Leave Type
                            </label>

                            <select
                                value={leaveType}
                                onChange={(event) =>
                                    setLeaveType(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="CASUAL">
                                    Casual Leave
                                </option>

                                <option value="SICK">
                                    Sick Leave
                                </option>

                                <option value="EARNED">
                                    Earned Leave
                                </option>

                            </select>

                        </div>


                        <div className="leave-form-group">

                            <label>
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="leave-form-group">

                            <label>
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(event) =>
                                    setEndDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="leave-form-group">

                        <label>
                            Reason
                        </label>

                        <textarea
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target.value
                                )
                            }
                            placeholder="Enter the reason for your leave..."
                            rows="4"
                        />

                    </div>


                    <div className="leave-form-actions">

                        <button
                            type="submit"
                            className="apply-leave-button"
                            disabled={applying}
                        >

                            <Send size={17} />

                            {applying
                                ? "Submitting..."
                                : "Apply Leave"}

                        </button>

                    </div>

                </form>

            </section>


            {/* Leave Balance */}

            <section className="leave-section">

                <div className="leave-section-header">

                    <div className="leave-section-title">

                        <div className="leave-section-icon">
                            <CalendarDays size={19} />
                        </div>

                        <div>

                            <h2>
                                Leave Balance
                            </h2>

                            <p>
                                Your available leaves
                            </p>

                        </div>

                    </div>

                </div>


                <div className="leave-balance-grid">

                    {loading ? (

                        <div className="leave-message">
                            Loading leave balance...
                        </div>

                    ) : balances.length === 0 ? (

                        <div className="leave-message">
                            No leave balance found.
                        </div>

                    ) : (

                        balances.map((balance) => (

                            <div
                                className="leave-balance-card"
                                key={balance.id}
                            >

                                <div className="leave-balance-card-top">

                                    <span>
                                        {getLeaveTypeLabel(
                                            balance.leaveType
                                        )}
                                    </span>

                                    <CalendarDays size={19} />

                                </div>


                                <div className="leave-balance-number">

                                    {balance.remainingLeaves}

                                </div>


                                <p>
                                    days remaining
                                </p>


                                <div className="leave-balance-footer">

                                    <span>
                                        Used
                                    </span>

                                    <strong>
                                        {balance.usedLeaves}
                                    </strong>

                                    <span>
                                        of {balance.totalLeaves}
                                    </span>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>


            {/* Leave History */}

            <section className="leave-section">

                <div className="leave-section-header">

                    <div className="leave-section-title">

                        <div className="leave-section-icon">
                            <ClipboardList size={19} />
                        </div>

                        <div>

                            <h2>
                                Leave History
                            </h2>

                            <p>
                                Your recent leave requests
                            </p>

                        </div>

                    </div>


                    <div className="leave-history-count">
                        {leaves.length} Requests
                    </div>

                </div>


                <div className="leave-table-container">

                    <table className="leave-table">

                        <thead>

                            <tr>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Start Date
                                </th>

                                <th>
                                    End Date
                                </th>

                                <th>
                                    Reason
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >
                                        Loading leaves...
                                    </td>

                                </tr>

                            ) : leaves.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="table-message"
                                    >
                                        No leave requests found.
                                    </td>

                                </tr>

                            ) : (

                                leaves
                                    .slice()
                                    .reverse()
                                    .map((leave) => (

                                        <tr key={leave.id}>

                                            <td>

                                                <span className="leave-type-badge">
                                                    {getLeaveTypeLabel(
                                                        leave.leaveType
                                                    )}
                                                </span>

                                            </td>


                                            <td>
                                                {leave.startDate}
                                            </td>


                                            <td>
                                                {leave.endDate}
                                            </td>


                                            <td className="leave-reason-cell">
                                                {leave.reason}
                                            </td>


                                            <td>

                                                <span
                                                    className={`leave-status ${leave.status?.toLowerCase()
                                                        }`}
                                                >

                                                    {getStatusIcon(
                                                        leave.status
                                                    )}

                                                    {leave.status}

                                                </span>

                                            </td>

                                        </tr>

                                    ))

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
}

export default LeavePage;