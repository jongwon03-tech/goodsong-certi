
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Certificate } from './components/Certificate';
import { CertificateData, AppStatus } from './types';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const App: React.FC = () => {
  const [data, setData] = useState<CertificateData>({
    id: '', name: '', category: '10k', customCategory: '', performance: '', record: '',
    date: new Date().toISOString().split('T')[0], temperature: '', place: '', shoes: '',
  });
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [activeTab, setActiveTab] = useState<'edit' | 'log'>('edit');
  const [history, setHistory] = useState<CertificateData[]>([]);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('goodsong_history');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); } }
  }, []);

  useEffect(() => {
    const cat = data.category === '기타' ? (data.customCategory || '기타') : data.category;
    setData(prev => ({ ...prev, record: cat ? `${cat} ${prev.performance}`.trim() : prev.performance }));
  }, [data.category, data.customCategory, data.performance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.performance) { alert('성함과 기록을 입력해주세요!'); return; }
    const newData = { ...data, id: Date.now().toString() };
    const updatedHistory = [newData, ...history.filter(h => h.id !== newData.id)].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('goodsong_history', JSON.stringify(updatedHistory));
    setStatus(AppStatus.READY);
    alert('기록이 저장되었습니다!');
  };

  const handleDownload = useCallback(() => {
    if (!certificateRef.current) return;
    setStatus(AppStatus.DOWNLOADING);
    setTimeout(() => {
      toPng(certificateRef.current!, { quality: 1, pixelRatio: 3, cacheBust: true })
        .then((url) => {
          const a = document.createElement('a');
          a.download = `굿송기록증_${data.name}.png`;
          a.href = url;
          a.click();
          setStatus(AppStatus.READY);
        }).catch(() => { setStatus(AppStatus.READY); alert('저장에 실패했습니다.'); });
    }, 100);
  }, [data.name]);

  const exportProjectToZip = async () => {
    try {
      const zip = new JSZip();
      zip.file('index.html', document.documentElement.outerHTML);
      zip.file('README.md', '# GoodSong Certificate Project Backup');
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "goodsong-backup.zip");
      alert('백업 파일이 생성되었습니다.');
    } catch (err) {
      alert('백업 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-100">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-200 group-hover:rotate-6 transition-transform">G</div>
            <h1 className="font-black text-xl tracking-tighter uppercase">GoodSong <span className="text-orange-600">Cert</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>만들기</button>
            <button onClick={() => setActiveTab('log')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'log' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>기록로그</button>
            <button onClick={exportProjectToZip} className="ml-2 p-2 text-slate-400 hover:text-slate-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          {activeTab === 'edit' ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                Runner Info
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input type="text" name="name" value={data.name} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-lg" placeholder="성함" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Event</label>
                    <select name="category" value={data.category} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold">
                      <option value="10k">10k</option><option value="하프">하프</option><option value="풀">풀코스</option><option value="5k">5k</option><option value="기타">기타</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                    <input type="text" name="performance" value={data.performance} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold" placeholder="00:00:00" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input type="date" name="date" value={data.date} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold" />
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95">기록 저장</button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[500px]">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                History
              </h2>
              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-sm">No records</div>
                ) : (
                  history.map(h => (
                    <div key={h.id} onClick={() => { setData(h); setActiveTab('edit'); }} className="group p-5 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-orange-200 hover:bg-white cursor-pointer transition-all flex justify-between items-center">
                      <div>
                        <div className="text-xl font-black text-slate-800 group-hover:text-orange-600 transition-colors">{h.record}</div>
                        <div className="text-xs text-slate-400 font-bold mt-1 uppercase">{h.date} • {h.name}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 opacity-0 group-hover:opacity-100 transition-all">→</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Preview</h2>
              <p className="text-slate-400 font-bold text-sm tracking-tight">당신의 기록이 빛나는 순간</p>
            </div>
            <button onClick={handleDownload} disabled={!data.name} className="px-8 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-700 disabled:bg-slate-200 disabled:shadow-none hover:-translate-y-1 transition-all">이미지 저장</button>
          </div>
          
          <div className="bg-slate-200 rounded-[3rem] p-6 flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl relative min-h-[600px]">
            <div className="scale-[0.35] xs:scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.65] origin-center shadow-2xl transition-transform duration-500">
              <Certificate data={data} certificateRef={certificateRef} />
            </div>
            {!data.name && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-white">
                <div className="animate-pulse text-center">
                  <div className="text-5xl mb-4">✍️</div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Input Your Name</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
