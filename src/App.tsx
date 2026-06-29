/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Flame, 
  Dog, 
  Candy,
  Coffee,
  Smile,
  Compass,
  Music
} from 'lucide-react';

// Reason Card Interface
interface PitchReason {
  id: number;
  title: string;
  tag: string;
  icon: React.ReactNode;
  text: string;
  image: string;
  alt: string;
}

// Confetti Particle Interface for Canvas
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'heart';
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export default function App() {
  // Navigation States
  const [screen, setScreen] = useState<'ask' | 'pitch' | 'decision' | 'celebration'>('ask');
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);

  // No Button Logic States
  const [noBtnPos, setNoBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [noBtnEvadedCount, setNoBtnEvadedCount] = useState(0);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // Confetti Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // List of Reasons with cute curated Unsplash images
  const reasons: PitchReason[] = [
    {
      id: 1,
      tag: "#1 CHARMING",
      title: "Reason 1: I am hot.",
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      text: "Proof is right here: look at this peak level of style, sophistication, and pure charisma. Undeniably striking!",
      image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "A cool cat wearing sunglasses looking incredibly hot and stylish"
    },
    {
      id: 2,
      tag: "#2 WHOLESOME",
      title: "Reason 2: I am a good boy.",
      icon: <Dog className="w-5 h-5 text-indigo-500" />,
      text: "I listen carefully, I appreciate the little things, and I have outstanding manners. Guaranteed to make you smile!",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "A wholesome puppy wearing spectacles looking very polite and good"
    },
    {
      id: 3,
      tag: "#3 CHEEKY",
      title: "Reason 3: I only bite when asked to 😉",
      icon: <Candy className="w-5 h-5 text-rose-500" />,
      text: "Just the right amount of playful energy to keep things exciting. Sweet, a little mischievous, but always respectful.",
      image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "A playful, cute winking kitten showing personality"
    },
    {
      id: 4,
      tag: "#4 CLASSY",
      title: "Reason 4: I have impeccable taste.",
      icon: <Coffee className="w-5 h-5 text-amber-600" />,
      text: "I mean, look at who I'm trying to take out. Truly, my standards are absolutely elite.",
      image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "Fresh bright white daisies in a sunny field representing elegant and charming taste"
    },
    {
      id: 5,
      tag: "#5 COZY",
      title: "Reason 5: Excellent hand-holding compatibility.",
      icon: <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />,
      text: "Rigorously tested, highly recommended, and scientifically proven to fit your hand perfectly.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "Warm holding hands representing cozy hand-holding compatibility"
    },
    {
      id: 6,
      tag: "#6 ATTENTIVE",
      title: "Reason 6: Expert-level listener.",
      icon: <Smile className="w-5 h-5 text-[#800000]" />,
      text: "I will remember every single tiny, random detail you mention—even the ones you forgot you said.",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "Polite listening puppy representing expert-level listener"
    },
    {
      id: 7,
      tag: "#7 PLAYFUL",
      title: "Reason 7: Guaranteed fun & zero awkward silence.",
      icon: <Candy className="w-5 h-5 text-purple-500" />,
      text: "A highly curated blend of witty banter, deep midnight talks, and laugh-until-it-hurts jokes.",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "Sparklers representing guaranteed fun"
    },
    {
      id: 8,
      tag: "#8 EXPLORER",
      title: "Reason 8: I know all the secret cozy spots.",
      icon: <Compass className="w-5 h-5 text-blue-500" />,
      text: "From hidden scenic rooftops to the most charming corner cafes you never knew existed.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "Scenic explorer aesthetic represent cozy hidden spots"
    },
    {
      id: 9,
      tag: "#9 SWEET",
      title: "Reason 9: Premium forehead kisses & cozy warm hugs.",
      icon: <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />,
      text: "Guaranteed to melt away any stressful day, bring out dynamic smiles, and keep you feeling incredibly cozy.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "Cozy warm drink with mini marshmallow hearts representing sweet comfort"
    },
    {
      id: 10,
      tag: "#10 MYSTERY",
      title: "Reason 10: The mystery factor 😉",
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      text: "Some secrets, stories, and beautiful smiles are simply best discovered in person...",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600&h=600",
      alt: "Fairy lights evening toast representing mystery factor"
    }
  ];

  // Cheeky comments as they try to click "No"
  const getCheekyComment = () => {
    if (noBtnEvadedCount === 0) return "Choose wisely...";
    if (noBtnEvadedCount === 1) return "Wait, did your cursor slip? 😜";
    if (noBtnEvadedCount === 2) return "Nice try! Speed up!";
    if (noBtnEvadedCount === 3) return "Error: 'No' option not found 🚫";
    if (noBtnEvadedCount <= 5) return "You're persistent, aren't you?";
    if (noBtnEvadedCount <= 8) return "Legend says nobody has ever clicked it! ⚡";
    if (noBtnEvadedCount <= 12) return "I can do this all day! Let's click YES! 😂";
    return "This is getting romantic... You chasing me around! 🥰";
  };

  // Evasion handler for "No" button
  const evadeNoButton = () => {
    // Generate random coordinates in viewport percentages (10% to 85% to stay well within screen bounds)
    const randomX = Math.floor(Math.random() * 75) + 10;
    const randomY = Math.floor(Math.random() * 75) + 10;
    
    setNoBtnPos({ x: randomX, y: randomY });
    setNoBtnEvadedCount(prev => prev + 1);
  };

  // Reset No Button Pos if we change screens
  useEffect(() => {
    setNoBtnPos(null);
    setNoBtnEvadedCount(0);
  }, [screen]);

  // Confetti Animation Effect
  useEffect(() => {
    if (screen !== 'celebration' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Setup with colors matching the Vibrant Palette theme
    const particles: Particle[] = [];
    const colors = ['#800000', '#9C5A64', '#FFB7B2', '#FFC6FF', '#E8DFF5', '#4A90E2', '#FF9AA2'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: ['circle', 'square', 'heart'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'heart',
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        opacity: Math.random() * 0.4 + 0.6
      });
    }

    // Helper to draw a heart
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      c.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      c.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 4);
      c.closePath();
      c.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'heart') {
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
        }

        ctx.restore();

        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Reset particle to top if it goes off bottom
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
          p.opacity = Math.random() * 0.4 + 0.6;
        }
        if (p.x > width || p.x < 0) {
          p.speedX *= -1;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [screen]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-gradient-to-br from-[#DCE7F3] via-[#F3E8FF] to-[#E0E7FF] text-[#374151] font-sans selection:bg-[#800000] selection:text-white pb-6 pt-6">
      
      {/* Background Glows from Vibrant Palette Theme */}
      <div className="absolute top-0 left-0 w-full h-full opacity-35 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[10%] w-48 h-48 rounded-full bg-[#800000] blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 rounded-full bg-[#F3E8FF] blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-64 h-64 rounded-full bg-[#DCE7F3] blur-3xl"></div>
      </div>

      {/* Background Floating Emojis from Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[15%] left-[8%] transform rotate-12 opacity-20 text-5xl">✨</div>
        <div className="absolute bottom-[25%] right-[8%] transform -rotate-12 opacity-20 text-4xl">💌</div>
        <div className="absolute top-[50%] right-[15%] transform rotate-45 opacity-15 text-3xl">🥂</div>
        <div className="absolute bottom-[15%] left-[12%] transform -rotate-6 opacity-15 text-4xl">🌹</div>
      </div>

      {/* Canvas for Celebration Confetti */}
      {screen === 'celebration' && (
        <canvas 
          id="confetti-canvas"
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-50"
        />
      )}

      {/* Header Area / Navigation with Theme Accents */}
      <header className="w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#800000] animate-pulse"></div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#374151]/80">
            Operation: Date Night
          </span>
        </div>
        <div className="flex gap-3.5">
          <div className={`w-8 h-1 rounded-full transition-colors duration-300 ${screen === 'ask' ? 'bg-[#800000]' : 'bg-[#374151]/10'}`}></div>
          <div className={`w-8 h-1 rounded-full transition-colors duration-300 ${screen === 'pitch' ? 'bg-[#800000]' : 'bg-[#374151]/10'}`}></div>
          <div className={`w-8 h-1 rounded-full transition-colors duration-300 ${(screen === 'decision' || screen === 'celebration') ? 'bg-[#800000]' : 'bg-[#374151]/10'}`}></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 z-10 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: THE ASK */}
          {screen === 'ask' && (
            <motion.div
              key="ask-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center max-w-2xl px-6"
              id="screen-ask"
            >
              <div className="mb-6 animate-bounce">
                <span className="text-5xl">🌹</span>
              </div>
              
              <span className="text-xs uppercase tracking-widest font-mono font-semibold text-[#800000] bg-rose-50/80 px-3.5 py-1.5 rounded-full inline-block mb-6 shadow-sm border border-rose-100">
                Incoming Connection 💌
              </span>
              
              <h2 className="font-display italic text-2xl md:text-3xl text-[#4B5563] font-medium leading-relaxed mb-4">
                I have a very important question for you...
              </h2>
              
              <h1 className="font-display italic text-4xl md:text-6xl font-extrabold text-[#374151] tracking-tight leading-tight mb-10">
                Will you go on a date with me?
              </h1>

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen('pitch')}
                  id="btn-convince-first"
                  className="bg-[#800000] hover:bg-[#660000] text-white px-8 py-4 rounded-full font-semibold shadow-[0_20px_50px_rgba(128,0,0,0.25)] hover:shadow-[0_20px_50px_rgba(128,0,0,0.35)] transition-all duration-300 flex items-center gap-2 text-base md:text-lg group"
                >
                  Wait, let me convince you first
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: THE PITCH */}
          {screen === 'pitch' && (
            <motion.div
              key="pitch-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg"
              id="screen-pitch"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/50 relative overflow-hidden flex flex-col items-center">
                
                {/* Decorative heart in the background of card */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Heart className="w-32 h-32 fill-[#800000] text-[#800000]" />
                </div>

                <div className="w-full flex justify-between items-center mb-6 z-10">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    SLIDE {activeReasonIndex + 1} OF {reasons.length}
                  </span>
                  <div className="flex gap-1.5">
                    {reasons.map((_, idx) => (
                      <span 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === activeReasonIndex ? 'w-5 bg-[#800000]' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Slides Content */}
                <div className="w-full min-h-[380px] flex flex-col z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeReasonIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center flex-grow text-center"
                    >
                      {/* Polaroid Frame for Image */}
                      <div className="bg-white p-3 pb-6 rounded-xl shadow-md border border-slate-100 mb-6 max-w-[280px] w-full transform rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-50 relative border border-slate-100">
                          <img
                            src={reasons[activeReasonIndex].image}
                            alt={reasons[activeReasonIndex].alt}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="mt-3.5 flex items-center justify-center gap-1.5">
                          {reasons[activeReasonIndex].icon}
                          <span className="font-mono text-xs font-semibold text-[#800000]/70 uppercase tracking-widest">
                            {reasons[activeReasonIndex].tag}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display italic text-2xl font-bold text-slate-800 mb-2">
                        {reasons[activeReasonIndex].title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm md:text-base leading-relaxed px-4">
                        {reasons[activeReasonIndex].text}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Carousel Controls */}
                <div className="w-full flex justify-between items-center mt-6 border-t border-slate-100 pt-5 z-10">
                  <button
                    onClick={() => setActiveReasonIndex(prev => (prev === 0 ? reasons.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer"
                    title="Previous reason"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setActiveReasonIndex(prev => (prev === reasons.length - 1 ? 0 : prev + 1))}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors duration-200 cursor-pointer"
                    title="Next reason"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

              {/* Transition to next screen */}
              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen('decision')}
                  id="btn-to-decision"
                  className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                >
                  Convinced? Now for your answer...
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: THE DECISION */}
          {screen === 'decision' && (
            <motion.div
              key="decision-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full max-w-xl"
              id="screen-decision"
            >
              <div className="mb-4 animate-bounce">
                <span className="text-4xl">🌹</span>
              </div>

              <h1 className="font-display italic text-4xl md:text-6xl font-extrabold text-[#374151] tracking-tight leading-tight mb-4">
                So, what do you say?
              </h1>
              
              <p className="font-display italic text-xl text-[#4B5563] mb-12">
                {getCheekyComment()}
              </p>

              {/* Action Buttons with Evasion Mechanism */}
              <div className="relative min-h-[180px] w-full flex items-center justify-center gap-6 flex-wrap">
                
                {/* YES Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setScreen('celebration')}
                  id="btn-yes"
                  className="animate-romantic-pulse bg-[#800000] hover:bg-[#660000] text-white px-12 py-6 rounded-full font-bold text-2xl shadow-[0_20px_50px_rgba(128,0,0,0.3)] transition-all duration-300 flex items-center gap-2.5 z-10 cursor-pointer"
                >
                  <Heart className="w-6 h-6 fill-white" />
                  Yes! I'd love to.
                </motion.button>

                {/* NO Button (The Evasive Trap) */}
                <button
                  ref={noBtnRef}
                  onMouseEnter={evadeNoButton}
                  onTouchStart={(e) => {
                    e.preventDefault(); // Prevent accidental selection
                    evadeNoButton();
                  }}
                  id="btn-no"
                  style={
                    noBtnPos 
                      ? { 
                          position: 'fixed', 
                          left: `${noBtnPos.x}vw`, 
                          top: `${noBtnPos.y}vh`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 40,
                        } 
                      : { 
                          position: 'relative', 
                          zIndex: 10,
                        }
                  }
                  className="bg-[#9CA3AF] hover:bg-slate-400 text-white px-6 py-2.5 rounded-full text-sm font-medium border border-white/20 shadow transition-all duration-200 ease-out select-none whitespace-nowrap cursor-pointer opacity-85"
                >
                  No
                </button>

              </div>
            </motion.div>
          )}

          {/* SCREEN 4: CELEBRATION */}
          {screen === 'celebration' && (
            <motion.div
              key="celebration-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full max-w-md text-center"
              id="screen-celebration"
            >
              <div className="bg-white/85 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/60 relative overflow-hidden flex flex-col items-center">
                
                {/* Floating animated sparkles */}
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-[#800000] mb-6 shadow-inner animate-bounce">
                  <Heart className="w-8 h-8 fill-[#800000] text-[#800000]" />
                </div>

                <h1 className="font-display italic text-3xl md:text-4xl font-extrabold text-[#374151] tracking-tight leading-tight mb-4">
                  Yay! ❤️
                </h1>

                <p className="font-display italic text-lg text-[#800000] font-semibold mb-6">
                  Best decision you've made all day.
                </p>

                <p className="text-[#4B5563] text-base mb-8">
                  I'll pick you up at 12 PM! Get ready for the perfect afternoon. ✨
                </p>

                {/* Elegant Itinerary Summary Card */}
                <div className="w-full bg-white/50 rounded-2xl p-5 border border-white/60 text-left space-y-3.5 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#800000]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold">DATE</p>
                      <p className="text-xs font-semibold text-[#374151]">28 July</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#4A90E2]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold">TIME</p>
                      <p className="text-xs font-semibold text-[#374151]">12:00 PM Sharp</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold">LOCATION</p>
                      <p className="text-xs font-semibold text-[#374151]">Ye nahi bataunga 😉</p>
                    </div>
                  </div>
                </div>

                {/* Playful Re-start/Close Button */}
                <button
                  onClick={() => setScreen('ask')}
                  className="mt-8 text-xs font-mono font-semibold text-slate-400 hover:text-[#800000] transition-colors duration-200 uppercase tracking-widest border-b border-dashed border-slate-300 hover:border-[#800000]/40 pb-0.5 cursor-pointer"
                >
                  ← Ask again (Just for fun)
                </button>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Elegant Summary Pitch Sidebar from Theme (Screen 3 & Celebration) */}
      {(screen === 'decision' || screen === 'celebration') && (
        <aside className="hidden lg:flex absolute left-12 bottom-12 z-20 flex-col gap-4">
          <div className="p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm w-64">
            <div className="flex gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#800000]"></div>
              <div className="w-2 h-2 rounded-full bg-[#800000]"></div>
              <div className="w-2 h-2 rounded-full bg-[#800000]"></div>
            </div>
            <p className="text-[11px] uppercase tracking-widest font-bold mb-1 opacity-50">Summary of Pitch</p>
            <ul className="text-xs space-y-1 text-[#374151]">
              <li>• Undeniably high aesthetic standards</li>
              <li>• Proven record of being a "good boy"</li>
              <li>• Expert-level boundary management</li>
            </ul>
          </div>
        </aside>
      )}

      {/* Decorative Encryption & Status labels from Theme (Screen 3 & Celebration) */}
      {(screen === 'decision' || screen === 'celebration') && (
        <div className="hidden md:block absolute bottom-12 right-12 text-right opacity-40 font-mono z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black">Status: Awaiting Response</p>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black">Encryption: Romantic 256-bit</p>
        </div>
      )}

      {/* Footer Area */}
      <footer className="w-full max-w-7xl mx-auto px-6 text-center text-[11px] font-mono text-[#374151]/50 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-300/20 pt-4">
        <p>© 2026 DATEPROPOSAL CORP. ALL RIGHTS RESERVED.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 fill-[#800000]/60 text-[#800000]/60" /> for someone special.
        </p>
      </footer>

    </div>
  );
}
