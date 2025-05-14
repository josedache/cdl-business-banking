const splitPhoneNumber = (input: string, countries: { code: string }[]) => {
  if (!input) return { countryCode: countries[0].code, phoneNumber: "" };
  const digits = input.replace(/\D/g, "");
  const withPlus = input.startsWith("+") ? input : `+${digits}`;

  const match = countries.find((c) => withPlus.startsWith(c.code));

  if (match) {
    const numberWithoutCode = digits.slice(match.code.replace("+", "").length);
    return { countryCode: match.code, phoneNumber: numberWithoutCode };
  }

  return { countryCode: "", phoneNumber: digits };
};

export default splitPhoneNumber;
