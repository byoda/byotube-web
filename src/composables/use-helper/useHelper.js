export const useHelper = () => {
  const compareArrays = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const toCapitalCase = (str) => {
    return str?.replace(/\b\w/g, function (char) {
      return char?.toUpperCase();
    });
  };

  const textEllipsis = (text, length) => {
    if (text.length > length) {
      return text.slice(0, length);
    }
  };

  const convertSecondsToMinutesAndSeconds = (seconds) => {
    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    return { minutes, seconds: remainingSeconds };
  };

  const uniqueArrayOfObjects = (array, key)=>{
    return array.filter((obj, index)=>{
      return array.findIndex(o => o[key] === obj[key]) === index
    })
  }

  const convertDateToDuration = (date) => {
    const currentDate = new Date();
    const inputDate = new Date(date);
    const timeDifference = currentDate - inputDate;

    const seconds = Math.floor(timeDifference / 1000);

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return {
    textEllipsis,
    compareArrays,
    toCapitalCase,
    uniqueArrayOfObjects,
    convertDateToDuration,
    convertSecondsToMinutesAndSeconds,
  };
};
