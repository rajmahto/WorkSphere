import { useEffect, useState } from "react";
import {
    ArrowLeft,
    WalletCards,
    Banknote,
    Home,
    PlusCircle,
    MinusCircle,
    CalendarDays
} from "lucide-react";

import "../App.css";

function PayrollPage({ onNotify, onBack }) {

    const token = localStorage.getItem("token");

    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchPayrolls();
    }, []);


    const fetchPayrolls = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/payrolls/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                throw new Error(
                    "Unable to fetch payroll"
                );
            }


            const data =
                await response.json();


            setPayrolls(
                Array.isArray(data)
                    ? data
                    : [data]
            );


        } catch (error) {

            console.error(
                "Payroll error:",
                error
            );

            onNotify({
                type: "error",
                message:
                    "Unable to load payroll details."
            });

        } finally {

            setLoading(false);
        }
    };


    const formatAmount = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(amount || 0);
    };


    const formatMonth = (month) => {

        const monthNumber =
            Number(month);

        if (
            monthNumber >= 1 &&
            monthNumber <= 12
        ) {

            return new Date(
                2000,
                monthNumber - 1,
                1
            ).toLocaleString(
                "en-IN",
                {
                    month: "long"
                }
            );
        }

        return month;
    };


    return (

        <div className="payroll-page">

            {/* Header */}

            <div className="payroll-header">

                <div>

                    <button
                        type="button"
                        className="back-dashboard-button"
                        onClick={onBack}
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </button>


                    <div className="payroll-title-row">

                        <div className="payroll-title-icon">
                            <WalletCards size={24} />
                        </div>

                        <div>

                            <h1>
                                Payroll
                            </h1>

                            <p>
                                View your salary and payroll details
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Payroll Content */}

            {loading ? (

                <div className="payroll-message">

                    <div className="payroll-message-icon">
                        <WalletCards size={22} />
                    </div>

                    <div>

                        <strong>
                            Loading payroll
                        </strong>

                        <span>
                            Fetching your latest salary details...
                        </span>

                    </div>

                </div>

            ) : payrolls.length === 0 ? (

                <div className="payroll-message">

                    <div className="payroll-message-icon">
                        <WalletCards size={22} />
                    </div>

                    <div>

                        <strong>
                            No payroll records found
                        </strong>

                        <span>
                            Your salary information will appear here.
                        </span>

                    </div>

                </div>

            ) : (

                <div className="payroll-list">

                    {payrolls
                        .slice()
                        .reverse()
                        .map((payroll) => (

                            <section
                                className="payroll-card"
                                key={payroll.id}
                            >

                                {/* Salary Header */}

                                <div className="payroll-card-header">

                                    <div className="payroll-period">

                                        <div className="payroll-card-icon">
                                            <CalendarDays size={20} />
                                        </div>

                                        <div>

                                            <h2>
                                                Salary Details
                                            </h2>

                                            <p>
                                                {formatMonth(
                                                    payroll.month
                                                )}{" "}
                                                {payroll.year}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="net-salary">

                                        <span>
                                            Net Salary
                                        </span>

                                        <strong>
                                            {formatAmount(
                                                payroll.netSalary
                                            )}
                                        </strong>

                                    </div>

                                </div>


                                {/* Salary Breakdown */}

                                <div className="payroll-details">

                                    <div className="payroll-detail-item">

                                        <div className="payroll-detail-icon basic">
                                            <Banknote size={18} />
                                        </div>

                                        <div>

                                            <span>
                                                Basic Salary
                                            </span>

                                            <strong>
                                                {formatAmount(
                                                    payroll.basicSalary
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="payroll-detail-item">

                                        <div className="payroll-detail-icon hra">
                                            <Home size={18} />
                                        </div>

                                        <div>

                                            <span>
                                                HRA
                                            </span>

                                            <strong>
                                                {formatAmount(
                                                    payroll.hra
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="payroll-detail-item">

                                        <div className="payroll-detail-icon allowance">
                                            <PlusCircle size={18} />
                                        </div>

                                        <div>

                                            <span>
                                                Allowances
                                            </span>

                                            <strong>
                                                {formatAmount(
                                                    payroll.allowances
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="payroll-detail-item">

                                        <div className="payroll-detail-icon deduction">
                                            <MinusCircle size={18} />
                                        </div>

                                        <div>

                                            <span>
                                                Deductions
                                            </span>

                                            <strong>
                                                {formatAmount(
                                                    payroll.deductions
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                {/* Net Salary Footer */}

                                <div className="payroll-net-footer">

                                    <span>
                                        Take-home salary
                                    </span>

                                    <strong>
                                        {formatAmount(
                                            payroll.netSalary
                                        )}
                                    </strong>

                                </div>

                            </section>

                        ))}

                </div>

            )}

        </div>
    );
}

export default PayrollPage;