export const useHelper = () => {
  const compareArrays = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const toCapitalCase = (str) => {
    return str?.replace(/\b\w/g, function (char) {
      return char?.toUpperCase();
    });
  };

  const textEllipsis = (text, length, dots = true) => {
    if (text?.length > length) {
      return `${text?.slice(0, length)}${dots ? "..." : ""}`;
    }

    return text;
  };

  const convertSecondsToMinutesAndSeconds = (seconds) => {
    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    return { minutes, seconds: remainingSeconds };
  };

  const uniqueArrayOfObjects = (array, key) => {
    return array.filter((obj, index) => {
      return array.findIndex((o) => o[key] === obj[key]) === index;
    });
  };

  const toQueryString = (filter) => {
    const queryArray = Object.entries(filter).map(([key, value]) => {
      return value ? `${key}=${value}` : null;
    });

    const queryString = queryArray?.reduce((acc, curr) => {
      if (curr) {
        return `${acc}${curr}&`;
      }
      return acc;
    }, "");

    const query = queryString.slice(0, queryString.length - 1);
    return query;
  };

  function findThumbnailWithMaxHeight(array, number = 0) {
    if (array?.length === 0) {
      return null;
    }

    const objectsWithCustomHeight = array?.find((obj) => obj.height === number);

    if (objectsWithCustomHeight) {
      return objectsWithCustomHeight;
    }
    const maxHeight = array?.find((obj) => {
      return obj.height > number;
    });

    return maxHeight;
  }

  const findAvatarWithMaxHeight = (array, number = 0) => {
    if (array?.length === 0) {
      return null; // If the array is empty, return null
    }

    const maxHeight = array?.reduce((prev, curr) => {
      return curr.height > prev.height ? curr : prev;
    });

    return maxHeight;
  };

  function addTrailingCommas(number) {
    let numberString = number.toString();
    let decimalPart = "";
    if (numberString.indexOf(".") !== -1) {
      decimalPart = numberString.slice(numberString.indexOf("."));
      numberString = numberString.slice(0, numberString.indexOf("."));
    }
    let result = "";
    let counter = 0;
    for (let i = numberString.length - 1; i >= 0; i--) {
      result = numberString[i] + result;
      counter++;
      if (counter % 3 === 0 && i !== 0) {
        result = "," + result;
      }
    }
    return result + decimalPart;
  }

  function basisPointsToPercentage(basisPoints) {
    return (basisPoints / 10000) * 100;
  }

  function centsToDollars(cents) {
    if (isNaN(cents)) {
      return;
    }
    return cents / 100;
  }

  const viewsFormatter = (views) => {
    views = +views
    if (views >= 1000000) {
      return (views / 1000000) + "M";
    } else if (views >= 1000) {
      return (views / 1000) + "K";
    } else {
      return views.toString();
    }
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
    toQueryString,
    findThumbnailWithMaxHeight,
    findAvatarWithMaxHeight,
    addTrailingCommas,
    basisPointsToPercentage,
    centsToDollars,
    viewsFormatter
  };
};
