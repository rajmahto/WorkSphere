import { useEffect, useState } from "react";
import {
    ArrowLeft,
    FileText,
    Clock3,
    CalendarDays,
    UserRound,
    CheckCircle2,
    XCircle,
    LoaderCircle
} from "lucide-react";

import "../App.css";


function HRLeavePage({ onNotify, onBack }) {

    const token = localStorage.getItem("token");

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);


    useEffect(() => {
        fetchPendingLeaves();
    }, []);


    const fetchPendingLeaves = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/leaves/pending",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Unable to fetch leave requests"
                );
            }


            const data = await response.json();

            setLeaves(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Leave requests error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to load leave requests."
            });

        } finally {

            setLoading(false);
        }
    };


    const handleLeaveAction = async (
        id,
        action
    ) => {

        if (processingId) return;

        setProcessingId(id);


        try {

            const response = await fetch(
                `http://localhost:8080/leaves/${id}/${action}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                onNotify({
                    type: "error",
                    message:
                        data.message ||
                        `Unable to ${action} leave.`
                });

                return;
            }


            setLeaves(
                (previousLeaves) =>
                    previousLeaves.filter(
                        (leave) =>
                            leave.id !== id
                    )
            );


            onNotify({
                type: "success",
                message:
                    action === "approve"
                        ? "Leave approved successfully."
                        : "Leave rejected successfully."
            });


        } catch (error) {

            console.error(
                "Leave action error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to connect to server."
            });

        } finally {

            setProcessingId(null);
        }
    };


    const calculateDays = (
        startDate,
        endDate
    ) => {

        const start =
            new Date(startDate);

        const end =
            new Date(endDate);


        const difference =
            end.getTime() -
            start.getTime();


        return (
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            ) + 1
        );
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


    return (

        <div className="hr-leave-page">

            {/* Header */}

            <div className="hr-leave-header">

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
                                Review and manage employee leave requests
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Leave Card */}

            <section className="hr-leave-card">

                {/* Card Header */}

                <div className="hr-leave-card-header">

                    <div className="leave-section-title">

                        <div className="leave-section-icon">
                            <Clock3 size={19} />
                        </div>

                        <div>

                            <h2>
                                Pending Leave Requests
                            </h2>

                            <p>
                                Review requests submitted by employees
                            </p>

                        </div>

                    </div>


                    <div className="pending-count">

                        {leaves.length}{" "}
                        {leaves.length === 1
                            ? "Pending"
                            : "Pending"}

                    </div>

                </div>


                {/* Table */}

                <div className="hr-leave-table-container">

                    <table className="hr-leave-table">

                        <thead>

                            <tr>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Leave Type
                                </th>

                                <th>
                                    Start Date
                                </th>

                                <th>
                                    End Date
                                </th>

                                <th>
                                    Days
                                </th>

                                <th>
                                    Reason
                                </th>

                                <th>
                                    Action
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

                                        <div className="hr-table-state">

                                            <LoaderCircle
                                                size={20}
                                                className="loading-spinner"
                                            />

                                            <span>
                                                Loading leave requests...
                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : leaves.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="table-message"
                                    >

                                        <div className="hr-table-state">

                                            <CheckCircle2
                                                size={21}
                                            />

                                            <div>

                                                <strong>
                                                    No pending requests
                                                </strong>

                                                <span>
                                                    All leave requests have been processed.
                                                </span>

                                            </div>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                leaves.map((leave) => (

                                    <tr
                                        key={leave.id}
                                    >

                                        {/* Employee */}

                                        <td>

                                            <div className="hr-leave-employee">

                                                <div className="hr-leave-avatar">
                                                    <UserRound size={17} />
                                                </div>

                                                <div>

                                                    <strong>
                                                        {leave.employee?.name ||
                                                            "Unknown"}
                                                    </strong>

                                                    <span>
                                                        {leave.employee?.email ||
                                                            ""}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Leave Type */}

                                        <td>

                                            <span className="leave-type-badge">
                                                {leave.leaveType}
                                            </span>

                                        </td>


                                        {/* Start Date */}

                                        <td>

                                            <div className="leave-date">

                                                <CalendarDays
                                                    size={15}
                                                />

                                                <span>
                                                    {formatDate(
                                                        leave.startDate
                                                    )}
                                                </span>

                                            </div>

                                        </td>


                                        {/* End Date */}

                                        <td>

                                            <div className="leave-date">

                                                <CalendarDays
                                                    size={15}
                                                />

                                                <span>
                                                    {formatDate(
                                                        leave.endDate
                                                    )}
                                                </span>

                                            </div>

                                        </td>


                                        {/* Days */}

                                        <td>

                                            <span className="leave-days">
                                                {calculateDays(
                                                    leave.startDate,
                                                    leave.endDate
                                                )}{" "}
                                                {calculateDays(
                                                    leave.startDate,
                                                    leave.endDate
                                                ) === 1
                                                    ? "day"
                                                    : "days"}
                                            </span>

                                        </td>


                                        {/* Reason */}

                                        <td>

                                            <div className="leave-reason-cell">

                                                {leave.reason ||
                                                    "No reason provided"}

                                            </div>

                                        </td>


                                        {/* Actions */}

                                        <td>

                                            <div className="leave-actions">

                                                <button
                                                    type="button"
                                                    className="approve-leave-button"
                                                    onClick={() =>
                                                        handleLeaveAction(
                                                            leave.id,
                                                            "approve"
                                                        )
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        leave.id
                                                    }
                                                >

                                                    {processingId ===
                                                        leave.id ? (

                                                        <LoaderCircle
                                                            size={16}
                                                            className="loading-spinner"
                                                        />

                                                    ) : (

                                                        <CheckCircle2
                                                            size={16}
                                                        />

                                                    )}

                                                    <span>
                                                        {processingId ===
                                                            leave.id
                                                            ? "Processing..."
                                                            : "Approve"}
                                                    </span>

                                                </button>


                                                <button
                                                    type="button"
                                                    className="reject-leave-button"
                                                    onClick={() =>
                                                        handleLeaveAction(
                                                            leave.id,
                                                            "reject"
                                                        )
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        leave.id
                                                    }
                                                >

                                                    <XCircle
                                                        size={16}
                                                    />

                                                    <span>
                                                        Reject
                                                    </span>

                                                </button>

                                            </div>

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

export default HRLeavePage;