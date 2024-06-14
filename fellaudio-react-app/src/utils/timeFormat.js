export function formatDateTimeIntoDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export function formatDateTimeIntoAgoDate(dateString) {
  const now = new Date()
  const nowUTC = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
  const date = new Date(dateString);
  
  const diffInSeconds = Math.floor((nowUTC - date) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInMonth = secondsInDay * 30;
  const secondsInYear = secondsInDay * 365;

  if (diffInSeconds >= secondsInYear) {
    const years = Math.floor(diffInSeconds / secondsInYear);
    return `${years} р. тому`;
  } else if (diffInSeconds >= secondsInMonth) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} міс. тому`;
  } else if (diffInSeconds >= secondsInDay) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return days === 1 ? 'вчора' : `${days} д. тому`;
  } else if (diffInSeconds >= secondsInHour) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} год тому`;
  } else if (diffInSeconds >= secondsInMinute) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} хв тому`;
  } else {
    return `${diffInSeconds} сек тому`;
  }
}


export function formatDurationTime(timeInSeconds) {
  if(timeInSeconds){
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    if(hours !== 0)
      return `${hours} год ${minutes} хв`

    return `${minutes} хв`
  }
}