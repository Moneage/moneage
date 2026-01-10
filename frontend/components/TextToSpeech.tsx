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
    }, []);

    // Extract plain text from Strapi blocks
    const getPlainText = () => {
        let text = `${title}. `;

        content.forEach(block => {
            if (block.type === 'paragraph' || block.type === 'heading') {
                block.children.forEach((child: any) => {
                    if (child.text) {
                        text += child.text + ' ';
                    }
                });
                text += '. '; // Pause between blocks
            }
        });

        return text;
    };

    const handlePlay = () => {
        if (!supported) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
            return;
        }

        const text = getPlainText();
        const utterance = new SpeechSynthesisUtterance(text);

        // Configure voice (prefer nicer ones if available)
        const voices = window.speechSynthesis.getVoices();
        // Try to find a nice English voice like "Google US English" or system default
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || null;
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    const handleStop = () => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    if (!supported) return null;

    return (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full w-max shadow-sm mb-6">
            <div className="flex items-center gap-2 text-blue-900 text-sm font-semibold mr-2">
                <Volume2 className="w-4 h-4" />
                <span>Listen</span>
            </div>

            <button
                onClick={handlePlay}
                className="p-2 rounded-full bg-white text-blue-900 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm border border-blue-100"
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {(isPlaying || isPaused) && (
                <button
                    onClick={handleStop}
                    className="p-2 rounded-full bg-white text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm border border-slate-200"
                    aria-label="Stop"
                >
                    <Square className="w-4 h-4 fill-current" />
                </button>
            )}
        </div>
    );
}
