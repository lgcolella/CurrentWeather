import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import './style.scss';
import $ from 'jquery';
const apiKey = 'b833ce501ff196a419ba285594863c6c';
//import cityList from './city.list.js';


$(document).ready(() => {

    const STATE = (function(){
        
        let props = {
            apiUrl: 'http://api.openweathermap.org/data/2.5/',
            searchBox: $('#search-input'),
            searchSubmit: $('#search-input-submit'),
            weatherTab: $('#weather-tabs'),
            cities: [],
            cookieValueName: 'cities',
            maxCookieTime: 1800000
        }

        return {
            get(prop){
                return props[prop];
            },

            set(prop, newValue){
                props[prop] = newValue;
                return props[prop];
            }
        }

    })();

    const funcs = {

        fetchData(city, cb){

            let apiUrl = STATE.get('apiUrl');
            let url = `${apiUrl}weather?q=${city}&units=metric&APPID=${apiKey}`;

            fetch(url)
            .then((resp) => { return resp.json() })
            .then((data) => { cb(data) })
            .catch((err) => { 
                alert(`Sorry, impossible find requested city: ${city}`);
             })

        },

        saveData(){
            let data = STATE.get('cities');
            let cookieValueName = STATE.get('cookieValueName');
            let timestamp = Date.now() + STATE.get('maxCookieTime');
            let cookieDate = new Date(timestamp);
            document.cookie = `${cookieValueName}=${encodeURI(JSON.stringify(data))}; expires= ${cookieDate}`
        },

        setData(){
            let cookie = document.cookie;
            if(cookie.trim() !== ''){
                let cookieValueName = STATE.get('cookieValueName');
                let data = cookie.split(`${cookieValueName}=`).slice(1);
                let cities = JSON.parse(decodeURI(data));
                cities.forEach((city) => {
                    weatherTab.add(city);
                });
            }
        }

    }

    const weatherTab = {

        element: STATE.get('weatherTab'),

        add(city){
            
            let newCities = STATE.get('cities');
            //Prevent pushing same city
            if(newCities.indexOf(city) === -1){
                newCities.push(city);
                STATE.set('cities', newCities );
                this.render();
                funcs.saveData();
            }

        },

        delete(city){

            STATE.set('cities', STATE.get('cities').filter((cityName) => {
                return cityName !== city;
            }));
            this.render();
            funcs.saveData();

        },

        render(){

            let cities = STATE.get('cities');
            this.element.empty();

            if(cities.length > 0){

                cities.forEach((city) => {

                    funcs.fetchData(city, (data) => {
                        
                        //To ensure to prevent duplicating in async env.
                        let bool = true;
                        this.element.children().each((index, element) => {
                            let elemCity = $(element).data().city;
                            if (elemCity === city){ bool = false };
                        });
                        if(bool){
                            let temp = data.main.temp;
                            let tab = $('<li>').data('city', city).append(
                                $('<div>').addClass('collapsible-header').append(
                                    $('<div>').addClass('left').css('width', '50%').append(
                                        $('<i>').addClass('material-icons').text('filter_drama'),
                                        city
                                    ),
                                    $('<div>').addClass('right').css('width', '50%').append(
                                        $('<button>').addClass('right btn waves-effect waves-light').text('Delete')
                                        .click(() => {
                                            this.delete(city);
                                        })
                                    )  
                                    
                                ),
                                $('<div>').addClass('collapsible-body').append(
                                    $('<span>').html(`Temperature at ${city} is: ${temp}&deg;`)
                                )
                            );

                            this.element.addClass('collapsible').append(tab);
                        }
                        
                    });
    
                });

            } else {
                this.element.removeClass('collapsible').append(
                    $('<i>').text('To insert a new city, fill the above input.')
                );
            }

        }

    }
    
    const init = {
        
        plugins(){
            
            M.Collapsible.init( STATE.get('weatherTab') );

        },

        events(){

            STATE.get('searchSubmit').click(() => {
                let city = STATE.get('searchBox').val().trim();
                weatherTab.add(city);
            });

        },

        run(){
            this.plugins();
            this.events();
            funcs.setData();
            weatherTab.render();
        }
    }

    init.run();

});