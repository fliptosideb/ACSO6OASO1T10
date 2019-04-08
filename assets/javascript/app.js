let activities = [],
    i = 0,
    destinationsInfo = [],
    waypoints = []
    isActivity = false,
    dayname,
    yourlocation,
    area,
    isOptimize = false,
    API_KEY = 'AxkwSE1_LXTlHlyz7rrKPjqs30_wHghk4L4k5-1w-QALR2_QM7kwVpdbNWmhnt8eFWmN-xFaIdFlaiNKRlaAGzsDHXqGzmRbt_nGrPwXPBmQYSIfq6LbgqFQpKKfXHYx'

//geolocation
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        yourLocation.innerHTML = "Geolocation is not supported by this browser.";
    }
}

const showPosition = (position) => {
    yourLocation = document.querySelector('#yourlocation')

    //reverse geocode
    fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=zlMKNlqjyFv79AvMHSCLunzQE5O7u7Ak&location=${position.coords.latitude},${position.coords.longitude}`)
        .then(r => r.json())
        .then(({ results }) => {
            let curLocation = results[0].locations[0].street + " " + results[0].locations[0].adminArea5 + " " + results[0].locations[0].adminArea3 + " " + results[0].locations[0].postalCode
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
        end: yourlocation,
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
                dispbusiness.className = 'col s12 m4 dispbusiness'
                dispbusiness.coor = business.coordinates
                dispbusiness.name = business.name
                dispbusiness.address = business.location.display_address
                dispbusiness.innerHTML = `
            <h4>${business.name}</h4>
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
        <button class='btn waves-effect waves-light rmvactivities' value='${activity}'><i class="material-icons">remove_circle</i> ${activity}</button>
        `
        activityelem.value = activity

        document.querySelector('.plannedactivities').append(activityelem)
    })
}

// add activity on click
document.querySelector('#add').addEventListener('click', e => {
    e.preventDefault()
    if (document.querySelector('.newlocation').value) {
        document.querySelector('.plannedactivities').innerHTML = ''
        activities.push(document.querySelector('.newlocation').value)
        isActivity = true
        document.querySelector('.newlocation').value = ''
        activitybtns()
    }
})

// if input has value display yelp search else display add activity
document.querySelector('.submit').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('.noactivity').innerHTML = ''
    if (isActivity === true) {
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
        noactivity.innerHTML = `Please add an activity`

        document.querySelector('.noactivity').append(noactivity)
    }
})

// display yelp api for next activity on location click
const nextactivity = () => {
    if (i !== activities.length) {
        document.querySelector('.container2').innerHTML = `
        <h4 class="subtitle">${activities[i]}</h4>
        `
        yelp(activities[i])
    } 
    // display all destinations when location for all activites been selected
    else if (i === activities.length) {
        document.querySelector('.container2').innerHTML = `
        <h4 class='subtitle'>Your Destinations</h4>
        `
        destinationsInfo.forEach(destination => {
            let destinationelem = document.createElement('div')
            destinationelem.innerHTML = `
            <h4 class='businesses'>${destination.name}</h4>
            <h5 class='businesses'>${destination.address}</h5>
            `
            document.querySelector('.container2').appendChild(destinationelem)
        })
        let direction = document.createElement('div')
        direction.innerHTML = `
        <button class='btn waves-effect waves-light plotcoursebtn'>Plot Course</button>
        `
        // <button class='btn waves-effect waves-light savebtn'>Save</button>
        direction.className = 'directionOrsave'
        document.querySelector('.container2').appendChild(direction)
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
    if (e.target.className === 'col s12 m4 dispbusiness' && destinationsInfo.indexOf(e.target.address) === -1) {
        destinationsInfo.push({ 'name': e.target.name, 'address': e.target.address })
        i++
        setTimeout(nextactivity, 500)
    } else if (e.target.className === 'btn waves-effect waves-light plotcoursebtn') {
        destinationsInfo.forEach(destination => {
            waypoints.push(`${destination.address[0]} ${destination.address[1]}`)
        })
        direction()
    } else if (e.target.className === 'btn waves-effect waves-light location') {
        e.preventDefault()
    } else if (e.target.className === 'btn waves-effect waves-light rmvactivities' || e.target.className === 'material-icons') {
        e.preventDefault()
        document.querySelector('.plannedactivities').innerHTML = ''
        let j = activities.indexOf(e.target.value)
        if (j !==-1){
            activities.splice(j,1)
        }
        activitybtns()
    } else if (e.target.className === 'btn waves-effect waves-light isOptimize') {
        e.preventDefault()
        isOptimize = !isOptimize
        direction()
    }
})