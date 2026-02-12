
export interface CertificateData {
  id: string;
  name: string;
  category: string;
  customCategory?: string;
  performance: string;
  record: string;
  date: string;
  temperature?: string;
  place?: string;
  shoes?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  READY = 'READY',
  DOWNLOADING = 'DOWNLOADING'
}
