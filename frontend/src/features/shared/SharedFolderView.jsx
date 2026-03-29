import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import MediaViewer from '../../components/common/MediaViewer';

const SharedFolderView = () => {
    const { token } = useParams();
    const [folderData, setFolderData] = useState(null);
    const [currentPath, setCurrentPath] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryItems, setGalleryItems] = useState([]);
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        fetchSharedFolder(currentPath);
    }, [token, currentPath]);

    const fetchSharedFolder = async (path = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/public/shared-folder/${token}`, {
                params: { path }
            });
            if (res.data?.status === 'success') {
                setFolderData(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching shared folder:', err);
            setError(err.response?.data?.error || 'Ordner nicht gefunden или Zugriff abgelaufen.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (file) => {
        const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
        try {
            const res = await api.get(`/public/shared-folder/${token}/download`, {
                params: { file: filePath },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert('Fehler beim Herunterladen');
        }
    };

    const navigateTo = (folderName) => {
        setCurrentPath(prev => prev ? `${prev}/${folderName}` : folderName);
    };

    const navigateUp = () => {
        if (!currentPath) return;
        const parts = currentPath.split('/');
        parts.pop();
        setCurrentPath(parts.join('/'));
    };

    const openGallery = (fileItem) => {
        // Prepare items for MediaViewer: only files in the current folder
        const filesOnly = folderData.items.filter(item => !item.isDirectory);
        const mappedItems = filesOnly.map(file => ({
            file_url: file.url,
            file_name: file.name,
            file_size: file.size,
            // MediaViewer will infer content_type from extension if not provided
        }));
        
        const index = filesOnly.findIndex(f => f.name === fileItem.name);
        setGalleryItems(mappedItems);
        setGalleryIndex(index >= 0 ? index : 0);
        setIsGalleryOpen(true);
    };

    const formatSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    if (loading && !folderData) {
        return (
            <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-gray-400 animate-pulse">Dateien werden geladen...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6">
                <div className="glass-card max-w-md w-full p-8 text-center animate-[fadeIn_0.3s_ease-out]">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Zugriff verweigert</h1>
                    <p className="text-gray-400 mb-8">{error}</p>
                    <a href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        <i className="fa-solid fa-arrow-left"></i>
                        Zurück zur Startseite
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f111a] py-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Project Header (The Red Circled Area) */}
                <div className="mb-12 animate-[slideDown_0.6s_ease-out]">
                    <div className="relative p-8 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
                        
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase">Projekt-Informationen</p>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase italic break-words">
                                        {folderData?.project?.title || folderData?.folderName}
                                    </h1>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <i className="fa-solid fa-location-dot text-blue-400 text-xs"></i>
                                        </div>
                                        <span>{folderData?.project?.address || 'Keine Adresse hinterlegt'}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-white/10 rounded-full hidden md:block"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <i className="fa-solid fa-user-tie text-blue-400 text-xs"></i>
                                        </div>
                                        <span className="text-white font-bold">{folderData?.project?.clientName || 'Kein Kunde zugeordnet'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 shrink-0">
                                <div className="glass-card px-4 py-2 border-white/10 bg-white/5 rounded-2xl">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black block mb-1">Inhalt</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-lg font-black">{folderData?.items?.length || 0}</span>
                                        <span className="text-gray-500 text-[10px] uppercase font-bold">Objekte</span>
                                    </div>
                                </div>
                                <div className="glass-card px-4 py-2 border-white/10 bg-white/5 rounded-2xl">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black block mb-1 text-right">Server Status</span>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Header */}
                <div className="flex items-center gap-4 mb-8 px-2 animate-[fadeIn_0.5s_ease-out_0.2s] delay-200">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <i className="fa-solid fa-folder-open text-white text-xl"></i>
                    </div>
                    <div>
                        <p className="text-blue-400/80 text-[10px] font-black tracking-[0.2em] uppercase leading-none mb-1.5">Aktueller Ordner</p>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            {currentPath.split('/').pop() || folderData?.folderName || 'Projektdateien'}
                        </h2>
                    </div>
                </div>

                {/* Navigation Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 animate-[fadeIn_0.5s_ease-out_0.15s] overflow-x-auto pb-2 scrollbar-none">
                    <button 
                        onClick={() => setCurrentPath('')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${!currentPath ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'}`}
                    >
                        <i className="fa-solid fa-home text-xs"></i>
                        <span className="text-xs font-bold uppercase tracking-wider">Start</span>
                    </button>
                    {currentPath.split('/').filter(Boolean).map((part, idx, arr) => (
                        <React.Fragment key={idx}>
                            <i className="fa-solid fa-chevron-right text-gray-700 text-[10px]"></i>
                            <button
                                onClick={() => setCurrentPath(arr.slice(0, idx + 1).join('/'))}
                                className={`px-3 py-1.5 rounded-lg transition-colors ${idx === arr.length - 1 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'}`}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider">{part}</span>
                            </button>
                        </React.Fragment>
                    ))}
                </div>

                {/* File List */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl shadow-2xl animate-[fadeIn_0.5s_ease-out_0.2s]">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                    
                    <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h2 className="text-gray-200 font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <i className="fa-solid fa-file-shield text-blue-400 text-sm"></i>
                            </div>
                            <span className="tracking-tight uppercase italic text-sm">Dateien & Ordner</span>
                        </h2>
                    </div>

                    <div className="divide-y divide-white/[0.05]">
                        {currentPath && (
                            <div 
                                onClick={navigateUp}
                                className="p-5 hover:bg-white/[0.03] transition-all flex items-center gap-4 cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-white/10 transition-all">
                                    <i className="fa-solid fa-arrow-turn-up scale-x-[-1]"></i>
                                </div>
                                <span className="text-gray-400 font-medium group-hover:text-white text-sm">Zurück</span>
                            </div>
                        )}

                        {!folderData?.items || folderData.items.length === 0 ? (
                            <div className="p-20 text-center">
                                <i className="fa-regular fa-folder-open text-6xl text-gray-600/30 mb-4 block animate-bounce"></i>
                                <p className="text-gray-500 italic">Dieser Ordner enthält momentan keine Objekte.</p>
                            </div>
                        ) : (
                            folderData.items.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={item.isDirectory ? () => navigateTo(item.name) : () => openGallery(item)}
                                    className="p-4 hover:bg-white/[0.03] transition-all flex items-center justify-between gap-4 group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center transition-all ${item.isDirectory ? 'text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-500/40' : 'text-gray-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 group-hover:text-blue-400'}`}>
                                            <i className={`fa-solid ${item.isDirectory ? 'fa-folder' : 'fa-file-lines'} text-lg`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate group-hover:text-blue-100 transition-colors">
                                                {item.name}
                                            </p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                {!item.isDirectory && (
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        {formatSize(item.size)}
                                                    </span>
                                                )}
                                                {item.isDirectory && (
                                                    <span className="text-[10px] text-blue-500/50 font-bold uppercase tracking-wider">
                                                        Ordner
                                                    </span>
                                                )}
                                                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                <span className="text-[10px] text-gray-500 font-medium italic">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!item.isDirectory && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                                            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                                        >
                                            <i className="fa-solid fa-download"></i>
                                            <span className="hidden sm:inline">Laden</span>
                                        </button>
                                    )}
                                    {item.isDirectory && (
                                        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all">
                                            <i className="fa-solid fa-chevron-right text-xs"></i>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="p-5 bg-white/5 border-t border-white/10 flex items-center justify-center text-[9px] text-gray-500 gap-3 uppercase tracking-[0.2em] font-black">
                        <i className="fa-solid fa-shield-check text-blue-500/50 text-xs"></i>
                        Sichere Übertragung via Empire Premium Cloud
                    </div>
                </div>
                
                {/* Footer Logo/Branding */}
                <div className="mt-12 text-center animate-[fadeIn_0.8s_ease-out_0.5s] delay-300 opacity-20 hover:opacity-100 transition-opacity">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Bereitgestellt von</p>
                    <div className="flex items-center justify-center gap-3 text-white font-black text-2xl italic tracking-tighter">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center not-italic shadow-lg shadow-blue-500/20">
                            <span className="text-sm">EP</span>
                        </div>
                        EMPIRE PREMIUM
                    </div>
                </div>
            </div>

            {/* Media Gallery Viewer */}
            <MediaViewer 
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                items={galleryItems}
                initialIndex={galleryIndex}
            />
        </div>
    );
};

export default SharedFolderView;
