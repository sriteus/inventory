export const trimDateStrings = (data: Record<string, any>) => {
  const trimmedData: Record<string, any> = { ...data };

  Object.keys(trimmedData).forEach((key) => {
    const value = trimmedData[key];

    // If the value is a date string in ISO format, trim it to "yyyy-MM-dd"
    if (typeof value === 'string' && value.includes('T')) {
      // Trimming to the date part (yyyy-MM-dd)
      trimmedData[key] = value.split('T')[0];
    }
  });

  return trimmedData;
};
