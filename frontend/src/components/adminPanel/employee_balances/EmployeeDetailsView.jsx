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
} from "lucide-react";
import debounce from "lodash/debounce";
import "../../../styles/adminPanelStyles/balances/EmployeeBalanceStyles.css";

function EmployeeDetailsView() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortOption, setSortOption] = useState("name");
    const [expandedEmployee, setExpandedEmployee] = useState(null);
    const [isSortDropdownExpanded, setSortDropdownExpanded] = useState(false);
    const [balances, setBalances] = useState(null);
    const [allowances, setAllowances] = useState(null);

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
            const allowancesResponse = await api.get(`/api/allowance/${employee_id}/`);
            setAllowances(allowancesResponse.data);

            const balanceResponse = await api.get(`/api/balance/${employee_id}`);
            setBalances(balanceResponse.data);
        } catch (error) {
            console.error("Error fetching employee details:", error);
        }
    };

    const handleExpandCollapse = (employee) => {
        if (expandedEmployee === employee.employee_id) {
            setExpandedEmployee(null);
        } else {
            setExpandedEmployee(employee.employee_id);
            fetchDetails(employee.employee_id);
        }
    };

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
                <h1>Employee Vacation Details</h1>
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
                            <div>
                                <h2>{`${employee.first_name} ${employee.last_name}`}</h2>
                                <p>{employee.position}</p>
                            </div>
                            {expandedEmployee === employee.employee_id ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        {expandedEmployee === employee.employee_id && (
                            <div className="balance-employee-details">
                                <div className="allowance-container">
                                    <h3 className="balance-section-title">Allowance Details</h3>
                                    {allowances &&
                                        allowances.map((allowance) => (
                                            <div key={allowance.allowance_id} className="allowance-item">
                                                <p>
                                                    <Calendar /> <strong>{allowance.leave_type_name}</strong>
                                                </p>
                                                <p>{`${allowance.period_start_date} - ${allowance.period_end_date}`}</p>
                                                <p>
                                                    <strong>Allowance:</strong> {allowance.days} days (Carry forward:{" "}
                                                    {allowance.bring_forward})
                                                </p>
                                                {allowance.comment && (
                                                    <p>
                                                        <MessageSquare /> {allowance.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                </div>
                                <div className="balance-container">
                                    <h3 className="balance-section-title">Current Balance</h3>
                                    {balances &&
                                        balances.map((balance) => (
                                            <div key={balance.eb_id} className="balance-item">
                                                <Clock />
                                                <p>
                                                    <strong>{balance.leave_type_name}:</strong> {balance.days_left} days
                                                </p>
                                            </div>
                                        ))}
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
                    <ChevronLeft />
                </button>
                <span>
                    {currentPage}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((prev) =>
                            currentPage < Math.ceil(filteredEmployees.length / itemsPerPage)
                                ? prev + 1
                                : prev
                        )
                    }
                    disabled={
                        currentPage >= Math.ceil(filteredEmployees.length / itemsPerPage)
                    }
                >
                    <ChevronRight />
                </button>
            </footer>
        </div>
    );
}

export default EmployeeDetailsView;
