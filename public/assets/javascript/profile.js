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
    userid,
    userpic,
    username,
    i = 0

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        userid = user.uid
        collections = db.collection(`${userid}`)
        userpic = user.photoURL
        username = user.displayName
        document.querySelector('.picture').src = `${userpic}`
        document.querySelector('.profilename').innerHTML = `${username}`
        db.collection(`${userid}`).onSnapshot(({docs}) =>{
            docs.forEach(doc => {
                let savedday = i
                let {Dayname, destinations} = doc.data()
                let saveddayelem = document.createElement('div')
                saveddayelem.className = "row savedday"
                saveddayelem.innerHTML = `
                <h4 class='row nameofday'>${Dayname}</h4>
                <div class='row s${savedday}'></div>
                `
                document.querySelector('.container5').appendChild(saveddayelem)
                
                doc.data().destinations.forEach(dest => {
                    let destinationelem = document.createElement('span')
                    destinationelem.className = 'col s12 m4 saveddestination'
                    destinationelem.innerHTML = `
                    <div class='dispsaved'>
                        <h4 class='row savedbusinessname'>${dest.name}</h4>
                        <img src='${dest.imgUrl}' alt='${dest.name}' class='businessimg'>
                        <h4 class='row savedbusinessaddress'>${dest.address}</h4>
                    </div>
                    `
                    document.querySelector(`.s${savedday}`).append(destinationelem)
                })
                i++
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