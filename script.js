'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout{
    date = new Date();
    id  =(Date.now() + '').slice(-10);
    constructor(coords, distance, duration) {
        this.coords = coords; // we need an arrary of [lat, lng]
        this.distance = distance;  // in km
        this.duration = duration;  // in min
    }
}
    class Running extends Workout{
        constructor(coords, distance, duration, cadence){
            super(coords, distance, duration);
            this.cadence = cadence;
            this.calcPace();
        }

        calcPace(){
            // min/km
            this.pace = this.duration / this.distance;
            return this.pace;
        }
    }
    class Cycling extends Workout{
        constructor(coords, distance, duration, elevationGain){
            super(coords, distance, duration);
            this.elevationGain = elevationGain;
            this.calcSpeed();
        }

        calcSpeed() {
        //  km/hr
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
        }
    }

    // const run1 = new Running([39, -12], 5.2, 24, 178);
    // const cycling1 = new Cycling([39, -12], 27, 95, 523);

///////////////////////////////////////////////////////////////////////////////////
    // APPLICATION ARCHITECURE
    const form = document.querySelector('.form');
    const containerWorkouts = document.querySelector('.workouts');
    const inputType = document.querySelector('.form__input--type');
    const inputDistance = document.querySelector('.form__input--distance');
    const inputDuration = document.querySelector('.form__input--duration');
    const inputCadence = document.querySelector('.form__input--cadence');
    const inputElevation = document.querySelector('.form__input--elevation');

    class App {
        #map;
        #mapEvent;
        #workouts = [];

        constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElavationField);
        }

            _getPosition(){
        if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
            alert('could not get your position');
        });

        }

        _loadMap(position){
                const {latitude} = position.coords;
                const {longitude} = position.coords;
                console.log(`https://www.google.ng/maps/${latitude},${longitude}`);    
            
                // creating our own latitude and longitude
                const coords = [latitude, longitude]
            
                this.#map = L.map('map').setView(coords, 13);
            
                    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(this.#map);
            
                    // Handling clicks on map
                    this.#map.on('click', this._showForm.bind(this));
        }

        _showForm(mapE){
            this.#mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();
        }
        _toggleElavationField(){
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
        }
        _newWorkout(e){
            const validInputs = (...inputs) => 
            inputs.every(inp => Number.isFinite(inp));
            const allPosition = (...inputs) => inputs.every(inp => inp > 0);
            e.preventDefault();

            // Get data from form
            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value;
            const {lat, lng} = this.#mapEvent.latlng;
            let workout;
            
            // if workout running, create a running object
            if(type === 'running') {
                const cadence = +inputCadence.value;
                // check id data is valid

                if(
                //     !Number.isFinite(distance) ||
                //  !Number.isFinite(duration) || 
                //  !Number.isFinite(cadence)
                !validInputs(distance, duration, cadence) ||
                !allPosition(distance, duration, cadence)
                 ) 
                return alert('Inputs have to be positive numbers');

             workout = new Running([lat, lng], distance, duration, cadence);
                
            }

            // if workout cycling, create a cycling object
            if(type === 'cycling') {
                const elevation = +inputElevation.value;
                
                if(
                    !validInputs(distance, duration, elevation) ||
                    !allPosition(distance, duration, cadence)
                  ) 
                    return alert('Inputs have to be positive numbers');
             workout = new Cycling([lat, lng], distance, duration, elevation);

                }

            // Add new object to workout array
            this.#workouts.push(workout);

            // Render workout on map as marker
             
            L.marker([lat, lng])
                .addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnclick: false,
                    className: 'running-popup',
                })
                )
                .setPopupContent('Workout')
                .openPopup();
    

            // Render workout on list 

            // Hide form + clear input fields


            // clear input fields
            inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
      }     
    }

        const app = new App();





