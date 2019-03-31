let activities = [],
    isActivity = false,
    date,
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
         console.log(data.businesses)
         data.businesses.forEach(business => {
            let dispbusiness = document.createElement('div')
            dispbusiness.innerHTML = `${business.name}`
            document.querySelector('.container').append(dispbusiness)
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
        activities.forEach(activitysrch => {
            yelp(activitysrch)
        })
    }else {
        let noactivity = document.createElement('p')
        noactivity.className = 'noactivity'
        noactivity.innerHTML = `Please add an activity`
    
        document.querySelector('.noactivity').append(noactivity) 
    }
})