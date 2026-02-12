
import React from 'react';
import { Logo } from './Logo';
import { CertificateData } from '../types';

interface CertificateProps {
  data: CertificateData;
  certificateRef: React.RefObject<HTMLDivElement>;
}

export const Certificate: React.FC<CertificateProps> = ({ data, certificateRef }) => {
  const { name, record, date, temperature, place, shoes } = data;

  return (
    <div className="flex justify-center p-4">
      <div 
        ref={certificateRef}
        className="relative w-[800px] h-[1131px] bg-white shadow-2xl overflow-hidden p-16 flex flex-col items-center justify-between border-[20px] border-double border-amber-200"
        style={{ aspectRatio: '1 / 1.414' }}
      >
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] opacity-[0.08] pointer-events-none">
          <Logo variant="graphic" className="w-full h-full" />
        </div>

        {/* Top Border Accent */}
        <div className="w-full border-t-2 border-amber-500 mb-6 z-10"></div>

        {/* Header */}
        <div className="text-center z-10">
          <h1 className="text-6xl font-serif-kr font-bold text-slate-800 tracking-[0.5em] mb-3">기 록 증</h1>
          <p className="text-xl text-slate-500 font-medium uppercase tracking-widest">Certificate of Achievement</p>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center w-full space-y-12 z-10">
          
          <div className="text-center">
            <span className="text-sm text-slate-400 border-b border-slate-200 pb-1 uppercase tracking-[0.3em]">Runner</span>
            <h2 className="text-6xl font-serif-kr font-bold text-slate-900 mt-4">{name || "성함"}</h2>
          </div>

          <div className="text-center w-full max-w-lg">
            <span className="text-sm text-slate-400 border-b border-slate-200 pb-1 uppercase tracking-[0.3em]">Official Record</span>
            <div className="mt-4 px-12 py-10 bg-white/70 backdrop-blur-md rounded-3xl border border-amber-100 shadow-xl flex items-center justify-center">
               <h3 className="text-6xl font-black text-indigo-800 font-serif-kr tracking-tighter">{record || "00:00"}</h3>
            </div>
          </div>

          {/* Details Section: Place, Temperature, Shoes */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-xl text-center">
            {place && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Place</span>
                <span className="text-lg font-bold text-slate-700">{place}</span>
              </div>
            )}
            {temperature && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Temp</span>
                <span className="text-lg font-bold text-slate-700">{temperature}</span>
              </div>
            )}
            {shoes && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Shoes</span>
                <span className="text-lg font-bold text-slate-700">{shoes}</span>
              </div>
            )}
          </div>

          <div className="text-center max-w-lg px-8">
            <div className="text-2xl text-indigo-600 font-bold font-serif-kr leading-[1.6] tracking-tight">
              우리 동호회,<br />
              굿모닝 송도 러닝클럽은<br />
              귀하의 기록을 응원합니다.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex flex-col items-center space-y-8 pb-4 z-10">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-[0.5em] mb-2">Issue Date</p>
            <p className="text-3xl font-medium text-slate-800 border-b-2 border-slate-200 px-20 pb-2 inline-block">
              {date || "202X. XX. XX"}
            </p>
          </div>

          {/* Official Organizer Logo */}
          <div className="flex flex-col items-center">
             <Logo variant="korean" className="h-32 w-auto" />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            * 본 기록증은 기록자 본인의 성실한 측정을 바탕으로 발행되었습니다.
          </p>
        </div>

        {/* Bottom Border Accent */}
        <div className="w-full border-b-2 border-amber-500 mt-2 z-10"></div>
      </div>
    </div>
  );
};
