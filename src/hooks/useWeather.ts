import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

export const useWeather = () => {
  const [weather, setWeather] = useState<{ text: string; icon: string; bg: string }>({
    text: 'CPT: Loading...',
    icon: 'sunny',
    bg: ''
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.92&longitude=18.42&current_weather=true');
        const data: WeatherData = await res.json();
        const isRain = data.current_weather.weathercode >= 51;
        
        setWeather({
          text: isRain ? "CPT: RAIN" : "CPT: SUNNY",
          icon: isRain ? "rainy" : "sunny",
          bg: isRain 
            ? "/gen?prompt=moody+south+african+township+street+scene+with+rain+slicked+roads+and+neon+lights+cyberpunk+afrofuturist+style&aspect=16:9"
            : "/gen?prompt=vibrant+south+african+township+street+scene+with+corrugated+iron+shacks+and+taxi+vans+sunny+day+flat+vector+art+afrofuturist+style&aspect=16:9"
        });
      } catch (e) {
        console.log("Weather offline");
        setWeather({
          text: 'CPT: SUNNY',
          icon: 'sunny',
          bg: "/gen?prompt=vibrant+south+african+township+street+scene+with+corrugated+iron+shacks+and+taxi+vans+sunny+day+flat+vector+art+afrofuturist+style&aspect=16:9"
        });
      }
    };

    fetchWeather();
  }, []);

  return weather;
};