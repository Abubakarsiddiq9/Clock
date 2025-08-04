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
  