let activities = [],
    i = 0,
    destinationsInfo = [],
    waypoints = []
    isActivity = false,
    dayname,
    yourlocation,
    area,
    isPickup = false,
    isOptimize = false,
    API_KEY = 'AxkwSE1_LXTlHlyz7rrKPjqs30_wHghk4L4k5-1w-QALR2_QM7kwVpdbNWmhnt8eFWmN-xFaIdFlaiNKRlaAGzsDHXqGzmRbt_nGrPwXPBmQYSIfq6LbgqFQpKKfXHYx'

const config = {
    apiKey: "AIzaSyCbPutO4jNX4dyzzK9WJ-w2h06hYSMf-kg",
    authDomain: "day-out-7bc8d.firebaseapp.com",
    databaseURL: "https://day-out-7bc8d.firebaseio.com",
    projectId: "day-out-7bc8d",
    storageBucket: "day-out-7bc8d.appspot.com",
    messagingSenderId: "855448935871"
  }
firebase.initializeApp(config)

let db = firebase.firestore(), 
    collections,
    userid

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        userid = user.uid
        collections = db.collection(`${userid}`)
    } else {
        window.location.href = "https://day-out-7bc8d.firebaseapp.com"
    }
})

document.querySelector('#signout').addEventListener('click', e => {
    firebase.auth().signOut()
    window.location.reload()
})

//geolocation
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        yourLocation.value = "Geolocation is not supported by this browser.";
    }
}

