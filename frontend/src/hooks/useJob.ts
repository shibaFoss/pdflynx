import { useState, useRef, useCallback } from 'react';
import { api, JobStatusResponse } from '@/lib/api';

interface UseJobOptions {
  onSuccess?: (blob: Blob) => void;
  onError?: (message: string) => void;
}

/**
 * useJob manages the polling and status tracking for a PDF background task.
 */
export function useJob(options: UseJobOptions = {}) {
  const [status, setStatus] = useState<'idle' | 'queued' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [queueInfo, setQueueInfo] = useState<{ position: number; length: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  }, []);

  const startJob = async (submitTask: () => Promise<{ data: { jobId: string } }>) => {
    setStatus('queued'); // Start with the queue state
    setProgress(0);
    setError(null);
    setQueueInfo(null);
    
    try {
      // 1. Submit the task
      const { data } = await submitTask();
      const jobId = data.jobId;

      // 2. Start polling for status
      pollInterval.current = setInterval(async () => {
        try {
          const { data: job } = await api.getStatus(jobId);
          
          if (job.status === 'queued') {
            setStatus('queued');
            setQueueInfo({ position: job.position, length: job.queueLength });
            // Subtle progress for queued state
            setProgress(Math.min(10, (1 / (job.position + 1)) * 10));
          } 
          
          else if (job.status === 'processing') {
            setStatus('processing');
            setQueueInfo(null);
            setProgress(Math.max(20, job.progress));
          } 
          
          else if (job.status === 'completed') {
            cleanup();
            setProgress(100);
            
            // 3. Download the final result
            const { data: blob } = await api.download(jobId);
            setStatus('success');
            options.onSuccess?.(blob);
          } 
          
          else if (job.status === 'failed') {
            cleanup();
            setStatus('error');
            const errMsg = job.error || 'Server processing failed.';
            setError(errMsg);
            options.onError?.(errMsg);
          }
        } catch (err: any) {
          cleanup();
          setStatus('error');
          setError('Failed to track task status.');
        }
      }, 1500); // Poll every 1.5 seconds

    } catch (err: any) {
      setStatus('error');
      const message = err.response?.data?.message || err.message || 'Submission failed.';
      setError(message);
      options.onError?.(message);
    }
  };

  const reset = () => {
    cleanup();
    setStatus('idle');
    setProgress(0);
    setQueueInfo(null);
    setError(null);
  };

  return {
    status,
    progress,
    queueInfo,
    error,
    startJob,
    reset,
  };
}
