'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { useJob } from '@/hooks/useJob';
import { Zap, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CompressPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const { status, progress, queueInfo, error, startJob, reset: resetJob } = useJob({
    onSuccess: (blob) => {
      setResult({ blob, filename: `compressed_pdf_${Date.now()}.pdf` });
    },
  });

  const handleCompress = async () => {
    if (files.length === 0) return;
    await startJob(() => api.compress(files[0]));
  };

  const reset = () => {
    resetJob();
    setFiles([]);
    setResult(null);
  };

  const isActive = status === 'queued' || status === 'processing';

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

      {isActive && (
        <div className="relative">
          {status === 'queued' && (
            <div className="absolute top-0 right-0 flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 text-amber-600 font-black text-sm border border-amber-500/20 animate-pulse">
              <Loader2 className="animate-spin" size={16} />
              HEAVY LOAD MODE
            </div>
          )}
          <ProgressBar
            progress={progress}
            label={status === 'queued' ? 'Tasks are Queued' : 'Squeezing your PDF...'}
            sublabel={status === 'queued' && queueInfo ? `Waiting in line... Position: ${queueInfo.position} / ${queueInfo.length}` : 'Compressing data to save you storage and bandwidth'}
          />
        </div>
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
