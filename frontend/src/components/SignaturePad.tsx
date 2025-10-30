import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  onCancel: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signature = sigCanvas.current.toDataURL();
      onSave(signature);
    }
  };

  const handleEnd = () => {
    setIsEmpty(sigCanvas.current?.isEmpty() || false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Signature électronique</h3>
        <p className="text-gray-600 mb-4">
          Signez dans la zone ci-dessous avec votre doigt ou votre souris
        </p>
        
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: 'w-full h-64 bg-gray-50',
            }}
            onEnd={handleEnd}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={clear}
            className="btn-secondary"
            disabled={isEmpty}
          >
            Effacer
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex items-center gap-2"
          >
            <X size={18} />
            Annuler
          </button>
          <button
            type="button"
            onClick={save}
            className="btn-primary flex items-center gap-2"
            disabled={isEmpty}
          >
            <Check size={18} />
            Valider la signature
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;

