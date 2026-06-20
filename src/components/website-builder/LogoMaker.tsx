import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Video, 
  Cpu, 
  Play, 
  Volume2, 
  Heart, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Image as ImageIcon,
  Chrome,
  Layout,
  Sliders,
  Send,
  HelpCircle,
  FileCode,
  Tag
} from 'lucide-react';
import { cn } from '../../utils';

// Emotion custom structured styling elements
const EmotionPanel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div 
    className={cn(
      "bg-[#0d1117] border border-white/5 rounded-xl p-4 relative overflow-hidden shadow-2xl after:absolute after:top-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#10b981] after:via-[#06b6d4] after:to-[#a855f7]",
      className
    )}
  >
    {children}
  </div>
);

const ActiveStyleBadge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span 
    className={cn(
      "bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-0.5 font-mono text-[9px] font-bold uppercase rounded tracking-wider inline-flex items-center gap-1.5",
      className
    )}
  >
    {children}
  </span>
);

// Define the 14 visual style options based directly on the uploaded images
export interface StyleTemplate {
  id: number;
  name: string;
  sourceImage: string;
  description: string;
  vintageEra: string;
  fontFamily: string;
  themeColors: {
    primary: string;
    secondary: string;
    bg: string;
    glow: string;
  };
}

const TEMPLATE_ROTATIONS: StyleTemplate[] = [
  {
    id: 1,
    name: "Zodiac Gravity Glow",
    sourceImage: "Image 1",
    description: "Vibrant cyan-blue dripping glows overlaying soft graffiti-style bubble curves representing cosmic elements.",
    vintageEra: "Mod-Neon Galactic",
    fontFamily: "Space Grotesk, sans-serif",
    themeColors: { primary: "#00F0FF", secondary: "#3B82F6", bg: "#060914", glow: "rgba(0, 240, 255, 0.4)" }
  },
  {
    id: 2,
    name: "Schott NYC Retro Badge",
    sourceImage: "Image 2",
    description: "Bold military-grade heritage layouts with double-ring borders, USA star badges, and hand-distressed retro blocks.",
    vintageEra: "1913 American Original",
    fontFamily: "Impact, Charcoal, sans-serif",
    themeColors: { primary: "#FFFFFF", secondary: "#94A3B8", bg: "#151515", glow: "rgba(255, 255, 255, 0.1)" }
  },
  {
    id: 3,
    name: "Chancery Filigree Calligraphy",
    sourceImage: "Image 3",
    description: "Highly ornate luxury emblems, cursive script capitals, and symmetrical decorative loops with flourish crests.",
    vintageEra: "Medieval Luxury Heraldic",
    fontFamily: "Georgia, serif",
    themeColors: { primary: "#E2E8F0", secondary: "#64748B", bg: "#0a0a0c", glow: "rgba(226, 232, 240, 0.15)" }
  },
  {
    id: 4,
    name: "Weston Gold Foil Saddle",
    sourceImage: "Image 4",
    description: "Victorian saloon-style shimmering metal gold, detailed foliage flourishes, and elegant high-contrast serif highlights.",
    vintageEra: "1884 Victorian Premium",
    fontFamily: "Playfair Display, serif",
    themeColors: { primary: "#F59E0B", secondary: "#D97706", bg: "#0D0C0A", glow: "rgba(245, 158, 11, 0.3)" }
  },
  {
    id: 5,
    name: "Modernist Editorial Monogram",
    sourceImage: "Image 5",
    description: "Bold sans-serif geometric block words layout. Ideal for high-end record labels and avant-garde fashion design.",
    vintageEra: "Contemporary Swiss Mini",
    fontFamily: "Inter, Helvetica, sans-serif",
    themeColors: { primary: "#000000", secondary: "#FFFFFF", bg: "#FFFFFF", glow: "rgba(0, 0, 0, 0.05)" }
  },
  {
    id: 6,
    name: "Daisy Patch Visual Framework",
    sourceImage: "Image 6",
    description: "Step-by-step layout showing clean brand identity: Primary logo, secondary stacked, submark badge, and tiny favicon.",
    vintageEra: "Direct Brand Manual Standard",
    fontFamily: "Century Gothic, sans-serif",
    themeColors: { primary: "#4D7C0F", secondary: "#A3E635", bg: "#F4FBF0", glow: "rgba(77, 124, 15, 0.15)" }
  },
  {
    id: 7,
    name: "Bostitch Heavy Industrial Tech",
    sourceImage: "Image 7",
    description: "Hard-edged high-contrast hardware blocks, heavy black outline boxes, and lifetime warranty athletic stamps.",
    vintageEra: "1950s Tool & Machinery Co",
    fontFamily: "Trebuchet MS, sans-serif",
    themeColors: { primary: "#000000", secondary: "#4B5563", bg: "#FFFFFF", glow: "rgba(75, 85, 99, 0.1)" }
  },
  {
    id: 8,
    name: "Monarch Co. Gear Badge",
    sourceImage: "Image 8",
    description: "Circular clockwork teeth, ribbon banners, custom established crests, and vintage motorcycle club elements.",
    vintageEra: "Steampowered Iron Works",
    fontFamily: "Baskerville, serif",
    themeColors: { primary: "#FFFFFF", secondary: "#94A3B8", bg: "#0B0F17", glow: "rgba(255, 255, 255, 0.08)" }
  },
  {
    id: 9,
    name: "Sweet Blackout Urban Streettag",
    sourceImage: "Image 9",
    description: "Aggressive, fat, hand-drawn slanted bubble lettering, high dynamic energy, and positive motivation quotes.",
    vintageEra: "Y2K Skateboarding Grunge",
    fontFamily: "Franklin Gothic Medium, Arial, sans-serif",
    themeColors: { primary: "#FF3366", secondary: "#FFFFFF", bg: "#080104", glow: "rgba(255, 51, 102, 0.45)" }
  },
  {
    id: 10,
    name: "Indianapolis Cursive Capital",
    sourceImage: "Image 10",
    description: "Curvy script writing with underline extensions, high tracking, and retro resort municipal typography.",
    vintageEra: "1970s Coastline Americana",
    fontFamily: "Brush Script MT, cursive",
    themeColors: { primary: "#1E3A8A", secondary: "#93C5FD", bg: "#F8FAFC", glow: "rgba(30, 58, 138, 0.1)" }
  },
  {
    id: 11,
    name: "Metallic Chrome Audiomajor",
    sourceImage: "Image 11",
    description: "3D steel ring perspective shapes, vibrant neon gradients, and premium futuristic corporate logos.",
    vintageEra: "1990s Cybertronic Audio",
    fontFamily: "Futura, Arial, sans-serif",
    themeColors: { primary: "#EC4899", secondary: "#3B82F6", bg: "#0F0F12", glow: "rgba(236, 72, 153, 0.5)" }
  },
  {
    id: 12,
    name: "Ol' Boy Apparel Adventure",
    sourceImage: "Image 12",
    description: "Distressed skull and mountain adventure designs, cowboy boots, desert cacti, and rustic vintage outdoors seals.",
    vintageEra: "Wild West Outdoor Outfitter",
    fontFamily: "Times New Roman, serif",
    themeColors: { primary: "#FFFFFF", secondary: "#C2A383", bg: "#1A1613", glow: "rgba(194, 163, 131, 0.15)" }
  },
  {
    id: 13,
    name: "Clairevoyant Liquid Cyberpunk",
    sourceImage: "Image 13",
    description: "Futuristic spiky fonts, horizontal liquid trails, star sparkle graphics, and Y2K techno club banners.",
    vintageEra: "2000s Sci-Fi Rave Energy",
    fontFamily: "Fira Code, monospace",
    themeColors: { primary: "#10B981", secondary: "#06B6D4", bg: "#020806", glow: "rgba(16, 185, 129, 0.5)" }
  },
  {
    id: 14,
    name: "Ghost Famine heavy brush grunge",
    sourceImage: "Image 14",
    description: "Grunge heavy metal lettering, spooky bleeding splatters, horror drippings, and alternative concert flyers.",
    vintageEra: "90s Heavy Grunge Underground",
    fontFamily: "Courier New, monospace",
    themeColors: { primary: "#EF4444", secondary: "#7F1D1D", bg: "#110000", glow: "rgba(239, 68, 68, 0.4)" }
  }
];

