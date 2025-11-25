import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { stations, trains as mockTrains, schedules } from '../data/mockData';

const TrainResults = () => {
    const [searchParams] = useSearchParams();
    const fromStation = searchParams.get('from');
    const toStation = searchParams.get('to');
    const dateParam = searchParams.get('date');
    const navigate = useNavigate();

    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);

    const getMockTrains = (from, to) => {
        const foundTrains = mockTrains.filter(t => t.from === from && t.to === to);
        return foundTrains.map(t => {
            const schedule = schedules[t.number] || [];
            const fromStop = schedule.find(s => s.stationCode === from);
            const toStop = schedule.find(s => s.stationCode === to);
            const fromStationName = stations.find(s => s.code === from)?.name || from;
            const toStationName = stations.find(s => s.code === to)?.name || to;

            return {
                trainNumber: t.number,
                trainName: t.name,
                schedule: {
                    departureTime: fromStop ? fromStop.departure : '00:00',
                    arrivalTime: toStop ? toStop.arrival : '00:00',
                    duration: '24 h 00 min',
                    origin: { code: from, name: fromStationName },
                    destination: { code: to, name: toStationName },
                    runningDays: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: true }
                },
                train_type: 'EXP'
            };
        });
    };

    const formatDate = (dateStr) => {
        const today = new Date();
        if (!dateStr || dateStr === 'All Dates' || dateStr === 'Today') {
            return `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
        } else if (dateStr === 'Tomorrow') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return `${tomorrow.getDate().toString().padStart(2, '0')}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getFullYear()}`;
        } else {
            // Assuming Custom date is YYYY-MM-DD from input type="date", convert to DD-MM-YYYY
            const [year, month, day] = dateStr.split('-');
            return `${day}-${month}-${year}`;
        }
    };

    useEffect(() => {
        const fetchTrains = async () => {
            const formattedDate = formatDate(dateParam);
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '',
                    'x-rapidapi-host': 'irctc-train-api.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(`https://irctc-train-api.p.rapidapi.com/api/v1/trains-between-stations?startStationCode=${fromStation}&endStationCode=${toStation}&date=${formattedDate}`, options);

                if (response.status === 429) {
                    throw new Error('Rate limit exceeded');
                }

                const result = await response.json();

                if (result.status === true && Array.isArray(result.data)) {
                    setTrains(result.data);
                } else {
                    // If data is missing or not an array, check if it's just no trains found
                    if (result.status === true && !result.data) {
                        setTrains([]);
                    } else {
                        throw new Error(result.message || 'Failed to fetch trains');
                    }
                }
            } catch (err) {
                console.warn('API failed, falling back to mock data:', err);
                const fallbackData = getMockTrains(fromStation, toStation);
                setTrains(fallbackData);
                setUsingMockData(true);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        if (fromStation && toStation) {
            fetchTrains();
        }
    }, [fromStation, toStation, dateParam]);

    const cleanDuration = (duration) => {
        if (!duration) return '--';
        // Fix for repeated duration string like "00 h 10 min00 h 10 min..."
        // Just take the first occurrence of "xx h xx min"
        const match = duration.match(/\d+\s*h\s*\d+\s*min/);
        return match ? match[0] : duration;
    };

    if (loading) {
        return (
            <div className="container">
                <Header />
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Searching trains from {fromStation} to {toStation}...</p>
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
                <h1>Search Results</h1>
            </div>

            <div style={{ padding: '1rem' }}>
                {usingMockData && (
                    <div style={{
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        border: '1px solid #ffeeba',
                        fontSize: '0.9rem'
                    }}>
                        ⚠️ API limit reached. Showing offline results.
                    </div>
                )}
                <p style={{ marginBottom: '1rem', color: '#666' }}>
                    {trains.length} trains found from <strong>{fromStation}</strong> to <strong>{toStation}</strong>
                </p>

                {trains.map((train, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(`/live-status/${train.trainNumber}`)}
                        style={{
                            background: '#fff',
                            padding: '1rem',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            marginBottom: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', color: '#2196F3', margin: 0 }}>{train.trainNumber}</h3>
                            <span style={{ fontSize: '0.8rem', background: '#e3f2fd', color: '#1976d2', padding: '2px 6px', borderRadius: '4px' }}>
                                {train.train_type || 'EXP'}
                            </span>
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>{train.trainName}</h4>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{train.schedule?.departureTime}</div>
                                <div style={{ fontSize: '0.8rem', color: '#777' }}>
                                    {train.schedule?.origin?.name} ({train.schedule?.origin?.code})
                                </div>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#999', borderBottom: '1px dashed #ccc', paddingBottom: '2px' }}>
                                {cleanDuration(train.schedule?.duration)}
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{train.schedule?.arrivalTime}</div>
                                <div style={{ fontSize: '0.8rem', color: '#777' }}>
                                    {train.schedule?.destination?.name} ({train.schedule?.destination?.code})
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#555', display: 'flex', gap: '4px' }}>
                            <span>Runs:</span>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <span key={day} style={{
                                    color: train.schedule?.runningDays?.[day] ? '#4CAF50' : '#ccc',
                                    fontWeight: train.schedule?.runningDays?.[day] ? 'bold' : 'normal'
                                }}>
                                    {day[0]}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainResults;

