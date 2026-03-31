'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/pdf/FileUpload';
import { ProgressBar } from '@/components/pdf/ProgressBar';
import { ResultDownload } from '@/components/pdf/ResultDownload';
import { api, downloadBlob } from '@/lib/api';
import { Shield, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProtectPdfPage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProtect = async () => {
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setStatus('processing');
    setProgress(20);
    setError(null);

    try {
      setProgress(40);
      const response = await api.protect(file, password);
      setProgress(80);
      
      const blob = response.data;
      const filename = `protected_${file.name}`;
      
      setResult({ blob, filename });
      setProgress(100);
      setTimeout(() => setStatus('success'), 500);
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'An error occurred while protecting your PDF.';
      setError(message);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFile(null);
    setPassword('');
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pt-4">
        <div className="flex items-center gap-6 text-left">
          <div className="p-4 rounded-[24px] bg-amber-500/10 text-amber-500 ring-4 ring-amber-500/5 shadow-xl shadow-amber-500/10">
            <Shield size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">Protect PDF</h1>
            <p className="text-base text-muted-foreground font-medium max-w-md">
              Secure your PDF documents with industry-standard encryption.
            </p>
          </div>
        </div>

        {status === 'idle' && file && password && (
          <div className="flex-shrink-0 animate-in zoom-in-95 duration-500">
            <Button size="lg" onClick={handleProtect} className="px-10 rounded-[20px] h-16 text-lg font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group bg-amber-600 hover:bg-amber-700 uppercase tracking-tighter">
              <Lock className="mr-2 group-hover:scale-110 transition-transform duration-500" size={20} strokeWidth={3} />
              Encrypt PDF
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
                   <h3 className="text-xl font-black">Security Settings</h3>
                   <p className="text-sm text-muted-foreground font-medium">Choose a strong password to lock your document.</p>
                </div>
                
                <div className="space-y-4">
                   <div className="relative">
                      <label 
                        htmlFor="password" 
                        className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                      >
                         User Password
                      </label>
                      <input 
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full h-16 px-6 rounded-[20px] bg-secondary/30 border-2 border-border focus:border-amber-500 focus:bg-white outline-none text-lg font-medium transition-all"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-600 transition-colors"
                      >
                         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                   </div>
                   
                   <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                      <div className="text-amber-600 shrink-0">
                         <Shield size={20} />
                      </div>
                      <p className="text-xs text-amber-900/70 font-medium leading-relaxed">
                        Notice: We don't store your passwords. If you lose this password, the PDF cannot be recovered.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="py-12">
            <ProgressBar progress={progress} label="Encrypting Document..." sublabel="Applying AES-256 bit encryption to your file." />
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
          <div className="premium-card p-16 text-center space-y-10 border-destructive/20 bg-destructive/5 animate-in shake duration-500 rounded-[48px]">
            <div className="inline-flex p-8 rounded-[32px] bg-destructive/10 text-destructive ring-8 ring-destructive/5">
               <AlertCircle size={64} strokeWidth={2.5} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-foreground">Wait! Something went wrong</h2>
              <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">{error}</p>
            </div>
            <Button onClick={reset} variant="outline" className="rounded-2xl px-12 h-14 font-black border-2">Try Again</Button>
          </div>
        )}
      </div>
    </div>
  );
}
