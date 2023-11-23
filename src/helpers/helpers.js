export const extractNumericPart = (inputString) => {
  // Use regular expression to match the numeric part
  const match = inputString.match(/\d+/);

  // Check if there is a match
  if (match) {
    // Return the matched numeric part
    return match[0];
  } else {
    // Return an appropriate value or handle the case where no numeric part is found
    return null;
  }
}