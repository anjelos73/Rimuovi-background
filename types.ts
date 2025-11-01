
export interface FileDetails {
  file: File;
  preview: string;
}

export interface GenerativePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}
