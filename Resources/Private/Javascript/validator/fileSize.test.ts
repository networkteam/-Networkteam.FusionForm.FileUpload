import validateFileSize from './fileSize';

describe('validateFileSize', () => {
  // Helper function to create a mock File object with a specific size
  const createMockFile = (sizeInBytes: number): File => {
    return {
      size: sizeInBytes,
    } as File;
  };

  test('should accept any file size when maxFileSize is not provided', () => {
    const file = createMockFile(1000000000); // 1 GB
    expect(validateFileSize(file, '')).toBe(true);
  });

  test('should accept file within byte limit', () => {
    const file = createMockFile(500);
    expect(validateFileSize(file, '1000')).toBe(true);
    expect(validateFileSize(file, '500B')).toBe(true);
    expect(validateFileSize(file, '1K')).toBe(true);
    expect(validateFileSize(file, '1KB')).toBe(true);
  });

  test('should reject file exceeding byte limit', () => {
    const file = createMockFile(1500);
    expect(validateFileSize(file, '1000')).toBe(false);
    expect(validateFileSize(file, '1000B')).toBe(false);
    expect(validateFileSize(file, '1K')).toBe(false);
    expect(validateFileSize(file, '1KB')).toBe(false);
  });

  test('should accept file within KB/K limit', () => {
    const file = createMockFile(1024 * 500); // 500 KB
    expect(validateFileSize(file, '500KB')).toBe(true);
    expect(validateFileSize(file, '500K')).toBe(true);
    expect(validateFileSize(file, '1M')).toBe(true);
    expect(validateFileSize(file, '1MB')).toBe(true);
  });

  test('should reject file exceeding KB/K limit', () => {
    const file = createMockFile(1024 * 1500); // 1.5 MB
    expect(validateFileSize(file, '1000KB')).toBe(false);
    expect(validateFileSize(file, '1000K')).toBe(false);
    expect(validateFileSize(file, '1M')).toBe(false);
    expect(validateFileSize(file, '1MB')).toBe(false);
  });

  test('should accept file within MB/M limit', () => {
    const file = createMockFile(1024 * 1024 * 5); // 5 MB
    expect(validateFileSize(file, '5MB')).toBe(true);
    expect(validateFileSize(file, '5M')).toBe(true);
    expect(validateFileSize(file, '10MB')).toBe(true);
    expect(validateFileSize(file, '10M')).toBe(true);
  });

  test('should reject file exceeding MB/M limit', () => {
    const file = createMockFile(1024 * 1024 * 15); // 15 MB
    expect(validateFileSize(file, '10MB')).toBe(false);
    expect(validateFileSize(file, '10M')).toBe(false);
  });

  test('should accept file within GB/G limit', () => {
    const file = createMockFile(1024 * 1024 * 1024 * 1.5); // 1.5 GB
    expect(validateFileSize(file, '2GB')).toBe(true);
    expect(validateFileSize(file, '2G')).toBe(true);
  });

  test('should reject file exceeding GB/G limit', () => {
    const file = createMockFile(1024 * 1024 * 1024 * 2.5); // 2.5 GB
    expect(validateFileSize(file, '2GB')).toBe(false);
    expect(validateFileSize(file, '2G')).toBe(false);
  });

  test('should handle decimal values in size limit', () => {
    const file = createMockFile(1024 * 1024 * 1.5); // 1.5 MB
    expect(validateFileSize(file, '1.6MB')).toBe(true);
    expect(validateFileSize(file, '1.6M')).toBe(true);
    expect(validateFileSize(file, '1.4MB')).toBe(false);
    expect(validateFileSize(file, '1.4M')).toBe(false);
  });

  test('should be case-insensitive for units', () => {
    const file = createMockFile(1024 * 500); // 500 KB
    expect(validateFileSize(file, '500kb')).toBe(true);
    expect(validateFileSize(file, '500k')).toBe(true);
    expect(validateFileSize(file, '0.5MB')).toBe(true);
    expect(validateFileSize(file, '0.5m')).toBe(true);
    expect(validateFileSize(file, '0.0005gb')).toBe(true);
    expect(validateFileSize(file, '0.0005g')).toBe(true);
  });

  test('should return false for invalid size format', () => {
    const file = createMockFile(1000);
    expect(validateFileSize(file, '1X')).toBe(false);
    expect(validateFileSize(file, '1KMB')).toBe(false);
    expect(validateFileSize(file, 'abc')).toBe(false);
  });

  test('should log error for invalid size format', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const file = createMockFile(1000);
    validateFileSize(file, 'invalid');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Invalid maxFileSize string:',
      'invalid'
    );
    consoleSpy.mockRestore();
  });
});
