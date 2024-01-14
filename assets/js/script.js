/* User Story
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly

Acceptance Criteria
Create a weather dashboard with form inputs.
When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
When a user views the current weather conditions for that city they are presented with:
The city name
The date
An icon representation of weather conditions
The temperature
The humidity
The wind speed
When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
The date
An icon representation of weather conditions
The temperature
The humidity
When a user click on a city in the search history they are again presented with current and future conditions for that city
 */
const apiURL = `https://api.openweathermap.org/data/2.5/weather?`;

// API key
const APIKey = "0e30f3273392b0602beedb3cf58693bd";
let userInputCity = "";
let queryURL;


$("#search-form").on("submit", function (e) {
    e.preventDefault();

// URL we need to query the database

userInputCity = $("#search-input").val();

queryURL = `${apiURL}q=${userInputCity}&appid=${APIKey}`;

console.log('query: ', queryURL)



// This queryURL grabs the coordinates of the specified city to use in the newQueryUrl and then we grab the data from the newQueryUrl. This is beacuse the queryURL system of getting data from the website is deprecated.

// We then created a Fetch call
fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {


        // Added metric parameter to use Celsius Degree

        const newQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${APIKey}`

        fetch(newQueryUrl)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log(data)
            })

            .catch(function (error) {
                console.error('Error during fetch:', error);
            })  
            
        console.log('query: ', newQueryUrl)

    })

    .catch(function (error) {
        console.error('Error during fetch:', error);
    });
    
})