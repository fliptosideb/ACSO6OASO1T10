let locations = [],
    isActivity = false

document.querySelector('#add').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('.plannedactivities').innerHTML = ''
    if (document.querySelector('.newlocation').value) {
        locations.push(document.querySelector('.newlocation').value)
        isActivity = true
        document.querySelector('.newlocation').value = ''
        locations.forEach(location => {
            let activities = document.createElement('span')
            activities.className = 'activities'
            activities.innerHTML = ` ${location},`
        
            document.querySelector('.plannedactivities').append(activities)
        })
    } 
})

document.querySelector('.submit').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector('.noactivity').innerHTML = ''
    if (isActivity && locations.length > 0){
        document.querySelector('.container').innerHTML = ''
    }else {
        let noactivity = document.createElement('p')
        noactivity.className = 'noactivity'
        noactivity.innerHTML = `Please add an activity`
    
        document.querySelector('.noactivity').append(noactivity) 
    }
})