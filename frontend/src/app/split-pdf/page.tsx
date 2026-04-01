'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { useJob } from '@/hooks/useJob';
import { Scissors, AlertCircle, Hash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SplitPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState('1-z');
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const { status, progress, queueInfo, error, startJob, reset: resetJob } = useJob({
    onSuccess: (blob) => {
      setResult({ blob, filename: `split_pdf_${Date.now()}.zip` });
    },
  });

  const handleSplit = async () => {
    if (files.length === 0) return;
    await startJob(() => api.split(files[0], range));
  };

  const reset = () => {
    resetJob();
    setFiles([]);
    setRange('1-z');
    setResult(null);
  };

  const isActive = status === 'queued' || status === 'processing';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/5 shadow-xl shadow-emerald-500/10 active:rotate-12 transition-transform">
            <Scissors size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Split PDF</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
               Extract pages or split a document into parts.
            </p>
          </div>
        </div>

        {status === 'idle' && files.length > 0 && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleSplit} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group bg-primary hover:bg-emerald-600">
              <Scissors className="mr-2 group-hover:rotate-12 transition-transform duration-500" size={20} strokeWidth={3} />
              Split Now
            </Button>
          </div>
        )}
      </div>

      <div className="pt-2">
        {status === 'idle' && (
          <div className="space-y-6">
            <FileUpload onFilesSelected={(f) => setFiles(f)} multiple={false} />
            {files.length > 0 && (
              <div className="premium-card p-6 px-8 animate-in zoom-in duration-500 relative overflow-hidden group border-2 rounded-[32px]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-3 min-w-max">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary ring-4 ring-primary/5">
                      <Hash size={20} strokeWidth={3} />
                    </div>
                    <label className="text-lg font-black tracking-tight text-foreground">Page Range</label>
                  </div>
                  <div className="flex-1 w-full relative">
                    <input
                      type="text"
                      value={range}
                      onChange={(e) => setRange(e.target.value)}
                      placeholder="e.g. 1-5, 8, 11-z"
                      className="w-full bg-muted/40 border-2 border-border/40 rounded-2xl px-6 h-14 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground font-bold whitespace-nowrap italic opacity-70">
                    Use &quot;z&quot; for last page
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isActive && (
        <div className="py-12 relative">
          {status === 'queued' && (
            <div className="absolute top-0 right-0 flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 text-amber-600 font-black text-sm border border-amber-500/20 animate-pulse">
              <Loader2 className="animate-spin" size={16} />
              HEAVY LOAD MODE
            </div>
          )}
          <ProgressBar
            progress={progress}
            label={status === 'queued' ? 'Tasks are Queued' : 'Splitting PDF...'}
            sublabel={status === 'queued' && queueInfo ? `Waiting in line... Position: ${queueInfo.position} / ${queueInfo.length}` : 'Slicing your document into precisely what you need'}
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
