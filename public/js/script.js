
const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Error getting location: ", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    console.error("Geolocation is not supported by your browser.");
}


const map = L.map("map").setView([0, 0], 10);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
const markers = {};

socket.on("recived-location", (data) => {
    const { latitude, longitude,id } = data;
    map.setView([latitude, longitude], 12); 
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }

});
