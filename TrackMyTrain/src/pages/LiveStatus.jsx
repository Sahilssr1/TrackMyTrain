import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusTimeline from '../components/StatusTimeline';
import Header from '../components/Header';
import { getTrainSchedule, trains } from '../data/mockData';

const LiveStatus = () => {
    const { trainNo } = useParams();
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState([]);
    const [trainInfo, setTrainInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLiveStatus = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': 'xyz',
                    'x-rapidapi-host': 'irctc-train-api.p.rapidapi.com'
                }
            };

            try {
                console.log(`Fetching live status for ${trainNo}...`);
                const response = await fetch(`https://irctc-train-api.p.rapidapi.com/api/v1/live-train-status?trainNo=${trainNo}&startDay=0`, options);
                console.log('Response Status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Body:', errorText);
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }

                const result = await response.json();
                console.log('API Result:', result);

                if (result.status === true) {
                    processData(result);
                } else {
                    throw new Error(result.message || 'Failed to fetch train status');
                }
            } catch (err) {
                console.error('Full Error Object:', err);

                // Fallback to local mock data
                const mockSched = getTrainSchedule(trainNo);
                const mockInfo = trains.find(t => t.number === trainNo);

                if (mockInfo && mockSched.length > 0) {
                    console.log('Using Mock Data Fallback');
                    setTrainInfo(mockInfo);
                    setSchedule(mockSched);
                } else {
                    setError(err.message || 'Unknown Error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLiveStatus();
    }, [trainNo]);

    const processData = (data) => {
        if (data.trainDetails) {
            setTrainInfo({
                name: data.trainDetails.name,
                number: data.trainDetails.number
            });
        }

        if (data.route && Array.isArray(data.route)) {
            setSchedule(data.route);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Fetching live status for {trainNo}...</p>
                </div>
            </div>
        );
    }

    if (error || !trainInfo) {
        return (
            <div className="container">
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Could not find live status for {trainNo}.
                        <br />
                        (Try 12859 or 12951 for demo)
                    </p>
                    <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Go Back</button>
                </div>
            </div>
        );
    }

    // Helper to get current status message
    const getStatusMessage = () => {
        if (!schedule || schedule.length === 0) return "Status unknown";
        // Simple logic: find last passed station
        // In real app, use API's 'current_station_name' if available
        return `Running on time`; // Placeholder, can be enhanced with real logic
    };

    return (
        <div className="container" style={{ background: '#f5f7fa', minHeight: '100vh' }}>
            <div className="header" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '1rem', color: '#333', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <button onClick={() => navigate('/')} style={{ color: '#333', background: 'none', fontSize: '1.2rem', border: 'none', cursor: 'pointer' }}>←</button>
                <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Live Status</h1>
            </div>

            {/* Summary Card */}
            <div style={{ padding: '1rem 1rem 0 1rem' }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Current Status</span>
                        <span style={{ fontSize: '0.8rem', color: '#4CAF50', background: '#e8f5e9', padding: '4px 8px', borderRadius: '4px' }}>● Live</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '0.25rem' }}>{trainInfo.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#888' }}>{trainInfo.number}</p>
                </div>
            </div>

            <StatusTimeline
                schedule={schedule}
                trainName={trainInfo.name}
                trainNo={trainInfo.number}
            />
        </div>
    );
};

export default LiveStatus;

