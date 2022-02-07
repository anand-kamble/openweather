function locatecoor() {
    var lon = parseFloat($("#LON").val())
    var lat = parseFloat($("#LAT").val())
    //rotateGlobe(18.5204,73.8567);
}

var r = document.querySelector(':root');
var temprature , weatherData ,weekdata, dataforGraph;

function toCurrentLocation(){
    $.get('http://ip-api.com/json/',(d)=>{
        console.log(d)
       // console.log(d.lat , d.lon)
        $("#LoadingScreen").fadeOut(500)
        $("#hoverme").fadeIn();
        //rotateGlobe(d.lat , d.lon);
        loadweather(d.city,true)
    }).fail(()=>{
        showMain();
        document.getElementById('errormsg').innerText = `Can't get your Location, Search For a City.`;
        $("#LoadingScreen").fadeOut(500)
    })
}

function changeTempUnit(num){
    //document.getElementById('tempNumber').innerText = weatherData.main.temp;
    changeUnits(num)
    if(num == 0){
        document.getElementById('unitDegree').classList.remove('halffaded');
        document.getElementById('unitFarh').classList.add('halffaded');
        $("#feelslike").fadeOut(300)
        $("#tempNumber").fadeOut(300,()=>{
            var tempnumber = weatherData.main.temp - 273.15
            document.getElementById('tempNumber').innerText = Math.round(tempnumber);
            var feelslike = weatherData.main.feels_like - 273.15;
            document.getElementById('feelslike').innerText = 'Feels like ' + Math.round(feelslike) + ' °C' ;
            var tempmin = Math.round(weatherData.main.temp_min- 273.15) , tempmax = Math.round(weatherData.main.temp_max - 273.15);
            document.getElementById('minmax').innerText = tempmin + '°C / '+ tempmax + ' °C'
            $("#tempNumber").fadeIn(300)
            $("#feelslike").fadeIn(300)
        })
        
    }
    if(num == 1){
        document.getElementById('unitDegree').classList.add('halffaded');
        document.getElementById('unitFarh').classList.remove('halffaded');
        $("#feelslike").fadeOut(300)
        $("#tempNumber").fadeOut(300,()=>{
            var tempnumber = weatherData.main.temp - 273.15
            let fahrenheit = Math.floor(tempnumber * (9/5) + 32);
            document.getElementById('tempNumber').innerText = Math.round(fahrenheit);
            var feelcelcius = weatherData.main.feels_like - 273.15
            var feelslike = Math.floor(feelcelcius * (9/5) + 32);
            document.getElementById('feelslike').innerText = 'Feels like ' + feelslike + ' °F' ;
            var tempmin = Math.round((weatherData.main.temp_min- 273.15) * (9/5) + 32) , tempmax = Math.round((weatherData.main.temp_max - 273.15) * (9/5) + 32);
            document.getElementById('minmax').innerText = tempmin + '°F / '+ tempmax + ' °F'
            $("#tempNumber").fadeIn(300)
            $("#feelslike").fadeIn(300)
        })
        
    }
}

document.getElementById('dailyinfodivsholder').addEventListener('mousemove',()=>{
    $("#hoverme").fadeOut();
})


function loadweather (city,is_intro) {
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fd55280c21f43ecb621fe7a10e7cf077`,(d)=>{
            weatherData = d;
            if(is_intro !== true){
                hideMain();
                
            }
            setTimeout(()=>{
                changeTempUnit(0);
                loadDailyWeather(d.coord.lat,d.coord.lon)
                document.getElementById('cityname').innerText = d.name;
                document.getElementById('time').innerText = new Date(d.dt*1000)
                document.getElementById('weathermaindesc').innerText = d.weather[0].main;
                document.getElementById('weatherdescicon').src = `http://openweathermap.org/img/w/${d.weather[0].icon}.png`
                document.getElementById('pressure').innerText = d.main.pressure;
                document.getElementById('humidity').innerText = d.main.humidity + ' %';
                document.getElementById('sealevel').innerText = d.main.sea_level;
                document.getElementById('groundlevel').innerText = d.wind.speed + 'm/s';
                document.getElementById('errormsg').innerText = ``;
                rotateGlobe(d.coord.lat , d.coord.lon);
               // console.log(`Rotating : ${d.coord.lat} , ${d.coord.lon}`)
            },500)
            
        }).fail(()=>{
           // console.log('Not Found.')
            document.getElementById('errormsg').innerText = `Can't locate ${city}`
        })


    
}

