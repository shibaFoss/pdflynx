import axios from 'axios';

const API_BASE_URL = '/api/pdf';

export interface JobStatusResponse {
  success: boolean;
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  position: number;
  queueLength: number;
  error?: string;
}

export const api = {
  // --- SUBMISSION METHODS ---
  // Now return a jobId instead of the file Blob directly.
  
  merge: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/merge`, formData);
  },
  
  split: (file: File, range: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('range', range);
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/split`, formData);
  },
  
  compress: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/compress`, formData);
  },
  
  pdfToImage: (file: File, range: string = '1-z') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('range', range);
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/pdf-to-image`, formData);
  },
  
  imageToPdf: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/image-to-pdf`, formData);
  },
  
  htmlToPdf: (options: { url?: string; file?: File }) => {
    const formData = new FormData();
    if (options.url) formData.append('url', options.url);
    if (options.file) formData.append('file', options.file);
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/html-to-pdf`, formData);
  },
  
  protect: (file: File, password: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/protect`, formData);
  },
  
  unlock: (file: File, password: string = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/unlock`, formData);
  },
  
  rotate: (file: File, angle: string, pageRange: string = '1-z') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('angle', angle);
    formData.append('pageRange', pageRange);
    return axios.post<{ success: boolean; jobId: string }>(`${API_BASE_URL}/rotate`, formData);
  },

  // --- QUEUE & DOWNLOAD METHODS ---

  getStatus: (jobId: string) => {
    return axios.get<JobStatusResponse>(`${API_BASE_URL}/status/${jobId}`);
  },

  download: (jobId: string) => {
    return axios.get(`${API_BASE_URL}/download/${jobId}`, {
      responseType: 'blob',
    });
  },

  getPageCount: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<{ success: boolean; count: number }>(`${API_BASE_URL}/pages`, formData);
  },
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
