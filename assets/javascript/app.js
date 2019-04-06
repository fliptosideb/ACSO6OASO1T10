let activities = [],
    i = 0,
    destinationsInfo = [],
    waypoints = []
    isActivity = false,
    isDestination = false,
    dayname,
    yourlocation,
    area,
    API_KEY = 'AxkwSE1_LXTlHlyz7rrKPjqs30_wHghk4L4k5-1w-QALR2_QM7kwVpdbNWmhnt8eFWmN-xFaIdFlaiNKRlaAGzsDHXqGzmRbt_nGrPwXPBmQYSIfq6LbgqFQpKKfXHYx';

const yelp = e => {
    let URL = `https://api.yelp.com/v3/businesses/search?location=${area}&term=${e}&limit=5`;
    let queryURL = `https://cors-anywhere.herokuapp.com/${URL}`;
    fetch( queryURL, {       
        method: "GET",
        headers: {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin":"*",
            "Authorization": `Bearer ${API_KEY}`
         }
     })
     .then(r => r.json())
     .then(data => {
         data.businesses.forEach(business => {
            let dispbusiness = document.createElement('div')
            dispbusiness.className = 'dispbusiness'
            dispbusiness.coor = business.coordinates
            dispbusiness.name = business.name
            dispbusiness.address = business.location.display_address
            dispbusiness.innerHTML = `
            <h5>${business.name}</h5>
            <img src='${business.image_url}' class='businessimg'>
            <div>Rating: ${business.rating} Price: ${business.price}</div>
            <p class='businessaddress'>${business.location.display_address}</p>
            `
            document.querySelector('.container').appendChild(dispbusiness)
         })
     })
     .catch(e => console.error(e))
}

document.querySelector('#add').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('.plannedactivities').innerHTML = ''
    if (document.querySelector('.newlocation').value) {
        activities.push(document.querySelector('.newlocation').value)
        isActivity = true
        document.querySelector('.newlocation').value = ''
        activities.forEach(activity => {
            let activityelem = document.createElement('span')
            activityelem.className = 'activities'
            activityelem.innerHTML = ` ${activity},`
        
            document.querySelector('.plannedactivities').append(activityelem)
        })
    } 
})

document.querySelector('.submit').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('.noactivity').innerHTML = ''
    if (isActivity && activities.length > 0){
        dayname = document.querySelector('#dayname').value,
        yourlocation = document.querySelector('#yourlocation').value,
        area = document.querySelector('#area').value
        document.querySelector('.container').innerHTML = `
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

const nextactivity = () => {
    if (i !== activities.length){
        document.querySelector('.container').innerHTML = `
        <h4 class="subtitle">${activities[i]}</h4>
        `
        yelp(activities[i])
    } else if (i === activities.length){
        document.querySelector('.container').innerHTML = `
        <h4 class='subtitle'>Your Destinations</h4>
        `
        destinationsInfo.forEach(destination => {
            let destinationelem = document.createElement('div')
            destinationelem.innerHTML = `
            <h5 class='businesses'>${destination.name}</h5>
            <h6 class='businesses'>${destination.address}</h6>
            `
            document.querySelector('.container').appendChild(destinationelem)
        })
        let direction = document.createElement('button')
        direction.className = 'btn waves-effect waves-light direction'
        direction.innerHTML = 'Plot Course'
        document.querySelector('.container').appendChild(direction)
    }
}

document.addEventListener('click', e => {
    if (e.target.className === 'dispbusiness' && destinationsInfo.indexOf(e.target.address) ===-1){
        destinationsInfo.push({'name': e.target.name, 'address': e.target.address})
        e.target.style.backgroundColor = '#26a69954'
        i++
        setTimeout(nextactivity, 1000) 
    } else if (e.target.className === 'btn waves-effect waves-light direction') {
        destinationsInfo.forEach(destination => {
            waypoints.push(`${destination.address[0]} ${destination.address[1]}`)   
        })
        document.querySelector('.container').innerHTML = `
        <div id="map" style="width: 100%; height: 530px;"></div>
        `
        L.mapquest.key = 'unhtsta6Q2zNmOUxHGw2VK1eiDTwNWvY';
        const render = (err, response) => {
            let map = L.mapquest.map('map', {
                    center: [0, 0],
                    layers: L.mapquest.tileLayer('map'),
                    zoom: 7
                }),
                directionsLayer = L.mapquest.directionsLayer({
                    directionsResponse: response
                }).addTo(map),
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
            optimizeWaypoints: true,
            options: {
                enhancedNarrative: true
            }
        }, render)
    }
})