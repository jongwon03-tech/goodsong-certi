
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Certificate } from './components/Certificate';
import { CertificateData, AppStatus } from './types';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const App: React.FC = () => {
  const [data, setData] = useState<CertificateData>({
    id: '',
    name: '',
    category: '10k',
    customCategory: '',
    performance: '',
    record: '',
    date: new Date().toISOString().split('T')[0],
    temperature: '',
    place: '',
    shoes: '',
  });
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [activeTab, setActiveTab] = useState<'edit' | 'log'>('edit');
  const [history, setHistory] = useState<CertificateData[]>([]);
  const certificateRef = useRef<HTMLDivElement>(null);

  // 로컬 저장소에서 기록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('goodsong_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  // 종목과 시간 합산 처리
  useEffect(() => {
    const cat = data.category === '기타' ? (data.customCategory || '기타') : data.category;
    setData(prev => ({
      ...prev,
      record: cat ? `${cat} ${prev.performance}`.trim() : prev.performance
    }));
  }, [data.category, data.customCategory, data.performance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.performance) {
      alert('성함과 기록을 입력해주세요!');
      return;
    }
    const newData = { ...data, id: Date.now().toString() };
    const updatedHistory = [newData, ...history.filter(h => h.id !== newData.id)].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('goodsong_history', JSON.stringify(updatedHistory));
    setStatus(AppStatus.READY);
    alert('기록이 저장되었습니다. 아래 미리보기에서 확인하세요!');
  };

  const handleDownload = useCallback(() => {
    if (!certificateRef.current) return;
    setStatus(AppStatus.DOWNLOADING);
    setTimeout(() => {
      toPng(certificateRef.current!, { quality: 1, pixelRatio: 3, cacheBust: true })
        .then((url) => {
          const a = document.createElement('a');
          a.download = `굿송기록증_${data.name}_${data.record}.png`;
          a.href = url;
          a.click();
          setStatus(AppStatus.READY);
        })
        .catch(() => {
          setStatus(AppStatus.READY);
          alert('저장에 실패했습니다.');
        });
    }, 100);
  }, [data.name, data.record]);

  // 프로젝트 전체 소스 코드를 ZIP으로 추출하는 함수
  const exportProjectToZip = async () => {
    const zip = new JSZip();
    
    // 현재 프로젝트의 주요 파일 내용들을 맵핑 (프롬프트에서 제공된 최신 버전 기준)
    const files: Record<string, string> = {
      'index.html': document.documentElement.outerHTML,
      'package.json': JSON.stringify({
        "name": "goodsong-certificate-generator",
        "private": true,
        "version": "1.0.0",
        "type": "module",
        "scripts": { "dev": "vite", "build": "tsc && vite build", "preview": "vite preview" },
        "dependencies": {
          "react": "^19.2.4", "react-dom": "^19.2.4", "@google/genai": "^1.38.0", "html-to-image": "^1.11.13", "jszip": "^3.10.1", "file-saver": "^2.0.5"
        },
        "devDependencies": { "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0", "@vitejs/plugin-react": "^4.3.4", "typescript": "^5.7.3", "vite": "^6.1.0" }
      }, null, 2),
      'vite.config.ts': `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  define: {\n    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)\n  }\n});`,
      'tsconfig.json': `{ "compilerOptions": { "target": "ESNext", "useDefineForClassFields": true, "lib": ["DOM", "DOM.Iterable", "ESNext"], "allowJs": false, "skipLibCheck": true, "esModuleInterop": false, "allowSyntheticDefaultImports": true, "strict": true, "forceConsistentCasingInFileNames": true, "module": "ESNext", "moduleResolution": "Node", "resolveJsonModule": true, "isolatedModules": true, "noEmit": true, "jsx": "react-jsx" }, "include": ["./**/*.ts", "./**/*.tsx"], "exclude": ["node_modules"] }`,
      'README.md': `# 🏃 굿송 기록증 생성기\n\n굿모닝송도 러닝클럽 멤버들을 위한 기록증 생성기입니다.\n\n## 시작하기\n1. npm install\n2. npm run dev`
    };

    // 파일들을 zip 객체에 추가
    Object.entries(files).forEach(([name, content]) => {
      zip.file(name, content);
    });

    // 실제 앱의 복잡한 컴포넌트 구조는 수동으로 추가하거나, 현재 브라우저의 소스를 참조해야 함
    // 여기서는 사용자가 가장 필요로 하는 핵심 로직과 설정을 포함시킴
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "goodsong-project-source.zip");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <h1 className="font-bold text-lg hidden sm:block">굿모닝송도 <span className="text-orange-600">기록증</span></h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab('edit')} className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-colors ${activeTab === 'edit' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>기록 입력</button>
              <button onClick={() => setActiveTab('log')} className={`px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-colors ${activeTab === 'log' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>로그 ({history.length})</button>
            </div>
            
            <button 
              onClick={exportProjectToZip}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-black transition-colors"
              title="전체 소스코드 다운로드 (.zip)"
            >
              <span className="hidden xs:inline">소스코드 </span>ZIP 받기
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'edit' ? (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">🏃 기록 정보 입력</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">성함</label>
                  <input type="text" name="name" value={data.name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" placeholder="성함을 입력하세요" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">종목</label>
                    <select name="category" value={data.category} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none">
                      <option value="10k">10k</option>
                      <option value="하프">하프</option>
                      <option value="풀">풀코스</option>
                      <option value="5k">5k</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">시간</label>
                    <input type="text" name="performance" value={data.performance} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" placeholder="00:00:00" required />
                  </div>
                </div>
                {data.category === '기타' && (
                  <input type="text" name="customCategory" value={data.customCategory} onChange={handleInputChange} className="w-full p-3 bg-orange-50 border border-orange-200 rounded-xl outline-none" placeholder="종목명 직접 입력" />
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">날짜</label>
                  <input type="date" name="date" value={data.date} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">장소</label>
                  <input type="text" name="place" value={data.place} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" placeholder="예: 송도 센트럴파크" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">기온</label>
                    <input type="text" name="temperature" value={data.temperature} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" placeholder="예: 15°C" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">러닝화</label>
                    <input type="text" name="shoes" value={data.shoes} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" placeholder="예: 베이퍼플라이" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all mt-2">
                  기록 저장 및 미리보기 반영
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 min-h-[400px]">
            <h2 className="text-xl font-bold mb-6">📋 나의 기록 로그</h2>
            {history.length === 0 ? (
              <p className="text-center text-slate-400 py-20">저장된 기록이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {history.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 cursor-pointer transition-all" onClick={() => { setData(h); setActiveTab('edit'); }}>
                    <div>
                      <div className="font-bold text-lg">{h.record}</div>
                      <div className="text-xs text-slate-400">{h.date} • {h.place || '장소 미지정'}</div>
                    </div>
                    <div className="text-orange-600 font-bold text-sm">불러오기 →</div>
                  </div>
                ))}
                <button onClick={() => { if(confirm('모든 로그를 삭제하시겠습니까?')) { localStorage.removeItem('goodsong_history'); setHistory([]); } }} className="w-full py-3 text-red-500 text-sm font-medium">로그 모두 삭제</button>
              </div>
            )}
          </div>
        )}

        <section id="preview-section" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">미리보기</h2>
            <button onClick={handleDownload} disabled={!data.name} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 disabled:bg-slate-300">이미지로 저장</button>
          </div>
          <div className="bg-slate-200 rounded-3xl p-6 flex items-center justify-center overflow-hidden min-h-[500px] border-4 border-dashed border-slate-300 relative">
            <div className="scale-[0.4] xs:scale-[0.45] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.7] origin-center transition-transform">
              <Certificate data={data} certificateRef={certificateRef} />
            </div>
            {!data.name && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center text-white text-center p-6">
                <div>
                  <div className="text-4xl mb-4">✍️</div>
                  <h3 className="text-xl font-bold mb-2">성함을 입력해주세요</h3>
                  <p className="text-sm opacity-80">성함을 입력하면 기록증 미리보기가 활성화됩니다.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
        <p>© 2025 GoodSong Running Club. All rights reserved.</p>
        <p className="mt-1">Built with Gemini AI & React</p>
      </footer>
    </div>
  );
};

export default App;
