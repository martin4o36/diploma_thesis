import { useEffect, useState } from "react";
import api from "../../../api";
import AddCountryForm from "./AddCountryForm";
import "../../../styles/adminPanelStyles/countryStyles/CountriesViewStyles.css";
import NonWorkingDays from "./NonWorkingDays";

function CountriesView() {
    const [countries, setCountries] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const fetchCountries = async () => {
        try {
            const response = await api.get("/api/country/");
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    useEffect(() => {
        fetchCountries();
        setSelectedCountry(countries[0]);
    }, []);

    const handleDeleteCountry = async (countryId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this country?");
        if (confirmDelete) {
            try {
                await api.delete(`/api/country/${countryId}/delete/`);
                fetchCountries();
            } catch (error) {
                console.error("Error deleting country:", error);
            }
        }
    };

    return (
        <div className="countries-page">
            <div className="countries-container">
                <div className="countries-header">
                    <h2>Countries</h2>
                    <button className="add-country-button" onClick={() => setShowAddForm(true)}>
                        <i className="fa fa-plus"></i> Add Country
                    </button>
                </div>
    
                {showAddForm && (
                    <>
                        <div className="modal-overlay" onClick={() => setShowAddForm(false)}></div>
                        <div className="add-country-modal">
                            <AddCountryForm
                                onSuccess={() => {
                                    fetchCountries();
                                    setShowAddForm(false);
                                }}
                                onCancel={() => setShowAddForm(false)}
                            />
                        </div>
                    </>
                )}
    
                <ul className="country-list">
                    {countries.map((country) => (
                        <li key={country.country_id} className="country-item">
                            <strong onClick={() => setSelectedCountry(country)}>{country.country_name}</strong>
                            <button
                                onClick={() => handleDeleteCountry(country.country_id)}
                                className="delete-country-btn"
                            >
                                <i className="fa fa-trash"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
    
            <div className="non-working-days-container">
                {selectedCountry && <NonWorkingDays country={selectedCountry} />}
            </div>
        </div>
    );    
}

export default CountriesView;
