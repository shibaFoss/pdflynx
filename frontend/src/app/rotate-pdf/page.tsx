'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { useJob } from '@/hooks/useJob';
import { RefreshCw, AlertCircle, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [transformation, setTransformation] = useState('90');
  const [pageRange, setPageRange] = useState('1-1');
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  const { status, progress, queueInfo, error, startJob, reset: resetJob } = useJob({
    onSuccess: (blob) => {
      setResult({ blob, filename: `transformed_${file?.name || 'document.pdf'}` });
    },
  });

  const handleRotate = async () => {
    if (!file) return;
    const isFlip = transformation === 'flipH' || transformation === 'flipV';
    await startJob(() => api.rotate(file, transformation, isFlip ? pageRange : '1-z'));
  };

  const reset = () => {
    resetJob();
    setFile(null);
    setTransformation('90');
    setPageRange('1-1');
    setResult(null);
  };

  const isActive = status === 'queued' || status === 'processing';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-violet-500/10 text-violet-500 ring-4 ring-violet-500/5 shadow-xl shadow-violet-500/10">
            <RefreshCw size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Rotate PDF</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
              Easily rotate all pages in your PDF document.
            </p>
          </div>
        </div>

        {status === 'idle' && file && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleRotate} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group bg-violet-600 hover:bg-violet-700 uppercase tracking-tighter">
              <RefreshCw className="mr-2 group-hover:rotate-180 transition-transform duration-700" size={20} strokeWidth={3} />
              Transform PDF
            </Button>
          </div>
        )}
      </div>

      <div className="pt-2">
        {status === 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <FileUpload onFilesSelected={(files) => setFile(files[0])} multiple={false} />
            </div>
            <div className="premium-card p-10 space-y-8 animate-in slide-in-from-right-8 duration-700">
              <div className="space-y-2">
                <h3 className="text-xl font-black">Rotation Angle</h3>
                <p className="text-sm text-muted-foreground font-medium">Select how much you want to rotate each page.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: '90° Right', value: '90', icon: RotateCw },
                  { label: '180°', value: '180', icon: RefreshCw },
                  { label: '90° Left', value: '270', icon: RotateCcw },
                ].map((option) => (
                  <button key={option.value} onClick={() => setTransformation(option.value)}
                    className={`flex flex-col items-center justify-center p-6 rounded-[24px] border-2 transition-all gap-4 ${transformation === option.value ? 'bg-violet-500/10 border-violet-500 text-violet-700 ring-4 ring-violet-500/5' : 'bg-secondary/30 border-transparent hover:bg-secondary/50 text-muted-foreground'}`}>
                    <option.icon size={28} strokeWidth={2.5} />
                    <span className="font-black text-xs uppercase tracking-widest">{option.label}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <h3 className="text-xl font-black">Mirror &amp; Flip</h3>
                  <p className="text-sm text-muted-foreground font-medium">Flip the pages horizontally or vertically.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Flip Horizontal', value: 'flipH', icon: FlipHorizontal },
                    { label: 'Flip Vertical', value: 'flipV', icon: FlipVertical },
                  ].map((option) => (
                    <button key={option.value} onClick={() => setTransformation(option.value)}
                      className={`flex flex-col items-center justify-center p-6 rounded-[24px] border-2 transition-all gap-4 ${transformation === option.value ? 'bg-violet-500/10 border-violet-500 text-violet-700 ring-4 ring-violet-500/5' : 'bg-secondary/30 border-transparent hover:bg-secondary/50 text-muted-foreground'}`}>
                      <option.icon size={28} strokeWidth={2.5} />
                      <span className="font-black text-xs uppercase tracking-widest">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {(transformation === 'flipH' || transformation === 'flipV') ? (
                <div className="space-y-6 pt-4 border-t border-border animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
                    <div className="text-amber-600 shrink-0"><AlertCircle size={20} /></div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-amber-900">Image Conversion Required</p>
                      <p className="text-[10px] text-amber-900/70 font-medium leading-relaxed">Mirroring pages requires converting the PDF into high-quality images. The resulting file will be a rasterized PDF.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Page Selection</h4>
                      <span className="text-[10px] font-bold text-violet-600 bg-violet-600/10 px-2 py-0.5 rounded-full">Required for Mirror</span>
                    </div>
                    <div className="relative">
                      <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} placeholder="e.g. 1-2, 5, 1-z" className="w-full h-14 px-6 rounded-[16px] bg-secondary/30 border-2 border-border focus:border-violet-500 focus:bg-white outline-none text-sm font-bold transition-all" />
                      <p className="mt-2 text-[10px] text-muted-foreground font-medium pl-1">Use format: <b>1-3</b> for range, <b>5</b> for single page, or <b>1-z</b> for all.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 flex gap-4">
                  <div className="text-violet-600 shrink-0"><RefreshCw size={20} /></div>
                  <p className="text-xs text-violet-900/70 font-medium leading-relaxed">Tip: This will apply the same transformation to all pages in your document.</p>
                </div>
              )}
            </div>
          </div>
        )}

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
              label={status === 'queued' ? 'Tasks are Queued' : 'Applying Transformation...'}
              sublabel={status === 'queued' && queueInfo ? `Waiting in line... Position: ${queueInfo.position} / ${queueInfo.length}` : `Processing your document with ${transformation} setting.`}
            />
          </div>
        )}

        {status === 'success' && result && (
          <ResultDownload filename={result.filename} onDownload={() => downloadBlob(result.blob, result.filename)} onReset={reset} />
        )}

        {status === 'error' && (
          <div className="premium-card p-16 text-center space-y-10 border-destructive/20 bg-destructive/5 animate-in shake duration-500 rounded-[48px]">
            <div className="inline-flex p-8 rounded-[32px] bg-destructive/10 text-destructive ring-8 ring-destructive/5">
              <AlertCircle size={64} strokeWidth={2.5} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-foreground">Transformation Failed</h2>
              <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">{error}</p>
            </div>
            <Button onClick={reset} variant="outline" className="rounded-2xl px-12 h-14 font-black border-2">Try Again</Button>
          </div>
        )}
      </div>
    </div>
  );
}
