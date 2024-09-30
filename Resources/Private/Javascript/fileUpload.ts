import { createThumbnailNode, formatFileSize } from './utils';
import { validateFile } from './validator/file';

class FileUploadInput {
  private input: HTMLInputElement;
  private container: HTMLDivElement;
  private fileList: HTMLDivElement;
  private dataTransfer: DataTransfer;

  constructor(input: HTMLInputElement, dropAreaSelector?: string) {
    this.input = input;
    this.dataTransfer = new DataTransfer();
    this.setupInput();
    if (dropAreaSelector) {
      this.setupDropArea(dropAreaSelector);
    }
  }

  // TODO: Add a way to customize the file container/list (at least get class names from a config object)
  private setupInput() {
    this.container = document.createElement('div');
    this.container.className = 'file-upload-container';
    this.input.parentNode?.insertBefore(this.container, this.input);
    this.container.appendChild(this.input);

    this.fileList = document.createElement('div');
    this.fileList.className = 'file-list';
    this.container.appendChild(this.fileList);

    this.input.addEventListener('change', () => this.handleFiles());
  }

  private setupDropArea(dropAreaSelector: string) {
    const dropArea = document.querySelector(dropAreaSelector);
    if (!dropArea) {
      console.error('Drop area selector provided but no element was found');
      return;
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e: Event) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, () =>
        dropArea.classList.add('highlight')
      );
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, () =>
        dropArea.classList.remove('highlight')
      );
    });

    dropArea.addEventListener('drop', (e: Event) => {
      const dragEvent = e as DragEvent;
      const files = dragEvent.dataTransfer?.files;
      if (files) {
        this.addFiles(Array.from(files));
      }
    });
  }

  private handleFiles() {
    const newFiles = Array.from(this.input.files || []);
    this.addFiles(newFiles);
  }

  private addFiles(files: File[]) {
    files.forEach((file) => {
      if (validateFile(file, this.input)) {
        this.dataTransfer.items.add(file);
        this.addFileToList(file);
      } else {
        console.error(`File ${file.name} is not valid`);
        // TODO: Add user-friendly error message
      }
    });
    this.updateInputFiles();
  }

  // TODO: Add a way to customize the file list item (at least get class names from a config object)
  private addFileToList(file: File) {
    const fileBloc = document.createElement('span');
    fileBloc.className = 'file-block';

    const fileName = document.createElement('span');
    fileName.className = 'name';
    fileName.textContent = file.name;

    const fileSize = document.createElement('span');
    fileSize.className = 'size';
    fileSize.textContent = ` (${formatFileSize(file.size)})`;

    const deleteButton = document.createElement('span');
    deleteButton.className = 'file-delete';
    deleteButton.innerHTML = '<span>Delete</span>';
    deleteButton.onclick = () => this.removeFile(file.name, fileBloc);

    fileBloc.appendChild(deleteButton);
    fileBloc.appendChild(fileName);
    fileBloc.appendChild(fileSize);

    if (file.type.startsWith('image/')) {
      const thumbnail = createThumbnailNode(file);
      fileBloc.appendChild(thumbnail);
    }

    this.fileList.appendChild(fileBloc);
  }

  private removeFile(fileName: string, fileBloc: HTMLElement) {
    fileBloc.remove();
    for (let i = 0; i < this.dataTransfer.items.length; i++) {
      if (this.dataTransfer.items[i].kind === 'file') {
        const file = this.dataTransfer.items[i].getAsFile();
        if (file && file.name === fileName) {
          this.dataTransfer.items.remove(i);
          break;
        }
      }
    }
    this.updateInputFiles();
  }

  private updateInputFiles() {
    this.input.files = this.dataTransfer.files;
  }
}

export default FileUploadInput;
