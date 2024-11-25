import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsSankey from "highcharts/modules/sankey";
import HighchartsOrganization from "highcharts/modules/organization";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import AddDepartmentForm from "../forms/AddDepartmentForm";

if (typeof Highcharts === "object") {
    HighchartsSankey(Highcharts);
    HighchartsOrganization(Highcharts);
    HighchartsAccessibility(Highcharts);
}

function OrgDepartmentsChart({ departments }) {
    const { nodes, links } = departments;
    const [showModal, setShowModal] = useState(false);

    const options = {
        chart: {
            type: "organization",
            inverted: true,
        },
        title: {
            text: "Organization structure",
        },
        series: [
            {
                type: "organization",
                name: "Departments",
                keys: ["from", "to"],
                data: links,
                nodes: nodes,
                colorByPoint: false,
                color: "#655956",
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                    style: { fontSize: "16px",fontWeight: "bold",
                    },
                },
            },
        ],
        tooltip: { outside: true },
        exporting: { allowHTML: true },
        credits: { enabled: false },
    };

    return (
        <div className="chart">
            <HighchartsReact highcharts={Highcharts} options={options} />
            <button
                onClick={() => setShowModal(true)}
                style={{ padding: "10px 20px", cursor: "pointer" }}
            >
                Add Department
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <AddDepartmentForm/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrgDepartmentsChart