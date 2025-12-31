const API_KEY = '6d2d85099d5fffc5344fdb0bff628af0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const MOCK_DATA = {
    'Mumbai': {
        temp: 28,
        feels_like: 30,
        humidity: 65,
        wind_speed: 3.6,
        pressure: 1013,
        visibility: 10,
        description: 'Partly Cloudy',
        icon: '02d',
        sunrise: '06:45',
        sunset: '18:30',
        aqi: 3,
        pm25: 25.3,
        pm10: 42.7,
        o3: 18.5,
        cloudiness: 40,
        lat: 19.0760,
        lon: 72.8777,
        country: 'IN',
        dew_point: 21,
        rain: 0,
        snow: 0
    },
    'Delhi': {
        temp: 22,
        feels_like: 21,
        humidity: 45,
        wind_speed: 2.5,
        pressure: 1015,
        visibility: 12,
        description: 'Clear Sky',
        icon: '01d',
        sunrise: '06:40',
        sunset: '18:20',
        aqi: 4,
        pm25: 18.7,
        pm10: 35.2,
        o3: 15.8,
        cloudiness: 0,
        lat: 28.7041,
        lon: 77.1025,
        country: 'IN',
        dew_point: 18,
        rain: 0,
        snow: 0
    },
    'Bangalore': {
        temp: 24,
        feels_like: 23,
        humidity: 60,
        wind_speed: 2.8,
        pressure: 1012,
        visibility: 15,
        description: 'Mostly Sunny',
        icon: '01d',
        sunrise: '06:30',
        sunset: '18:45',
        aqi: 1,
        pm25: 15.2,
        pm10: 28.4,
        o3: 12.6,
        cloudiness: 10,
        lat: 12.9716,
        lon: 77.5946,
        country: 'IN',
        dew_point: 19,
        rain: 0,
        snow: 0
    },
    'London': {
        temp: 12,
        feels_like: 10,
        humidity: 82,
        wind_speed: 4.1,
        pressure: 1018,
        visibility: 8,
        description: 'Light Rain',
        icon: '10d',
        sunrise: '07:30',
        sunset: '16:20',
        aqi: 4,
        pm25: 32.4,
        pm10: 48.8,
        o3: 28.1,
        cloudiness: 90,
        lat: 51.5074,
        lon: -0.1278,
        country: 'GB',
        dew_point: 9,
        rain: 2.5,
        snow: 0
    },
    'New York': {
        temp: 18,
        feels_like: 16,
        humidity: 70,
        wind_speed: 3.2,
        pressure: 1016,
        visibility: 16,
        description: 'Partly Cloudy',
        icon: '02d',
        sunrise: '06:20',
        sunset: '19:45',
        aqi: 5,
        pm25: 45.8,
        pm10: 62.3,
        o3: 35.2,
        cloudiness: 30,
        lat: 40.7128,
        lon: -74.0060,
        country: 'US',
        dew_point: 12,
        rain: 0,
        snow: 0
    }
};