const showPosition = (position) => {
    yourLocation = document.querySelector('#yourlocation')

    //reverse geocode
    fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=zlMKNlqjyFv79AvMHSCLunzQE5O7u7Ak&location=${position.coords.latitude},${position.coords.longitude}`)
        .then(r => r.json())
        .then(({ results }) => {
            let locations = results[0].locations[0]
            let curLocation = locations.street +' '+ locations.adminArea5 +' '+ locations.adminArea3 +' '+ locations.postalCode
            yourLocation.value = curLocation
        })
        .catch(e => console.error(e))
}
document.querySelector('#location').addEventListener('click', e => {
    e.preventDefault()
    getLocation()
})

// mapquest api call
const map = t => {
    L.mapquest.key = 'unhtsta6Q2zNmOUxHGw2VK1eiDTwNWvY';
    const render = (err, response) => {
        let map = L.mapquest.map('map', {
            center: [0, 0],
            layers: L.mapquest.tileLayer('map'),
            zoom: 7
        })
        directionsLayer = L.mapquest.directionsLayer({
            directionsResponse: response
        }).addTo(map)
        narrativeControl = L.mapquest.narrativeControl({
            directionsResponse: response,
            compactResults: false,
            interactive: true
        })
        narrativeControl.setDirectionsLayer(directionsLayer);
        narrativeControl.addTo(map)
    }
    L.mapquest.directions().route({
        start: yourlocation,
        waypoints: waypoints,
        optimizeWaypoints: t,
        options: {
            enhancedNarrative: true
        }
    }, render)
}

// yelp api call
const yelp = e => {
    let URL = `https://api.yelp.com/v3/businesses/search?location=${area}&term=${e}&limit=6`;
    let queryURL = `https://cors-anywhere.herokuapp.com/${URL}`;
    fetch(queryURL, {
        method: "GET",
        headers: {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${API_KEY}`
        }
    })
        .then(r => r.json())
        .then(data => {
            data.businesses.forEach(business => {
                let dispbusiness = document.createElement('div')
                dispbusiness.className = 'col s12 m4 dispbusinessdiv'
                dispbusiness.innerHTML = `
            <h4>${business.name}</h4>
            <button class="dispbusiness" name="${business.name}" value="${business.location.display_address}" data-img="${business.image_url}"> + </button>
            <img src='${business.image_url}' class='businessimg'>
            <h5>Rating: ${business.rating} Price: ${business.price}</h5>
            <h5 class='businessaddress'>${business.location.display_address}</h5>
            `
                document.querySelector('.container2').appendChild(dispbusiness)
            })
        })
        .catch(e => console.error(e))
}

// button to remove activity
const activitybtns = () => {
    activities.forEach(activity => {
        let activityelem = document.createElement('span')
        activityelem.innerHTML = `
        <button class='btn waves-effect waves-light rmvactivities' value='${activity}'><i class="material-icons remove">remove_circle</i> ${activity}</button>
        `
        activityelem.value = activity

        document.querySelector('.plannedactivities').append(activityelem)
    })
}

// add activity on click
document.querySelector('#add').addEventListener('click', e => {
    e.preventDefault()
    if (document.querySelector('.activityinput').value) {
        document.querySelector('.plannedactivities').innerHTML = ''
        activities.push(document.querySelector('.activityinput').value)
        isActivity = true
        document.querySelector('.activityinput').value = ''
        activitybtns()
    }
})

// if input has value display yelp search, else display add activity
document.querySelector('.submit').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('.noactivity').innerHTML = ''
    if (isActivity === true && document.querySelector('#dayname').value && document.querySelector('#yourlocation').value && document.querySelector('#area').value) {
        dayname = document.querySelector('#dayname').value,
        yourlocation = document.querySelector('#yourlocation').value,
        area = document.querySelector('#area').value
        document.querySelector('.container2').innerHTML = `
        <h4 class="subtitle">${activities[i]}</h4>
        `
        yelp(activities[i])
    } else {
        let noactivity = document.createElement('p')
        noactivity.className = 'noactivity'
        noactivity.innerHTML = `Please fill out form`

        document.querySelector('.noactivity').append(noactivity)
    }
})

const dispdestination = () => {
    document.querySelector('.container2').innerHTML = `
        <h4 class='subtitle'>Your Destinations</h4>
        `
        let direction = document.createElement('div')
        direction.innerHTML = `
        <button class='btn waves-effect waves-light plotcoursebtn'>Plot Course</button>
        <button class='btn waves-effect waves-light repickbtn'>New Location</button>
        <button class='btn waves-effect waves-light moreactivitybtn'>Add Activity</button>
        <button class='btn waves-effect waves-light pickupbtn'>Pick Up</button>
        <div class='container3'></div>
        `
        direction.className = 'options'
        document.querySelector('.container2').appendChild(direction)
        destinationsInfo.forEach(destination => {
            let destinationelem = document.createElement('div')
            destinationelem.innerHTML = `
            <h4 class='businesses'>${destination.name}</h4>
            <h5 class='businesses'>${destination.address}</h5>
            `
            document.querySelector('.container2').appendChild(destinationelem)
    })
}

// display yelp search for next activity when previous activity location is click
const nextactivity = () => {
    if (i !== activities.length) {
        document.querySelector('.container2').innerHTML = `
        <h4 class="subtitle">${activities[i]}</h4>
        `
        yelp(activities[i])
    } 
    // display all destinations when location for all activites been selected
    else if (i === activities.length) {
        dispdestination()
    }
}

// option to switch between exact activity order and optimize route
const direction = () => {
    if (isOptimize === false) {
        document.querySelector('.container').innerHTML = ''
        document.querySelector('.container').innerHTML = `
        <button class="btn waves-effect waves-light isOptimize" type="submit">Optimize Route</button>
        <div id="map" style="width: 100%; height: 530px;"></div>
        `
        map(false)
    } else if (isOptimize === true) {
        document.querySelector('.container').innerHTML = ''
        document.querySelector('.container').innerHTML = `
        <button class="btn waves-effect waves-light isOptimize" type="submit">Exact Stop</button>
        <div id="map" style="width: 100%; height: 530px;"></div>
        `
        map(true)
    }
}

document.addEventListener('click', e => {
    if (e.target.className === 'dispbusiness') {
        destinationsInfo.push({ 'name': e.target.name, 'address': e.target.value, 'imgUrl':e.target.dataset.img })
        i++
        setTimeout(nextactivity, 500)
    } else if (e.target.classList.contains('plotcoursebtn')) {
        let daynamearr = dayname.split(' ')
        for(let i = 0 ; i < daynamearr.length ; i++){
            daynamearr[i] = daynamearr[i].toUpperCase()
        }
        destinationsInfo.forEach(destination => {
            waypoints.push(`${destination.address}`)
        })
        console.log(waypoints)
        id = collections.doc().id
        collections.doc(id).set({
            Dayname: daynamearr,
            destinations: destinationsInfo,
            waypoints: waypoints
        })
        direction()
    } else if (e.target.classList.contains('rmvactivities') || e.target.className === 'material-icons remove') {
        e.preventDefault()
        document.querySelector('.plannedactivities').innerHTML = ''
        let j = activities.indexOf(e.target.value)
        if (j !==-1){
            activities.splice(j,1)
        }
        activitybtns()
    } else if (e.target.classList.contains('isOptimize')) {
        e.preventDefault()
        isOptimize = !isOptimize
        direction()
    } else if (e.target.classList.contains('repickbtn')) {
        if (isPickup === true) {
            destinationsInfo.splice(1, destinationsInfo.length)
            i = 0
            nextactivity()
        } else {
            destinationsInfo.splice(0, destinationsInfo.length)
            i = 0
            nextactivity()
        }
    } else if (e.target.classList.contains('moreactivitybtn')) {
        document.querySelector('.container3').innerHTML= `
        <label for="newactivity">Activity</label>
        <input type="text" class="newactivity" id="newactivity"><!-- 
        --><button class="btn waves-effect waves-light addmorebtn" type="submit" id="addmore"><i class="material-icons add">add</i></button>
        `
    }else if (e.target.classList.contains('addmorebtn') || e.target.className === 'material-icons add') {
        e.preventDefault()
        if (document.querySelector('.newactivity').value){
            activities.push(document.querySelector('.newactivity').value)
            nextactivity()
        }
    } else if (e.target.classList.contains('pickupbtn')) {
        document.querySelector('.container3').innerHTML = `
        <label for="name">Name</label>
        <input type="text" class="name pickupinput" id="name">
        <label for="address0">Address</label>
        <input type="text" class="address0 pickupinput" id="address0"> 
        <label for="address1">City State Zipcode</label>
        <input type="text" class="address1 pickupinput" id="address1"> 
        <button class="btn waves-effect waves-light addpickup" type="submit" id="addpickup"><i class="material-icons">add</i></button>
        `
    } else if (e.target.classList.contains('addpickup')) {
        if (document.querySelector('.name').value && document.querySelector('.address0').value && document.querySelector('.address1').value) {
            destinationsInfo.unshift({ 
                'name': document.querySelector('.name').value, 
                'address': [`${document.querySelector('.address0').value}`, `${document.querySelector('.address1').value}`]
            })
            isPickup = true
            dispdestination()
        }
    }
})