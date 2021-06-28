export const removeDuplicates = (arr) => {
  if (!Array.isArray(arr)) throw new Error("not an array");
  const array = arr.filter((val, index) => arr.indexOf(val) === index);

  return array;
};
export const filterList = (value, list, api) => {
  if (!Array.isArray(list)) return;

  switch (api) {
    case "channels":
      return value && value.trim().length
        ? list.filter((o) =>
            Object.keys(o).some((k) => {
              return k === "channelName"
                ? o[k].toLowerCase().includes(value.toLowerCase())
                : false;
            })
          )
        : list;

    case "users":
      return value && value.trim().length
        ? list.filter((o) =>
            Object.keys(o).some((k) => {
              return k === "username"
                ? o[k].toLowerCase().includes(value.toLowerCase())
                : false;
            })
          )
        : list;

      break;
    default:
      return;
  }

  return value && value.trim().length
    ? list.filter((o) => o.toLowerCase().includes(value.toLowerCase()) !== -1)
    : list;
};
