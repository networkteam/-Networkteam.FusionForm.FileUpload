import validateFileType from './fileType';

describe('validateFileType', () => {
  // Helper function to create a mock File object
  const createMockFile = (name: string, type: string): File => {
    return {
      name,
      type,
    } as File;
  };

  test('should accept all files when accept is empty', () => {
    const file = createMockFile('test.txt', 'text/plain');
    expect(validateFileType(file, '')).toBe(true);
  });

  test('should accept file with matching MIME type', () => {
    const file = createMockFile('image.png', 'image/png');
    expect(validateFileType(file, 'image/png')).toBe(true);
  });

  test('should accept file with matching extension', () => {
    const file = createMockFile('document.pdf', 'application/pdf');
    expect(validateFileType(file, '.pdf')).toBe(true);
  });

  test('should accept file with wildcard MIME type', () => {
    const file = createMockFile('image.jpg', 'image/jpeg');
    expect(validateFileType(file, 'image/*')).toBe(true);
  });

  test('should reject file with non-matching type', () => {
    const file = createMockFile('document.xml', 'application/xhtml+xml');
    expect(validateFileType(file, 'image/png,.pdf,text/*')).toBe(false);
  });

  test('should handle multiple accepted types', () => {
    const file = createMockFile('data.csv', 'text/csv');
    expect(validateFileType(file, '.pdf,.csv,image/*')).toBe(true);
  });

  test('should be case-insensitive', () => {
    const file = createMockFile('IMAGE.JPG', 'IMAGE/JPEG');
    expect(validateFileType(file, 'image/jpeg,.jpg')).toBe(true);
  });

  test('should handle files without extensions', () => {
    const file = createMockFile('README', 'text/plain');
    expect(validateFileType(file, 'text/plain')).toBe(true);
  });

  test('should handle files with multiple dots in the name', () => {
    const file = createMockFile('archive.tar.gz', 'application/gzip');
    expect(validateFileType(file, '.gz,application/gzip')).toBe(true);
  });
});
