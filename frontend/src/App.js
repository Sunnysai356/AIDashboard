// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2'; // Import multiple chart types
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [credits, setCredits] = useState([]);
  const [prediction, setPrediction] = useState(0);
  const [chartType, setChartType] = useState('bar'); // Default chart type

  useEffect(() => {
    // Fetch credits data
    axios.get('http://localhost:5010/api/credits')
      .then(res => setCredits(res.data));

    // Fetch prediction
    axios.get('http://localhost:5010/api/predict')
      .then(res => setPrediction(res.data.prediction));
  }, []);

  // Chart data
  const chartData = {
    labels: credits.map(c => c.credit_id),
    datasets: [{
      label: 'Points Earned',
      data: credits.map(c => c.points_earned),
      backgroundColor: chartType === 'pie' ? [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ] : 'rgba(75, 192, 192, 0.6)', // Different colors for pie chart
    }]
  };

  // Render the selected chart
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} />;
      case 'line':
        return <Line data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      default:
        return <Bar data={chartData} />;
    }
  };

  return (
    <div>
      <h1>Sustainability Dashboard</h1>

      {/* Chart Type Selector */}
      <div>
        <label>Select Chart Type: </label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {/* Chart Container */}
      <div style={{ width: '600px', marginTop: '20px' }}>
        {renderChart()}
      </div>

      {/* Prediction and Credits List */}
      <h3>Predicted 2023 Score for AC-1: {prediction.toFixed(2)}</h3>
      <div>
        {credits.map(credit => (
          <div key={credit._id}>
            <h4>{credit.credit_id}: {credit.description}</h4>
            <p>Score: {credit.points_earned}/{credit.points_possible}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;