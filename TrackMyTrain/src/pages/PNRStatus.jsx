import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const PNRStatus = () => {
    const { pnr } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

        async function fetchPNRStatus() {
            const cacheKey = `pnr_status_v2_${pnr}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    setData(data);
                    setLoading(false);
                    return;
                }
            }

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '37ebc84f84msh613d7f90a99435ap1c6b05jsn6577228717bd',
                    'x-rapidapi-host': 'irctc-train-api.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(`https://irctc-train-api.p.rapidapi.com/api/v1/pnr-status?pnrNo=${pnr}`, options);

                setError('Network error or invalid API key');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (pnr) {
            fetchPNRStatus();
        }
    }, [pnr]);

    if (loading) {
        return (
            <div className="container">
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Fetching PNR Status for {pnr}...</p>
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
                <h1>PNR Status</h1>
            </div>

            <div style={{ padding: '1rem' }}>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#2196F3', marginBottom: '0.5rem' }}>{data.trainName} ({data.trainNumber})</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555' }}>
                        <div>
                            <strong>From:</strong> {data.from.name} ({data.from.code})
                        </div>
                        <div>
                            <strong>To:</strong> {data.to.name} ({data.to.code})
                        </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <strong>Date of Journey:</strong> {data.boardingDay}
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Passenger Status</h3>
                    {data.passengers && data.passengers.map((passenger, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f5f5f5' }}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>Passenger {passenger.id}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: (passenger.currentStatus === 'CNF' || passenger.currentStatus === 'Confirmed') ? 'green' : 'orange', fontWeight: 'bold' }}>
                                    {passenger.currentStatus}
                                </div>
                                {(passenger.currentStatus === 'CNF' || passenger.currentStatus === 'Confirmed') && (
                                    <div style={{ fontSize: '0.8rem', color: '#777' }}>
                                        {passenger.coachBerthRaw || `${passenger.coach || ''} ${passenger.berth || ''}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PNRStatus;
