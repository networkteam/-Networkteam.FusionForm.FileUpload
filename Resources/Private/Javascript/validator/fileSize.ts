const validateFileSize = (file: File, maxFileSize: string): boolean => {
  // If no maxFileSize string is provided, allow any file size
  if (!maxFileSize) return true;

  // Parse the maxFileSize string
  const sizeRegex = /^(\d+(\.\d+)?)\s*(B|K|M|G|KB|MB|GB)?$/i;
  const match = maxFileSize.match(sizeRegex);

  if (!match) {
    console.error('Invalid maxFileSize string:', maxFileSize);
    return false;
  }

  const [, size, , unit = 'B'] = match;
  const maxBytes =
    parseFloat(size) *
    ({
      B: 1,
      K: 1024,
      M: 1024 * 1024,
      G: 1024 * 1024 * 1024,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    }[unit.toUpperCase()] || 1);

  return file.size <= maxBytes;
};

export default validateFileSize;
