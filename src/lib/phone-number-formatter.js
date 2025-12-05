export const formatPhoneNumber = (value) => {
  // Format the phone number as XXX-XXXX-XXXX or XXX-XXX-XXXX
  if (value.length > 3 && value.length <= 7) {
    value = `${value.slice(0, 3)}-${value.slice(3)}`;
  } else if (value.length === 10) {
    value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  } else if (value.length > 7) {
    value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  } else {
    value = value;
  }
  return value;
};