const elements = {
    citySearch: document.getElementById('city-search'),
    searchBtn: document.querySelector('.search-box'),
    searchButton: document.getElementById('search-button'),
    currentLocationBtn: document.getElementById('btn-current-location'),
    refreshBtn: document.getElementById('btn-refresh'),
    quickCities: document.querySelectorAll('.quick-city'),
    locationBadge: document.getElementById('current-location'),
    weatherStatus: document.querySelector('.weather-status span'),
    tempValue: document.getElementById('temp-value'),
    weatherIcon: document.getElementById('weather-icon-large'),
    weatherDesc: document.getElementById('weather-desc'),
    feelsLikeTemp: document.getElementById('feels-like-temp'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    unitBtns: document.querySelectorAll('.unit-btn'),
    forecastCards: document.getElementById('forecast-cards'),
    aqiBadge: document.getElementById('aqi-badge'),
    aqiIndicator: document.getElementById('aqi-indicator'),
    pm25Value: document.getElementById('pm25-value'),
    pm10Value: document.getElementById('pm10-value'),
    o3Value: document.getElementById('o3-value'),
    pm25Fill: document.getElementById('pm25-fill'),
    pm10Fill: document.getElementById('pm10-fill'),
    o3Fill: document.getElementById('o3-fill'),
    sunriseTime: document.getElementById('sunrise-time'),
    sunsetTime: document.getElementById('sunset-time'),
    dayLength: document.getElementById('day-length-value'),
    cloudiness: document.getElementById('cloudiness-value'),
    dewPoint: document.getElementById('dew-point'),
    rainVolume: document.getElementById('rain-volume'),
    snowVolume: document.getElementById('snow-volume'),
    hourlyScroll: document.getElementById('hourly-scroll'),
    mapLocation: document.getElementById('map-location'),
    mapCoordinates: document.getElementById('map-coordinates'),
    timeDisplay: document.querySelector('#time-display span'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    loadingOverlay: document.getElementById('loading-overlay'),
    themeToggle: document.getElementById('theme-toggle'),
    fabMenu: document.getElementById('fab-menu'),
    mobileMenu: document.getElementById('mobile-menu'),
    closeMenu: document.getElementById('close-menu'),
    menuItems: document.querySelectorAll('.menu-item'),
    navItems: document.querySelectorAll('.nav-item')
};

const state = {
    currentCity: 'Mumbai',
    currentUnit: 'celsius',
    isOnline: navigator.onLine,
    useMockData: false,
    theme: localStorage.getItem('theme') || 'light',
    currentCoords: { lat: 19.0760, lon: 72.8777 }
};

function initApp() {
    console.log('🚀 Weather App Initialized');
    
    setTheme(state.theme);
    
    updateTime();
    setInterval(updateTime, 1000);
    
    setTimeout(() => {
        loadWeatherData('Mumbai');
    }, 500);
    
    setupEventListeners();
    setupNetworkListeners();
    generateForecastCards();
    generateHourlyForecast();
}

function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    elements.timeDisplay.textContent = time;
}

function setupEventListeners() {
    elements.citySearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
    
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSearch();
    });
    
    elements.searchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSearch();
    });
    
    elements.currentLocationBtn.addEventListener('click', getCurrentLocation);
    
    elements.refreshBtn.addEventListener('click', () => {
        loadWeatherData(state.currentCity);
    });
    
    elements.quickCities.forEach(city => {
        city.addEventListener('click', () => {
            const cityName = city.dataset.city;
            elements.citySearch.value = cityName;
            loadWeatherData(cityName);
        });
    });
    
    elements.unitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.dataset.unit;
            if (unit !== state.currentUnit) {
                state.currentUnit = unit;
                updateUnitButtons();
                loadWeatherData(state.currentCity);
            }
        });
    });
    
    const viewMapBtn = document.getElementById('btn-view-map');
    if (viewMapBtn) {
        viewMapBtn.addEventListener('click', () => {
            const { lat, lon } = state.currentCoords;
            window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
        });
    }
    
    elements.fabMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    elements.closeMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    elements.menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            scrollToSection(section);
            toggleMobileMenu();
            
            elements.menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            item.classList.add('active');
            
            elements.navItems.forEach(navItem => {
                if (navItem.dataset.section === section) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            });
        });
    });
    
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            elements.menuItems.forEach(menuItem => {
                if (menuItem.dataset.section === section) {
                    menuItem.classList.add('active');
                } else {
                    menuItem.classList.remove('active');
                }
            });
            
            if (section === 'more') {
                toggleMobileMenu();
            } else {
                if (elements.mobileMenu.classList.contains('open')) {
                    toggleMobileMenu();
                }
                scrollToSection(section);
            }
        });
    });
    
    elements.themeToggle.addEventListener('change', toggleTheme);
    
    const viewForecastBtn = document.getElementById('view-forecast');
    if (viewForecastBtn) {
        viewForecastBtn.addEventListener('click', () => {
            scrollToSection('forecast');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (elements.mobileMenu.classList.contains('open') && 
            !elements.mobileMenu.contains(e.target) && 
            !elements.fabMenu.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.mobileMenu.classList.contains('open')) {
            toggleMobileMenu();
        }
    });
}

function setupNetworkListeners() {
    window.addEventListener('online', () => {
        state.isOnline = true;
        state.useMockData = false;
        showToast('Back online! Loading real data...');
        loadWeatherData(state.currentCity);
    });
    
    window.addEventListener('offline', () => {
        state.isOnline = false;
        state.useMockData = true;
        showToast('You are offline. Using mock data.', 'warning');
    });
}

