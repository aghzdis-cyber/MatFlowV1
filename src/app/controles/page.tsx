'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, FileCheck, AlertTriangle } from 'lucide-react';

export default function ControlesPage() {
  const [receptions, setReceptions] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
  const [selectedReceptionId, setSelectedReceptionId] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [globalStatus, setGlobalStatus] = useState('PASS');
  const [comments, setComments] = useState('');
  
  const [items, setItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReceptions();
    fetchInspections();
  }, []);

  const fetchReceptions = async () => {
    try {
      const res = await fetch('/api/receptions');
      if (res.ok) {
        const data = await res.json();
        setReceptions(data);
      }
    } catch (e) { console.error(e); }
  };

  const fetchInspections = async () => {
    try {
      const res = await fetch('/api/inspections');
      if (res.ok) {
        setInspections(await res.json());
      }
    } catch (e) { console.error(e); }
  };

  // When a reception is selected, load its items into the form
  useEffect(() => {
    if (selectedReceptionId) {
      const rec = receptions.find(r => r.id === selectedReceptionId);
      if (rec && rec.items) {
        setItems(rec.items.map((i: any) => ({
          materialId: i.materialId,
          materialName: i.material?.name || 'Inconnu',
          quantityReceived: i.quantity,
          quantityInspected: i.quantity,
          quantityRejected: 0,
          defects: ''
        })));
      }
    } else {
      setItems([]);
    }
  }, [selectedReceptionId, receptions]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceptionId || !inspectorName) return alert('Veuillez remplir les champs requis.');
    
    setIsSubmitting(true);
    try {
      const payload = {
        receptionId: selectedReceptionId,
        inspectorName,
        globalStatus,
        comments,
        items
      };

      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Inspection enregistrée avec succès.');
        setSelectedReceptionId('');
        setInspectorName('');
        setComments('');
        setGlobalStatus('PASS');
        setActiveTab('history');
        fetchInspections();
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2343] p-8 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-6">
          <Link href="/" className="inline-flex items-center space-x-2 bg-[#ff5722] hover:bg-[#e64a19] text-white px-4 py-2 rounded-md w-fit transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au tableau de bord</span>
          </Link>
          <div>
            <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Qualité & Contrôles</h1>
            <p className="text-gray-400 mt-2">Inspectez les réceptions de matériaux et enregistrez vos rapports qualité.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-[#3b4371] pb-2">
          <button 
            onClick={() => setActiveTab('new')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'new' ? 'bg-[#ff5722] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a3059]'}`}
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Inspection</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'history' ? 'bg-[#ff5722] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a3059]'}`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Historique des Contrôles</span>
          </button>
        </div>

        {activeTab === 'new' && (
          <form onSubmit={handleSubmit} className="bg-[#2a3059] rounded-lg p-6 shadow-lg border border-[#3b4371] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Réception (BL) à inspecter *</label>
                <select 
                  value={selectedReceptionId}
                  onChange={(e) => setSelectedReceptionId(e.target.value)}
                  className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5722]"
                  required
                >
                  <option value="">Sélectionnez une réception...</option>
                  {receptions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.receptionNumber} - {r.supplier?.name} ({new Date(r.deliveryDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Nom de l'inspecteur *</label>
                <input 
                  type="text" 
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5722]"
                  placeholder="Ex: Jean Dupont"
                  required
                />
              </div>
            </div>

            {items.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#3b4371]">
                <h3 className="text-[#ff5722] font-semibold">Détails des articles reçus</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-[#1e2343]">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-md">Matériel</th>
                        <th className="px-4 py-3">Qté Reçue</th>
                        <th className="px-4 py-3">Qté Inspectée</th>
                        <th className="px-4 py-3">Qté Rejetée</th>
                        <th className="px-4 py-3 rounded-tr-md">Remarques / Défauts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b border-[#3b4371]">
                          <td className="px-4 py-3 font-medium text-white">{item.materialName}</td>
                          <td className="px-4 py-3">{item.quantityReceived}</td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              min="0"
                              max={item.quantityReceived}
                              step="0.01"
                              value={item.quantityInspected}
                              onChange={(e) => handleItemChange(index, 'quantityInspected', e.target.value)}
                              className="w-24 bg-[#1e2343] border border-[#3b4371] rounded px-2 py-1 focus:border-[#ff5722] focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              min="0"
                              max={item.quantityReceived}
                              step="0.01"
                              value={item.quantityRejected}
                              onChange={(e) => handleItemChange(index, 'quantityRejected', e.target.value)}
                              className="w-24 bg-[#1e2343] border border-red-900/50 rounded px-2 py-1 text-red-400 focus:border-red-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              value={item.defects}
                              onChange={(e) => handleItemChange(index, 'defects', e.target.value)}
                              className="w-full bg-[#1e2343] border border-[#3b4371] rounded px-2 py-1 focus:border-[#ff5722] focus:outline-none"
                              placeholder="Défauts mineurs..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#3b4371]">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Statut global du contrôle</label>
                <select 
                  value={globalStatus}
                  onChange={(e) => setGlobalStatus(e.target.value)}
                  className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                >
                  <option value="PASS">Approuvé (Conforme)</option>
                  <option value="FAIL">Rejeté (Non-conforme)</option>
                  <option value="PENDING">En attente de décision</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Commentaires généraux</label>
                <textarea 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5722] min-h-[80px]"
                  placeholder="Observations générales..."
                  maxLength={500}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-[#ff5722] hover:bg-[#e64a19] disabled:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'inspection'}</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="bg-[#2a3059] rounded-lg shadow-lg border border-[#3b4371] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-[#1e2343]/50 border-b border-[#3b4371]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">BL Réception</th>
                    <th className="px-6 py-4 font-medium">Inspecteur</th>
                    <th className="px-6 py-4 font-medium">Statut Global</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4371]">
                  {inspections.length > 0 ? (
                    inspections.map((insp) => (
                      <tr key={insp.id} className="hover:bg-[#1e2343]/30 transition-colors">
                        <td className="px-6 py-4">{new Date(insp.date).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-white">{insp.reception?.receptionNumber}</td>
                        <td className="px-6 py-4">{insp.inspectorName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insp.globalStatus === 'PASS' ? 'bg-green-900/50 text-green-400' : 
                            insp.globalStatus === 'FAIL' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                          }`}>
                            {insp.globalStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune inspection trouvée.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
