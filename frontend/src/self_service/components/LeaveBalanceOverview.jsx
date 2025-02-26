import { useState, useEffect, useMemo } from "react";
import api from "../../api";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/LeaveBalanceOverviewStyles.css";

function LeaveBalanceOverview({ employee_id }) {
	const [leaveBalances, setLeaveBalances] = useState(null);
	const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
	const [uniquePeriods, setUniquePeriods] = useState([]);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const { data } = await api.get(`/api/leave-balance/${employee_id}/`);
				const sorted = data.sort(
					(a, b) => new Date(a.period_start_date) - new Date(b.period_start_date)
				);

				const periods = [
					...new Set(sorted.map((a) => `${a.period_start_date}_${a.period_end_date}`)),
				];

				setLeaveBalances(sorted);
				setUniquePeriods(periods);
			} catch (error) {
				console.error("Error fetching employee details:", error);
			}
		};
		fetchDetails();
	}, [employee_id]);

	const leaveBalancesForCurrentPeriod = useMemo(() => {
		if (!leaveBalances || !uniquePeriods.length) return [];
		const [start, end] = uniquePeriods[currentPeriodIndex].split("_");
		return leaveBalances.filter(
			(b) => b.period_start_date === start && b.period_end_date === end
		);
	}, [leaveBalances, uniquePeriods, currentPeriodIndex]);

	const handlePeriodChange = (direction) => {
		setCurrentPeriodIndex((prev) => {
			const next = prev + direction;
			return next >= 0 && next < uniquePeriods.length ? next : prev;
		});
	};

	const formattedPeriod = useMemo(() => {
		if (!uniquePeriods[currentPeriodIndex]) return "No periods";
		const [start, end] = uniquePeriods[currentPeriodIndex].split("_");
		return `${dayjs(start).format("MMM DD, YYYY")} - ${dayjs(end).format("MMM DD, YYYY")}`;
	}, [uniquePeriods, currentPeriodIndex]);

	return (
		<div className="leave-balance-overview">
			<div className="leave-balance-header">
				<h2>Leave Balance Overview</h2>
				<div className="balance-navigation">
					<button
						onClick={() => handlePeriodChange(-1)}
						disabled={currentPeriodIndex === 0}
					>
						<ChevronLeft />
					</button>
					<span>{formattedPeriod}</span>
					<button
						onClick={() => handlePeriodChange(1)}
						disabled={currentPeriodIndex >= uniquePeriods.length - 1}
					>
						<ChevronRight />
					</button>
				</div>
			</div>

			<div className="balance-grid">
				{leaveBalancesForCurrentPeriod.map((balance, index) => {
					const usedPercentage =
						balance.days > 0 ? ((balance.days_used / balance.days) * 100).toFixed(0) : 0;

					return (
						<div key={index} className="balance-card">
							<div className="balance-card-header">
								<span className="title">{balance.leave_type_name}</span>
								<div className="details">
									<span>
										{balance.days_used}/{balance.days} days
									</span>
								</div>
							</div>

							<div className="progress-info">
								<span>Can carry forward: {balance.bring_forward}</span>
							</div>

							<div className="progress-container">
								<div
									className="progress-bar used-percentage"
									style={{ width: `${usedPercentage}%` }}
								/>
							</div>

							<div className="progress-info">
								<span>Used: {balance.days_used}</span>
								<span>Remaining: {balance.days - balance.days_used}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default LeaveBalanceOverview;
