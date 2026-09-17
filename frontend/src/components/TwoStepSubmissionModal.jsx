import { useState } from 'react';
import { X, ExternalLink, Check, UploadCloud } from 'lucide-react';

export default function TwoStepSubmissionModal({ isOpen, onClose, assignment, onSubmit }) {
  const [step, setStep] = useState(1);
  const [confirmedUpload, setConfirmedUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleNext = () => {
    if (confirmedUpload) setStep(2);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSubmit(assignment.id);
        onClose();
        setStep(1);
        setConfirmedUpload(false);
        setSuccess(false);
      }, 1500);
    }, 1500);
  };

  const handleClose = () => {
    setStep(1);
    setConfirmedUpload(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white border border-black rounded-none w-full max-w-lg relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-black">
          <h2 className="text-xl font-bold text-black">
            {step === 1 ? 'Step 1: Upload Work' : 'Step 2: Confirm Submission'}
          </h2>
          {!success && (
            <button onClick={handleClose} className="text-black hover:bg-black hover:text-white p-1">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white border-b border-black h-2">
          <div 
            className="bg-black h-full"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <h3 className="text-2xl font-bold text-black mb-2">Submitted</h3>
            </div>
          ) : step === 1 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-2">{assignment.title}</h3>
                <p className="text-sm text-black">{assignment.description}</p>
              </div>

              <div className="bg-white border border-black p-5 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 border border-black flex items-center justify-center text-black">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-sm text-black mb-3">Please upload your files to the designated OneDrive folder first.</p>
                  <a 
                    href={assignment.oneDriveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black border border-black hover:bg-black hover:text-white font-bold"
                  >
                    Open OneDrive Folder <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 border border-black cursor-pointer hover:bg-gray-100">
                <input 
                  type="checkbox" 
                  className="mt-1 accent-black w-4 h-4 rounded-none"
                  checked={confirmedUpload}
                  onChange={(e) => setConfirmedUpload(e.target.checked)}
                />
                <span className="text-sm text-black leading-relaxed font-bold">
                  I confirm that I have uploaded all required files to the provided OneDrive link and they are named correctly.
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={handleClose}
                  className="px-5 py-2 border border-black text-black hover:bg-black hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!confirmedUpload}
                  className="px-5 py-2 bg-black text-white font-bold disabled:opacity-50 border border-black"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white border border-black p-5 space-y-4">
                <div>
                  <p className="text-sm text-[#666] mb-1 font-bold">Assignment</p>
                  <p className="font-bold text-black">{assignment.title}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666] mb-1 font-bold">Status</p>
                  <div className="inline-flex items-center px-2 py-1 border border-black font-bold text-xs text-black">
                    Pending Confirmation
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#666] mb-1 font-bold">Timestamp</p>
                  <p className="font-bold text-black font-mono text-sm">{new Date().toLocaleString()}</p>
                </div>
              </div>

              <p className="text-sm text-black text-center font-bold">
                By confirming, you are finalizing your submission. This action will notify your professor.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="px-5 py-2 border border-black text-black hover:bg-black hover:text-white font-bold disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="px-5 py-2 bg-black text-white font-bold disabled:opacity-50 border border-black"
                >
                  {loading ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
