import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stations } from '../data/mockData';
import './SearchTab.css';

const SearchTab = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('SPOT');

    // Station Search States
    const [fromStation, setFromStation] = useState('');
    const [toStation, setToStation] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);

    // Date Selection States
    const [selectedDate, setSelectedDate] = useState('All Dates'); // 'All Dates', 'Today', 'Tomorrow', or specific date
    const [customDate, setCustomDate] = useState('');

    const [trainNo, setTrainNo] = useState('');
    const [pnr, setPnr] = useState('');

    // Helper to filter stations
    const handleStationInput = (value, setStation, setSuggestions) => {
        setStation(value);
        if (value.length > 0) {
            const filtered = stations.filter(s =>
                s.name.toLowerCase().includes(value.toLowerCase()) ||
                s.code.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const selectStation = (station, setStation, setSuggestions) => {
        setStation(station.code); // Store code for API
        setSuggestions([]);
    };

    const handleFindTrains = () => {
        if (fromStation && toStation) {
            navigate(`/trains?from=${fromStation}&to=${toStation}&date=${selectedDate === 'Custom' ? customDate : selectedDate}`);
        } else {
            alert('Please enter both From and To stations');
        }
    };

    const handleTrainSearch = () => {
        if (trainNo) {
            navigate(`/live-status/${trainNo}`);
        } else {
            alert('Please enter a Train Number or Name');
        }
    };

    const handlePNRSearch = () => {
        if (pnr && pnr.length === 10) {
            navigate(`/pnr-status/${pnr}`);
        } else {
            alert('Please enter a valid 10-digit PNR number');
        }
    };

    const handleSwap = () => {
        const temp = fromStation;
        setFromStation(toStation);
        setToStation(temp);
    };

    return (
        <div className="search-tab">
            <div className="tab-header">
                <div className={`tab ${activeTab === 'SPOT' ? 'active' : ''}`} onClick={() => setActiveTab('SPOT')}>SPOT</div>
                <div className={`tab ${activeTab === 'PNR' ? 'active' : ''}`} onClick={() => setActiveTab('PNR')}>PNR</div>
                <div className={`tab ${activeTab === 'SEATS' ? 'active' : ''}`} onClick={() => setActiveTab('SEATS')}>SEATS</div>
            </div>

            {activeTab === 'SPOT' && (
                <>
                    <div className="search-card">
                        {/* From Station */}
                        <div className="input-group" style={{ position: 'relative' }}>
                            <label>From Station</label>
                            <input
                                type="text"
                                placeholder="Enter From Station"
                                value={fromStation}
                                onChange={(e) => handleStationInput(e.target.value, setFromStation, setFromSuggestions)}
                            />
                            {fromSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {fromSuggestions.map(s => (
                                        <li key={s.code} onClick={() => selectStation(s, setFromStation, setFromSuggestions)}>
                                            {s.name} - {s.code}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', margin: '-15px 0', position: 'relative', zIndex: 10 }}>
                            <button onClick={handleSwap} className="swap-btn" title="Swap Stations">⇅</button>
                        </div>

                        {/* To Station */}
                        <div className="input-group" style={{ position: 'relative' }}>
                            <label>To Station</label>
                            <input
                                type="text"
                                placeholder="Enter To Station"
                                value={toStation}
                                onChange={(e) => handleStationInput(e.target.value, setToStation, setToSuggestions)}
                            />
                            {toSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {toSuggestions.map(s => (
                                        <li key={s.code} onClick={() => selectStation(s, setToStation, setToSuggestions)}>
                                            {s.name} - {s.code}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Date Selection */}
                        <div className="date-selection" style={{ marginBottom: '1rem' }}>
                            <div className="date-options" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <button
                                    className={`date-chip ${selectedDate === 'All Dates' ? 'active' : ''}`}
                                    onClick={() => setSelectedDate('All Dates')}
                                >
                                    All Dates
                                </button>
                                <button
                                    className={`date-chip ${selectedDate === 'Today' ? 'active' : ''}`}
                                    onClick={() => setSelectedDate('Today')}
                                >
                                    Today
                                </button>
                                <button
                                    className={`date-chip ${selectedDate === 'Tomorrow' ? 'active' : ''}`}
                                    onClick={() => setSelectedDate('Tomorrow')}
                                >
                                    Tomorrow
                                </button>
                            </div>
                            <div className="input-group">
                                <label>Choose from Calendar</label>
                                <input
                                    type="date"
                                    value={customDate}
                                    onChange={(e) => { setCustomDate(e.target.value); setSelectedDate('Custom'); }}
                                />
                            </div>
                        </div>

                        <button className="find-trains-btn" onClick={handleFindTrains}>
                            FIND TRAINS
                        </button>
                    </div>

                    <div className="divider">OR</div>

                    <div className="search-card">
                        <div className="input-group">
                            <label>Train No / Name</label>
                            <input
                                type="text"
                                placeholder="Enter Train No"
                                value={trainNo}
                                onChange={(e) => setTrainNo(e.target.value)}
                            />
                        </div>
                        <button className="find-trains-btn secondary" onClick={handleTrainSearch}>
                            FIND LIVE STATUS
                        </button>
                    </div>
                </>
            )}

            {activeTab === 'PNR' && (
                <div className="search-card">
                    <div className="input-group">
                        <label>Enter PNR Number</label>
                        <input
                            type="text"
                            placeholder="10-digit PNR Number"
                            value={pnr}
                            onChange={(e) => setPnr(e.target.value)}
                            maxLength={10}
                        />
                    </div>
                    <button className="find-trains-btn" onClick={handlePNRSearch}>
                        FIND PNR STATUS
                    </button>
                </div>
            )}

            {activeTab === 'SEATS' && (
                <div className="search-card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Seat Availability feature coming soon!</p>
                </div>
            )}
        </div>
    );
};

export default SearchTab;


