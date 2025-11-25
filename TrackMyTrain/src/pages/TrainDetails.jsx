import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const TrainDetails = () => {
    const { trainNo } = useParams();
    const navigate = useNavigate();
    const [trainData, setTrainData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrainDetails = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': 'xyz',
                    'x-rapidapi-host': 'irctc-train-api.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(`https://irctc-train-api.p.rapidapi.com/api/v1/train-details?trainNo=${trainNo}`, options);
                const result = await response.json();

                if (result.status === true) {
                    // API returns an array of trains, take the first one
                    setTrainData(Array.isArray(result.data) ? result.data[0] : result.data);
                } else {
                    setError(result.message || 'Failed to fetch train details');
                }
            } catch {
                setError('Network error or invalid API key');
            } finally {
                setLoading(false);
            }
        };

        if (trainNo) {
            fetchTrainDetails();
        }
    }, [trainNo]);

    if (loading) {
        return (
            <div className="container">
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Loading details for Train {trainNo}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                    <p>Error: {error}</p>
                    <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => navigate('/')} style={{ color: 'white', background: 'none', fontSize: '1.2rem' }}>←</button>
                <h1>Train Details</h1>
            </div>

            <div style={{ padding: '1rem' }}>
                {trainData && (
                    <div style={{
                        background: '#fff',
                        padding: '1rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ margin: 0, color: '#2196F3' }}>{trainData.trainNumber}</h2>
                            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{trainData.trainName}</span>
                        </div>

                        {/* Basic Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>From</div>
                                <div style={{ fontWeight: 'bold' }}>{trainData.schedule?.origin?.name || trainData.source}</div>
                                <div style={{ fontSize: '0.8rem', color: '#999' }}>{trainData.schedule?.departureTime}</div>
                            </div>
                            <div style={{ textAlign: 'center', alignSelf: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#999' }}>{trainData.schedule?.duration}</div>
                                <div style={{ fontSize: '1.2rem' }}>➔</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>To</div>
                                <div style={{ fontWeight: 'bold' }}>{trainData.schedule?.destination?.name || trainData.destination}</div>
                                <div style={{ fontSize: '0.8rem', color: '#999' }}>{trainData.schedule?.arrivalTime}</div>
                            </div>
                        </div>

                        {/* Running Days */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Running Days</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {trainData.schedule?.runningDays && Object.entries(trainData.schedule.runningDays).map(([day, runs]) => (
                                    <span key={day} style={{
                                        color: runs ? '#fff' : '#ccc',
                                        backgroundColor: runs ? '#4CAF50' : '#f0f0f0',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: runs ? 'bold' : 'normal'
                                    }}>
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Classes */}
                        {trainData.inventory && (
                            <div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Available Classes</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {trainData.inventory.map((cls, idx) => (
                                        <div key={idx} style={{
                                            border: '1px solid #ddd',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            minWidth: '60px'
                                        }}>
                                            <div style={{ fontWeight: 'bold', color: '#2196F3' }}>{cls.className}</div>
                                            {cls.fare > 0 && <div style={{ fontSize: '0.8rem' }}>₹{cls.fare}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate(`/live-status/${trainData.trainNumber}`)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                marginTop: '1.5rem',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Check Live Status
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainDetails;

