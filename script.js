        const API_KEY = 'fa8d62022a0c452f8f1141338252508';
        const API_URL = 'https://api.weatherapi.com/v1/current.json';

        const cityInput = document.getElementById('cityInput');
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const weatherInfo = document.getElementById('weatherInfo');
        const body = document.body;

        // Weather icons mapping
        const weatherIcons = {
            'sunny': 'fas fa-sun',
            'clear': 'fas fa-sun',
            'partly cloudy': 'fas fa-cloud-sun',
            'cloudy': 'fas fa-cloud',
            'overcast': 'fas fa-cloud',
            'mist': 'fas fa-smog',
            'patchy rain possible': 'fas fa-cloud-rain',
            'patchy snow possible': 'fas fa-snowflake',
            'patchy sleet possible': 'fas fa-cloud-rain',
            'patchy freezing drizzle possible': 'fas fa-cloud-rain',
            'thundery outbreaks possible': 'fas fa-bolt',
            'blowing snow': 'fas fa-wind',
            'blizzard': 'fas fa-snowflake',
            'fog': 'fas fa-smog',
            'freezing fog': 'fas fa-smog',
            'patchy light drizzle': 'fas fa-cloud-drizzle',
            'light drizzle': 'fas fa-cloud-drizzle',
            'freezing drizzle': 'fas fa-cloud-rain',
            'heavy freezing drizzle': 'fas fa-cloud-rain',
            'patchy light rain': 'fas fa-cloud-rain',
            'light rain': 'fas fa-cloud-rain',
            'moderate rain at times': 'fas fa-cloud-rain',
            'moderate rain': 'fas fa-cloud-rain',
            'heavy rain at times': 'fas fa-cloud-showers-heavy',
            'heavy rain': 'fas fa-cloud-showers-heavy',
            'light freezing rain': 'fas fa-cloud-rain',
            'moderate or heavy freezing rain': 'fas fa-cloud-showers-heavy',
            'light sleet': 'fas fa-cloud-rain',
            'moderate or heavy sleet': 'fas fa-cloud-rain',
            'patchy light snow': 'fas fa-snowflake',
            'light snow': 'fas fa-snowflake',
            'patchy moderate snow': 'fas fa-snowflake',
            'moderate snow': 'fas fa-snowflake',
            'patchy heavy snow': 'fas fa-snowflake',
            'heavy snow': 'fas fa-snowflake',
            'ice pellets': 'fas fa-icicles',
            'light rain shower': 'fas fa-cloud-rain',
            'moderate or heavy rain shower': 'fas fa-cloud-showers-heavy',
            'torrential rain shower': 'fas fa-cloud-showers-heavy',
            'light sleet showers': 'fas fa-cloud-rain',
            'moderate or heavy sleet showers': 'fas fa-cloud-rain',
            'light snow showers': 'fas fa-snowflake',
            'moderate or heavy snow showers': 'fas fa-snowflake',
            'patchy light rain with thunder': 'fas fa-bolt',
            'moderate or heavy rain with thunder': 'fas fa-bolt',
            'patchy light snow with thunder': 'fas fa-bolt',
            'moderate or heavy snow with thunder': 'fas fa-bolt'
        };

        // Background themes based on weather conditions
        function getWeatherTheme(condition, isDay) {
            const lowerCondition = condition.toLowerCase();
            
            if (!isDay) return 'night';
            
            if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
                return 'sunny';
            } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('thunder')) {
                return 'rainy';
            } else if (lowerCondition.includes('snow') || lowerCondition.includes('sleet') || lowerCondition.includes('blizzard')) {
                return 'snowy';
            } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast') || lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
                return 'cloudy';
            }
            
            return 'sunny'; // default
        }

        // Create floating particles
        function createParticles() {
            const particles = document.querySelector('.particles');
            particles.innerHTML = '';
            
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                particles.appendChild(particle);
            }
        }

        // Show loading state
        function showLoading() {
            loading.style.display = 'block';
            error.style.display = 'none';
            weatherInfo.style.display = 'none';
        }

        // Hide loading state
        function hideLoading() {
            loading.style.display = 'none';
        }

        // Show error message
        function showError(message) {
            error.textContent = message;
            error.style.display = 'block';
            weatherInfo.style.display = 'none';
            hideLoading();
        }

        // Update weather display
        function updateWeatherDisplay(data) {
            const { location, current } = data;
            
            // Update basic info
            document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
            document.getElementById('weatherDesc').textContent = current.condition.text;
            document.getElementById('tempMain').textContent = `${Math.round(current.temp_c)}°C`;
            
            // Update weather icon
            const iconClass = weatherIcons[current.condition.text.toLowerCase()] || 'fas fa-sun';
            document.getElementById('weatherIcon').className = `weather-icon ${iconClass}`;
            
            // Update details
            document.getElementById('feelsLike').textContent = `${Math.round(current.feelslike_c)}°C`;
            document.getElementById('humidity').textContent = `${current.humidity}%`;
            document.getElementById('windSpeed').textContent = `${current.wind_kph} km/h`;
            document.getElementById('pressure').textContent = `${current.pressure_mb} mb`;
            document.getElementById('visibility').textContent = `${current.vis_km} km`;
            document.getElementById('uvIndex').textContent = current.uv;
            
            // Update background theme
            const theme = getWeatherTheme(current.condition.text, current.is_day);
            body.className = theme;
            
            // Show weather info
            weatherInfo.style.display = 'block';
            hideLoading();
        }

        // Fetch weather data
        async function fetchWeather(city) {
            showLoading();
            
            try {
                const response = await fetch(`${API_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`);
                
                if (!response.ok) {
                    throw new Error('City not found');
                }
                
                const data = await response.json();
                updateWeatherDisplay(data);
                
            } catch (err) {
                showError('City not found. Please check the spelling and try again.');
            }
        }

        // Event listeners
        searchBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeather(city);
            } else {
                showError('Please enter a city name');
            }
        });

        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });

        // Initialize particles and default city
        createParticles();
        fetchWeather('London'); // Default city

        // Recreate particles when theme changes
        const observer = new MutationObserver(() => {
            createParticles();
        });
        observer.observe(body, { attributes: true, attributeFilter: ['class'] });
