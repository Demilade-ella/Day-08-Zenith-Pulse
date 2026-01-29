import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ShowSummary.css';

function SessionSummary({ isOpen, onClose, minutesDone, taskName }) {
  return (
   <AnimatePresence>
        {isOpen && (
            <div className='modal-overlay'>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="summary-modal"
                >
                    <div className='modal-glow' />
                    <span className='modal-label'> SESSION COMPLETE </span>
                    <h2>{taskName || "Deep Work"}</h2>

                    <div className='stat-row'>
                        <div className='stat'>
                            <span> DURATION </span>
                            <p> {minutesDone}mins </p>
                        </div>
                        <div className='stat'>
                            <span> INTENSITY </span>
                            <p> 100% </p>
                        </div>
                    </div>

                    <p className='mood-question'> How was your flow? </p>
                    <div className='mood-selector'>
                        {['😫', '😐', '😊', '🔥'].map((emoji) => (
                            <button key={emoji} onClick={onClose} className='mood-btn'>
                                {emoji}
                            </button>
                        ))}
                    </div>

                    <button className='close summary' onClick={onClose}>
                        BaACK TO ZENITH
                    </button>
                </motion.div>
            </div>
        )}
   </AnimatePresence>
  )
}

export default SessionSummary;
