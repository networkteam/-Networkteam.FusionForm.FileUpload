const validateFileType = (file: File, accept: string): boolean => {
  // If no accept string is provided, allow all file types
  if (!accept) return true;

  const acceptedTypes = accept
    .split(',')
    .map((type) => type.trim().toLowerCase());

  const fileMimeType = file.type.toLowerCase();
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  // Check if the file matches any of the accepted types
  return acceptedTypes.some((type) => {
    // Exact MIME type match
    if (type === fileMimeType) return true;

    // Wildcard MIME type match (e.g., "image/*")
    if (type.endsWith('/*')) {
      const [typeCategory] = type.split('/');
      return fileMimeType.startsWith(`${typeCategory}/`);
    }

    // File extension match
    if (type.startsWith('.') && type.slice(1) === fileExtension) return true;

    return false;
  });
};

export default validateFileType;
