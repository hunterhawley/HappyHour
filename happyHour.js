//Prevent arrow keys from scrolling
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//Play function starts the audio when a user asks for it
function play() {
    for(i = 2; i <= users; i++) {
        var audio = document.getElementById("audioUser" + i);
        if(audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
        
    }
}

var room = $('#room'),
    user = $('#user1'),
    w = room.width() - user.width(),
    d = {},
    x = 3,
    users = 1;

generateUsers(2);

function newv(v,a,b) {
    var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
    //console.log(d);
    return n < 0 ? 0 : n > w ? w : n;
}

$(window).keydown(function(e) { 
    d[e.which] = true; 
});

$(window).keyup(function(e) { 
    d[e.which] = false; 
});

setInterval(function() {
    user.css({
        left: function(i,v) { return newv(v, 37, 39); },
        top: function(i,v) { return newv(v, 38, 40); }
    });
    refreshCalculations();
}, 10);

function getCoordinates(element) {
    //Find the bounding lines for the element
    var bounds = element.getBoundingClientRect();

    //Find x,y coordinates of the element
    var x = Math.round(bounds.left + window.pageYOffset);
    var y = Math.round(bounds.top + window.pageYOffset);

    return [x, y];
}

function calculateDistance(x1, x2, y1, y2) {
    return Math.round(Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2)));
}

function refreshCalculations() {
    //Get coordinates for main user
    var mainUserCoordinates = getCoordinates(document.getElementById('user1'));
    document.getElementById('user-coordinates').innerHTML = mainUserCoordinates[0] + "x" + mainUserCoordinates[1];

    //Get coordinates for all dummies
    var userCoordinates = {};
    for(i = 2; i <= users; i++) {
        var dummyCordinates = getCoordinates(document.getElementById('user' + i));
        var distanceFromDummy = calculateDistance(mainUserCoordinates[0], dummyCordinates[0], mainUserCoordinates[1], dummyCordinates[1]);
        var volumeRaw = Math.round(100 * ((300 - distanceFromDummy) / 300));
        if(volumeRaw > 0) {
            document.getElementById("audioUser" + i).volume = volumeRaw / 100;
        } else {
            document.getElementById("audioUser" + i).volume = 0;
        }
        document.getElementById('distance-user' + i).innerHTML = distanceFromDummy;
        document.getElementById('volume-user' + i).innerHTML = volumeRaw + "%";

        if(distanceFromDummy < 150) {
            document.getElementById('nearByUserImage' + i).style.display = 'inline';
        } else {
            document.getElementById('nearByUserImage' + i).style.display = 'none';
        }
    }
}

function generateUsers(amount) {
    for(i = 0; i < amount; i++) {
        users += 1;

        //Make new user icon
        var newUser = document.createElement("img");
        //Set its source and id
        newUser.src = 'images/user' + users + 'Icon.png';
        newUser.id = 'user' + users;
        newUser.class = 'user';
        newUser.style.width ="40px";
        newUser.style.position = "absolute";
        newUser.style.left = (Math.random() * 680) + 20;
        newUser.style.top = (Math.random() * 230) + 20;
        //Put the user in the room
        document.getElementById('room').appendChild(newUser);

        //Make new user audio
        var newUserAudio = document.createElement("audio");
        newUserAudio.id = "audioUser" + users;
        newUserAudio.controls = false;
        newUserAudio.autoplay = true;
        var newUserAudioSource = document.createElement("source");
        newUserAudioSource.src = "audio/user" + users + ".mp3";
        newUserAudioSource.type = "audio/mpeg";
        newUserAudio.appendChild(newUserAudioSource);
        document.getElementById("audioFiles").appendChild(newUserAudio);

        //Make new user stream image
        var newUserStreamImage = document.createElement("img");
        newUserStreamImage.id = "nearByUserImage" + users;
        newUserStreamImage.src = "images/user" + users + ".png";
        newUserStreamImage.class = "nearBy";
        newUserStreamImage.style.width = "40%";
        document.getElementById("nearbyUsersImages").appendChild(newUserStreamImage);

        //Make new user distance raw number at bottom
        var newUserDistance = document.createElement("p");

        newUserDistance.appendChild(document.createTextNode('Distance From User ' + users + ": "));
        var newUserDistanceSpan = document.createElement("span");
        newUserDistanceSpan.id = "distance-user" + users;
        newUserDistance.appendChild(newUserDistanceSpan);
        document.getElementById('raw-numbers').appendChild(newUserDistance);

        //Make new user volume raw number at bottom
        var newUserVolume = document.createElement("p");
        newUserVolume.appendChild(document.createTextNode('Volume of User ' + users + ": "));
        var newUserVolumeSpan = document.createElement("span");
        newUserVolumeSpan.id = "volume-user" + users;
        newUserVolume.appendChild(newUserVolumeSpan);
        document.getElementById('raw-numbers').appendChild(newUserVolume);
    }
}