var weekdays  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function loadDailyWeather(lat,lon){
        $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=fd55280c21f43ecb621fe7a10e7cf077`,(d)=>{
           // console.log(d)
            var weekdaydiv = document.getElementById('weekday');
            weekdaydiv.innerHTML = '';
            var dailyInfoHolder = document.getElementById('dailyinfodivsholder');
            dailyInfoHolder.innerHTML = '';
            dataforGraph = [['Time','Temp']];
            weekdata = d;
            for(i=1;i<=7;i++){
                var day = d.daily[i]
                var dayOfWeek = (Math.floor(day.dt / 86400) + 4) % 7;
                var tempinC = Math.round(day.temp.day  - 273.15)
                var basearray = [i,tempinC]
                var Unit = '°C'
                weekdaydiv.insertAdjacentHTML('beforeend',`<div class="weekdayfont centerAlign">
                <p>${weekdays[dayOfWeek]}</p>
                <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png">
                <p>${tempinC} ${Unit}</p>
                </div>`)
               // console.log(basearray)
                dataforGraph.push(basearray)
                var datestamp = new Date(day.dt*1000)
                dailyInfoHolder.insertAdjacentHTML('beforeend',`    <div class="dailyonfo ">
                    <p class="textshadow" style="margin-top:10px;">${datestamp.getDate()} ${months[datestamp.getMonth()]}</p>
                    <p class="textshadow" style="font-size: 10px;margin-top:20px;">Min / Max</p>
                    <p class="textshadow">${Math.round(day.temp.min  - 273.15)}/${Math.round(day.temp.max  - 273.15)}</p>
                    <p class="textshadow" style="font-size: 10px;margin-top:20px;">Wind</p>
                    <p class="textshadow" style="margin-top:0;">${day.wind_speed} m/s</p>
                    <p class="textshadow" style="margin-top:20px;">${day.weather[0].main}</p>
                </div>`)

            }
            if(window.innerWidth >= 1200){
                Chart (dataforGraph,30,20);
            }
            if(window.innerWidth >= 800 && window.innerWidth <1200){
                Chart (dataforGraph,35,20);
            }
            if(window.innerWidth < 800 ){
                Chart (dataforGraph,80,20);
            }
            
            
        })
}
//Math.round((weatherData.main.temp_max - 273.15) * (9/5) + 32)
function changeUnits(num){
    if(weekdata !== undefined && num == 1){var weekdaydiv = document.getElementById('weekday');
    weekdaydiv.innerHTML = '';
    var dailyInfoHolder = document.getElementById('dailyinfodivsholder');
    dailyInfoHolder.innerHTML = '';
    //var dataforGraph = [['Time','Temp']];
    //console.log(weekdata)
    var d = weekdata;
    //console.log(d)
    for(i=1;i<=7;i++){
        var day = d.daily[i]
        var dayOfWeek = (Math.floor(day.dt / 86400) + 4) % 7;
        //var tempinC = Math.round(day.temp.day  - 273.15)
        var tempinF = Math.round((day.temp.day - 273.15) * (9/5) + 32)
        //var basearray = [i,tempinC]
        var Unit = '°F'
        weekdaydiv.insertAdjacentHTML('beforeend',`<div class="weekdayfont centerAlign">
        <p>${weekdays[dayOfWeek]}</p>
        <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png">
        <p>${tempinF} ${Unit}</p>
        </div>`)
        //console.log(basearray)
        //dataforGraph.push(basearray)
        var datestamp = new Date(day.dt*1000)
        //Math.round(day.temp.min  - 273.15)}/${Math.round(day.temp.max  - 273.15)
        dailyInfoHolder.insertAdjacentHTML('beforeend',`    <div class="dailyonfo ">
            <p class="textshadow" style="margin-top:10px;">${datestamp.getDate()} ${months[datestamp.getMonth()]}</p>
            <p class="textshadow" style="font-size: 10px;margin-top:20px;">Min / Max</p>
            <p class="textshadow">${Math.round((day.temp.min - 273.15) * (9/5) + 32)} / ${Math.round((day.temp.max - 273.15) * (9/5) + 32)}</p>
            <p class="textshadow" style="font-size: 10px;margin-top:20px;">Wind</p>
            <p class="textshadow" style="margin-top:0;">${day.wind_speed} m/s</p>
            <p class="textshadow" style="margin-top:20px;">${day.weather[0].main}</p>
        </div>`)

    }}

    if(weekdata !== undefined && num == 0){var weekdaydiv = document.getElementById('weekday');
        //console.log(d)
        var weekdaydiv = document.getElementById('weekday');
        weekdaydiv.innerHTML = '';
        var dailyInfoHolder = document.getElementById('dailyinfodivsholder');
        dailyInfoHolder.innerHTML = '';
       // var dataforGraph = [['Time','Temp']];
        var d = weekdata;
        for(i=1;i<=7;i++){
            var day = d.daily[i]
            var dayOfWeek = (Math.floor(day.dt / 86400) + 4) % 7;
            var tempinC = Math.round(day.temp.day  - 273.15)
           /// var basearray = [i,tempinC]
            var Unit = '°C'
            weekdaydiv.insertAdjacentHTML('beforeend',`<div class="weekdayfont centerAlign">
            <p>${weekdays[dayOfWeek]}</p>
            <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png">
            <p>${tempinC} ${Unit}</p>
            </div>`)
            //console.log(basearray)
            //dataforGraph.push(basearray)
            var datestamp = new Date(day.dt*1000)
            dailyInfoHolder.insertAdjacentHTML('beforeend',`    <div class="dailyonfo ">
                <p class="textshadow" style="margin-top:10px;">${datestamp.getDate()} ${months[datestamp.getMonth()]}</p>
                <p class="textshadow" style="font-size: 10px;margin-top:20px;">Min / Max</p>
                <p class="textshadow">${Math.round(day.temp.min  - 273.15)}/${Math.round(day.temp.max  - 273.15)}</p>
                <p class="textshadow" style="font-size: 10px;margin-top:20px;">Wind</p>
                <p class="textshadow" style="margin-top:0;">${day.wind_speed} m/s</p>
                <p class="textshadow" style="margin-top:20px;">${day.weather[0].main}</p>
            </div>`)

    }}
}


function searchCity(){
   var city = $("#search").val()
   if(city.length > 0){
       //console.log(city)
       loadweather(city , false)
   }else{
    //document.getElementById('search').classList.remove('glowSearchBar');
    document.getElementById('search').classList.add('glowSearchBar');
    setTimeout(()=>{
        document.getElementById('search').classList.remove('glowSearchBar');
    },1000)
   }
}

//w 30  h 20
function Chart (dataforGraph , wScale , hScale) {
    google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                let data = google.visualization.arrayToDataTable(dataforGraph);

                var options = {
                //legend: { position: 'bottom' },
                curveType: 'function',
                chartArea : {left:0,right:0,width:`${window.innerWidth/100*wScale}px`,height:`${window.innerHeight/100*hScale}px`/*, backgroundColor: '#00ffff',opacity :0 */ },
                legend: { position: "none" },
                vAxis : {
                    textPosition: 'none',
                    gridlines: {
                        color: 'transparent'
                    }
                },
                hAxis : {
                    baselineColor: '#000',
                    gridlineColor: '#fff',
                    textPosition: 'none',
                    gridlines: {
                        color: 'transparent'
                    }
                },
                tooltip: { isHtml: true , textStyle: { fontName: 'Montserrat', fontSize: 14 } },
                height: window.innerHeight/100*hScale,
                width: window.innerWidth/100*wScale,
                backgroundColor: { fill:'transparent' },
                colors : ['white'],
                annotations: {
                    boxStyle: {
                    // Color of the box outline.
                    stroke: '#888',
                    // Thickness of the box outline.
                    strokeWidth: 1,
                    // x-radius of the corner curvature.
                    rx: 10,
                    // y-radius of the corner curvature.
                    ry: 10,
                    // Attributes for linear gradient fill.
                    gradient: {
                        // Start color for gradient.
                        color1: '#fbf6a7',
                        // Finish color for gradient.
                        color2: '#33b679',
                        // Where on the boundary to start and
                        // end the color1/color2 gradient,
                        // relative to the upper left corner
                        // of the boundary.
                        x1: '0%', y1: '0%',
                        x2: '100%', y2: '100%',
                        // If true, the boundary for x1,
                        // y1, x2, and y2 is the box. If
                        // false, it's the entire chart.
                        useObjectBoundingBoxUnits: true
                    }
                    }
                }
                };

                var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
                
                
                
                chart.draw(data, options);
                var weekdaywidth = document.getElementById('curve_chart').offsetWidth/7;
                var weekdayHeight = document.getElementById('curve_chart').offsetHeight;
                if(window.innerWidth < 800){weekdayHeight = 'inherit'}
                document.getElementById('weekday').style = `grid-template-columns: ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px;`;
                document.getElementById('curve_chart').style = `margin-left:${weekdaywidth/2}px;`
               // console.log(`${weekdaywidth}px`)
                document.getElementById('dailyinfodivsholder').style = `height:${weekdayHeight}px;width:${weekdaywidth*7}px;grid-template-columns: ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px ${weekdaywidth}px;`

                var cols = document.getElementsByClassName('dailyonfo');
                for(i = 0; i < cols.length; i++) {
                    cols[i].style = `height:${weekdayHeight}px;width:${weekdaywidth}px;`;
                  }
            }
}

function hideMain(){
    document.getElementById('MainHolder').classList.remove('showdiv')
    document.getElementById('MainHolder').classList.add('hidediv')
}

function showMain(){
    document.getElementById('MainHolder').classList.remove('hiddenDiv')
    document.getElementById('MainHolder').classList.remove('hidediv')
    document.getElementById('MainHolder').classList.add('showdiv')
    topFunction()
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  