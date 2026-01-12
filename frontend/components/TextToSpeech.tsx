"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';

interface TextToSpeechProps {
    title: string;
    content: any[]; // Strapi rich text blocks
}

export default function TextToSpeech({ title, content }: TextToSpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [supported, setSupported] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [showVoiceSelector, setShowVoiceSelector] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);

            // Load voices
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                if (availableVoices.length > 0) {
                    // Filter for English voices only
                    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
                    setVoices(englishVoices);

                    // Auto-select best voice
                    if (!selectedVoice) {
                        const bestVoice =
                            // Prefer premium/natural voices
                            englishVoices.find(v => v.name.includes('Premium')) ||
                            englishVoices.find(v => v.name.includes('Natural')) ||
                            englishVoices.find(v => v.name.includes('Enhanced')) ||
                            // Google voices are usually good
                            englishVoices.find(v => v.name.includes('Google') && v.name.includes('US')) ||
                            englishVoices.find(v => v.name.includes('Google')) ||
                            // Microsoft voices
                            englishVoices.find(v => v.name.includes('Microsoft') && v.name.includes('Zira')) ||
                            englishVoices.find(v => v.name.includes('Microsoft') && v.name.includes('David')) ||
                            // Apple voices
                            englishVoices.find(v => v.name.includes('Samantha')) ||
                            englishVoices.find(v => v.name.includes('Alex')) ||
                            // Fallback to first English voice
                            englishVoices[0];

                        setSelectedVoice(bestVoice || null);
                    }
                }
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                try {
                    window.speechSynthesis.cancel();
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
        };
    }, [selectedVoice]);

    // Extract plain text from Strapi blocks
    const getPlainText = () => {
        let text = `${title}. `;

        content.forEach(block => {
            if (block.type === 'paragraph' || block.type === 'heading') {
                block.children.forEach((child: any) => {
                    if (child.type === 'link') {
                        child.children?.forEach((linkChild: any) => {
                            if (linkChild.text) {
                                text += linkChild.text + ' ';
                            }
                        });
                    } else if (child.text) {
                        text += child.text + ' ';
                    }
                });
                text += '. ';
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

            const utterance = new SpeechSynthesisUtterance(text);

            // Use selected voice
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('Using voice:', selectedVoice.name);
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            utterance.lang = 'en-US';

            utterance.onstart = () => {
                console.log('Speech started with voice:', selectedVoice?.name);
                setIsPlaying(true);
                setIsPaused(false);
            };

            utterance.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };

            utterance.onerror = (event) => {
                console.error('Speech error:', event.error);
                setIsPlaying(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };

            utterance.onpause = () => {
                setIsPaused(true);
                setIsPlaying(false);
            };

            utterance.onresume = () => {
                setIsPaused(false);
                setIsPlaying(true);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error('Error in speak:', error);
            setIsPlaying(false);
            setIsPaused(false);
        }
    };

    const handlePlay = () => {
        if (!supported) return;

        try {
            if (isPaused) {
                window.speechSynthesis.resume();
                return;
            }

            if (isPlaying) {
                window.speechSynthesis.pause();
                return;
            }

            if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                window.speechSynthesis.cancel();
            }

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
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(false);
            utteranceRef.current = null;
        } catch (error) {
            console.error('Error in handleStop:', error);
        }
    };

    const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
        setSelectedVoice(voice);
        setShowVoiceSelector(false);

        // Restart if currently playing
        if (isPlaying || isPaused) {
            handleStop();
            setTimeout(() => {
                handlePlay();
            }, 300);
        }
    };

    if (!supported) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full w-max shadow-sm">
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

                <div className="relative">
                    <button
                        onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                        className="p-2 rounded-full bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm border border-slate-200"
                        aria-label="Voice Settings"
                        title="Change Voice"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    {showVoiceSelector && voices.length > 0 && (
                        <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 min-w-[250px] max-h-[300px] overflow-y-auto z-10">
                            <div className="text-xs font-semibold text-slate-500 px-2 py-1 mb-1">
                                Select Voice
                            </div>
                            {voices.map((voice, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleVoiceChange(voice)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-blue-50 transition-colors ${selectedVoice?.name === voice.name ? 'bg-blue-100 text-blue-900 font-medium' : 'text-slate-700'
                                        }`}
                                >
                                    <div className="font-medium">{voice.name}</div>
                                    <div className="text-xs text-slate-500">{voice.lang}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedVoice && (
                <div className="text-xs text-slate-500 mt-2 ml-1">
                    Voice: {selectedVoice.name}
                </div>
            )}
        </div>
    );
}
