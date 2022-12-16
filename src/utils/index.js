import uniqby from "lodash.uniqby";

export const expandDate = (list) => {
  return list.map((item) => {
    const date = new Date(item.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return { ...item, year, month, day };
  });
};

export const getYearData = (group) => {
  let maxOpenings = 0;
  let maxUniq = 0;
  const result = [];

  for (const value of Object.values(group)) {
    const uniq = uniqby(value, "id");

    maxOpenings = value.length > maxOpenings ? value.length : maxOpenings;
    maxUniq = uniq.length > maxUniq ? uniq.length : maxUniq;
  }

  for (const [key, value] of Object.entries(group)) {
    const year = {};
    const uniq = uniqby(value, "id").length;

    year.name = key;
    year.openings = value.length;
    year.uniq = uniq;
    year.openingsHeight = (value.length * 100) / maxOpenings;
    year.uniqHeight = (uniq * 100) / maxUniq;

    result.push(year);
  }

  return result;
};
