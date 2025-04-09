import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import ThemeToggle from "./components/ThemeToggle";
import RecentSearches from "./components/RecentSearches";
import "./App.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [darkTheme, setDarkTheme] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("darkTheme");
    if (savedTheme) {
      setDarkTheme(JSON.parse(savedTheme));
    }
  }, []);

  // Update theme class on the body element
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
  }, [darkTheme]);

  const updateRecentSearches = (cityName) => {
    const updatedSearches = [cityName, ...recentSearches.filter(item => item !== cityName)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const API_KEY = "050e872f4fc1d4016a13436414218ec7"; // Replace with your API key
      
      // Fetch current weather data
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      setWeatherData(weatherResponse.data);
      setCity(cityName);
      updateRecentSearches(cityName);
      
      // Fetch 5-day forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      setForecastData(forecastResponse.data);
    } catch (err) {
      setError("City not found or API error. Please try again.");
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const refreshWeather = () => {
    if (city) {
      fetchWeather(city);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 ${darkTheme ? 'bg-gray-900 text-white' : 'bg-blue-100 text-gray-800'}`}>
      <header className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weather Dashboard</h1>
        <ThemeToggle darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </header>
      
      <div className="w-full max-w-3xl">
        <SearchBar onSearch={fetchWeather} />
        
        {recentSearches.length > 0 && (
          <RecentSearches searches={recentSearches} onSelect={fetchWeather} />
        )}
        
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        
        <div className="mt-6">
          {weatherData && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Current Weather</h2>
                <button 
                  onClick={refreshWeather}
                  className={`p-2 rounded-full ${darkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                  title="Refresh weather data"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <WeatherCard data={weatherData} darkTheme={darkTheme} />
            </div>
          )}
          
          {forecastData && (
            <div>
              <h2 className="text-xl font-semibold mb-2">5-Day Forecast</h2>
              <Forecast data={forecastData} darkTheme={darkTheme} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
