import validateFileSize from './fileSize';
import validateFileType from './fileType';

export const validateFile = (file: File, input: HTMLInputElement): boolean => {
  const acceptedTypes = input.accept;
  const maxFileSize = input.dataset.maxFileSize || '';
  const maxUploadSize = input.dataset.maxUploadSize || '';

  if (acceptedTypes && !validateFileType(file, acceptedTypes)) {
    console.error(`File type ${file.type} is not allowed`);
    return false;
  }
  if (maxFileSize && !validateFileSize(file, maxFileSize)) {
    console.error(`File size exceeds the maximum limit of ${maxFileSize}`);
    return false;
  }

  // TODO: Add logic here to check total upload size against maxUploadSize
  return true;
};
