'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CompressPdfPage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to compress.');
      return;
    }

    setStatus('processing');
    setProgress(30);
    setError(null);

    try {
      setProgress(60);
      const response = await api.compress(files[0]);
      setProgress(90);
      
      const blob = response.data;
      const filename = `compressed_pdf_${Date.now()}.pdf`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err) {
      console.error(err);
      const message = (err as any).response?.data?.message || 'An error occurred while compressing your PDF.';
      setError(message);
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
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-amber-500/10 text-amber-500 ring-4 ring-amber-500/5 shadow-xl shadow-amber-500/10 active:-rotate-12 transition-transform">
            <Zap size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Compress PDF</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
               Reduce file size while maintaining quality.
            </p>
          </div>
        </div>

        {status === 'idle' && files.length > 0 && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleCompress} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all group bg-amber-500 hover:bg-amber-600">
              <Zap className="mr-2 group-hover:animate-pulse" size={20} strokeWidth={3} />
              Compress Now
            </Button>
          </div>
        )}
      </div>

      <div className="pt-2">
        {status === 'idle' && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <FileUpload onFilesSelected={(f) => setFiles(f)} multiple={false} />
          </div>
        )}
      </div>

      {status === 'processing' && (
        <ProgressBar progress={progress} label="Squeezing your PDF..." sublabel="Compressing data to save you storage and bandwidth" />
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
