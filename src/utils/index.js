import uniqby from "lodash.uniqby";
import { months } from "../constants";

export const expandDate = (list) => {
  return list.map((item) => {
    const date = new Date(item.createdAt);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    return { ...item, year, month, day };
  });
};

export const getData = (group) => {
  let maxOpenings = 0;
  let maxUniq = 0;
  const result = [];

  for (const value of Object.values(group)) {
    const uniq = uniqby(value, "id");

    maxOpenings = value.length > maxOpenings ? value.length : maxOpenings;
    maxUniq = uniq.length > maxUniq ? uniq.length : maxUniq;
  }

  for (const [key, value] of Object.entries(group)) {
    const bar = {};
    const uniq = uniqby(value, "id").length;

    bar.name = key;
    bar.openings = value.length;
    bar.uniq = uniq;
    bar.openingsHeight = (value.length * 100) / maxOpenings;
    bar.uniqHeight = (uniq * 100) / maxUniq;

    result.push(bar);
  }

  return result;
};
