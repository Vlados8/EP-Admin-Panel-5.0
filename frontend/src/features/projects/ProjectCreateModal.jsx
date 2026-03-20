import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProjectCreateModal = ({ isOpen, onClose, onProjectCreated, initialData = null }) => {
    // --- Data Lists ---
    const [clients, setClients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [subcontractors, setSubcontractors] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // --- Form States (Combined from Wizard & EditModal) ---
    // Section 1: Client Selection/Creation
    const [isNewClient, setIsNewClient] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [newClientData, setNewClientData] = useState({
        name: '', type: 'company', contact_person: '', email: '', phone: '', address: '', zip_code: '', city: '', source: 'admin_panel'
    });

    // Section 2: Project Details
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        status: 'Aktiv',
        progress: 0,
        start_date: '',
        end_date: '',
        budget: 0,
        category_id: '',
        subcategory_id: ''
    });

    // Section 3: Questions/Answers (Survey Logic)
    const [catViewLevel, setCatViewLevel] = useState('main'); // 'main', 'sub', 'questions'
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [dynamicAnswers, setDynamicAnswers] = useState({}); // { question_id: { value: string, answerId: number|null } }
    const [checkboxSelections, setCheckboxSelections] = useState([]); // [{ id, answer_text, ... }]

    // Section 4: Team & Besetzung
    const [assignedUsers, setAssignedUsers] = useState([]); // [{ user_id, role }]
    const [assignedSubcontractors, setAssignedSubcontractors] = useState([]); // [id]
    const [treeTopUser, setTreeTopUser] = useState('');
    const [treeGL, setTreeGL] = useState('');
    const [treeWorker, setTreeWorker] = useState('');

    // Fetch initial data
    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
            // Reset state
            setIsNewClient(false);
            setSelectedClientId('');
            setNewClientData({ name: '', type: 'company', contact_person: '', email: '', phone: '', address: '', zip_code: '', city: '', source: 'admin_panel' });
            setFormData({ title: '', description: '', address: '', status: 'Aktiv', progress: 0, start_date: '', end_date: '', budget: 0, category_id: '', subcategory_id: '' });
            setAssignedUsers([]); setAssignedSubcontractors([]);
            setTreeTopUser(''); setTreeGL(''); setTreeWorker('');
            setDynamicAnswers({}); setCatViewLevel('main'); setCurrentQuestion(null);

            if (initialData) {
                // Prefill from Inquiry
                setIsNewClient(true);
                setNewClientData({
                    name: initialData.contact_name || '', type: 'company', contact_person: initialData.contact_name || '',
                    email: initialData.contact_email || '', phone: initialData.contact_phone || '',
                    address: initialData.location || '', zip_code: '', city: ''
                });
                setFormData(prev => ({
                    ...prev,
                    title: initialData.title || '',
                    address: initialData.location || '',
                    description: initialData.notes || '',
                    category_id: initialData.category_id || '',
                    subcategory_id: initialData.subcategory_id || '' // prefill subcategory if available
                }));

                // Set answers if available
                if (initialData.answers && initialData.answers.length > 0) {
                    const presetAnswers = {};
                    let inferredSubcategoryId = initialData.subcategory_id || '';

                    initialData.answers.forEach(ans => {
                        presetAnswers[ans.question_id] = { value: ans.answer_value, answerId: ans.answer_id };

                        // Try to infer subcategory from first answer if not provided
                        if (!inferredSubcategoryId && ans.question_id) {
                            // This is a bit complex as categories might not be loaded yet or requires nested search
                        }
                    });
                    setDynamicAnswers(presetAnswers);
                    if (inferredSubcategoryId) {
                        setFormData(prev => ({ ...prev, subcategory_id: inferredSubcategoryId }));
                    }
                }
            }
        }
    }, [isOpen, initialData]);

    const fetchInitialData = async () => {
        setLoadingData(true);
        try {
            const [clientRes, catRes, userRes, subRes] = await Promise.all([
                api.get('/clients'),
                api.get('/categories'),
                api.get('/users'),
                api.get('/subcontractors')
            ]);
            setClients(clientRes.data.data.clients || []);
            setCategories(catRes.data.data.categories || []);
            setUsers(userRes.data.data.users || []);
            setSubcontractors(subRes.data.data.subcontractors || []);
        } catch (error) {
            console.error('Error fetching wizard data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    // --- Survey Handlers ---
    const handleCategorySelect = (category) => {
        setFormData({ ...formData, category_id: category.id, subcategory_id: '' });
        if (category.subcategories && category.subcategories.length > 0) {
            setCatViewLevel('sub');
        } else {
            setCatViewLevel('questions');
            if (category.questions && category.questions.length > 0) {
                setCurrentQuestion(category.questions[0]);
            } else {
                setCurrentQuestion(null);
            }
        }
    };

    const handleSubcategorySelect = (subcategory) => {
        setFormData({ ...formData, subcategory_id: subcategory.id });
        setCatViewLevel('questions');
        if (subcategory.questions && subcategory.questions.length > 0) {
            setCurrentQuestion(subcategory.questions[0]);
        } else {
            setCurrentQuestion(null);
        }
    };

    const handleAnswerQuestion = (question, answerValue, answerId, nextQuestionId) => {
        setDynamicAnswers(prev => ({ ...prev, [question.id]: { value: answerValue, answerId } }));

        let nextQ = null;
        if (nextQuestionId) {
            const selectedCat = categories.find(c => String(c.id) === String(formData.category_id));
            if (formData.subcategory_id && selectedCat) {
                const selectedSub = selectedCat.subcategories?.find(s => String(s.id) === String(formData.subcategory_id));
                nextQ = selectedSub?.questions?.find(q => q.id === nextQuestionId);
            } else if (selectedCat) {
                nextQ = selectedCat?.questions?.find(q => q.id === nextQuestionId);
            }
        }

        if (nextQ) {
            setCurrentQuestion(nextQ);
        } else {
            setCurrentQuestion(null); // Finished questions
        }
    };

    const submitCheckboxes = () => {
        if (checkboxSelections.length === 0) return;
        const values = checkboxSelections.map(a => a.answer_text).join(', ');
        const firstSelected = checkboxSelections[0];
        handleAnswerQuestion(currentQuestion, values, firstSelected?.id, firstSelected?.next_question_id);
        setCheckboxSelections([]);
    };

    const handleBackCat = () => {
        if (catViewLevel === 'questions') {
            const hasSubcategories = categories.find(c => String(c.id) === String(formData.category_id))?.subcategories?.length > 0;
            if (hasSubcategories) {
                setCatViewLevel('sub');
            } else {
                setCatViewLevel('main');
            }
        } else if (catViewLevel === 'sub') {
            setCatViewLevel('main');
        }
    };

    const toggleSubcontractor = (id) => {
        if (assignedSubcontractors.includes(id)) {
            setAssignedSubcontractors(assignedSubcontractors.filter(sid => sid !== id));
        } else {
            setAssignedSubcontractors([...assignedSubcontractors, id]);
        }
    };

    // --- Submit Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        try {
            let finalClientId = selectedClientId;

            // Handle inline client creation
            if (isNewClient) {
                if (!newClientData.name) {
                    alert('Bitte geben Sie einen Namen für den neuen Kunden ein.');
                    setLoadingSubmit(false);
                    return;
                }

                // Check by email first
                if (newClientData.email) {
                    const checkRes = await api.get(`/clients/check-email?email=${encodeURIComponent(newClientData.email)}`);
                    if (checkRes.data.data.exists) {
                        finalClientId = checkRes.data.data.client.id;
                    }
                }

                if (!finalClientId) {
                    const res = await api.post('/clients', {
                        ...newClientData,
                        source: 'admin_panel' // Explicitly set it
                    });
                    finalClientId = res.data.data.client.id;
                }
            } else if (!finalClientId) {
                alert('Bitte wählen Sie einen Kunden aus oder erstellen Sie einen neuen.');
                setLoadingSubmit(false);
                return;
            }

            // Format answers array
            const formattedAnswers = Object.keys(dynamicAnswers).map(qId => ({
                question_id: parseInt(qId),
                answer_id: dynamicAnswers[qId].answerId || null,
                custom_value: dynamicAnswers[qId].value
            }));

            // Construct payload for ProjectController.js createProject
            const payload = {
                ...formData,
                client_id: finalClientId,
                assigned_users: JSON.stringify(assignedUsers),
                assigned_subcontractors: JSON.stringify(assignedSubcontractors),
                answers: JSON.stringify(formattedAnswers),
                inquiry_id: initialData?.id // Pass inquiry ID to be handled by backend
            };

            const response = await api.post('/projects', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Project created:', response.data);

            if (onProjectCreated) {
                onProjectCreated(response.data.project);
            }
            onClose();

        } catch (error) {
            console.error('Error creating project:', error);
            const errorMsg = error.response?.data?.error || 'Fehler beim Erstellen des Projekts.';
            alert(errorMsg);
        } finally {
            setLoadingSubmit(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-md flex justify-center p-4">
            <div className="glass-card w-full max-w-4xl rounded-2xl border border-white/10 shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden flex flex-col my-auto max-h-none md:max-h-[95vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                        <i className="fa-solid fa-folder-plus text-emerald-400"></i> Projekt erstellen
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">

                    {/* Section 1: Client */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                            <i className="fa-regular fa-address-book text-blue-400"></i> 1. Kunde zuweisen
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Kunde auswählen</label>
                                <select
                                    value={!isNewClient ? selectedClientId : 'new'}
                                    onChange={(e) => {
                                        if (e.target.value === 'new') {
                                            setIsNewClient(true);
                                            setSelectedClientId('');
                                        } else {
                                            setIsNewClient(false);
                                            setSelectedClientId(e.target.value);
                                        }
                                    }}
                                    className="w-full bg-[#0a101d] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500"
                                >
                                    <option value="" disabled>-- Bitte wählen --</option>
                                    <option value="new">+ Neuen Kunden anlegen</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Inline Client Forms */}
                        {isNewClient && (
                            <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-4 animate-[fadeIn_0.3s_ease-out]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Typ</label>
                                        <select
                                            value={newClientData.type}
                                            onChange={e => setNewClientData({ ...newClientData, type: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500"
                                        >
                                            <option value="company">Unternehmen</option>
                                            <option value="private">Privatperson</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Unternehmens-/Kundenname *</label>
                                        <input type="text" value={newClientData.name} onChange={e => setNewClientData({ ...newClientData, name: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500" required={isNewClient} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Ansprechpartner</label>
                                        <input type="text" value={newClientData.contact_person} onChange={e => setNewClientData({ ...newClientData, contact_person: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">E-Mail</label>
                                        <input type="email" value={newClientData.email} onChange={e => setNewClientData({ ...newClientData, email: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Telefon</label>
                                        <input type="text" value={newClientData.phone} onChange={e => setNewClientData({ ...newClientData, phone: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Adresse</label>
                                        <input type="text" value={newClientData.address} onChange={e => setNewClientData({ ...newClientData, address: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">PLZ</label>
                                        <input type="text" value={newClientData.zip_code} onChange={e => setNewClientData({ ...newClientData, zip_code: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Stadt</label>
                                        <input type="text" value={newClientData.city} onChange={e => setNewClientData({ ...newClientData, city: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {!isNewClient && selectedClientId && (
                            <div className="text-sm text-gray-400 mt-2">
                                ✅ Ein bestehender Kunde wurde ausgewählt.
                            </div>
                        )}
                    </div>

                    {/* Section 2: Project Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                            <i className="fa-solid fa-list-check text-blue-400"></i> 2. Projektinformationen
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Projekttitel *</label>
                                <input
                                    type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Baustellenadresse</label>
                                <input
                                    type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Status</label>
                                <select
                                    value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-[#0a101d] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                >
                                    <option value="Aktiv">Aktiv</option>
                                    <option value="Pausiert">Pausiert</option>
                                    <option value="Abgeschlossen">Abgeschlossen</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Startdatum</label>
                                <input
                                    type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Enddatum</label>
                                <input
                                    type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Projekt-Budget (€)</label>
                                <input
                                    type="number" step="0.01" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Beschreibung</label>
                                <textarea
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>


                    {/* Section 3: Categories & Survey */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                            <i className="fa-solid fa-layer-group text-purple-400"></i> 3. Klassifizierung & Qualifizierung
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Kategorie</label>
                                <select
                                    value={formData.category_id}
                                    onChange={e => {
                                        const cat = categories.find(c => String(c.id) === String(e.target.value));
                                        if (cat) handleCategorySelect(cat);
                                        else handleCategorySelect({ id: '' });
                                    }}
                                    className="w-full bg-[#0a101d] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                >
                                    <option value="">-- Keine --</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Unterkategorie</label>
                                <select
                                    value={formData.subcategory_id}
                                    onChange={e => handleSubcategorySelect(categories.find(c => String(c.id) === String(formData.category_id))?.subcategories?.find(s => String(s.id) === e.target.value) || { id: e.target.value })}
                                    className="w-full bg-[#0a101d] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors"
                                    disabled={!formData.category_id}
                                >
                                    <option value="">-- Keine --</option>
                                    {categories.find(c => String(c.id) === String(formData.category_id))?.subcategories?.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Summary of Questions from Inquiry */}
                        {Object.keys(dynamicAnswers).length > 0 && (
                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl mt-4">
                                <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-check-circle"></i> Antworten aus der Anfrage übernommen
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    {Object.keys(dynamicAnswers).map(qId => {
                                        // Try to find question text and subcategory name
                                        let qText = "Frage " + qId;
                                        let subName = "";
                                        categories.forEach(c => {
                                            c.questions?.forEach(q => { if (q.id === parseInt(qId)) qText = q.question_text });
                                            c.subcategories?.forEach(s => {
                                                s.questions?.forEach(q => {
                                                    if (q.id === parseInt(qId)) {
                                                        qText = q.question_text;
                                                        subName = s.name;
                                                    }
                                                });
                                            });
                                        })
                                        return (
                                            <div key={qId} className="bg-black/30 p-2 rounded-lg text-sm border border-white/5">
                                                <div className="text-gray-400 text-[10px] mb-1 flex justify-between items-center">
                                                    <span className="truncate max-w-[70%]">{qText}</span>
                                                    {subName && <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{subName}</span>}
                                                </div>
                                                <div className="text-white font-medium">{dynamicAnswers[qId].value}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-3 text-xs text-gray-400 italic">
                                    Die Antworten werden beim Speichern des Projekts gespeichert. Sie können sie später bearbeiten.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 4: Team */}
                    <div className="space-y-6 pt-4 border-t border-white/10">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                            <i className="fa-solid fa-users text-amber-400"></i> 4. Team & Besetzung
                        </h3>

                        {/* Projektleiter */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-gray-400 uppercase">Projektleiter hinzufügen</label>
                                <div className="flex gap-2">
                                    <select
                                        value={treeTopUser}
                                        onChange={e => { setTreeTopUser(e.target.value); setTreeGL(''); setTreeWorker(''); }}
                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500"
                                    >
                                        <option value="">-- Person wählen --</option>
                                        {users.filter(u => u.role?.name?.toLowerCase() === 'projektleiter').map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (treeTopUser) {
                                                if (!assignedUsers.some(au => au.user_id === treeTopUser)) {
                                                    setAssignedUsers([...assignedUsers, { user_id: treeTopUser, role: 'projektleiter' }]);
                                                }
                                                setTreeTopUser('');
                                            }
                                        }}
                                        className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-600/30 transition-all"
                                    ><i className="fa-solid fa-plus"></i></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {assignedUsers.filter(au => au.role === 'projektleiter').map(au => {
                                        const u = users.find(user => user.id === au.user_id);
                                        return u && (
                                            <div key={u.id} className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-2 py-1 flex items-center gap-2">
                                                <span className="text-xs text-blue-300">{u.name}</span>
                                                <button type="button" onClick={() => setAssignedUsers(assignedUsers.filter(x => x.user_id !== u.id))} className="text-blue-400 hover:text-red-400"><i className="fa-solid fa-xmark text-[10px]"></i></button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Nachunternehmer */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-gray-400 uppercase">Nachunternehmer auswählen</label>
                                <div className="h-40 overflow-y-auto custom-scrollbar bg-black/20 rounded-xl border border-white/10 p-2 grid grid-cols-2 gap-2">
                                    {subcontractors.map(sub => {
                                        const isAssigned = assignedSubcontractors.includes(sub.id);
                                        return (
                                            <button
                                                key={sub.id} type="button" onClick={() => toggleSubcontractor(sub.id)}
                                                className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-center ${isAssigned ? 'bg-amber-500/10 border-amber-500/50 text-white' : 'bg-transparent border-white/5 text-gray-400 hover:bg-white/5'}`}
                                            >
                                                <span className="text-xs font-bold truncate w-full">{sub.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>


                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-white/10 bg-black/20 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="button" // Use type="submit" in form, but here type="button" with onClick to trigger form action because the form does not wrap everything neatly sometimes, but here we can just safely trigger submission
                        disabled={loadingSubmit}
                        onClick={handleSubmit}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
                    >
                        {loadingSubmit ? <><i className="fa-solid fa-spinner fa-spin"></i> Erstelle...</> : <><i className="fa-solid fa-check"></i> Projekt erstellen</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCreateModal;
