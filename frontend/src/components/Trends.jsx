import React, { useEffect, useState } from 'react';
// import { fetchTrendsData } from '../utils/api';
import './Analytics.css';

const Trends = () => {
    // const [trends, setTrends] = useState([]);

    // useEffect(() => {
    //     const getTrends = async () => {
    //         const data = await fetchTrendsData();
    //         setTrends(data);
    //     };
    //     getTrends();
    // }, []);

    return (
        <div className="trends">
            <h2>Trends</h2>
            {/* Render trends here if needed */}
            <p>Trends feature is currently disabled.</p>
        </div>
    );
};

export default Trends;