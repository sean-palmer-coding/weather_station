let weather = new WebSocket('ws://127.0.0.1:8000/ws/weather/')

const gaugeUpdate = function (selector, value) {
    let valueAdj = null
    if (parseInt(value) < 10 && value !== "0") {
        valueAdj = "10"
    }
    else {
        valueAdj = value
    }
    $(selector).width(valueAdj + "%")
    $(selector + "-value").text( value + "%")
}

const compassUpdate = function (value, speed) {
    const html = $("html")
    document.getAnimations().forEach((anim) => {
        anim.cancel();
        anim.play();
    })
    html.css("--startRotation", html.css("--endRotation"))
    html.css("--endRotation", value + "deg")
    $('#wind-speed').text(speed)
}

const aqiUpdate = function (pm10, pm25, pm100) {
    let pmObj = {"pm10": parseInt(pm10), "pm25" : parseInt(pm25), "pm100" : parseInt(pm100)}

    for(const [key, value] of Object.entries(pmObj)) {
        let element = $("#" + key)

        element.width((parseInt(value) / 300 * 100).toString() + "%")
        element.text(value.toString())
        if (value < 30) {
            $("#" + key).width("10%")
        }
        if (value < 51) {
            $("#" + key).css("background-color", 'green');
        }
        else if (50 < value && value < 101) {
            $("#" + key).css("background-color", '#ffd501');
        }
        else if (100 < value && value < 151) {
            $("#" + key).css("background-color", 'orange');
        }
        else if (150 < value && value < 201) {
            $("#" + key).css("background-color", 'red');
        }
        else if (200 < value && value < 301) {
            $("#" + key).css("background-color", 'purple');
        }
        else {
            element.width("100%")
            element.css("background-color", '#7c0101');
        }
    }
}

const uvIndexUpdate = function (value) {
    let valueInt = parseInt(value)
    $('#uv-index-number').text(value)

    for (const x in [...Array(6).keys()]) {
        $("#uv-index-fill-" + x.toString()).width("0")
    }

    let valRemainder = valueInt % 3
    let valFilled = parseInt(valueInt / 3)
    for (const x in [...Array(valFilled + 1).keys()]) {
        $("#uv-index-fill-" + x.toString()).width("100%")
    }
    if (valRemainder) {

        let widthDivisor = 3
        if (valFilled === 0) {
            widthDivisor = 2
        }
        let width = ((valRemainder / widthDivisor).toFixed(2) * 100).toString() + "%"
        console.log(valFilled + 1)
        $("#uv-index-fill-" + (valFilled + 1).toString()).width(width)
    }
    if (value > 12) {
        for (const x in [...Array(6).keys()]) {
        $("#uv-index-fill-" + x.toString()).width("100%")
    }
    }
    let cat = $("#uv-index-cat")
    if (value < 2) {
        cat.text("Low")
    } else if (value < 5){
        cat.text("Moderate")
    } else if (value < 7) {
        cat.text("High")
    } else if (value < 10) {
        cat.text("Very High")
    } else {
        cat.text("Extreme")
    }
}

weather.onmessage = function (e){
    let data = JSON.parse(e.data).data
    document.querySelector('#temp').innerText = JSON.parse(e.data).data[0]['temperature'] + "°"
    myChart.data.datasets[0].data = data.map(a => a.temperature).reverse()
    myChart.data.labels = data.map(a => a.current_time).reverse()
    myChart.update()
    gaugeUpdate('#humidity', data[0]['humidity'])
    compassUpdate(data[0]["wind_direction"], data[0]['wind_speed'])
    aqiUpdate(data[0]["pm10"],data[0]["pm25"],data[0]["pm100"])
    uvIndexUpdate(data[0]["uv_index"])
    pressureChart.data.datasets[0].data = data.map(a => a.pressure).reverse()
    pressureChart.data.labels = data.map(a => a.current_time).reverse()
    pressureChart.update()
    windChart.data.datasets[0].data = data.map(a => a.wind_speed).reverse()
    windChart.data.labels = data.map(a => a.current_time).reverse()
    windChart.update()
}

let initialData

$.ajax({
    method: "GET",
    async: false,
    url: '/measurement/',
    success(data) {
        initialData = data
        compassUpdate(data[0]["wind_direction"], data[0]['wind_speed'])
        aqiUpdate(data[0]["pm10"],data[0]["pm25"],data[0]["pm100"])
        uvIndexUpdate(data[0]["uv_index"])
    }
})

const ctx = document.getElementById('weather-chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: initialData.map(a => a.current_time).reverse(),
        datasets: [{
            label: 'Temperature',
            data: initialData.map(a => a.temperature).reverse(),
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
            ],
            fill: true,
            cubicInterpolationMode: 'monotone',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            },
            x: {
                ticks: {
                    maxTicksLimit: 5
                },
                type: 'time',
                time: {
                    unit: 'hour',

                }

                // type: 'datetime'
            }
        }
    }
});

const pressureCtx = document.getElementById('pressure-chart').getContext('2d');
const pressureChart = new Chart(pressureCtx, {
    type: 'line',
    data: {
        labels: initialData.map(a => a.current_time).reverse(),
        datasets: [{
            label: 'Pressure',
            data: initialData.map(a => a.pressure).reverse(),
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
            ],
            fill: true,
            cubicInterpolationMode: 'monotone',
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            y: {
                display: false,
                beginAtZero: false,
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    display: false,
                    maxTicksLimit: 2,
                    font: {
                        size: 8
                    }
                },
                type: 'time',
                time: {
                    unit: 'hour',

                }

                // type: 'datetime'
            }
        }
    }
});

const windCtx = document.getElementById('wind-chart').getContext('2d');
const windChart = new Chart(windCtx, {
    type: 'line',
    data: {
        labels: initialData.map(a => a.current_time).reverse(),
        datasets: [{
            label: 'Wind',
            data: initialData.map(a => a.wind_speed).reverse(),
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
            ],
            fill: true,
            cubicInterpolationMode: 'monotone',
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 0
            }
        },
        scales: {
            y: {
                display: false,
                beginAtZero: false,
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    display: false,
                    maxTicksLimit: 2,
                    font: {
                        size: 8
                    }
                },
                type: 'time',
                time: {
                    unit: 'hour',

                }

                // type: 'datetime'
            }
        }
    }
});