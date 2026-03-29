import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import api from '../../services/api';

const MediaViewer = ({ isOpen, onClose, items = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setZoom(1);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, initialIndex]);

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setZoom(1);
    }, [items.length]);

    const handlePrev = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setZoom(1);
    }, [items.length]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') onClose();
    }, [handleNext, handlePrev, onClose]);

    const handleDownload = async (e) => {
        if (e) e.stopPropagation();
        if (!currentItem) return;
        
        try {
            const fileUrl = `${baseUrl}${currentItem.file_url}`;
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = currentItem.file_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
            // Fallback: open in new tab
            window.open(`${baseUrl}${currentItem.file_url}`, '_blank');
        }
    };

    const handleOpenInNewTab = (e) => {
        if (e) e.stopPropagation();
        window.open(`${baseUrl}${currentItem.file_url}`, '_blank');
    };

    useEffect(() => {
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleKeyDown]);

    if (!isOpen || items.length === 0) return null;

    const currentItem = items[currentIndex];
    const baseUrl = api.defaults.baseURL.replace('/api/v1', '');
    const isImage = currentItem.content_type?.startsWith('image/') || 
                    currentItem.file_name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    const isVideo = currentItem.content_type?.startsWith('video/') || 
                    currentItem.file_name?.match(/\.(mp4|webm|ogg|mov)$/i);

    return createPortal(
        <div 
            className="fixed inset-0 z-[99999] flex flex-col bg-black/95 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]"
            onClick={onClose}
        >
            {/* Header / Controls */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex flex-col">
                    <h3 className="text-white font-bold tracking-tight truncate max-w-sm md:max-w-xl">
                        {currentItem.file_name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                        {currentIndex + 1} von {items.length} • {currentItem.file_size ? (currentItem.file_size / (1024 * 1024)).toFixed(2) : '0.00'} MB
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleOpenInNewTab}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10"
                        title="In neuem Tab öffnen"
                    >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10"
                        title="Herunterladen"
                    >
                        <i className="fa-solid fa-download"></i>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all border border-white/10"
                        title="Schließen"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
                {/* Navigation Arrows */}
                {items.length > 1 && (
                    <>
                        <button 
                            onClick={handlePrev}
                            className="absolute left-4 md:left-8 w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-20 border border-white/5 backdrop-blur-md group"
                        >
                            <i className="fa-solid fa-chevron-left text-xl group-hover:-translate-x-1 transition-transform"></i>
                        </button>
                        <button 
                            onClick={handleNext}
                            className="absolute right-4 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-20 border border-white/5 backdrop-blur-md group"
                        >
                            <i className="fa-solid fa-chevron-right text-xl group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </>
                )}

                {/* Media Content */}
                <div 
                    className="max-w-full max-h-full flex items-center justify-center select-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {isImage ? (
                        <img 
                            crossOrigin="anonymous"
                            src={`${baseUrl}${currentItem.file_url}`} 
                            alt={currentItem.file_name}
                            className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm transition-transform duration-300"
                            style={{ transform: `scale(${zoom})` }}
                            onDoubleClick={() => setZoom(prev => prev === 1 ? 2 : 1)}
                        />
                    ) : isVideo ? (
                        <video 
                            controls 
                            autoPlay
                            crossOrigin="anonymous"
                            className="max-w-full max-h-[85vh] shadow-2xl rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <source src={`${baseUrl}${currentItem.file_url}`} type={currentItem.content_type || 'video/mp4'} />
                            Ihr Browser unterstützt das Video-Tag nicht.
                        </video>
                    ) : (
                        <div className="flex flex-col items-center gap-6 p-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md max-w-lg w-full">
                            <i className="fa-solid fa-file-invoice text-8xl text-blue-500/50"></i>
                            <div className="text-center">
                                <p className="text-white text-xl font-bold mb-2">Keine Vorschau verfügbar</p>
                                <p className="text-gray-400">Dieser Dateityp kann nicht direkt angezeigt werden.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button 
                                    onClick={handleOpenInNewTab}
                                    className="flex-1 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                    Ansehen
                                </button>
                                <button 
                                    onClick={handleDownload}
                                    className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-download"></i>
                                    Download
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Strip */}
            {items.length > 1 && (
                <div 
                    className="h-24 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center justify-center p-2 gap-2 overflow-x-auto scrollbar-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {items.map((item, idx) => {
                        const isThumbImage = item.content_type?.startsWith('image/') || item.file_name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                        const isThumbVideo = item.content_type?.startsWith('video/') || item.file_name?.match(/\.(mp4|webm|ogg|mov)$/i);
                        
                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-16 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative ${currentIndex === idx ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                {isThumbImage ? (
                                    <img 
                                        crossOrigin="anonymous"
                                        src={`${baseUrl}${item.file_url}`} 
                                        alt="" 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : isThumbVideo ? (
                                    <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <i className="fa-solid fa-video"></i>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                                        <i className="fa-solid fa-file"></i>
                                    </div>
                                )}
                                {currentIndex === idx && (
                                    <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>,
        document.body
    );
};

export default MediaViewer;
