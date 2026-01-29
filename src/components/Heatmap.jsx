import React, { useRef} from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import '../styles/Heatmap.css';

function Heatmap({ focusHistory = {} }) {
    const totalHours = Object.values(focusHistory || {}).reduce((a, b) => a + b, 0);

    const days = [...Array(28)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const calculateStreak = (history) => {
        const dates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));
        if (dates.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < dates.length; i++) {
            const checkDate = new Date(dates[i]);
            checkDate.setHours(0, 0, 0, 0);

            const diffInTime = currentDate.getTime() - checkDate.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

            if (diffInDays === streak) {
                streak++;
            } else if (diffInDays > streak) {
                break;
            }
        }
        return streak;
    };

    const streakCount = calculateStreak(focusHistory);

    if (streakCount === 7) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#ffffff', '#ff8c00']
        });
    }

    const heatmapRef = useRef(null);

    const handleDownload = async () => {
        if (heatmapRef.current) {
            const canvas = await html2canvas(heatmapRef.current, {
                backgroundColor: '#050505',
                scale: 2,
                borderRadius: 20
            });

            const image = canvas.toDataURL("image/png")
            const link = document.createElement('a');
            link.href = image;
            link.download = `Zenith-Flow-Repoort-${new Date().toISOString().split('T')[0]}.png`;
            link.click();

            const streak = calculateStreak(focusHistory);
            const total = Object.values(focusHistory).reduce((a, b) => a +b, 0).toFixed(1);

            const shareText = `Just reached a ${streak}-day flow streak on Zenith! 🔥\n\nTotal focus time: ${total}minutes.\n\nVisualizing deep work with @ZenithApp. #BuildInPublic #FlowState`;

            try {
                await navigator.clipboard.writeText(shareText);
                alert("Report download & share text copied to clipboard!");
            } catch (err) {
                alert('Failed to copy text', err)
            }
        }
    };

  return (
    <div className='heatmap-container' ref={heatmapRef}>
        <div className='heatmap-header'>
            <div className='streak-badge'>
                <span> FLOW HISTORY </span>
                {streakCount >= 3 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='fire-streak'
                    >
                        🔥 {streakCount} DAY STREAK
                    </motion.span>
                )}
            </div>

            <div className='header-right'>
                <span> {totalHours.toFixed(1)}mins Total </span>
                <button onClick={handleDownload} className='download-btn' title='Download Report'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </div>
        </div>

        <div className='heatmap-grid'>
            {days.map(date => {
                const hours = focusHistory[date] || 0;
                const intensity = Math.min(hours / 4, 1);

                return (
                    <motion.div
                        key={date}
                        className='heatmap-cell'
                        initial={false}
                        animate={{
                            backgroundColor: hours > 0 ? `rgba(212, 175, 55, ${0.2 + intensity * 0.8})` : '#111',
                            boxShadow: hours > 0 ? `0 0 ${intensity * 15}px rgba(212, 175, 55, 0.3)` : 'none',
                            border: hours > 0 ? '1px solid #d4af37' : '1px solid #222'
                        }}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                    >
                        <div className='tooltip'> {date}: {hours.toFixed(1)}mins </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
  )
}

export default Heatmap;