function handleSearch() {
    const city = elements.citySearch.value.trim();
    if (city) {
        loadWeatherData(city);
        elements.citySearch.blur();
    } else {
        showToast('Please enter a city name', 'warning');
        elements.citySearch.focus();
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation not supported', 'warning');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            state.currentCoords = { lat: latitude, lon: longitude };
            
            if (!state.isOnline) {
                hideLoading();
                showToast('Cannot get location while offline', 'warning');
                return;
            }
            
            try {
                const response = await fetch(
                    `${GEO_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.length) {
                        const city = data[0].name;
                        elements.citySearch.value = city;
                        loadWeatherData(city);
                    } else {
                        showToast('Location not found', 'warning');
                        hideLoading();
                    }
                }
            } catch (error) {
                console.error('Location error:', error);
                showToast('Failed to get location', 'error');
                hideLoading();
            }
        },
        (error) => {
            hideLoading();
            showToast('Location access denied', 'warning');
        }
    );
}

async function loadWeatherData(city) {
    showLoading();
    state.currentCity = city;
    
    try {
        if (!state.isOnline || state.useMockData) {
            updateUIWithMockData(city);
            showToast(`Showing mock data for ${city}`, 'info');
        } else {
            await fetchRealWeatherData(city);
        }
    } catch (error) {
        console.error('Error loading weather:', error);
        updateUIWithMockData(city);
        showToast('Using mock data', 'info');
    } finally {
        setTimeout(() => {
            hideLoading();
        }, 800);
    }
}

async function fetchRealWeatherData(city) {
    try {
        const geoResponse = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );
        
        if (!geoResponse.ok) throw new Error('Geo API failed');
        
        const geoData = await geoResponse.json();
        if (!geoData.length) {
            showToast('City not found', 'warning');
            throw new Error('City not found');
        }
        
        const { lat, lon, name, country } = geoData[0];
        state.currentCoords = { lat, lon };
        
        const unit = state.currentUnit === 'celsius' ? 'metric' : 'imperial';
        const weatherResponse = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
        );
        
        if (!weatherResponse.ok) throw new Error('Weather API failed');
        
        const weatherData = await weatherResponse.json();
        
        updateUIWithRealData(weatherData, name, country);
        showToast(`Weather data loaded for ${name}`, 'success');
        
    } catch (error) {
        console.warn('Real API failed:', error);
        throw error;
    }
}

function updateUIWithRealData(data, cityName, country) {
    elements.locationBadge.textContent = `${cityName}, ${country}`;
    
    const temp = Math.round(data.main.temp);
    elements.tempValue.textContent = temp;
    elements.weatherStatus.textContent = `${temp}°${state.currentUnit === 'celsius' ? 'C' : 'F'}`;
    elements.feelsLikeTemp.textContent = Math.round(data.main.feels_like);
    
    const weather = data.weather[0];
    elements.weatherDesc.textContent = weather.description;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    const windSpeed = data.wind.speed;
    elements.windSpeed.textContent = state.currentUnit === 'celsius' 
        ? `${windSpeed.toFixed(1)} m/s` 
        : `${(windSpeed * 2.237).toFixed(1)} mph`;
    
    if (data.sys.sunrise) {
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        
        elements.sunriseTime.textContent = sunrise.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        elements.sunsetTime.textContent = sunset.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const dayLengthMs = data.sys.sunset - data.sys.sunrise;
        const hours = Math.floor(dayLengthMs / 3600);
        const minutes = Math.floor((dayLengthMs % 3600) / 60);
        elements.dayLength.textContent = `${hours}h ${minutes}m`;
    }
    
    elements.cloudiness.textContent = `${data.clouds?.all || 0}%`;
    
    const dewPoint = calculateDewPoint(data.main.temp, data.main.humidity);
    elements.dewPoint.textContent = `${Math.round(dewPoint)}°${state.currentUnit === 'celsius' ? 'C' : 'F'}`;
    
    elements.rainVolume.textContent = `${data.rain?.['1h'] || 0} mm`;
    elements.snowVolume.textContent = `${data.snow?.['1h'] || 0} mm`;
    
    updateMap(cityName, country, state.currentCoords.lat, state.currentCoords.lon);
    
    updateAQIWithMockData(cityName);
}

function updateUIWithMockData(city) {
    const data = MOCK_DATA[city] || MOCK_DATA['Mumbai'];
    
    state.currentCoords = { lat: data.lat, lon: data.lon };
    
    elements.locationBadge.textContent = `${city}, ${data.country}`;
    
    elements.tempValue.textContent = data.temp;
    elements.weatherStatus.textContent = `${data.temp}°${state.currentUnit === 'celsius' ? 'C' : 'F'}`;
    elements.feelsLikeTemp.textContent = data.feels_like;
    
    elements.weatherDesc.textContent = data.description;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    
    elements.humidity.textContent = `${data.humidity}%`;
    elements.pressure.textContent = `${data.pressure} hPa`;
    elements.visibility.textContent = `${data.visibility} km`;
    elements.windSpeed.textContent = `${data.wind_speed} m/s`;
    elements.cloudiness.textContent = `${data.cloudiness}%`;
    
    elements.sunriseTime.textContent = data.sunrise;
    elements.sunsetTime.textContent = data.sunset;
    elements.dayLength.textContent = '11h 45m';
    
    elements.dewPoint.textContent = `${data.dew_point}°${state.currentUnit === 'celsius' ? 'C' : 'F'}`;
    elements.rainVolume.textContent = `${data.rain || 0} mm`;
    elements.snowVolume.textContent = `${data.snow || 0} mm`;
    
    updateAQIWithMockData(city);
    
    updateMap(city, data.country, data.lat, data.lon);
}

function updateAQIWithMockData(city) {
    const data = MOCK_DATA[city] || MOCK_DATA['Mumbai'];
    
    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const aqiColors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336', '#7B1FA2'];
    const aqiIndex = data.aqi - 1;
    
    elements.aqiBadge.innerHTML = `
        <span class="aqi-value">${data.aqi}</span>
        <span class="aqi-label">${aqiLabels[aqiIndex] || 'Moderate'}</span>
    `;
    
    const positions = [0, 25, 50, 75, 100];
    elements.aqiIndicator.style.left = `${positions[aqiIndex] || 50}%`;
    
    document.querySelectorAll('.scale-item').forEach((item, index) => {
        item.classList.toggle('active', index === aqiIndex);
    });
    
    elements.pm25Value.textContent = `${data.pm25} µg/m³`;
    elements.pm10Value.textContent = `${data.pm10} µg/m³`;
    elements.o3Value.textContent = `${data.o3} µg/m³`;
    
    elements.pm25Fill.style.width = `${Math.min(data.pm25 / 50 * 100, 100)}%`;
    elements.pm10Fill.style.width = `${Math.min(data.pm10 / 100 * 100, 100)}%`;
    elements.o3Fill.style.width = `${Math.min(data.o3 / 50 * 100, 100)}%`;
}

function updateMap(city, country, lat, lon) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    const latAbs = Math.abs(lat).toFixed(2);
    const lonAbs = Math.abs(lon).toFixed(2);
    
    elements.mapLocation.textContent = `${city}, ${country}`;
    elements.mapCoordinates.textContent = `${latAbs}°${latDir}, ${lonAbs}°${lonDir}`;
    
    const mapBtn = document.getElementById('btn-view-map');
    if (mapBtn) {
        mapBtn.onclick = () => {
            window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
        };
    }
}

function generateForecastCards() {
    const forecastDays = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];
    const icons = ['02d', '03d', '10d', '01d', '02d'];
    const temps = [28, 29, 27, 30, 29];
    const descriptions = ['Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny', 'Partly Cloudy'];
    
    elements.forecastCards.innerHTML = '';
    
    forecastDays.forEach((day, index) => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${icons[index]}.png" alt="${descriptions[index]}">
            </div>
            <div class="forecast-temp">${temps[index]}°</div>
            <div class="forecast-desc">${descriptions[index]}</div>
        `;
        elements.forecastCards.appendChild(card);
    });
}

function generateHourlyForecast() {
    const hours = ['Now', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'];
    const temps = [28, 29, 30, 31, 30, 29, 28, 27];
    const icons = ['02d', '02d', '03d', '03d', '02d', '01d', '01d', '02d'];
    
    elements.hourlyScroll.innerHTML = '';
    
    hours.forEach((hour, index) => {
        const item = document.createElement('div');
        item.className = 'hourly-item';
        item.innerHTML = `
            <div class="hourly-time">${hour}</div>
            <div class="hourly-icon">
                <img src="https://openweathermap.org/img/wn/${icons[index]}.png" alt="">
            </div>
            <div class="hourly-temp">${temps[index]}°</div>
        `;
        elements.hourlyScroll.appendChild(item);
    });
}

function calculateDewPoint(temp, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
}

function updateUnitButtons() {
    elements.unitBtns.forEach(btn => {
        if (btn.dataset.unit === state.currentUnit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    document.querySelector('.temp-unit').textContent = state.currentUnit === 'celsius' ? '°C' : '°F';
}

function toggleMobileMenu() {
    const isOpen = elements.mobileMenu.classList.contains('open');
    
    if (isOpen) {
        elements.mobileMenu.classList.remove('open');
        elements.fabMenu.innerHTML = '<i class="fas fa-bars"></i>';
        elements.fabMenu.style.transform = 'rotate(0deg)';
    } else {
        elements.mobileMenu.classList.add('open');
        elements.fabMenu.innerHTML = '<i class="fas fa-times"></i>';
        elements.fabMenu.style.transform = 'rotate(90deg)';
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    elements.themeToggle.checked = theme === 'dark';
}

function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`);
}

function showToast(message, type = 'success') {
    const icon = type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 
                 'fa-check-circle';
    
    elements.toastMessage.textContent = message;
    elements.toast.querySelector('.toast-icon').className = `fas ${icon} toast-icon`;
    
    const toast = elements.toast;
    toast.style.background = type === 'error' ? 'var(--danger)' : 
                            type === 'warning' ? 'var(--warning)' : 
                            'var(--success)';
    toast.style.color = 'white';
    
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
        setTimeout(() => {
            toast.style.background = '';
            toast.style.color = '';
        }, 300);
    }, 3000);
}

function showLoading() {
    elements.loadingOverlay.classList.add('active');
}

function hideLoading() {
    elements.loadingOverlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', initApp);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
