import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAnswerStatus(answer) {  
  switch (answer) {
    case true:
      return "Correct";
    case false:
      return "Incorrect";
    case "InApplicable":
      return "InApplicable";
    default:
      return "";
  }
}

export function formatDateTime(dateString){
  
  return new Date(dateString).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
  });
}

export function formatDateTimeLocal(dateString) {
  const date = new Date(dateString); 

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`; // for datetime-local input
}

export function formatDuration(seconds) {
  const mins = seconds / 60;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hrs && remainingMins) return `${hrs} hr ${remainingMins} min`;
  if (hrs) return `${hrs} hr`;
  return `${remainingMins} min`;
}


export function getEffectiveDuration(endTime, configuredDuration) {
  const now = new Date();
  const end = new Date(endTime);

  const timeLeft = Math.floor((end - now) / 1000); // seconds left until exam window ends  
  return Math.max(0, Math.min(configuredDuration, timeLeft)); // don't go negative
}