import { useEffect, useState, useMemo } from "react";
import api from "../../../api";
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    MessageSquare,
    Search,
    Edit2,
    Trash2,
    Plus
} from "lucide-react";
import debounce from "lodash/debounce";
import "../../../styles/admin_panel_styles/balances/EmployeeDetailsStyles.css";
import EditLeaveBalance from "./EditLeaveBalance";
import AddLeaveBalance from "./AddLeaveBalance";

function EmployeeDetailsView() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortOption, setSortOption] = useState("name");
    const [expandedEmployee, setExpandedEmployee] = useState(null);
    const [isSortDropdownExpanded, setSortDropdownExpanded] = useState(false);
    const [leaveBalances, setLeaveBalances] = useState(null);
    const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
    const [uniquePeriods, setUniquePeriods] = useState([]);
    const [currentLeaveBalance, setCurrentLeaveBalance] = useState(null);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [showEditLeaveBalance, setShowEditLeaveBalance] = useState(false);
    const [showAddLeaveBalance, setShowAddLeaveBalance] = useState(false);

    const debouncedSearch = debounce((value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, 300);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const response = await api.get("/api/employee/all/");
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchAllEmployees();
    }, []);

    const fetchDetails = async (employee_id) => {
        try {
            const allowancesResponse = await api.get(`/api/leave-balance/${employee_id}/`);
            const sortedAllowances = allowancesResponse.data
                .sort((a, b) => {
                    const dateComparison = new Date(a.period_start_date) - new Date(b.period_start_date);
                    if (dateComparison !== 0) {
                        return dateComparison;
                    }
                    return a.leave_type_name.localeCompare(b.leave_type_name);
                });

            const periods = [
                ...new Set(
                    sortedAllowances.map(
                        (allowance) => `${allowance.period_start_date}_${allowance.period_end_date}`
                    )
                ),
            ];

            setLeaveBalances(sortedAllowances);
            setUniquePeriods(periods);
            setCurrentPeriodIndex(0);
        } catch (error) {
            console.error("Error fetching employee details:", error);
        }
    };

    const handleExpandCollapse = (employee) => {
        const isSameEmployee = expandedEmployee === employee.employee_id;
        setExpandedEmployee(isSameEmployee ? null : employee.employee_id);
        if (!isSameEmployee) fetchDetails(employee.employee_id);
    };

    const handlePeriodChange = (direction) => {
        setCurrentPeriodIndex((prevIndex) => {
            const nextIndex = prevIndex + direction;
            if (nextIndex >= 0 && nextIndex < uniquePeriods.length) {
                return nextIndex;
            }
            return prevIndex;
        });
    };

    const handleEditLeaveBalance = async (leaveBalance, employee) => {
        setShowEditLeaveBalance(true);
        setCurrentLeaveBalance(leaveBalance);
        setCurrentEmployee(employee);
    }

    const handleAddLeaveBalance = async (employee) => {
        setShowAddLeaveBalance(true);
        setCurrentEmployee(employee);
    }

    const handleDeleteLeaveBalance = async (leaveBalanceId, employeeId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this leave balance?");

        if(confirmDelete) {
            try {
                await api.delete(`/api/leave-balance/${leaveBalanceId}/delete/`);
                fetchDetails(employeeId);
            } catch (error) {
                console.error("Error deleting leave balance:", error);
            }
        }
    }

    const leaveBalancesForCurrentPeriod = useMemo(() => {
        if (uniquePeriods.length > 0 && leaveBalances) {
            const [currentStart, currentEnd] = uniquePeriods[currentPeriodIndex].split("_");
            return leaveBalances.filter(
                (balance) =>
                    balance.period_start_date === currentStart &&
                    balance.period_end_date === currentEnd
            );
        }
        return [];
    }, [leaveBalances, uniquePeriods, currentPeriodIndex]);

    const filteredEmployees = useMemo(() => {
        let results = employees.filter(
            (emp) =>
                emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.position.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortOption === "name") {
            results.sort((a, b) =>
                `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
            );
        } else if (sortOption === "position") {
            results.sort((a, b) => a.position.localeCompare(b.position));
        }

        return results;
    }, [employees, searchQuery, sortOption]);

    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredEmployees, currentPage, itemsPerPage]);

    return (
        <div className="balance-container">
            <header className="balance-header">
                <h1>Employee Holiday Details</h1>
                <div className="balance-controls">
                    <div className="balance-search-container">
                        <Search />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                    </div>
                    <div className="balance-sort-container">
                        <div
                            className="balance-sort-header"
                            onClick={() => setSortDropdownExpanded(!isSortDropdownExpanded)}
                        >
                            <span>{sortOption === "name" ? "Sort by Name" : "Sort by Position"}</span>
                            {isSortDropdownExpanded ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        {isSortDropdownExpanded && (
                            <div className="balance-sort-options">
                                <button
                                    onClick={() => {
                                        setSortOption("name");
                                        setSortDropdownExpanded(false);
                                    }}
                                >
                                    Sort by Name
                                </button>
                                <button
                                    onClick={() => {
                                        setSortOption("position");
                                        setSortDropdownExpanded(false);
                                    }}
                                >
                                    Sort by Position
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
    
            <div className="balance-employee-list">
                {paginatedEmployees.map((employee) => (
                    <div key={employee.employee_id} className="balance-employee-card">
                        <div className="balance-employee-header" onClick={() => handleExpandCollapse(employee)}>
                            <div className="employee-name-position">
                                <h2 className="employee-name">{`${employee.first_name} ${employee.last_name}`}</h2>
                                <p className="employee-position">{employee.position}</p>
                            </div>
                            {expandedEmployee === employee.employee_id ? <ChevronUp className="up-icon" /> : <ChevronDown className="up-icon" />}
                        </div>
                        {expandedEmployee === employee.employee_id && (
                            <div className="employee-leave-balance-details">
                                <div className="add-leave-balance-container">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAddLeaveBalance(employee)}}
                                        className="add-leave-balance-button"
                                        title="Add Balance"
                                    >
                                        <Plus className="plus-icon" /> Add Balance
                                    </button>
                                </div>

                                <div className="period-navigation">
                                    <button
                                        onClick={() => handlePeriodChange(-1)}
                                        disabled={currentPeriodIndex === 0}
                                        className="period-navigation-button left-button"
                                    >
                                        <ChevronLeft className="left-icon" />
                                        Previous
                                    </button>
    
                                    <span className="period-indicator">
                                        Period: {uniquePeriods[currentPeriodIndex]?.split("_")[0]} to{" "}
                                        {uniquePeriods[currentPeriodIndex]?.split("_")[1]}
                                    </span>
    
                                    <button
                                        onClick={() => handlePeriodChange(1)}
                                        disabled={currentPeriodIndex >= uniquePeriods.length - 1}
                                        className="period-navigation-button right-button"
                                    >
                                        Next 
                                        <ChevronRight className="right-icon" />
                                    </button>
                                </div>
    
                                <div className="employee-leave-balance-container">
                                    {leaveBalancesForCurrentPeriod.length > 0 && (
                                        leaveBalancesForCurrentPeriod.reduce((rows, _, index, src) => {
                                            if (index % 2 === 0) rows.push(src.slice(index, index + 2));
                                            return rows;
                                        }, []).map((pair, rowIndex) => (
                                            <div key={`leave-balance-row-${rowIndex}`} className="leave-balance-row">
                                                {pair.map((leaveBalance) => (
                                                    <div key={leaveBalance.balance_id} className="leave-balance-item styled-item">
                                                        <div className="leave-balance-info">
                                                            <div className="leave-balance-header">
                                                                <p><strong>{leaveBalance.leave_type_name}</strong></p>
                                                            </div>
                                                            <p className="leave-balance-allowance">
                                                                <Calendar className="calendar-icon" />
                                                                <strong>Allowance:</strong> {leaveBalance.days} days (Carry forward: {leaveBalance.bring_forward})
                                                            </p>
                                                            {leaveBalance.comment && (
                                                                <p className="leave-balance-comment">
                                                                    <MessageSquare className="message-icon" /> {leaveBalance.comment}
                                                                </p>
                                                            )}
                                                            <div className="leave-balance-days-used">
                                                                <Clock className="clock-icon" />
                                                                <p>{leaveBalance.days_used} days used: {leaveBalance.days - leaveBalance.days_used} days left</p>
                                                            </div>
                                                        </div>

                                                        <div className="leave-balance-buttons">
                                                            <button
                                                                onClick={(e) => e.stopPropagation() || handleEditLeaveBalance(leaveBalance, employee)}
                                                                className="edit-leave-balance-button"
                                                                title="Edit Balance"
                                                            >
                                                                <Edit2 className="leave-balance-edit-icon" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => e.stopPropagation() || handleDeleteLeaveBalance(leaveBalance.balance_id, employee.employee_id)}
                                                                className="delete-leave-balance-button"
                                                                title="Delete Balance"
                                                            >
                                                                <Trash2 className="leave-balance-trash-icon" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    )}

                                    {showAddLeaveBalance && currentEmployee && (
                                        <AddLeaveBalance 
                                            employee={currentEmployee}
                                            onSuccess={() => {
                                                fetchDetails(currentEmployee.employee_id);
                                                setShowAddLeaveBalance(false);
                                            }}
                                            onCancel={() => setShowAddLeaveBalance(false)}
                                        />
                                    )}

                                    {showEditLeaveBalance && currentLeaveBalance && (
                                        <EditLeaveBalance
                                            leaveBalance={currentLeaveBalance}
                                            onSuccess={() => {
                                                fetchDetails(currentEmployee.employee_id);
                                                setShowEditLeaveBalance(false);
                                            }}
                                            onCancel={() => setShowEditLeaveBalance(false)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
    
            <footer className="balance-pagination">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="left-icon" />
                </button>
                <span>{currentPage}</span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) =>
                            currentPage < Math.ceil(filteredEmployees.length / itemsPerPage) ? prev + 1 : prev
                        )
                    }
                    disabled={currentPage >= Math.ceil(filteredEmployees.length / itemsPerPage)}
                >
                    <ChevronRight className="right-icon" />
                </button>
            </footer>
        </div>
    );
}

export default EmployeeDetailsView;
