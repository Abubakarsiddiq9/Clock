/* alarm.js - revised */

/* shared audio */
let sharedSound = new Audio("thailand-eas-alarm-2006-266492.mp3");
sharedSound.loop = true;

/* unlock audio on first user interaction */
document.body.addEventListener("click", () => {
  sharedSound.play()
    .then(() => {
      sharedSound.pause();
      sharedSound.currentTime = 0;
      console.log("Audio unlocked for later use.");
    })
    .catch(err => console.log("Unlock failed:", err));
}, { once: true });

/* track running intervals so we can clear them on close */
let alarmIntervals = [];



export function initAlarmUI() {
  const allAlarms = document.getElementById('allAlarms');
  const timeGot = document.getElementById('jsinputAlrm');
  let addBtn = document.getElementById('js-addalrm');

  if (!allAlarms || !timeGot || !addBtn) {
    console.error('initAlarmUI: required elements not found.');
    return;
  }

  // remove previous listeners on addBtn by replacing node (simple reset)
  const newAddBtn = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(newAddBtn, addBtn);
  addBtn = newAddBtn;

  // clear any previous intervals and DOM list (prevents duplicates on reopen)
  destroyAlarmUI();
  allAlarms.innerHTML = '';

  // bind Add button
  addBtn.addEventListener('click', () => {
    if (timeGot.value) {
      createAlarm(timeGot.value, true);
      saveAlarm(timeGot.value, true);
      timeGot.value = '';
    }
  });

  // load saved alarms (from localStorage) into UI
  const savedAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
  savedAlarms.forEach(alarm => {
    createAlarm(alarm.time, alarm.enabled);
  });
}

/* destroy UI: clear intervals and stop sound (keeps saved alarms in storage) */
export function destroyAlarmUI() {
  alarmIntervals.forEach(id => clearInterval(id));
  alarmIntervals = [];

  if (!sharedSound.paused) {
    sharedSound.pause();
    sharedSound.currentTime = 0;
  }
}

/* save/update/delete helpers (keeps using time as key like your version) */
function saveAlarm(time, enabled) {
  const savedAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
  savedAlarms.push({ time, enabled });
  localStorage.setItem('alarms', JSON.stringify(savedAlarms));
}

function updateAlarmState(time, enabled) {
  let savedAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
  savedAlarms = savedAlarms.map(a => a.time === time ? { ...a, enabled } : a);
  localStorage.setItem('alarms', JSON.stringify(savedAlarms));
}

function deleteAlarm(time) {
  let savedAlarms = JSON.parse(localStorage.getItem('alarms')) || [];
  savedAlarms = savedAlarms.filter(a => a.time !== time);
  localStorage.setItem('alarms', JSON.stringify(savedAlarms));
}

/* small UI helper popups */
function showPopup(message) {
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.style.cssText = `
    position: fixed; top: 20px; left: 50%;
    transform: translateX(-50%); background: yellow; color: black;
    padding: 15px 25px; border: 2px solid black; font-size: 20px;
    font-weight: bold; z-index: 9999; border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

function showAlarmPopup(time) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display:flex; align-items:center;
    justify-content:center; z-index: 10000;
  `;
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: white; padding: 20px 40px; border-radius: 10px; text-align:center;
    font-size: 22px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  `;
  const message = document.createElement('p');
  message.textContent = `⏰ Alarm for ${time}!`;
  message.style.marginBottom = "20px";

  const stopBtn = document.createElement('button');
  stopBtn.textContent = "Stop Alarm";
  stopBtn.style.cssText = `
    padding: 10px 20px; font-size: 18px; font-weight:bold; background: red;
    color: white; border:none; border-radius:5px; cursor:pointer;
  `;

  stopBtn.onclick = () => {
    if (!sharedSound.paused) {
      sharedSound.pause();
      sharedSound.currentTime = 0;
    }
    overlay.remove();
  };

  popup.appendChild(message);
  popup.appendChild(stopBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

/* main: create one alarm row and its interval-checker */
function createAlarm(time, enabled) {
  const allAlarms = document.getElementById('allAlarms');
  if (!allAlarms) {
    console.error('createAlarm: #allAlarms not found. Did you call initAlarmUI()?');
    return;
  }

  const alarmItem = document.createElement('div');
  alarmItem.classList.add('alarm-times');

  alarmItem.innerHTML = `
    <p>${time}</p>
    <div class="right-alrm">
      <label class="switch">
        <input type="checkbox" class="alarm-toggle" ${enabled ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
      <button class="alarm-del">delete</button>
    </div>
  `;

  const toggle = alarmItem.querySelector('.alarm-toggle');
  let hasTriggered = false;
  let intervalId = null;

  toggle.addEventListener('change', () => {
    updateAlarmState(time, toggle.checked);
  });

  const delBtn = alarmItem.querySelector('.alarm-del');
  delBtn.addEventListener('click', () => {
    if (intervalId) clearInterval(intervalId);
    alarmItem.remove();
    deleteAlarm(time);
    alarmIntervals = alarmIntervals.filter(id => id !== intervalId);
  });

  intervalId = setInterval(() => {
    if (toggle.checked) {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
      if (currentTime === time && !hasTriggered) {
        hasTriggered = true;
        sharedSound.play().catch(err => console.log("Play blocked:", err));
        showAlarmPopup(time);
      }
      if (currentTime !== time) {
        hasTriggered = false;
        if (!sharedSound.paused) {
          sharedSound.pause();
          sharedSound.currentTime = 0;
        }
      }
    }
  }, 1000);

  alarmIntervals.push(intervalId);
  allAlarms.appendChild(alarmItem);
}
