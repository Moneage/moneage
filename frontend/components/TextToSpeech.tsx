"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

interface TextToSpeechProps {
    title: string;
    content: any[]; // Strapi rich text blocks
}

export default function TextToSpeech({ title, content }: TextToSpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [supported, setSupported] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
        }

        // Cleanup on unmount
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                try {
                    window.speechSynthesis.cancel();
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
        };
    }, []);

    // Extract plain text from Strapi blocks
    const getPlainText = () => {
        let text = `${title}. `;

        content.forEach(block => {
            if (block.type === 'paragraph' || block.type === 'heading') {
                block.children.forEach((child: any) => {
                    // Handle links
                    if (child.type === 'link') {
                        child.children?.forEach((linkChild: any) => {
                            if (linkChild.text) {
                                text += linkChild.text + ' ';
                            }
                        });
                    }
                    // Handle regular text
                    else if (child.text) {
                        text += child.text + ' ';
                    }
                });
                text += '. '; // Pause between blocks
            }
        });

        return text.trim();
    };

    const speak = () => {
        try {
            const text = getPlainText();
            if (!text || text.length === 0) {
                console.error('No text to speak');
                return;
            }

            // Create utterance
            const utterance = new SpeechSynthesisUtterance(text);

            // Get voices and select one
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Prefer English voices
                const englishVoice = voices.find(v => v.lang.startsWith('en'));
                if (englishVoice) {
                    utterance.voice = englishVoice;
                }
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            utterance.lang = 'en-US';

            utterance.onstart = () => {
                console.log('Speech started successfully');
                setIsPlaying(true);
                setIsPaused(false);
            };

            utterance.onend = () => {
                console.log('Speech ended');
                setIsPlaying(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };

            utterance.onerror = (event) => {
                console.error('Speech error:', event.error, event);
                // Reset state on error
                setIsPlaying(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };

            utterance.onpause = () => {
                console.log('Speech paused');
                setIsPaused(true);
                setIsPlaying(false);
            };

            utterance.onresume = () => {
                console.log('Speech resumed');
                setIsPaused(false);
                setIsPlaying(true);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
            console.log('Speak command issued');

        } catch (error) {
            console.error('Error in speak:', error);
            setIsPlaying(false);
            setIsPaused(false);
        }
    };

    const handlePlay = () => {
        if (!supported) {
            console.error('Speech synthesis not supported');
            return;
        }

        try {
            // If paused, resume
            if (isPaused) {
                console.log('Resuming speech');
                window.speechSynthesis.resume();
                return;
            }

            // If playing, pause
            if (isPlaying) {
                console.log('Pausing speech');
                window.speechSynthesis.pause();
                return;
            }

            // Start new speech
            console.log('Starting new speech');

            // Cancel any existing speech first
            if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                console.log('Cancelling existing speech');
                window.speechSynthesis.cancel();
            }

            // Use setTimeout to ensure cancel completes
            setTimeout(() => {
                speak();
            }, 200);

        } catch (error) {
            console.error('Error in handlePlay:', error);
            setIsPlaying(false);
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        if (!supported) return;

        try {
            console.log('Stopping speech');
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(false);
            utteranceRef.current = null;
        } catch (error) {
            console.error('Error in handleStop:', error);
        }
    };

    if (!supported) return null;

    return (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full w-max shadow-sm mb-6">
            <div className="flex items-center gap-2 text-blue-900 text-sm font-semibold mr-2">
                <Volume2 className="w-4 h-4" />
                <span>Listen to Article</span>
            </div>

            <button
                onClick={handlePlay}
                className="p-2 rounded-full bg-white text-blue-900 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm border border-blue-100"
                aria-label={isPaused ? "Resume" : isPlaying ? "Pause" : "Play"}
                title={isPaused ? "Resume" : isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {(isPlaying || isPaused) && (
                <button
                    onClick={handleStop}
                    className="p-2 rounded-full bg-white text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm border border-slate-200"
                    aria-label="Stop"
                    title="Stop"
                >
                    <Square className="w-4 h-4 fill-current" />
                </button>
            )}
        </div>
    );
}
