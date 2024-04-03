export const useAccountOptions = () => {
  const rows = [
    {
      byotube: "Choose Nickname",
      anonymous: "No",
      lite: "No",
      liteFunded: "Yes",
      plain: "Yes",
      creator: "Yes",
    },
    {
      byotube: "Follow Creator",
      anonymous: "No",
      lite: "Yes(*)",
      liteFunded: "Yes",
      plain: "Yes",
      creator: "Yes",
    },
    {
      byotube: "Tip",
      anonymous: "No",
      lite: "No",
      liteFunded: "Yes",
      plain: "Yes",
      creator: "Yes",
    },
    {
      byotube: "Feed Algorithm selection",
      anonymous: "No",
      lite: "No",
      liteFunded: "No",
      plain: "Yes",
      creator: "Yes",
    },
    {
      byotube: "Likes",
      anonymous: "No",
      lite: "Yes(*)",
      liteFunded: "Yes",
      plain: "Yes",
      creator: "Yes",
    },
    {
      byotube: "Post Comments",
      anonymous: "No",
      lite: "No",
      liteFunded: "Yes",
      plain: "Yes",
      creator: "Yes",
    },
    {
      byotube: "Maintain Lists",
      anonymous: "No",
      lite: "Yes",
      liteFunded: "Yes",
      plain: "Yes",
      creator: "Yes",
    },
    {
      byotube: "Video upload",
      anonymous: "No",
      lite: "No",
      liteFunded: "No",
      plain: "No",
      creator: "Yes",
    },
    {
      byotube: "Youtube Import",
      anonymous: "No",
      lite: "No",
      liteFunded: "No",
      plain: "Yes(*)",
      creator: "Yes",
    },
    {
      byotube: "Data on BYODA pod",
      anonymous: "No",
      lite: "No",
      liteFunded: "No",
      plain: "Yes",
      creator: "Yes",
    },
  ];

  const featuresTooltips = {
    "Choose Nickname":
      "Your nickname is unique and will show up on your channel and your comments",
    "Choose Handle":
      "Your handle is unique and people can go to your channel using www.byo.tube/channel/@<handle> (feature under development",
    "Follow Creator": "Follow the creators of the content you love",
    "Subscribe to Creator":
      "Pay for a monthly subscription to see the subscriber-only content of a creator",
    "Tip": "Give the creator of the video a tip",
    "BYO.Tube Ultra": "See videos hosted on BYO.Tube without ads",
    "Watch History": "See the list of videos you have watched",
    "Feed Algorithm selection":
      "Select the algorithm that creates the 'For You' feed (feature under development)",
    Likes: "Like/Dislike videos",
    "Post Comments": "Post comments to videos (feature under development)",
    Bookmarks: "Keep track of videos you have watched",
    "Maintain Lists":
      "Create your own lists and add videos to them (feature under development)",
    "Video upload":
      "Upload videos directly to BYO.Tube (feature under development)",
    "Youtube Import": "Import your videos from YouTube",
    "Data on BYODA pod":
      "You can run the BYODA pod yourself or have it hosted at https://byo.host/",
  };

  const contentTooltips = {
    "Follow Creator": "The creator does not know you follow them",
    Likes: "Your likes are not visible to others",
    "Youtube Import":
      "Import of metadata only, videos will be streaming from and monetized by YouTube",
  };

  const liteFundedTooltip =
    "To prevent bots and spam, make a one-time donation of $4.99 to upgrade from a 'Lite' to a 'Lite - funded' account";

  const headers = [
    {
      title: "Features",
      align: "start",
      sortable: false,
      key: "byotube",
      width: "220",
    },
    {
      title: "Anonymous",
      key: "anonymous",
      align: "center",
      sortable: false,
      width: "20",
    },
    {
      title: "Lite",
      key: "lite",
      align: "center",
      sortable: false,
      width: "160",
    },
    {
      title: "Lite - funded(*)",
      key: "liteFunded",
      align: "center",
      sortable: false,
      width: "160",
    },
    {
      title: "Standard",
      key: "plain",
      align: "center",
      sortable: false,
      width: "160",
    },
    {
      title: "Creator",
      key: "creator",
      align: "center",
      sortable: false,
      width: "160",
    },
  ];

  const getIconColor = (val) => {
    return val.includes("Yes") ? "green" : "red";
  };

  const getIcon = (val) => {
    return val.includes("Yes") ? "check" : "close";
  };

  const getValue = (val) => {
    return val.includes("Yes") ? val.replace("Yes", "") : val.replace("No", "");
  };

  const getFeatureTooltip = (val) => {
    return featuresTooltips[val];
  };

  const getContentTooltip = (val, item) => {
    if (val.includes("*")) {
      return contentTooltips[item?.byotube];
    }
  };

  const openUrl = (url) => {
    window.open(url);
  };

  return {
    headers,
    rows,
    liteFundedTooltip,
    getIconColor,
    getIcon,
    getValue,
    getFeatureTooltip,
    getContentTooltip,
    openUrl,
  };
};
