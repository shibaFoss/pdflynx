'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PdfToImagePage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to convert.');
      return;
    }

    setStatus('processing');
    setProgress(30);
    setError(null);

    try {
      setProgress(60);
      const response = await api.pdfToImage(files[0]);
      setProgress(90);
      
      const blob = response.data;
      const filename = `images_from_pdf_${Date.now()}.png`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while converting your PDF.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex p-4 rounded-3xl bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5 shadow-sm transform hover:rotate-12 transition-transform">
          <ImageIcon size={32} />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-foreground">PDF to Image</h1>
        <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
          Transform your PDF pages into high-quality images effortlessly.
        </p>
      </div>

      {status === 'idle' && (
        <div className="space-y-12">
          <FileUpload onFilesSelected={(f) => setFiles(f)} multiple={false} />
          {files.length > 0 && (
            <div className="flex justify-center pt-8">
              <Button size="lg" onClick={handleConvert} className="px-12 rounded-full h-14 text-lg font-bold shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-transform group bg-rose-500 hover:bg-rose-600">
                <ImageIcon className="mr-2 group-hover:scale-125 transition-transform" />
                Convert to Images
              </Button>
            </div>
          )}
        </div>
      )}

      {status === 'processing' && (
        <ProgressBar progress={progress} label="Converting to Images..." sublabel="Extracting visuals from your document" />
      )}

      {status === 'success' && result && (
        <ResultDownload 
          filename={result.filename} 
          onDownload={() => downloadBlob(result.blob, result.filename)}
          onReset={reset}
        />
      )}

       {status === 'error' && (
        <div className="premium-card p-12 text-center space-y-8 border-destructive/20 bg-destructive/5 animate-in shake duration-500">
          <div className="inline-flex p-6 rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
             <AlertCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-foreground">Oops! Something went wrong</h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">{error}</p>
          <Button onClick={reset} variant="outline" className="rounded-full px-10">Try Again</Button>
        </div>
      )}
    </div>
  );
}
