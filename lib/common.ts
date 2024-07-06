export const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const formatDate = (createdAt): string => {
  const options: any = {
    month: "short",
    day: "numeric",
  };

  const d = new Date(createdAt);
  const timezoneOffset = d.getTimezoneOffset();
  d.setTime(d.getTime() + timezoneOffset * 60000);
  return d.toLocaleDateString("cl-ES", options);
};
