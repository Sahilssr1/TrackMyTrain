import React, { useEffect, useState, useRef } from 'react';
import './StatusTimeline.css';

const StatusTimeline = ({ schedule, trainName, trainNo }) => {
    // Helper to parse "HH:MM" to minutes from midnight
    const getMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000); // Update every 30s
        return () => clearInterval(timer);
    }, []);

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const currentStationRef = useRef(null);

    // Find the current position of the train
    let lastDepartedIndex = -1;

    // First pass: find the last station the train has departed from
    for (let i = 0; i < schedule.length; i++) {
        const stop = schedule[i];
        const estDep = stop.estimatedDepartureTime || stop.departure || stop.scheduledDepartureTime;
        const depMin = getMinutes(estDep);

        if (currentMinutes >= depMin) {
            lastDepartedIndex = i;
        }
    }

    // Auto-scroll to current station on mount/update
    useEffect(() => {
        if (currentStationRef.current) {
            currentStationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [lastDepartedIndex, schedule]);

    return (
        <div className="timeline-container">
            <div className="train-header">
                <h2>{trainName}</h2>
                <p>{trainNo}</p>
            </div>

            <div className="timeline">
                {schedule.map((stop, index) => {
                    const stationName = stop.stationName || stop.stationCode;
                    const stationCode = stop.stationCode;
                    const distance = stop.distanceFromSourceKm !== undefined ? stop.distanceFromSourceKm : stop.distance;

                    const schArr = stop.scheduledArrivalTime || stop.arrival;
                    const estArr = stop.estimatedArrivalTime || schArr;
                    const schDep = stop.scheduledDepartureTime || stop.departure;
                    const estDep = stop.estimatedDepartureTime || schDep;

                    const delay = stop.delayInMinutes || 0;

                    // Determine status relative to train position
                    const isPast = index <= lastDepartedIndex;
                    const isCurrent = index === lastDepartedIndex;
                    const isNext = index === lastDepartedIndex + 1;

                    // Check if train is moving between this station and the next
                    const isMoving = isCurrent && index < schedule.length - 1;

                    return (
                        <div
                            key={stationCode}
                            className="timeline-item"
                            ref={isCurrent ? currentStationRef : null}
                        >
                            <div className="time-col">
                                <div className="time arrival">
                                    <span className="label">Arr</span>
                                    <span className={delay > 0 ? 'delayed' : ''}>{estArr}</span>
                                    {delay > 0 && <span className="scheduled">{schArr}</span>}
                                </div>
                                <div className="time departure">
                                    <span className="label">Dep</span>
                                    <span className={delay > 0 ? 'delayed' : ''}>{estDep}</span>
                                    {delay > 0 && <span className="scheduled">{schDep}</span>}
                                </div>
                            </div>

                            <div className="line-col">
                                {/* Line connecting to next station */}
                                <div className={`line ${isPast ? 'active' : ''}`}></div>

                                {/* Station Dot */}
                                <div className={`dot ${isPast ? 'filled' : ''} ${isCurrent ? 'pulsing' : ''}`}></div>

                                {/* Moving Train Icon (only show if moving to next) */}
                                {isMoving && (
                                    <div className="train-icon-container" style={{ top: '70%' }}>
                                        <span className="train-icon">🚆</span>
                                    </div>
                                )}
                            </div>

                            <div className="station-col">
                                <div className="station-name">{stationName} ({stationCode})</div>
                                <div className="station-dist">{distance} km</div>
                                {isCurrent && <div className="live-tag">Train is here / Departed</div>}
                                {delay > 0 && <div className="delay-tag">Delayed by {delay} min</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatusTimeline;
