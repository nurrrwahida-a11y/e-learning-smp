import React, { useState, useRef, useEffect } from 'react';
import { Printer, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';

interface PrintExportDropdownProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  onDirectPrint?: () => void;
  buttonClassName?: string;
  variant?: 'blue' | 'emerald' | 'slate';
  tooltip?: string;
}

export const PrintExportDropdown: React.FC<PrintExportDropdownProps> = ({
  onExportPDF,
  onExportExcel,
  onDirectPrint,
  buttonClassName = '',
  variant = 'blue',
  tooltip = 'Cetak Langsung Printer & Unduh (PDF / Excel)',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const defaultButtonStyles = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
    slate: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs',
  };

  const handleSelect = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  const handlePrint = () => {
    setIsOpen(false);
    if (onDirectPrint) {
      onDirectPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="relative inline-block text-left no-print" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title={tooltip}
        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
          buttonClassName || defaultButtonStyles[variant]
        }`}
      >
        <Printer className="w-4 h-4 shrink-0" />
        <span>Cetak</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3.5 py-2 border-b border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pilihan Cetak & Unduh Dokumen</p>
          </div>

          <div className="p-1 space-y-1">
            {/* Direct Printer Option */}
            <button
              type="button"
              role="menuitem"
              onClick={handlePrint}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/80 flex items-center gap-3 transition-colors group cursor-pointer border border-transparent hover:border-blue-200"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Printer className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Cetak Langsung (Printer)</p>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">Fisik</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Hubungkan ke printer atau dialog cetak browser</p>
              </div>
            </button>

            {/* PDF Option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSelect(onExportPDF)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-50/70 flex items-center gap-3 transition-colors group cursor-pointer border border-transparent hover:border-rose-200"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-rose-900">Unduh Format PDF</p>
                <p className="text-[10px] text-slate-400 leading-tight">Dokumen resmi (.pdf) siap cetak & arsip</p>
              </div>
            </button>

            {/* Excel Option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => handleSelect(onExportExcel)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50/70 flex items-center gap-3 transition-colors group cursor-pointer border border-transparent hover:border-emerald-200"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">Unduh Format Excel</p>
                <p className="text-[10px] text-slate-400 leading-tight">Spreadsheet data (.xlsx) Microsoft Excel</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
