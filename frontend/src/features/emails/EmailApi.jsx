import React from 'react';

const EmailApi = () => {
    const domain = 'empire-premium.de';
    const apiUrl = 'https://admin.empire-premium.de/api/v1/emails';

    const endpoints = [
        { method: 'GET', path: '/', desc: 'Alle verwalteten E-Mail-Konten abrufen' },
        { method: 'POST', path: '/', desc: 'Neues E-Mail-Konto (Weiterleitung/SMTP) erstellen', payload: '{ "email": "alias@'+domain+'", "type": "forward", "forward_to": "ziel@mail.de" }' },
        { method: 'DELETE', path: '/:id', desc: 'E-Mail-Konto löschen' },
        { method: 'GET', path: '/stats', desc: 'Mailgun-Statistiken für die Domain abrufen' },
        { method: 'POST', path: '/send', desc: 'E-Mail versenden', payload: '{ "to": "empfaenger@mail.de", "subject": "Betreff", "text": "Inhalt" }' }
    ];

    return (
        <div className="animate-[fadeIn_0.5s_ease-out_forwards] p-6 max-w-5xl mx-auto">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">E-Mail API Dokumentation</h2>
                <p className="text-gray-400 text-lg">Integrieren und verwalten Sie Ihre E-Mail-Infrastruktur programmatisch.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
                        <i className="fa-solid fa-link text-blue-400 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-white mb-1">Base URL</h4>
                    <p className="font-mono text-xs text-blue-300 break-all">{apiUrl}</p>
                </div>
                <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/30">
                        <i className="fa-solid fa-shield-halved text-purple-400 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-white mb-1">Authentifizierung</h4>
                    <p className="text-xs text-gray-400">Bearer Token (JWT) erforderlich für alle Endpunkte.</p>
                </div>
                <div className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30">
                        <i className="fa-solid fa-globe text-green-400 text-xl"></i>
                    </div>
                    <h4 className="font-bold text-white mb-1">Domain Status</h4>
                    <p className="text-xs text-gray-400">Verknüpft mit <strong>{domain}</strong> via Mailgun.</p>
                </div>
            </div>

            <div className="glass-card rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl overflow-hidden mb-12 shadow-2xl">
                <div className="p-8 border-b border-white/10 flex items-center gap-3 bg-white/5">
                    <i className="fa-solid fa-code text-blue-400"></i>
                    <h3 className="text-xl font-bold">Verfügbare Endpunkte</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {endpoints.map((ep, i) => (
                        <div key={i} className="p-8 hover:bg-white/5 transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg ${ep.method === 'GET' ? 'bg-blue-500 text-white' : ep.method === 'POST' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {ep.method}
                                    </span>
                                    <code className="text-blue-300 font-bold tracking-tight text-sm md:text-base">{ep.path}</code>
                                </div>
                                <span className="text-sm text-gray-400 font-medium">{ep.desc}</span>
                            </div>
                            {ep.payload && (
                                <div className="mt-4 animate-[slideDown_0.3s_ease-out]">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Beispiel Payload</p>
                                    <pre className="p-4 rounded-2xl bg-black/40 border border-white/5 text-blue-200 font-mono text-xs overflow-x-auto shadow-inner">
                                        {ep.payload}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-3xl mb-12 flex items-start gap-4">
                <i className="fa-solid fa-circle-info text-blue-400 text-xl mt-1"></i>
                <div>
                    <h4 className="font-bold text-blue-200 mb-2">Wichtiger Hinweis</h4>
                    <p className="text-sm text-blue-300 leading-relaxed">
                        Alle API-Aufrufe müssen den Header <code>Authorization: Bearer [DEIN_TOKEN]</code> enthalten. Die Endpunkte sind nur für Benutzer mit der Rolle <strong>Admin</strong> oder <strong>Büro</strong> zugänglich.
                    </p>
                </div>
            </div>

            {/* Visual Example Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/2 shadow-xl">
                    <h4 className="font-bold mb-6 flex items-center gap-3">
                        <i className="fa-brands fa-js-square text-yellow-400 text-2xl"></i> JavaScript Integration
                    </h4>
                    <pre className="text-[11px] text-gray-300 font-mono leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner">
{`const response = await fetch('${apiUrl}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
const data = await response.json();
console.log(data.accounts);`}
                    </pre>
                </div>
                <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/2 shadow-xl">
                    <h4 className="font-bold mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-terminal text-blue-400 text-xl"></i> Shell / cURL
                    </h4>
                    <pre className="text-[11px] text-gray-300 font-mono leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner">
{`curl -X GET "${apiUrl}" \\
     -H "Authorization: Bearer YOUR_TOKEN"`}
                    </pre>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}} />
        </div>
    );
};

export default EmailApi;
