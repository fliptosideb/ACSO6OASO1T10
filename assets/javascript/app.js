let activities = [],
    destinations = [],
    isActivity = false,
    date,
    yourlocation,
    area,
    API_KEY = 'AxkwSE1_LXTlHlyz7rrKPjqs30_wHghk4L4k5-1w-QALR2_QM7kwVpdbNWmhnt8eFWmN-xFaIdFlaiNKRlaAGzsDHXqGzmRbt_nGrPwXPBmQYSIfq6LbgqFQpKKfXHYx';

const activitiesbtn = () => {
    activities.forEach(activity => {
        let activitybtn = document.createElement('button')
        activitybtn.className = 'btn waves-effect waves-light activitybtn'
        activitybtn.innerHTML = activity
        activitybtn.value = activity
        document.querySelector('.activitiesbtns').append(activitybtn)
    })
}
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
            dispbusiness.value = business.coordinates
            dispbusiness.innerHTML = `
            <h5>${business.name}</h5>
            <img src='${business.image_url}' class='businessimg'>
            <div>Rating: ${business.rating} Price: ${business.price}</div>
            <p class='businessaddress'>${business.location.display_address}</p>
            `
            document.querySelector('.container').appendChild(dispbusiness)

            // let adddestination = document.createElement('button')
            // adddestination.className = 'addDestination'
            // adddestination.innerHTML = 'Add Location'
            // adddestination.value = dispbusiness.value
            // document.querySelector('.container').appendChild(adddestination)
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
        date = document.querySelector('#date').value,
        yourlocation = document.querySelector('#yourlocation').value,
        area = document.querySelector('#area').value
        document.querySelector('.container').innerHTML = ''
        activitiesbtn()
    }else {
        let noactivity = document.createElement('p')
        noactivity.className = 'noactivity'
        noactivity.innerHTML = `Please add an activity`
    
        document.querySelector('.noactivity').append(noactivity) 
    }
})
document.addEventListener('click', e => {
    if (e.target.className === 'btn waves-effect waves-light activitybtn') {
        document.querySelector('.container').innerHTML = ''
        yelp(e.target.value)
    }
    if (e.target.className === 'dispbusiness' && destinations.indexOf(e.target.value) ===-1){
        console.log(e.target.value)
        destinations.push(e.target.value)
        console.log(destinations)
        e.target.style.backgroundColor = '#26a69954'
    }
})