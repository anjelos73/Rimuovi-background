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

export type Quality = 'standard' | 'high';

export type Format = 'png' | 'jpeg';

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}