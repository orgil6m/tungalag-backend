export const isValidPhone = (phone: string) => {
  const mongolianPhoneRegex = /^(?:1|6|8|9)\d{7}$/;

  return mongolianPhoneRegex.test(phone);
};
