import { useState } from "react";
import api from "../../../api";
import "../../../styles/adminPanelStyles/countryStyles/AddCountryStyles.css";

function AddCountryForm({ onSuccess, onCancel }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "") {
            alert("Please fill in the country name!");
            return;
        }

        setLoading(true);

        try {
            await api.post("/api/country/add/", {
                country_name: name,
            });
            onSuccess();
        } catch (error) {
            console.error("Error adding country:", error);
            alert("Failed to add country.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-country-container">
            <h1 className="add-country-title">Add Country</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="country_name" className="country-label">
                    Country Name:
                </label>
                <input
                    name="country_name"
                    className="country-form-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Country Name"
                    required
                />

                <div className="form-buttons">
                    <button
                        type="submit"
                        className="submit-country-btn"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button
                        type="button"
                        className="cancel-country-btn"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddCountryForm;
