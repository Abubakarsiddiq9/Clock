window.stopwatchControl = (function () {
  let startTime = 0;
  let elapsedTime = 0;
  let intervalId;
  let running = false;

  function updateDisplay() {
    const now = Date.now();
    const time = elapsedTime + (now - startTime);

    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    document.getElementById('minutesSt').textContent = String(minutes).padStart(2, '0');
    document.getElementById('secondsSt').textContent = String(seconds).padStart(2, '0');
    document.getElementById('millisecondsSt').textContent = String(milliseconds).padStart(2, '0');
  }

  function start() {
    if (!running) {
      startTime = Date.now();
      intervalId = setInterval(updateDisplay, 10);
      running = true;
    }
  }

  function stop() {
    if (running) {
      elapsedTime += Date.now() - startTime;
      clearInterval(intervalId);
      running = false;
    }
  }

  function reset() {
    clearInterval(intervalId);
    startTime = 0;
    elapsedTime = 0;
    running = false;
    document.getElementById('minutesSt').textContent = '00';
    document.getElementById('secondsSt').textContent = '00';
    document.getElementById('millisecondsSt').textContent = '00';
  }

  function cleanup() {
    clearInterval(intervalId);
    running = false;
  }

  // Attach listeners
  document.querySelector('.js-startBtn').addEventListener('click', start);
  document.querySelector('.js-stopBtn').addEventListener('click', stop);
  document.querySelector('.js-resetBtn').addEventListener('click', reset);

  return {
    cleanup
  };
})();
