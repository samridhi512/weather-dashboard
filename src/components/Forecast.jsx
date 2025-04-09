import React from "react";

const Forecast = ({ data, darkTheme }) => {
  // Group forecast data by day
  const groupedByDay = {};
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    
    groupedByDay[day].push(item);
  });
  
  // Get daily average/max/min
  const dailyData = Object.keys(groupedByDay).map(day => {
    const items = groupedByDay[day];
    
    // Find max temp for the day
    const maxTemp = Math.max(...items.map(item => item.main.temp_max));
    // Find min temp for the day
    const minTemp = Math.min(...items.map(item => item.main.temp_min));
    // Use noon forecast or the middle forecast for the day for icon/description
    const middleIndex = Math.floor(items.length / 2);
    const representativeItem = items[middleIndex];
    
    return {
      day,
      maxTemp,
      minTemp,
      icon: representativeItem.weather[0].icon,
      description: representativeItem.weather[0].description
    };
  }).slice(0, 5); // Ensure we only show 5 days
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
      {dailyData.map((day, index) => (
        <div key={index} className={`p-4 rounded-md shadow-sm text-center ${darkTheme ? 'bg-gray-800' : 'bg-white'}`}>
          <p className="font-semibold">{day.day}</p>
          <img 
            src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
            alt={day.description} 
            className="mx-auto h-12 w-12" 
          />
          <p className="text-sm mb-1">{day.description}</p>
          <div className="flex justify-around">
            <span className="font-bold">{Math.round(day.maxTemp)}°</span>
            <span className="opacity-75">{Math.round(day.minTemp)}°</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forecast;
