export function formatDateTimeIntoDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}

export function formatDateTimeIntoAgoDate(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInMonth = secondsInDay * 30;
  const secondsInYear = secondsInDay * 365;

  if (diffInSeconds >= secondsInYear) {
    const years = Math.floor(diffInSeconds / secondsInYear);
    return `${years}y. ago`;
  } else if (diffInSeconds >= secondsInMonth) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months}m. ago`;
  } else if (diffInSeconds >= secondsInDay) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    if (days === 1) {
      return 'yesterday';
    }
    return `${days}d. ago`;
  } else if (diffInSeconds >= secondsInHour) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours}h. ago`;
  } else if (diffInSeconds >= secondsInMinute) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes}min ago`;
  } else {
    return `${diffInSeconds}sec ago`;
  }
}

export function formatDurationTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
  if(hours !== 0)
    return `${hours} год ${minutes} хв`

  return `${minutes} хв`
}