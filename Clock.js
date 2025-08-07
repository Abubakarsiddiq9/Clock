function updateAnalogClock() {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;
      const Dighr=now.getHours();

      const secondDeg = sec * 6;
      const minuteDeg = min * 6 + sec * 0.1;
      const hourDeg = hr * 30 + min * 0.5;

      document.getElementById('second-hand').style.transform = `translateX(-50%) translateY(-100%) rotate(${secondDeg}deg)`;
      document.getElementById('minute-hand').style.transform = `translateX(-50%) translateY(-100%) rotate(${minuteDeg}deg)`;
      document.getElementById('hour-hand').style.transform = `translateX(-50%) translateY(-100%) rotate(${hourDeg}deg)`;
       
      const hrsgo=document.getElementById('hrs');
      const mingo=document.getElementById('min');
      const secgo=document.getElementById('sec');
      sec<10?secgo.innerText='0'+sec : secgo.innerText=sec;
      Dighr<10?hrsgo.innerText='0'+Dighr : hrsgo.innerText=Dighr;
      min<10?mingo.innerText='0'+min : mingo.innerText=min;

    }

    setInterval(updateAnalogClock, 1000);
    updateAnalogClock(); // Call once to initialize immediately
  
const timerbtn=document.getElementById('timerbtn');
const main=document.querySelector('.main')
const timerContainer = document.getElementById('timerContainer');

timerbtn.addEventListener('click',()=>{
  
  // Below two lines control which part of the webpage is visible by changing the CSS display property using JavaScript.
  
  main.style.display = 'none';
 
  //This hides the element with class .main , by setting its display to 'none'.
 
  timerContainer.style.display = 'block';
 
  //This shows the element with id="timerContainer" by setting its display to 'block'.
  //This logic is useful when you're switching views in a single-page interface:
 
  timerContainer.innerHTML=`
  <style>
    body{
      color: rgb(0, 0, 0);
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
    }
  </style>
  <div class="blue"> 
    <button class="closeTimer js-closeTimer">X</button>
    <h1 style="margin-left: 40%;margin-bottom: 20%;margin-top: 10%;">Timer</h1>
      <div class="timerBelow">
      <div>
        <p style="font-size: 18px;">Select Time (hh:mm:ss):</p>
        <input class="inputbox" type="time" id="myTime" step="1" value="00:01:00">
      </div>
      <div class="timerdiv timerjs">
        <span id="hrsT">00</span>
        <span>:</span>
        <span id="minT">00</span>
        <span >:</span>
        <span id="secT">00</span>
      </div>
      <button class="StartBtn startcss">Start</button>
      </div>
  </div>
  `;

  const timeInput=document.getElementById('myTime');
    const StartBtn=document.querySelector('.StartBtn');
    const hrsSpan = document.getElementById('hrsT');
    const minSpan = document.getElementById('minT');
    const secSpan = document.getElementById('secT');    
    let intervalId;
    StartBtn.addEventListener('click',()=>{
      let timeInputgot=timeInput.value;
      if (timeInputgot) {
      const [hours, minutes, seconds = "00"] = timeInputgot.split(':');
     let totalSeconds =
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(seconds);

       clearInterval(intervalId);

      updateDisplay(totalSeconds);

      intervalId = setInterval(() => {
        totalSeconds--;
        if (totalSeconds < 0) {
          clearInterval(intervalId);
          alert('Time up!')
          return;
        }
        updateDisplay(totalSeconds);
      }, 1000);
    } else {
      alert('Please enter a valid time');
    }
    
  });
  function updateDisplay(totalSeconds) {
    const hrsT = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minsT = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secsT = String(totalSeconds % 60).padStart(2, '0');

    hrsSpan.textContent = hrsT;
    minSpan.textContent = minsT;
    secSpan.textContent = secsT;
  }
  const closeBtn = document.querySelector('.js-closeTimer');
closeBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  timerContainer.style.display = 'none';
  main.style.display = 'block'; // show clock again
  timerContainer.innerHTML = '';
});
});
 

const stopwatchBtn = document.getElementById('stopwatchbtn');  
const stopWatchContainer = document.getElementById('stopWatchContainer');

 stopwatchBtn.addEventListener('click', () => {
  main.style.display = 'none';
  stopWatchContainer.style.display = 'block';

  // Load stopwatch.html into the container
  fetch('stopwatch.html')
    .then(response => response.text())
    .then(html => {
      stopWatchContainer.innerHTML = html;

      const closeBtn = stopWatchContainer.querySelector('.closeStopw');
closeBtn.addEventListener('click', () => {
  // ✅ Stop stopwatch if it's running
  if (window.stopwatchControl && typeof window.stopwatchControl.cleanup === 'function') {
    window.stopwatchControl.cleanup();
  }

  stopWatchContainer.style.display = 'none';
  main.style.display = 'block';
  stopWatchContainer.innerHTML = '';
});

      // ✅ Load script dynamically and ensure it runs
      const script = document.createElement('script');
      script.src = 'stopwatch.js';
      script.onload = () => {
        // Optional: you can run init code here if needed
        console.log('stopwatch.js loaded!');
      };
      document.body.appendChild(script);
    });
});
