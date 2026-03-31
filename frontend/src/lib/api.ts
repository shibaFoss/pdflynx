import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/pdf';

export const api = {
  merge: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return axios.post(`${API_BASE_URL}/merge`, formData, {
      responseType: 'blob',
    });
  },
  split: (file: File, range: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('range', range);
    return axios.post(`${API_BASE_URL}/split`, formData, {
      responseType: 'blob',
    });
  },
  compress: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/compress`, formData, {
      responseType: 'blob',
    });
  },
  pdfToImage: (file: File, range: string = '1-z') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('range', range);
    return axios.post(`${API_BASE_URL}/pdf-to-image`, formData, {
      responseType: 'blob',
    });
  },
  getPageCount: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<{ success: boolean; count: number }>(`${API_BASE_URL}/pages`, formData);
  },
  imageToPdf: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return axios.post(`${API_BASE_URL}/image-to-pdf`, formData, {
      responseType: 'blob',
    });
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
