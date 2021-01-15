import React, {useState} from 'react'; // allows me to have state variables in functional components
import '../Styles/Weather.css'; // import of style sheet
import WeatherInfo from './WeatherInfo'; //importing the data displayed from api

function WeatherContainer() {
    //Api key variable is used when I am fetching the API. The purpose is to track my usage of the API
    const API_KEY = 'c7c3ad8358cc48b3b530be00380a9763';
    const [searchQuery, setSearchQuery] = useState('');
    const [weatherData, setWeatherData] = useState({
        temp: null,
        humidity: null,
        desc: null,
        city: null

    });

    const [isValidZipCode, setIsValidZipCode] = useState(true);

    // this function is used to determine whether the user's input for the zip code is valid
    function  updateSearchQuery(event){
        let zipCode= event.target.value;
        let isValid= validateZipCode(zipCode);
        setSearchQuery(zipCode);
        
        if (isValid || zipCode=== "" || isValid.length === 5 ) {
            setIsValidZipCode(true);
        } else {
            setIsValidZipCode(false);
        }
        
    }

    // Regex validation to make sure that the user's input is 5 numbers
    function validateZipCode(zipcode) {
        let regex = /[0-9]{5}/;
            return regex.test(zipcode);
    }

    // if the zip code is valid, return the weather API

    function getWeatherData() {
        if (!isValidZipCode || searchQuery === "") {
            setIsValidZipCode(false);
            return;

        }
        fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${searchQuery},us&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => setWeatherData ({
            temp: convertToFarenheit(data.main.temp),  // this is how I was able to retreive the data. This code was given to me from the API's website
            humidity: data.main.humidity,
            desc: data.weather[0].main,
            city: data.name
        }));

    }


    // API returned the temparature in Celcius. This function converts the temperature to Farenheit
    function convertToFarenheit(temp) {
        return((temp - 273.15) *(9.0/5.0) +32).toFixed(0);
    }
    // It is returning the title "Weather", an input for the zip code, and the message "no weather to display if the user has not searched with a valid zip code"

    // line 84 uses the ternary operator to decide whether or not to display the message if a valid zip code is not entered

    // line 91 is rendering the Weather Info component that displays the weather data from the API
    return (
        <section className= "weather-container">
            <header className="weather-header">
                <h3>Weather</h3>
                <div>

                    <input 
                        placeholder='Enter a Zip Code'
                        className= "search-input"
                        onChange={updateSearchQuery}
                        maxLength='5'
                    />
                    <button onClick={getWeatherData}
                    className="material-icons">search</button>
                </div>
            </header>
            <p className="error">{isValidZipCode ? '' : 'Invalid Zip Code'}</p>
            <section className="weather-info">
                {weatherData.temp === null ? (
                    <p>No Weather to Display
                     <i className="material-icons">wb_sunny</i>       
                    </p>
                    
                ) : <WeatherInfo data={weatherData} />
            }
            </section>
        </section>

    )

}

export default WeatherContainer;
