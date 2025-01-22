export const getRandomCode = (length: number) => {
  return Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, "0");
};

export const getRandomnumberInRange = ({
  min = 0,
  max,
}: {
  min: number;
  max: number;
}) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
};

export const dateDiffInDays = (date1: Date, date2: Date) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const fromNowInDays = (days: number) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export const publicSelect = {
  createdAt: 0,
  updatedAt: 0,
  createdBy: 0,
  updatedBy: 0,
};

export const ToNumber = (val: any): number => {
  return parseInt(val as string);
};
