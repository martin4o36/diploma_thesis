import { useEffect, useState } from "react";
import api from "../../../api";
import "../../../styles/admin_panel_styles/countryStyles/CountriesViewStyles.css";
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Save, X} from "lucide-react";
import EditNonWorkingDay from "./EditNonWorkingDay";
import CalendarView from "./CalendarView";

function CountriesView() {
    const [countries, setCountries] = useState([]);
    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [newCountryName, setNewCountryName] = useState("");
    const [showAddCountry, setShowAddCountry] = useState(false);
    const [showEditCountry, setShowEditCountry] = useState(false);
    const [countryToEdit, setCountryToEdit] = useState(null);
    const [showAddNonWorkingDay, setShowAddNonWorkingDay] = useState(false);
    const [editingDay, setEditingDay] = useState(null);
    const [newNonWorkingDay, setNewNonWorkingDay] = useState({ date: "", description: "" });

    const fetchCountries = async () => {
        try {
            const response = await api.get("/api/country/");
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const fetchNonWorkingDays = async (countryId) => {
        try {
            const response = await api.get(`/api/non-working-days/${countryId}/`);
            setNonWorkingDays(response.data);
        } catch (error) {
            console.error("Error fetching non-working days:", error);
        }
    };

    useEffect(() => {
        fetchCountries();
        if (countries.length) setSelectedCountry(countries[0]);
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            fetchNonWorkingDays(selectedCountry.country_id);
        }
    }, [selectedCountry]);
    

    // Countries actions handling
    const handleAddCountry = async () => {
        try {
            await api.post("/api/country/add/", {
                country_name: newCountryName
            });
            fetchCountries();
            setNewCountryName("");
            setShowAddCountry(false);
        } catch (error) {
            console.log("Error adding country:", error);
        }
    };

    const handleEditCountry = async (country) => {
        setCountryToEdit(country);
        setNewCountryName(country.country_name);
        setShowEditCountry(true);
    }

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

    const handleSaveEditCountry = async () => {
        try {
            await api.put(`/api/country/${countryToEdit.country_id}/edit/`, {
                country_name: newCountryName,
            });
            console.log(newCountryName);
            fetchCountries();
            setCountryToEdit(null);
            setNewCountryName("");
            setShowEditCountry(false);
        } catch (error) {
            console.error("Error editing country:", error);
        }
    }


    // Non working days actions handling
    const handleAddNonWorkingDay = async () => {
        try {
            await api.post("/api/non-working-days/add/", {
                country_id: selectedCountry.country_id,
                date: newNonWorkingDay.date,
                description: newNonWorkingDay.description
            });
            setNewNonWorkingDay({ date: "", description: "" });
            setShowAddNonWorkingDay(false);
            fetchNonWorkingDays(selectedCountry.country_id);
        } catch (error) {
            console.error("Error adding non-working day:", error);
        }
    };

    const handleDeleteNonWorkingDay = async (dayId) => {
        console.log("Delete Non working day", dayId);
        const confirmDelete = window.confirm("Are you sure you want to delete this non-working day?");
        if (confirmDelete) {
            try {
                await api.delete(`/api/non-working-days/${selectedCountry.country_id}/${dayId}/delete/`);
                fetchNonWorkingDays(selectedCountry.country_id);
            } catch (error) {
                console.error("Error deleting non-working day:", error);
            }
        }
    };

    const handleSaveEditDay = async (updatedDay) => {
        try {
            await api.put(`/api/non-working-days/${updatedDay.nwd_id}/edit/`, {
                date: updatedDay.date,
                description: updatedDay.description,
            });
            fetchNonWorkingDays(selectedCountry.country_id);
            setEditingDay(null);
        } catch (error) {
            console.error("Error saving edited non-working day:", error);
        }    
    };


    return (
        <div className="countries-non-working-days-container">
            <h1 className="countries-non-working-days-heading">
                Holiday Calendar Manager
            </h1>

            <div className="countries-non-working-days-main">
                {/* Left Section - Country Manager */}
                <div className="countries-section">
                    <div className="countries-header">
                        <h2 className="countries-title">
                            <span className="countries-title-icon">
                                <Calendar className="nwd-calendar-icon" />
                                Countries
                            </span>
                        </h2>
                        <button
                            onClick={() => setShowAddCountry(true)}
                            className="add-country-button"
                            aria-label="Add country"
                        >
                            <Plus className="country-plus-icon" />
                        </button>
                    </div>

                    {/* Add Country Section */}
                    {showAddCountry && (
                        <div className="country-overlay" onClick={() => setShowAddCountry(false)}>
                            <div className="country-modal" onClick={(e) => e.stopPropagation()}>
                                <h3 className="modal-heading">Add New Country</h3>
                                <div className="country-form">
                                    <div className="country-form-group">
                                        <label htmlFor="country-name" className="country-form-label">Country Name:</label>
                                        <input
                                            id="country-name"
                                            type="text"
                                            value={newCountryName}
                                            onChange={(e) => setNewCountryName(e.target.value)}
                                            placeholder="Enter country name"
                                            className="country-input"
                                        />
                                    </div>
                                </div>
                                <div className="country-actions">
                                    <button onClick={handleAddCountry} className="country-button country-button-save">
                                        <Save className="country-button-icon" /> Add
                                    </button>
                                    <button onClick={() => setShowAddCountry(false)} className="country-button country-button-cancel">
                                        <X className="country-button-icon" /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Country Section - Modal */}
                    {showEditCountry && countryToEdit && (
                        <div className="country-overlay" onClick={() => setShowEditCountry(false)}>
                            <div className="country-modal" onClick={(e) => e.stopPropagation()}>
                                <h3 className="modal-heading">Edit Country</h3>
                                <div className="country-form">
                                    <div className="country-form-group">
                                        <label htmlFor="country-name" className="country-form-label">New Country Name:</label>
                                        <input
                                            id="country-name"
                                            type="text"
                                            value={newCountryName}
                                            onChange={(e) => setNewCountryName(e.target.value)}
                                            placeholder="Enter new country name"
                                            className="country-input"
                                            aria-label="Edit country name"
                                        />
                                    </div>
                                </div>
                                <div className="country-actions">
                                    <button onClick={handleSaveEditCountry} className="country-button country-button-save">
                                        <Save className="country-button-icon" /> Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCountryToEdit(null);
                                            setNewCountryName("");
                                            setShowEditCountry(false);
                                        }}
                                        className="country-button country-button-cancel"
                                    >
                                        <X className="country-button-icon" /> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Country List */}
                    <ul className="countries-list">
                        {countries.map((country) => (
                            <li key={country.country_id} className={`country-item-container ${selectedCountry?.country_id === country.country_id ? "selected-country" : ""}`}>
                                <div
                                    onClick={() => setSelectedCountry(country)}
                                    className="country-item"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && setSelectedCountry(country)}
                                >
                                    <span className="country-name">{country.country_name}</span>
                                    <div className="country-actions">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditCountry(country);
                                            }}
                                            className="country-edit-button"
                                            aria-label="Edit country"
                                        >
                                            <Edit2 className="country-edit-icon" onClick={() => setShowEditCountry(true)} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCountry(country.country_id);
                                            }}
                                            className="country-delete-button"
                                            aria-label="Delete country"
                                        >
                                            <Trash2 className="country-delete-icon" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section - Non-working Days Manager */}
                <div className="non-working-days-section">
                    {selectedCountry ? (
                        <div className="non-working-days-container">
                            <div className="non-working-days-header">
                                <h2 className="non-working-days-title">
                                    Non-working Days for {selectedCountry.country_name}
                                </h2>
                                <button
                                    onClick={() => setShowAddNonWorkingDay(true)}
                                    className="add-non-working-day-button"
                                >
                                    <Plus className="nwd-plus-icon" /> Add Holiday
                                </button>
                            </div>

                            {/* Add Non-working Day Modal */}
                            {showAddNonWorkingDay && (
                                <div className="country-overlay" onClick={() => setShowAddNonWorkingDay(false)}>
                                    <div className="country-modal" onClick={(e) => e.stopPropagation()}>
                                        <h3 className="modal-heading">Add New Holiday</h3>
                                        <div className="country-form">
                                            <div className="country-form-group">
                                                <label htmlFor="nwd-date" className="country-form-label">Date:</label>
                                                <input
                                                    id="nwd-date"
                                                    type="date"
                                                    value={newNonWorkingDay.date}
                                                    onChange={(e) =>
                                                        setNewNonWorkingDay({
                                                            ...newNonWorkingDay,
                                                            date: e.target.value,
                                                        })
                                                    }
                                                    className="country-input"
                                                />
                                            </div>
                                            <div className="country-form-group">
                                                <label htmlFor="nwd-description" className="country-form-label">Holiday Description:</label>
                                                <input
                                                    id="nwd-description"
                                                    type="text"
                                                    value={newNonWorkingDay.description}
                                                    onChange={(e) =>
                                                        setNewNonWorkingDay({
                                                            ...newNonWorkingDay,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter holiday description"
                                                    className="country-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="country-actions">
                                            <button onClick={handleAddNonWorkingDay} className="country-button country-button-save">
                                                <Save className="country-button-icon" /> Add Holiday
                                            </button>
                                            <button onClick={() => setShowAddNonWorkingDay(false)} className="country-button country-button-cancel">
                                                <X className="country-button-icon" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Non-working Days List */}
                            <div className="non-working-days-list">
                                <div className="scrollable-non-working-days">
                                    {nonWorkingDays.map((day) => (
                                        <div key={day.nwd_id} className="non-working-day-card">
                                            {editingDay?.nwd_id === day.nwd_id ? (
                                                <EditNonWorkingDay
                                                    editingDay={editingDay}
                                                    onSave={handleSaveEditDay}
                                                    onCancel={() => setEditingDay(null)}
                                                />
                                            ) : (
                                                <div className="non-working-day-details">
                                                    <div className="nwd-day-date">
                                                        {new Date(day.date).toLocaleDateString(undefined, {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </div>
                                                    <div className="holiday-description">{day.description}</div>
                                                    <div className="nwd-action-buttons">
                                                        <button
                                                            onClick={() => setEditingDay(day)}
                                                            className="country-edit-button"
                                                        >
                                                            <Edit2 className="country-edit-icon" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteNonWorkingDay(day.nwd_id)}
                                                            className="country-delete-button"
                                                        >
                                                            <Trash2 className="country-delete-icon" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-country-selected">
                            <div className="no-country-message">
                                <Calendar className="icon-large" />
                                <p className="message">Select a country to manage non-working days</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <CalendarView
                selectedCountry={selectedCountry}
                nonWorkingDays={nonWorkingDays}
            />
        </div>
    );
}

export default CountriesView;
