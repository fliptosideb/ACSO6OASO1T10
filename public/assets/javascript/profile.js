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
    dbsearchresult = [],
    newwaypoints = [],
    collections,
    userid,
    userpic,
    username,
    curLocation,
    isOptimize = false,
    i = 0

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.querySelector('.container4').innerHTML = "Geolocation is not supported by this browser."
    }
}

const showPosition = (position) => {
    //reverse geocode
    fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=zlMKNlqjyFv79AvMHSCLunzQE5O7u7Ak&location=${position.coords.latitude},${position.coords.longitude}`)
        .then(r => r.json())
        .then(({ results }) => {
            let locations = results[0].locations[0]
            curLocation = locations.street +' '+ locations.adminArea5 +' '+ locations.adminArea3 +' '+ locations.postalCode
        })
        .catch(e => console.error(e))
}

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
        start: '6440 Adobe Circle Road, Irvine, CA',
        end: '6440 Adobe Circle Road, Irvine, CA',
        waypoints: newwaypoints,
        optimizeWaypoints: t,
        options: {
            enhancedNarrative: true
        }
    }, render)
}

const direction = () => {
    if (isOptimize === false) {
        document.querySelector('.container4').innerHTML = ''
        document.querySelector('.container4').innerHTML = `
        <button class="btn waves-effect waves-light isOptimize" type="submit">Optimize Route</button>
        <button class="btn waves-effect waves-light right backtoprofile" id="backtoprofile" name="action">X</button>
        <div id="map" style="width: 100%; height: 530px;"></div>
        `
        map(false)
    } else if (isOptimize === true) {
        document.querySelector('.container4').innerHTML = ''
        document.querySelector('.container4').innerHTML = `
        <button class="btn waves-effect waves-light isOptimize" type="submit">Exact Stop</button>
        <button class="btn waves-effect waves-light right backtoprofile" id="backtoprofile" name="action">X</button>
        <div id="map" style="width: 100%; height: 530px;"></div>
        `
        map(true)
    }
}

const dispdocs = (e) => {
    let savedday = i
    let {Dayname, destinations, waypoints} = e.data()
    let Daynamestr = Dayname.join(" ")
    let saveddayelem = document.createElement('div')
    saveddayelem.className = "row savedday"
    saveddayelem.innerHTML = `
    <h4 class='row nameofday'>${Daynamestr}</h4>
    <div class='row backbtn'>
    <button class="btn waves-effect waves-light right mapit${savedday}" id="mapit" name="action" value="${e.id}">map</button>
    </div>
    <div class='row a${savedday}'></div>
    `
    document.querySelector('.container5').appendChild(saveddayelem)
    
    e.data().destinations.forEach(dest => {
        let destinationelem = document.createElement('span')
        destinationelem.className = 'col s12 m4 saveddestination'
        destinationelem.innerHTML = `
        <div class='dispsaved'>
            <h4 class='row savedbusinessname'>${dest.name}</h4>
            <img src='${dest.imgUrl}' alt='${dest.name}' class='businessimg'>
            <h4 class='row savedbusinessaddress'>${dest.address}</h4>
        </div>
        `
        document.querySelector(`.a${savedday}`).append(destinationelem)
    })
    document.addEventListener('click', e => {
        if (e.target.classList.contains(`mapit${savedday}`)){
            db.collection(`${userid}`).where(firebase.firestore.FieldPath.documentId(), '==', `${e.target.value}`)
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    newwaypoints = waypoints
                    getLocation()
                    direction()
                })
            })
            console.log(curLocation)
        }
    })
    i++
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        userid = user.uid
        collections = db.collection(`${userid}`)
        userpic = user.photoURL
        username = user.displayName
        document.querySelector('.picture').src = `${userpic}`
        document.querySelector('.profilename').innerHTML = `${username}`
        db.collection(`${userid}`).onSnapshot(({docs}) =>{
            document.querySelector('.container5').innerHTML = ''
            docs.forEach(doc => {
                dispdocs(doc) 
            })
        })
        document.querySelector('.searchbtn2').addEventListener('click', e => {
            e.preventDefault()
            let search = document.querySelector('.searchinput').value
            let searcharr = search.split(' ')
            searcharr.forEach(firstword => {
                firstword = firstword.charAt(0).toUpperCase() + firstword.substr(1);
            })
            for(let i = 0 ; i < searcharr.length ; i++){
                searcharr[i] = searcharr[i].toUpperCase()
            }  
            dbsearchresult.splice(0,dbsearchresult.length)
            document.querySelector('.searchinput').value = ''
            document.querySelector('.container5').innerHTML = ''
            db.collection(`${userid}`).where('Dayname', 'array-contains', `${searcharr[0]}`)
            .get()
            .then(docs => {
                docs.forEach(doc => {
                   dispdocs(doc)
                })
            })
        })
    } else {
        window.location.href = "https://day-out-7bc8d.firebaseapp.com"
    }
})

document.querySelector('#signout').addEventListener('click', e => {
    firebase.auth().signOut()
    window.location.reload()
})

document.addEventListener('click', e => {
    if (e.target.classList.contains('backtoprofile')) {
        location.reload()
    } else if (e.target.classList.contains('isOptimize')) {
        e.preventDefault()
        isOptimize = !isOptimize
        direction()
    }
})