let weather = new WebSocket('ws://127.0.0.1:8000/ws/weather/')

weather.onmessage = function (e){
    let data = JSON.parse(e.data).data
    console.log(data[0]['temperature'])
    document.querySelector('#temp').innerText = JSON.parse(e.data).data[0]['temperature']
}