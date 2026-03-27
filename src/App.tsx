import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Info } from 'lucide-react';

// --- 数据定义 (纯本地，无需联网) ---

type Point = { x: number; y: number };

interface StageData {
  id: number;
  title: string;
  description: string;
  redArmyPos: Point;
  redArmyPath: string;
  enemies: { id: string; pos: Point; label: string }[];
  highlights?: string[];
}

const CITIES = [
  { id: 'zunyi', name: '遵义', pos: { x: 600, y: 350 } },
  { id: 'tucheng', name: '土城', pos: { x: 450, y: 200 } },
  { id: 'zhaxi', name: '扎西', pos: { x: 150, y: 250 } },
  { id: 'maotai', name: '茅台', pos: { x: 450, y: 300 } },
  { id: 'guiyang', name: '贵阳', pos: { x: 650, y: 500 } },
  { id: 'jinsha', name: '金沙江 (皎平渡)', pos: { x: 100, y: 500 } },
];

const STAGES: StageData[] = [
  {
    id: 0,
    title: '初始态势：遵义会议后',
    description: '1935年1月，红军占领遵义。面对国民党军队的围追堵截，毛泽东重新取得了指挥权。',
    redArmyPos: { x: 600, y: 350 },
    redArmyPath: 'M 600,350',
    enemies: [
      { id: 'e1', pos: { x: 400, y: 150 }, label: '川军' },
      { id: 'e2', pos: { x: 700, y: 450 }, label: '中央军' }
    ]
  },
  {
    id: 1,
    title: '一渡赤水：摆脱追兵',
    description: '1月下旬，红军离开遵义，在土城地区受挫后，果断西渡赤水河。',
    redArmyPos: { x: 450, y: 200 },
    redArmyPath: 'M 600,350 L 450,200',
    enemies: [{ id: 'e1', pos: { x: 550, y: 150 }, label: '川军' }]
  },
  {
    id: 2,
    title: '二渡赤水：回师遵义',
    description: '红军在扎西地区集结后，见敌兵力空虚，突然折回东渡赤水，重占遵义。',
    redArmyPos: { x: 600, y: 350 },
    redArmyPath: 'M 450,200 L 150,250 L 450,300 L 600,350',
    enemies: [{ id: 'e2', pos: { x: 650, y: 450 }, label: '中央军' }]
  },
  {
    id: 3,
    title: '三渡、四渡：调虎离山',
    description: '三渡赤水引诱敌人向西，随后快速四渡赤水，折向南进，直逼贵阳。',
    redArmyPos: { x: 650, y: 500 },
    redArmyPath: 'M 600,350 L 450,300 L 400,300 L 450,300 L 650,500',
    enemies: [{ id: 'e2', pos: { x: 750, y: 550 }, label: '主力军' }]
  },
  {
    id: 4,
    title: '胜利跨越：巧渡金沙江',
    description: '红军虚晃一枪甩掉追兵，急行军北上，于皎平渡胜利渡过金沙江，跳出了敌人的包围圈。',
    redArmyPos: { x: 100, y: 500 },
    redArmyPath: 'M 650,500 L 400,550 L 100,500',
    enemies: []
  }
];

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentStage((prev) => (prev + 1) % STAGES.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const next = () => setCurrentStage((prev) => Math.min(prev + 1, STAGES.length - 1));
  const prev = () => setCurrentStage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-500/30 overflow-hidden">
      {/* 顶部标题栏 */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-red-600 italic">四渡赤水战役可视化沙盘</h1>
            <p className="text-zinc-400 mt-1 uppercase tracking-widest text-xs">The Four Crossings of the Chishui River</p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur px-4 py-2 rounded-full border border-zinc-800 text-sm">
             阶段 {currentStage + 1} / {STAGES.length}
          </div>
        </div>
      </header>

      {/* 主画布 */}
      <main className="relative w-full h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl aspect-[16/10] bg-zinc-900/40 rounded-3xl border border-zinc-800/50 shadow-2xl overflow-hidden">
          
          {/* 模拟地形背景 */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#333_1px,transparent_1px)] bg-[length:40px_40px]" />
          </div>

          <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
            {/* 绘制城市节点 */}
            {CITIES.map(city => (
              <g key={city.id}>
                <circle cx={city.pos.x} cy={city.pos.y} r="4" fill="#52525b" />
                <text x={city.pos.x} y={city.pos.y + 20} textAnchor="middle" fill="#71717a" fontSize="12">{city.name}</text>
              </g>
            ))}

            {/* 绘制红军行军轨迹 */}
            <motion.path
              d={STAGES[currentStage].redArmyPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* 红军主力单位 */}
            <motion.g
              animate={{ x: STAGES[currentStage].redArmyPos.x, y: STAGES[currentStage].redArmyPos.y }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            >
              <motion.circle 
                r="12" 
                fill="#ef4444" 
                animate={{ r: [12, 18, 12], opacity: [0.6, 0.2, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <circle r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <text y="-20" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">中央红军</text>
            </motion.g>

            {/* 敌军单位 */}
            <AnimatePresence>
              {STAGES[currentStage].enemies.map(enemy => (
                <motion.g
                  key={enemy.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  x={enemy.pos.x}
                  y={enemy.pos.y}
                >
                  <rect x="-10" y="-10" width="20" height="20" fill="#3b82f6" rx="4" />
                  <text y="25" textAnchor="middle" fill="#3b82f6" fontSize="11">{enemy.label}</text>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>

          {/* 右侧信息面板 */}
          <div className="absolute top-8 right-8 w-80 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">{STAGES[currentStage].title}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {STAGES[currentStage].description}
            </p>
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">主要行动</p>
              <div className="flex flex-wrap gap-2">
                {['战略机动', '快速渡河', '声东击西'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-300 border border-zinc-700">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 底部控制栏 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-3 rounded-2xl shadow-2xl">
            <button onClick={prev} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"><SkipBack size={20} /></button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-lg shadow-red-900/20"
            >
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
            </button>
            <button onClick={next} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"><SkipForward size={20} /></button>
          </div>
        </div>
      </main>
    </div>
  );
}
