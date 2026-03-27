import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Info } from 'lucide-react';

// --- Data Definitions ---

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
    description: '1935年初，红军在遵义休整，原计划北渡长江与红四方面军会合。蒋介石调集40万重兵，企图将3万红军围歼于乌江西北地区。',
    redArmyPos: { x: 600, y: 350 },
    redArmyPath: 'M 600 350',
    enemies: [
      { id: 'e1', pos: { x: 450, y: 100 }, label: '川军 (北)' },
      { id: 'e2', pos: { x: 750, y: 350 }, label: '湘军 (东)' },
      { id: 'e3', pos: { x: 600, y: 480 }, label: '中央军 (南)' },
      { id: 'e4', pos: { x: 300, y: 450 }, label: '滇军 (西)' },
    ],
    highlights: ['zunyi'],
  },
  {
    id: 1,
    title: '一渡赤水：避锐击虚',
    description: '红军向北推进，在土城遭遇川军强力阻击。毛泽东果断决定放弃原计划，向西渡过赤水河，进入川南扎西地区，跳出敌人包围圈。',
    redArmyPos: { x: 150, y: 250 },
    redArmyPath: 'M 600 350 L 450 200 Q 300 200 150 250',
    enemies: [
      { id: 'e1', pos: { x: 400, y: 150 }, label: '川军阻击' },
      { id: 'e2', pos: { x: 600, y: 350 }, label: '湘军占领遵义' },
      { id: 'e3', pos: { x: 450, y: 400 }, label: '中央军追击' },
      { id: 'e4', pos: { x: 250, y: 400 }, label: '滇军防守' },
    ],
    highlights: ['tucheng', 'zhaxi'],
  },
  {
    id: 2,
    title: '二渡赤水：出奇制胜',
    description: '敌军以为红军要北渡长江，纷纷向扎西合围。红军突然掉头向东，二渡赤水，奇袭娄山关，重夺遵义城，歼敌两个师又八个团，取得长征以来最大胜利。',
    redArmyPos: { x: 600, y: 350 },
    redArmyPath: 'M 600 350 L 450 200 Q 300 200 150 250 L 300 280 Q 450 300 600 350',
    enemies: [
      { id: 'e1', pos: { x: 150, y: 150 }, label: '川军扑空' },
      { id: 'e2', pos: { x: 700, y: 300 }, label: '湘军溃败' },
      { id: 'e3', pos: { x: 200, y: 350 }, label: '中央军扑空' },
      { id: 'e4', pos: { x: 100, y: 400 }, label: '滇军合围扎西' },
    ],
    highlights: ['zunyi'],
  },
  {
    id: 3,
    title: '三渡赤水：调虎离山',
    description: '蒋介石飞抵贵阳亲自督战，企图再次围歼红军于遵义。红军将计就计，在茅台三渡赤水，伪装成又要北渡长江的姿态，将敌军主力引向西方。',
    redArmyPos: { x: 250, y: 350 },
    redArmyPath: 'M 600 350 L 450 200 Q 300 200 150 250 L 300 280 Q 450 300 600 350 L 450 300 Q 350 350 250 350',
    enemies: [
      { id: 'e1', pos: { x: 350, y: 200 }, label: '川军西调' },
      { id: 'e2', pos: { x: 650, y: 250 }, label: '湘军防守' },
      { id: 'e3', pos: { x: 500, y: 350 }, label: '中央军西追' },
      { id: 'e4', pos: { x: 350, y: 450 }, label: '滇军北上' },
    ],
    highlights: ['maotai'],
  },
  {
    id: 4,
    title: '四渡赤水：兵临贵阳，巧渡金沙',
    description: '趁敌军主力西进，红军突然折返东渡（四渡赤水），南下直逼贵阳。蒋介石惊恐万分，急调滇军救援。红军趁虚向西疾进，顺利渡过金沙江，彻底跳出包围圈！',
    redArmyPos: { x: 100, y: 500 },
    redArmyPath: 'M 600 350 L 450 200 Q 300 200 150 250 L 300 280 Q 450 300 600 350 L 450 300 Q 350 350 250 350 L 400 400 Q 550 450 550 500 L 100 500',
    enemies: [
      { id: 'e1', pos: { x: 250, y: 250 }, label: '川军滞留' },
      { id: 'e2', pos: { x: 750, y: 250 }, label: '湘军滞留' },
      { id: 'e3', pos: { x: 600, y: 450 }, label: '中央军救驾' },
      { id: 'e4', pos: { x: 550, y: 550 }, label: '滇军救驾' },
    ],
    highlights: ['guiyang', 'jinsha'],
  },
];

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stage = STAGES[currentStage];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev >= STAGES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds per stage
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => setCurrentStage((p) => Math.min(STAGES.length - 1, p + 1));
  const handlePrev = () => setCurrentStage((p) => Math.max(0, p - 1));
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar / Controls */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col z-10 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-500 mb-2 tracking-tight">四渡赤水</h1>
          <p className="text-zinc-400 text-sm">毛泽东军事生涯的"得意之笔"</p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500 font-bold text-sm border border-red-500/30">
                  {stage.id}
                </span>
                <h2 className="text-xl font-semibold text-zinc-100">{stage.title}</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm">
                {stage.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timeline Progress */}
        <div className="mt-8 mb-6 flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStage(idx)}
              className={`relative z-10 w-4 h-4 rounded-full transition-colors duration-300 ${
                idx === currentStage
                  ? 'bg-red-500 ring-4 ring-red-500/20'
                  : idx < currentStage
                  ? 'bg-red-800'
                  : 'bg-zinc-700 hover:bg-zinc-600'
              }`}
              aria-label={`Go to stage ${idx}`}
            />
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStage === 0}
            className="p-3 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStage === STAGES.length - 1}
            className="p-3 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#0a0a0c] overflow-hidden flex items-center justify-center p-4">
        {/* Topographic background hint */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #3f3f46 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="w-full max-w-4xl aspect-[4/3] relative">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
          >
            {/* Chishui River */}
            <motion.path
              d="M 400 0 Q 350 150 400 250 T 350 450 T 400 600"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="12"
              strokeLinecap="round"
              className="opacity-30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M 400 0 Q 350 150 400 250 T 350 450 T 400 600"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-60"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <text x="370" y="80" fill="#38bdf8" fontSize="14" className="opacity-60 font-medium" transform="rotate(15, 370, 80)">赤水河</text>

            {/* Yangtze River (Top) */}
            <path d="M 0 50 Q 400 20 800 80" fill="none" stroke="#0ea5e9" strokeWidth="16" className="opacity-20" />
            <text x="600" y="40" fill="#38bdf8" fontSize="16" className="opacity-50 font-bold">长江</text>

            {/* Cities */}
            {CITIES.map((city) => {
              const isHighlighted = stage.highlights?.includes(city.id);
              return (
                <g key={city.id} transform={`translate(${city.pos.x}, ${city.pos.y})`}>
                  <motion.circle
                    r={isHighlighted ? 8 : 4}
                    fill={isHighlighted ? "#facc15" : "#a1a1aa"}
                    animate={{
                      r: isHighlighted ? [8, 12, 8] : 4,
                      opacity: isHighlighted ? 1 : 0.6
                    }}
                    transition={{
                      r: { repeat: Infinity, duration: 2 },
                      duration: 0.3
                    }}
                  />
                  <motion.text
                    y="-12"
                    textAnchor="middle"
                    fill={isHighlighted ? "#facc15" : "#a1a1aa"}
                    fontSize={isHighlighted ? "16" : "12"}
                    fontWeight={isHighlighted ? "bold" : "normal"}
                    className="select-none"
                    animate={{
                      y: isHighlighted ? -16 : -12,
                      opacity: isHighlighted ? 1 : 0.6
                    }}
                  >
                    {city.name}
                  </motion.text>
                </g>
              );
            })}

            {/* Red Army Path (Historical Trail) */}
            <motion.path
              d={stage.redArmyPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 8"
              className="opacity-60"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              key={`path-${stage.id}`} // Re-animate when path changes
            />

            {/* Enemy Forces */}
            <AnimatePresence>
              {stage.enemies.map((enemy) => (
                <motion.g
                  key={enemy.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: enemy.pos.x,
                    y: enemy.pos.y
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 1, type: "spring" }}
                >
                  <circle r="24" fill="#1e3a8a" className="opacity-40" />
                  <circle r="12" fill="#3b82f6" className="opacity-80" />
                  <text
                    y="36"
                    textAnchor="middle"
                    fill="#93c5fd"
                    fontSize="11"
                    className="select-none font-medium"
                  >
                    {enemy.label}
                  </text>
                </motion.g>
              ))}
            </AnimatePresence>

            {/* Red Army Current Position */}
            <motion.g
              animate={{
                x: stage.redArmyPos.x,
                y: stage.redArmyPos.y,
              }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
              className="z-50"
            >
              {/* Pulse effect */}
              <motion.circle
                r="16"
                fill="#ef4444"
                className="opacity-30"
                animate={{ r: [16, 32, 16], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <circle r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
              <text
                y="-16"
                textAnchor="middle"
                fill="#ef4444"
                fontSize="14"
                fontWeight="bold"
                className="select-none drop-shadow-md"
              >
                中央红军
              </text>
            </motion.g>

          </svg>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-lg flex flex-col gap-3 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white" />
            <span>中央红军</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>国民党军队</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500/60 border-t border-dashed border-red-500" />
            <span>红军行军路线</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-sky-400/60" />
            <span>赤水河 / 长江</span>
          </div>
        </div>
      </div>
    </div>
  );
}
