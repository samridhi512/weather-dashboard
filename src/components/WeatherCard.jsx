const WeatherCard = ({ data }) => {
    const { name, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  
    return (
      <div className="bg-white p-6 rounded shadow-md text-center w-72">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <img src={iconUrl} alt="weather icon" className="mx-auto" />
        <p className="text-xl">{weather[0].main}</p>
        <p>Temperature: {main.temp}°C</p>
        <p>Humidity: {main.humidity}%</p>
        <p>Wind Speed: {wind.speed} km/h</p>
      </div>
    );
  };
  
  export default WeatherCard;