'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { useJob } from '@/hooks/useJob';
import { Image as ImageIcon, AlertCircle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PdfToImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeType, setRangeType] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState('1-1');
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const { status, progress, queueInfo, error, startJob, reset: resetJob } = useJob({
    onSuccess: (blob) => {
      setResult({ blob, filename: `images_from_pdf_${Date.now()}.png` });
    },
  });

  const analyzePdf = async (file: File) => {
    setAnalyzing(true);
    try {
      const response = await api.getPageCount(file);
      setPageCount(response.data.count);
      setCustomRange(`1-${response.data.count}`);
    } catch {
      // ignore analyze error
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (files.length > 0 && status === 'idle') {
      analyzePdf(files[0]);
    }
  }, [files]);

  const handleConvert = async () => {
    if (files.length === 0) return;
    const range = rangeType === 'all' ? `1-${pageCount}` : customRange;
    await startJob(() => api.pdfToImage(files[0], range));
  };

  const reset = () => {
    resetJob();
    setFiles([]);
    setPageCount(0);
    setRangeType('all');
    setResult(null);
  };

  const isActive = status === 'queued' || status === 'processing';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-rose-500/10 text-rose-500 ring-4 ring-rose-500/5 shadow-xl shadow-rose-500/10 active:rotate-12 transition-transform">
            <ImageIcon size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">PDF to Image</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
               Turn PDF pages into high-quality images.
            </p>
          </div>
        </div>

        {status === 'idle' && files.length > 0 && pageCount > 0 && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleConvert} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all group bg-rose-500 hover:bg-rose-600">
              <ImageIcon className="mr-2 group-hover:scale-110 transition-transform duration-500" size={20} strokeWidth={3} />
              Convert Now
            </Button>
          </div>
        )}
      </div>

      <div className="pt-2">
        {status === 'idle' && files.length === 0 && (
          <FileUpload onFilesSelected={(f) => setFiles(f)} multiple={false} />
        )}

        {analyzing && (
          <div className="premium-card p-12 text-center space-y-6 rounded-[32px]">
             <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
             <p className="text-xl font-bold">Analyzing your PDF...</p>
          </div>
        )}

        {status === 'idle' && files.length > 0 && pageCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="lg:col-span-1 space-y-6">
              <div className="premium-card p-6 flex flex-col items-center text-center space-y-4 border-2 rounded-[32px]">
                <div className="p-4 bg-rose-500/5 rounded-2xl text-rose-500 ring-4 ring-rose-500/5">
                  <ImageIcon size={32} strokeWidth={2.5} />
                </div>
                <div className="space-y-1 overflow-hidden w-full">
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Selected File</p>
                  <p className="font-bold truncate text-sm">{files[0].name}</p>
                </div>
                <div className="inline-flex px-4 py-1.5 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-black ring-2 ring-rose-500/5">
                  {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                </div>
                <Button variant="ghost" size="sm" onClick={reset} className="text-xs font-bold text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 rounded-lg w-full">Change File</Button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {pageCount > 1 ? (
                <div className="premium-card p-6 md:p-8 space-y-8 border-2 rounded-[32px] h-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => setRangeType('all')} className={`p-5 rounded-2xl border-2 transition-all text-left space-y-2 ${rangeType === 'all' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <p className="font-black text-base">Convert All Pages</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Join all pages into one image.</p>
                    </button>
                    <button onClick={() => setRangeType('custom')} className={`p-5 rounded-2xl border-2 transition-all text-left space-y-2 ${rangeType === 'custom' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <p className="font-black text-base">Select Range</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Specify pages to extract.</p>
                    </button>
                  </div>

                  {rangeType === 'custom' && (
                    <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-wider">Page Range (e.g. 1-5)</label>
                      <input type="text" value={customRange} onChange={(e) => setCustomRange(e.target.value)} placeholder="e.g. 1-10" className="w-full h-14 px-6 rounded-2xl bg-muted/40 border-2 border-transparent focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold text-lg transition-all" />
                    </div>
                  )}

                  {((rangeType === 'all' && pageCount > 10) || (rangeType === 'custom' && parseInt(customRange.split('-')[1]) - parseInt(customRange.split('-')[0]) > 10)) && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
                      <Info className="shrink-0 mt-0.5" size={16} />
                      <p className="text-xs font-bold leading-relaxed">Converting many pages might result in a very large file. System limits may apply.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="premium-card p-12 text-center flex flex-col items-center justify-center space-y-4 border-2 rounded-[32px] h-full dashed border-border/50">
                   <p className="text-lg font-black text-muted-foreground/60 italic">Ready to convert!</p>
                   <p className="text-sm text-muted-foreground font-medium max-w-xs">This is a single page document and will be converted to a high-quality image.</p>
                </div>
              )}
            </div>
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
            label={status === 'queued' ? 'Tasks are Queued' : 'Converting to Image...'}
            sublabel={status === 'queued' && queueInfo ? `Waiting in line... Position: ${queueInfo.position} / ${queueInfo.length}` : 'Joining pages into your final high-quality visual'}
          />
        </div>
      )}

      {status === 'success' && result && (
        <ResultDownload filename={result.filename} onDownload={() => downloadBlob(result.blob, result.filename)} onReset={reset} />
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
