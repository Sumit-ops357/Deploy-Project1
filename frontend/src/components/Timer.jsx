import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(1500); // 25 minutes in seconds
    const [isBreak, setIsBreak] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 0) {
                        setIsBreak(!isBreak);
                        return isBreak ? 1500 : 300; // Switch between 25 min and 5 min
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (!isActive && time !== 1500) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, time, isBreak]);

    const handleStart = () => {
        setIsActive(true);
    };

    const handlePause = () => {
        setIsActive(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(1500);
        setIsBreak(false);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="timer">
            <h2>{isBreak ? 'Break Time' : 'Work Time'}</h2>
            <div className="time">{formatTime(time)}</div>
            <div className="controls">
                {!isActive ? (
                    <button onClick={handleStart}>Start</button>
                ) : (
                    <button onClick={handlePause}>Pause</button>
                )}
                <button onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};

export default Timer;