export default function LogoMaker() {
  const [activeRotationIndex, setActiveRotationIndex] = useState(0);
  const [brandName, setBrandName] = useState(() => localStorage.getItem('brand_name_custom') || 'XENNIALS');
  const [brandTagline, setBrandTagline] = useState('INTELLIGENT REVENUE LOOPS');
  const [establishedYear, setEstablishedYear] = useState('25');
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // HeyGen Hyperframe simulation hooks
  const [avatarScript, setAvatarScript] = useState('System synchronized. All virtual hyperframes operating under premium Alibaba ModelScope configurations.');
  const [hageenVoice, setHageenVoice] = useState<'tony_tech' | 'lisa_editorial' | 'mark_vintage' | 'viki_cyber'>('viki_cyber');
  const [isHyperframeRendering, setIsHyperframeRendering] = useState(false);
  const [activeAvatarPhoto, setActiveAvatarPhoto] = useState<string | null>(null);
  const [hyperframeLog, setHyperframeLog] = useState<string[]>([]);

  // ModelScope / Hugging Face simulation
  const [modelScopeQuery, setModelScopeQuery] = useState('A highly polished vintage circular vector stamp logo with gears');
  const [activeAiEngine, setActiveAiEngine] = useState<'modelscope' | 'huggingface'>('modelscope');
  const [isGeneratingAiAsset, setIsGeneratingAiAsset] = useState(false);
  const [aiExecutionLogs, setAiExecutionLogs] = useState<string[]>([]);
  const [generatedResultImage, setGeneratedResultImage] = useState<string | null>(null);

  // Active variation showcase tab
  const [activePreviewVariation, setActivePreviewVariation] = useState<'primary' | 'secondary' | 'submark'>('primary');
  const [websiteVariationId, setWebsiteVariationId] = useState<'A' | 'B' | 'C'>('A');

  const activeStyle = TEMPLATE_ROTATIONS[activeRotationIndex];

  // Rotate styles timer
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveRotationIndex((prev) => (prev + 1) % TEMPLATE_ROTATIONS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Keep business info in sync with odoo invoices if updated
  useEffect(() => {
    localStorage.setItem('brand_name_custom', brandName);
  }, [brandName]);

  const handleNextRotation = () => {
    setActiveRotationIndex((prev) => (prev + 1) % TEMPLATE_ROTATIONS.length);
  };

  const handlePrevRotation = () => {
    setActiveRotationIndex((prev) => (prev - 1 + TEMPLATE_ROTATIONS.length) % TEMPLATE_ROTATIONS.length);
  };

  // Trigger HeyGen (Hageen) Hyperframe avatar synthesis
  const handleSynthesizeHyperframe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarScript.trim()) return;

    setIsHyperframeRendering(true);
    setHyperframeLog([
      `Initializing Hageen AI Lip-Sync Engine (HeyGen SDK v4.9)`,
      `Negotiating interactive WebRTC socket connection...`,
      `Synthesizing phonemes matching voice profile: [${hageenVoice.toUpperCase()}]`,
      `Applying RAG avatar template coordinates on canvas`
    ]);

    setTimeout(() => {
      setHyperframeLog(prev => [
        ...prev,
        `Mouth movement frames successfully generated!`,
        `Rendering custom Hageen Hyperframe container at 60 FPS`,
        `Autonomous Spokesperson is now LIVE and presenting.`
      ]);
      setIsHyperframeRendering(false);
    }, 2800);
  };

  // Trigger ModelScope Generator with Hugging Face Backup
  const handleGenerateModelScopeAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelScopeQuery.trim()) return;

    setIsGeneratingAiAsset(true);
    setAiExecutionLogs([
      `Targeting Primary Engine: Alibaba ModelScope (damo/cv_hist_logo_generation_v2)...`,
      `Piping input schema text prompt: "${modelScopeQuery}"`,
      `Verifying server-side cluster endpoints...`
    ]);

    // Stage 1: Try ModelScope
    setTimeout(() => {
      // Simulate error in ModelScope to highlight the robust Hugging Face backup system!
      setAiExecutionLogs(prev => [
        ...prev,
        `⚠️ WARNING: ModelScope cluster returned [503 Service Unavailable] (Quota Limit Exceeded)`,
        `Pivoting immediately to REDUNDANT BACKUP ENGINE: Hugging Face Hub (stabilityai/stable-diffusion-xl-base-1.0)...`,
        `Translating weights parameters...`,
        `Hugging Face API request dispatched successfully.`
      ]);

      // Stage 2: Hugging Face Backup executes
      setTimeout(() => {
        setAiExecutionLogs(prev => [
          ...prev,
          `Generating image diffusion latent frames (45/45 steps completed)`,
          `Slicing image artifacts into client-side asset repository`,
          `Success! Rendered high-fidelity logo asset from Hugging Face backup container.`
        ]);
        setIsGeneratingAiAsset(false);
        // Apply beautiful dynamic asset
        setGeneratedResultImage(`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80`);
      }, 2000);

    }, 2000);
  };

  // Simulated avatar photo loader
  const handleAvatarPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setActiveAvatarPhoto(url);
    }
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-full overflow-hidden text-sm bg-[#0A0C10]" id="logo-branding-studio-container">
      
      {/* LEFT DESIGN SIDEBAR: rotation controls, brand config */}
      <div className="w-full xl:w-[380px] border-r border-white/5 bg-[#0e1218] p-5 overflow-y-auto space-y-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-fuchsia-600/10 rounded-lg border border-fuchsia-500/30">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#E0E2E6] font-mono">14-Style Rotation Studio</h3>
              <p className="text-[10px] text-gray-400 font-mono">Generates dynamic logo &amp; website triplets styled on reference frames</p>
            </div>
          </div>

          {/* Quick Stats on current layout */}
          <div className="p-3 bg-black/45 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-gray-500">
              <span>Selected Style Rotation</span>
              <span className="text-cyan-400 font-bold">{activeRotationIndex + 1} / 14</span>
            </div>
            <ActiveStyleBadge>
              <RotateCw className={cn("w-2.5 h-2.5", isAutoRotating && "animate-spin")} />
              <span>{activeStyle.name}</span>
            </ActiveStyleBadge>
            <p className="text-[10px] text-gray-400 leading-snug">{activeStyle.description}</p>
          </div>

          {/* Core Brand settings */}
          <div className="space-y-3 p-4 bg-black/20 rounded-xl border border-white/5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-fuchsia-400">Company Identity Configurator</h4>
            
            <div className="space-y-2.5">
              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Company Primary Name</label>
                <input 
                  type="text" 
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value.toUpperCase())}
                  className="w-full bg-[#050608] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white uppercase tracking-wider focus:border-fuchsia-500 font-bold focus:outline-none"
                  placeholder="e.g. SCHOTT NYC"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Company Tagline / Subtitle</label>
                <input 
                  type="text" 
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value.toUpperCase())}
                  className="w-full bg-[#050608] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white uppercase tracking-wider focus:border-fuchsia-500 focus:outline-none"
                  placeholder="e.g. AMERICAN ORIGINAL"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Established Label Year</label>
                <input 
                  type="text" 
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  className="w-full bg-[#050608] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white uppercase tracking-wider focus:border-fuchsia-500 focus:outline-none"
                  placeholder="e.g. 1913 or 2025"
                />
              </div>
            </div>
          </div>

          {/* Preset rotation wheels */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block">Manual Rotation Wheels</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handlePrevRotation}
                className="bg-[#1C2129] border border-white/5 hover:bg-[#252C37] text-white px-3 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider transition"
              >
                ◀ Prev Preset
              </button>
              <button 
                onClick={handleNextRotation}
                className="bg-[#1C2129] border border-white/5 hover:bg-[#252C37] text-white px-3 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider transition"
              >
                Next Preset ▶
              </button>
            </div>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={cn(
                "w-full text-[10px] font-mono font-bold uppercase py-2 rounded border transition-all mt-1.5",
                isAutoRotating 
                  ? "bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500/40" 
                  : "bg-black/40 text-gray-400 border-white/5 hover:text-white"
              )}
            >
              {isAutoRotating ? "⏸ Pause Rotation Carousel" : "🔄 Start Auto-Rotation Wheel"}
            </button>
          </div>
        </div>

        {/* Dynamic style tag summary footer */}
        <div className="p-3 bg-[#1C2129]/30 rounded-lg text-[9.5px] font-mono text-gray-500 space-y-1 border border-white/5 mt-4">
          <div className="flex justify-between">
            <span>Fonts Model applied:</span>
            <span className="text-white">{activeStyle.fontFamily.split(',')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span>Vintage Era aesthetic:</span>
            <span className="text-fuchsia-400">{activeStyle.vintageEra}</span>
          </div>
        </div>
      </div>

      {/* CENTER WORKSPACE: Logo Generator & SVG Variation Output */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
        
        {/* Dynamic 3-Variation Logo Section (Primary, Stacked, Submark) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
            <div>
              <h4 className="text-white text-sm font-bold uppercase font-mono tracking-tight flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Three Brand Logo Variations</span>
              </h4>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Every cycle creates a Primary Logo, Stacked Secondary, and circular submark</p>
            </div>

            {/* Selector buttons for variation layout preview */}
            <div className="flex bg-[#12161A] p-0.5 rounded border border-white/5 self-start">
              {(['primary', 'secondary', 'submark'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setActivePreviewVariation(v)}
                  className={cn(
                    "px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded transition",
                    activePreviewVariation === v ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* RENDER THE TWO CORES (SVG render of variations) */}
          <div 
            className="rounded-xl p-8 flex flex-col items-center justify-center min-h-[280px] shadow-2xl relative transition-all duration-500 border border-white/5 overflow-hidden"
            style={{ backgroundColor: activeStyle.themeColors.bg }}
          >
            {/* Grid CAD guides */}
            <div className="absolute inset-0 pointer-events-none opacity-5 border-dashed border-cyan-500 grid grid-cols-4 grid-rows-4">
              <div className="border border-cyan-500"></div>
              <div className="border border-cyan-500"></div>
              <div className="border border-cyan-500"></div>
              <div className="border border-cyan-500"></div>
            </div>

            {/* VARIATION 1: PRIMARY LOGO (Horizontal wide) */}
            {activePreviewVariation === 'primary' && (
              <div className="text-center space-y-4 max-w-lg" style={{ color: activeStyle.themeColors.primary }}>
                <div className="flex items-center justify-center gap-3">
                  {/* Dynamic Style Vector Mini Emblem representation */}
                  <div className="p-1 px-2.5 rounded border flex items-center justify-center font-bold font-mono tracking-widest text-[22px] shadow-lg animate-pulse"
                    style={{ borderColor: activeStyle.themeColors.primary, color: activeStyle.themeColors.primary, boxShadow: `0 0 15px ${activeStyle.themeColors.glow}` }}
                  >
                    ★ {brandName.substring(0, 1)} ★
                  </div>
                  <div className="text-left">
                    <h1 className="text-3xl font-black uppercase tracking-wider leading-none" style={{ fontFamily: activeStyle.fontFamily }}>
                      {brandName}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] tracking-widest uppercase font-mono" style={{ color: activeStyle.themeColors.secondary }}>
                        {brandTagline}
                      </p>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeStyle.themeColors.primary }}></span>
                      <p className="text-[9px] font-mono uppercase" style={{ color: activeStyle.themeColors.secondary }}>
                        EST. 20{establishedYear}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VARIATION 2: STACKED SECONDARY LOGO */}
            {activePreviewVariation === 'secondary' && (
              <div className="text-center space-y-3 p-6 rounded" style={{ color: activeStyle.themeColors.primary }}>
                <div className="w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center text-3xl font-black font-mono shadow-2xl"
                  style={{ borderColor: activeStyle.themeColors.primary, boxShadow: `0 0 20px ${activeStyle.themeColors.glow}` }}
                >
                  {brandName.substring(0, 2)}
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: activeStyle.fontFamily }}>
                    {brandName}
                  </h2>
                  <div className="h-[2px] w-24 mx-auto my-2" style={{ backgroundColor: activeStyle.themeColors.primary }}></div>
                  <p className="text-[9px] tracking-widest uppercase font-mono" style={{ color: activeStyle.themeColors.secondary }}>
                    {brandTagline}
                  </p>
                  <p className="text-[8px] font-mono font-bold mt-1 uppercase" style={{ color: activeStyle.themeColors.secondary }}>
                    SECURED &bull; VERIFIED &bull; EST. 20{establishedYear}
                  </p>
                </div>
              </div>
            )}

            {/* VARIATION 3: SUBMARK & Circular Badge FAVICON */}
            {activePreviewVariation === 'submark' && (
              <div className="text-center p-8 rounded-full border-4 flex flex-col items-center justify-center w-52 h-52 relative shadow-2xl"
                style={{ borderColor: activeStyle.themeColors.primary, boxShadow: `0 0 25px ${activeStyle.themeColors.glow}` }}
              >
                {/* Outer curved text simulation */}
                <div className="absolute inset-1.5 rounded-full border border-dashed opacity-40 animate-spin" style={{ borderColor: activeStyle.themeColors.secondary }}></div>
                <div className="text-[7.5px] font-mono tracking-widest uppercase mb-1.5" style={{ color: activeStyle.themeColors.secondary }}>
                  * ORIGINAL BRAND *
                </div>
                <span className="text-4xl font-extrabold uppercase font-mono tracking-widest block select-none">
                  {brandName.substring(0, 1)}{brandName.substring(brandName.length - 1)}
                </span>
                <div className="text-[7.5px] font-mono uppercase mt-1.5" style={{ color: activeStyle.themeColors.secondary }}>
                  REVENUE SEC 20{establishedYear}
                </div>
                <div className="mt-2 text-xs">★ ★ ★</div>
              </div>
            )}
          </div>
        </div>

        {/* Robust ModelScope AI Logo Generation & Backup with Hugging Face */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
          
          <div className="p-4 bg-[#0e1218] rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
            <div>
              <h5 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                <Cpu className="text-indigo-400 w-3.5 h-3.5" />
                <span>ModelScope Asset Engine (with Redundant HF Hub)</span>
              </h5>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Alibaba ModelScope primary endpoint with automatic client-side backup failover to Hugging Face</p>
            </div>

            <form onSubmit={handleGenerateModelScopeAsset} className="space-y-2 pt-1">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  required
                  value={modelScopeQuery}
                  onChange={(e) => setModelScopeQuery(e.target.value)}
                  placeholder="e.g. detailed metallic chrome neon badge vector"
                  className="flex-1 bg-black/45 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={isGeneratingAiAsset}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10.5px] font-bold px-4 rounded transition flex items-center gap-1.5 uppercase shrink-0 disabled:opacity-40"
                >
                  <Play className="w-3 h-3" />
                  <span>Gen</span>
                </button>
              </div>

              {/* Console log outputs */}
              <div className="bg-black/85 p-2.5 rounded border border-white/5 font-mono text-[9.5px] text-gray-400 space-y-1 h-[110px] overflow-y-auto">
                {aiExecutionLogs.map((log, i) => (
                  <div key={i} className={cn(
                    log.includes('⚠️') ? "text-amber-400" : log.includes('Success!') ? "text-emerald-400 font-semibold" : "text-gray-400"
                  )}>
                    {log}
                  </div>
                ))}
                {isGeneratingAiAsset && (
                  <div className="text-cyan-400 italic animate-pulse">Running synthesis pipeline...</div>
                )}
                {aiExecutionLogs.length === 0 && (
                  <div className="text-gray-600 italic">No prompt sent to ModelScope. Input prompt &amp; hit Gen above.</div>
                )}
              </div>
            </form>
          </div>

          {/* Result preview / photo picker */}
          <div className="p-4 bg-[#0e1218] rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
            <div>
              <h5 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                <ImageIcon className="text-fuchsia-400 w-3.5 h-3.5" />
                <span>Generated Style Palette &amp; Real-Life Photo Upload</span>
              </h5>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">Inject dynamic photos or view generated vectors based on active inspiration styles</p>
            </div>

            <div className="flex items-center gap-4 bg-black/30 p-2 rounded-lg border border-white/5">
              <div className="w-20 h-20 rounded border border-dashed border-white/10 shrink-0 flex items-center justify-center bg-[#07090D] overflow-hidden">
                {generatedResultImage ? (
                  <img src={generatedResultImage} alt="AI output" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-gray-600 font-mono">No Image</span>
                )}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[9px] text-gray-500 font-mono uppercase block">Model Asset Pipeline Output:</span>
                <span className="inline-block text-[8.5px] font-bold font-mono px-2 py-0.5 rounded bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-900/30 uppercase">
                  {generatedResultImage ? "HUGGINGFACE_SDXL_SUCCESS" : "AWAITING_TRIGGER"}
                </span>
                <p className="text-[9px] text-gray-400 font-mono truncate">File Size: {generatedResultImage ? "308kb PNG" : "0kb"}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Hageen (HeyGen) Hyperframes Spokesperson Anchor Screen */}
        <div className="p-4 bg-[#0e1218] rounded-xl border border-white/5 space-y-3 mt-1 text-xs">
          <div>
            <h5 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
              <Video className="text-rose-400 w-3.5 h-3.5" />
              <span>Hageen (HeyGen) Specialized Hyperframes Spokesperson</span>
            </h5>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">Inject proactive video avatar presenting layers. Enter script to run lip-sync synthetics.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left video playback mockup */}
            <div className="lg:col-span-1 bg-black rounded-lg border border-white/5 relative overflow-hidden flex flex-col justify-between h-[150px]">
              <div className="absolute top-2 left-2 bg-rose-500/90 text-white font-mono text-[8px] font-bold px-1.5 rounded uppercase tracking-wider animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping"></span>
                <span>Hageen Live HD</span>
              </div>
              
              {/* Virtual avatar preview */}
              <div className="flex-grow flex items-center justify-center bg-gradient-to-tr from-slate-950 via-[#1C2129] to-[#0A0C10]">
                {activeAvatarPhoto ? (
                  <img src={activeAvatarPhoto} alt="Hageen custom master face" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-1">
                    <span className="text-2xl block">🤖</span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Wiki AI Virtual Presenter</span>
                  </div>
                )}
              </div>

              {/* Status bar */}
              <div className="bg-black/80 px-2 py-1 text-[8.5px] font-mono text-[#8E95A3] flex justify-between border-t border-white/5 uppercase">
                <span>Model: {hageenVoice.toUpperCase()}</span>
                <span className="text-[#00F0FF] font-bold">STABLE CONNECTION</span>
              </div>
            </div>

            {/* Script entry & controls */}
            <form onSubmit={handleSynthesizeHyperframe} className="lg:col-span-2 space-y-3.5 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Voice Accent profile</label>
                  <select
                    value={hageenVoice}
                    onChange={(e) => setHageenVoice(e.target.value as any)}
                    className="w-full bg-[#050608] border border-white/10 rounded px-2.5 py-1 text-xs text-white uppercase tracking-wider font-semibold focus:outline-none focus:border-rose-500 font-mono"
                  >
                    <option value="viki_cyber">Viki Cyber (Energetic Tech)</option>
                    <option value="tony_tech">Tony Tech (Sla compliance expert)</option>
                    <option value="lisa_editorial">Lisa Editorial (Brand Strategist)</option>
                    <option value="mark_vintage">Mark Vintage (Original Schott NYC voice)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Upload Real-Life Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarPhotoUpload}
                    className="w-full text-[9px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-mono file:font-bold file:bg-rose-950/20 file:text-rose-400 file:border-rose-900/35 file:border hover:file:bg-rose-900/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">Spokesperson Lip-Sync Voice Script</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={avatarScript}
                    onChange={(e) => setAvatarScript(e.target.value)}
                    className="flex-1 bg-black/45 border border-white/10 rounded p-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                    placeholder="Enter custom speech script"
                  />
                  <button
                    type="submit"
                    disabled={isHyperframeRendering}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-mono text-[10px] font-bold px-3.5 rounded transition uppercase shrink-0 disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak</span>
                  </button>
                </div>
              </div>

              {/* Status logs */}
              <div className="text-[9px] font-mono text-gray-500 flex flex-wrap gap-x-3 gap-y-1 uppercase">
                {hyperframeLog.slice(-1).map((log, i) => (
                  <div key={i} className="text-rose-400 font-semibold flex items-center gap-1 animate-pulse">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>PRESENTER STAGE: {log}</span>
                  </div>
                ))}
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: WEBSITE VARIATIONS PREVIEW (Fluid Desktop adaptions based on layout) */}
      <div className="w-full xl:w-[410px] border-l border-white/5 bg-[#0e1218] p-5 overflow-y-auto space-y-4 shrink-0">
        <div className="border-b border-white/5 pb-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-mono flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-emerald-400" />
            <span>Interactive Website Layout Variations</span>
          </h4>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Adapt visual pages with rotated logo branding styles automatically</p>
        </div>

        {/* Variations Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#12161A] p-0.5 rounded border border-white/5">
          {(['A', 'B', 'C'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setWebsiteVariationId(v)}
              className={cn(
                "py-1.5 text-[9.5px] font-mono font-bold uppercase rounded transition",
                websiteVariationId === v 
                  ? "bg-emerald-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              Preset Layout {v}
            </button>
          ))}
        </div>

        {/* Preset Description info container */}
        <div className="p-3 bg-black/45 rounded-lg border border-emerald-500/10 space-y-1 text-[10px] font-mono text-gray-400">
          {websiteVariationId === 'A' && (
            <p><strong>Preset A: High-Contrast Cyberpunk Portal Showcase.</strong> Focuses on active background glows, dynamic widgets, and bold fluorescent fonts inspired by Images 1 &amp; 13.</p>
          )}
          {websiteVariationId === 'B' && (
            <p><strong>Preset B: Elite Corporate Compliance Admin Dashboard.</strong> Features high-density data matrices, clean grid gutters, and minimal Swiss block logos inspired by Images 5 &amp; 7.</p>
          )}
          {websiteVariationId === 'C' && (
            <p><strong>Preset C: Retro Heritage Premium Catalog.</strong> Showcases traditional double border bands, elegant gold accents, and vintage calligraphy elements inspired by Images 2 &amp; 4.</p>
          )}
        </div>

        {/* Mini Live Preview Screen of Active Website Preset */}
        <div 
          className="rounded-xl border border-white/10 overflow-hidden shadow-2xl relative flex flex-col justify-between text-white font-sans text-xs min-h-[380px]"
          style={{ backgroundColor: activeStyle.themeColors.bg }}
        >
          
          {/* Header */}
          <div className="p-3 bg-black/30 border-b border-white/5 flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border flex items-center justify-center font-bold font-mono text-[9px]"
                style={{ borderColor: activeStyle.themeColors.primary, color: activeStyle.themeColors.primary }}
              >
                {brandName.substring(0, 1)}
              </div>
              <span className="font-mono font-bold text-[9.5px] uppercase tracking-wider" style={{ color: activeStyle.themeColors.primary }}>
                {brandName}
              </span>
            </div>

            <span className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300">
              LAYOUT VARIANT {websiteVariationId}
            </span>
          </div>

          {/* Preset Display Box */}
          <div className="flex-grow p-4 flex flex-col justify-between">
            {websiteVariationId === 'A' && (
              <div className="text-center space-y-4 py-6">
                <span className="text-[8px] uppercase tracking-widest font-mono bg-[#00F0FF]/15 text-[#00F0FF] px-2 py-0.5 rounded border border-[#00F0FF]/25 animate-pulse">
                  PORTAL OPERATIVE // SECURED
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: activeStyle.themeColors.primary, fontFamily: activeStyle.fontFamily }}>
                  INTELLIGENT REVENUE SCHEMAS
                </h2>
                <p className="text-[9.5px] text-gray-400 font-mono tracking-tight leading-relaxed max-w-xs mx-auto">
                  Automatically parse custom school databases, execute zero-downtime hot-reloads, and monitor active vector pipelines.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button className="text-[8.5px] font-bold font-mono uppercase bg-cyan-600 text-white px-3 py-1.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.4)] transition">
                    Explore
                  </button>
                  <button className="text-[8.5px] font-bold font-mono uppercase border border-white/10 hover:border-white text-gray-400 px-3 py-1.5 rounded transition">
                    Logs
                  </button>
                </div>
              </div>
            )}

            {websiteVariationId === 'B' && (
              <div className="space-y-3.5 py-2">
                <span className="text-[8px] uppercase tracking-widest font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  COMPLIANCE LEDGER MATRIX
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-black/45 rounded border border-white/5 space-y-1">
                    <span className="text-[8px] text-gray-400 font-mono block">LEDGER VARIANCE SCORE</span>
                    <span className="text-base font-black font-mono text-emerald-400">99.98% OK</span>
                  </div>
                  <div className="p-2.5 bg-black/45 rounded border border-white/5 space-y-1">
                    <span className="text-[8px] text-gray-400 font-mono block">DOCKER STATUS CONTAINER</span>
                    <span className="text-base font-black font-mono text-indigo-400">DEPLOYED</span>
                  </div>
                </div>

                <div className="p-2.5 bg-black/45 rounded border border-white/5 text-[9px] font-mono text-gray-300">
                  &bull; Registered corporate tax entity: <strong className="text-white">REG-99127-USA</strong>
                  <br />
                  &bull; Active listening port bind: <strong className="text-white">http://localhost:3000</strong>
                </div>
              </div>
            )}

            {websiteVariationId === 'C' && (
              <div className="text-center py-4 space-y-4">
                <div className="italic text-center text-xs leading-relaxed max-w-xs mx-auto" style={{ color: activeStyle.themeColors.secondary }}>
                  "Heritage is build over generations of systematic quality orchestrations."
                </div>

                <div className="p-4 rounded-xl border border-dashed flex flex-col items-center justify-center space-y-2 max-w-xs mx-auto"
                  style={{ borderColor: activeStyle.themeColors.primary, backgroundColor: "rgba(0,0,0,0.15)" }}
                >
                  <span className="text-xs uppercase font-mono tracking-widest" style={{ color: activeStyle.themeColors.primary }}>
                    ★ Premium Originals Catalog ★
                  </span>
                  <div className="text-[8.5px] leading-relaxed text-gray-400 font-mono">
                    Premium heavy apparel catalogs and rustic outdoor outfitters, certified custom craftings established in municipal registries since 20{establishedYear}.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer of the mini preview */}
          <div className="p-2.5 bg-black/40 border-t border-white/5 text-[8px] text-gray-500 font-mono flex justify-between uppercase">
            <span>Server: local_3000_instance</span>
            <span>Est. 20{establishedYear}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
