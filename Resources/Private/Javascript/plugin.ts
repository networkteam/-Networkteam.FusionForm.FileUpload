import FileUploadInput from './fileUpload';

class FileUploadPlugin {
  private selector: string;
  private dropAreaSelector: string;
  private inputs: FileUploadInput[] = [];

  constructor(options: { selector: string; dropAreaSelector?: string }) {
    this.selector = options.selector;
    this.dropAreaSelector = options.dropAreaSelector || '';
    this.init();
  }

  private init() {
    const fileInputs = document.querySelectorAll<HTMLInputElement>(
      this.selector
    );
    fileInputs.forEach((input) => {
      this.inputs.push(new FileUploadInput(input, this.dropAreaSelector));
    });
  }
}

declare global {
  interface Window {
    FileUploadPlugin: typeof FileUploadPlugin;
  }
}

window.FileUploadPlugin = FileUploadPlugin;
