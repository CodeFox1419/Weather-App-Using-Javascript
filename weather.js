var input = document.getElementById('input');
var mainContent =  Array.from(document.querySelectorAll('.main'));
var fContent =  Array.from(document.querySelectorAll('.forecast'));
var inputValue ;
var isLoading = false; 
// var newResult1;

var setLoading = ()=>{
    if(isLoading){
        document.getElementById('spinner').classList.remove('spinner-container1')
        document.getElementById('spinner').classList.add('spinner-container')
    }else{
        document.getElementById('spinner').classList.add('spinner-container1')
        document.getElementById('spinner').classList.remove('spinner-container')
    }
}

function currentTime(dt) {
    let dateTime = new Date(dt *1000);
    let newTime =  dateTime.toLocaleTimeString()
    let newDate = dateTime.toDateString();
    console.log(newDate,newTime)
    let arrayofDT = []
    arrayofDT.push(newDate,newTime);
    return arrayofDT;
}


const showContent = ({
    clouds : {all},
    dt,
    main: {humidity,pressure,temp,temp_max,temp_min},
    visibility,
    weather,
    wind: {deg,speed} 
}, address)=>{
    mainContent.forEach((elements,i)=>{
        var iconurl = "http://openweathermap.org/img/w/" + weather[0].icon + ".png";
        elements.getElementsByTagName('img')[0].src = iconurl;
        elements.getElementsByTagName('h2')[0].innerText = weather[0].description;
        let date =  currentTime(dt)
        elements.getElementsByTagName('h4')[0].innerText = date[0];
        elements.getElementsByTagName('h4')[1].innerText = address;
        console.log(address)
        elements.getElementsByTagName('span')[0].innerText = parseInt(temp);
        elements.getElementsByTagName('p')[0].innerText = `Min Tem: ${parseInt(temp_min)}℃`;
        elements.getElementsByTagName('p')[1].innerText = `Max Tem: ${parseInt(temp_max)}℃`;
        elements.getElementsByTagName('p')[2].innerText = `Wind: ${speed}Km/hr`;
        elements.getElementsByTagName('p')[3].innerText = `Wind: ${deg}°`;
        elements.getElementsByTagName('p')[4].innerText = `Visisbilty: ${visibility}`;
        elements.getElementsByTagName('p')[5].innerText = `Humidity: ${humidity}%`;
        elements.getElementsByTagName('p')[6].innerText = `Pressure: ${pressure}hPa`; 
        elements.getElementsByTagName('p')[7].innerText = `Clouds: ${all}%`; 
    })
}

const extractFContent = (result2)=>{
    for(i=0;i<40;i++){
        fContent.forEach((element,j)=>{
            let dt = result2.list[i].dt;
            let cDateTime = currentTime(dt);
            let cDate = cDateTime[0].split(' ');
            let cTime = cDateTime[1].split(':');
            element.getElementsByTagName('h4')[i].innerText = cDate[0];
            element.getElementsByTagName('span')[i].innerText = `${cTime[0]}:${cTime[2]}`; 
            element.getElementsByTagName('img')[i].src = "http://openweathermap.org/img/w/" + result2.list[i].weather[0].icon + ".png";
            element.getElementsByTagName('p')[i].innerText = parseInt(result2.list[i].main.temp)+'℃';
        })
    }
}

const fetchWData = async (latitude,longitude,address)=>{
    // Note That Api's Key Doesn't Work Because, I Had Changed The Api Key.
    const url1 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=efe9c7ecb4843a24f7f25fcb09471241&units=metric`;
    const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=efe9c7ecb4843a24f7f25fcb09471241&units=metric`;



    try {
        setLoading(isLoading = true)
        const response1 = await fetch(url1);
        const result1 = await response1.json();
        console.log(result1)
        var {
            clouds : {all},
            dt,
            main: {humidity,pressure,temp,temp_max,temp_min},
            visibility,
            weather,
            wind: {deg,speed} 
        } = result1;
        showContent({
            clouds : {all},
            dt,
            main: {humidity,pressure,temp,temp_max,temp_min},
            visibility,
            weather,
            wind: {deg,speed} 
        },address);
        const response2 = await fetch(url2);
        const result2 = await response2.json(); 
        extractFContent(result2);
        // newResult1 = result2;
        setLoading(isLoading = false)
    } catch (error) {
        console.error(error);
    }

}


const fetchCityData = async ()=>{
    // Note That Api's Key Doesn't Work Because, I Had Changed The Api Key.
    const url = `https://google-maps-geocoding3.p.rapidapi.com/geocode?address=${inputValue}%2C%20India`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f784d373a6msh9d54e0251b4bcc2p10e646jsn08e486c3bbfe',
            'X-RapidAPI-Host': 'google-maps-geocoding3.p.rapidapi.com'
        }
    };


    try {
        setLoading(isLoading = true)
        const response = await fetch(url, options);
        const result = await response.json();
        const {latitude , longitude , address} = result;
        fetchWData(latitude , longitude ,address );
        setLoading(isLoading = false);
        console.log(result)
    } catch (error) {
        console.error(error);
    }
}



input.onkeyup = (e)=>{
    if(e.keyCode == 13){
        inputValue = input.value;
        fetchCityData();
    }

}
