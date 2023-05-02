import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const secondsTimer = document.querySelector('span[data-seconds]');
const minutesTimer = document.querySelector('span[data-minutes]');
const hoursOfTimer = document.querySelector('span[data-hours]');
const daysOfTimer = document.querySelector('span[data-days]');

const btnStart = document.querySelector('button[data-start]');
const inputTime = document.querySelector('input[type="text"]');

btnStart.setAttribute('disabled', '');

flatpickr(inputTime, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Confirm.show('', 'Будь-ласка, виберіть майбутню дату', 'OK', '');
      return;
    }
    btnStart.removeAttribute('disabled');
    const finalDate = selectedDates[0].getTime();

    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = finalDate - currentTime;

      if (deltaTime <= 0) {
        clearInterval(intervalId);
        return;
      }
      const { days, hours, minutes, seconds } = convertMs(deltaTime);
      secondsTimer.textContent = `${seconds}`.padStart(2, '0');
      minutesTimer.textContent = `${minutes}`.padStart(2, '0');
      hoursOfTimer.textContent = `${hours}`.padStart(2, '0');
      daysOfTimer.textContent = `${days}`.padStart(2, '0');
    }, 1000);
    btnStart.setAttribute('disabled', '');
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}
