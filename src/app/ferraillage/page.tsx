'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Truck, History, Plus } from 'lucide-react';

export default function FerraillagePage() {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  
  const [providers, setProviders] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Form states
  const [providerId, setProviderId] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchProviders();
    fetchBatches();
    fetchMetadata();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers');
      if (res.ok) setProviders(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/scrap');
      if (res.ok) setBatches(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchMetadata = async () => {
    try {
      // In a real app we'd fetch reformed items. For MVP, we let user manually pick material & location
      const matRes = await fetch('/api/materials');
      const locRes = await fetch('/api/locations');
      if (matRes.ok) setMaterials(await matRes.json());
      if (locRes.ok) setLocations(await locRes.json());
    } catch (e) { console.error(e); }
  };

  const addNewItemRow = () => {
    setItems([...items, { materialId: '', locationId: '', quantity: 1 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerId || items.length === 0) return alert('Veuillez sélectionner un prestataire et ajouter au moins un article.');

    try {
      const res = await fetch('/api/scrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          certificateNumber,
          totalWeight,
          notes,
          items
        })
      });

      if (res.ok) {
        alert('Envoi au ferraillage enregistré.');
        setProviderId('');
        setCertificateNumber('');
        setTotalWeight('');
        setNotes('');
        setItems([]);
        setActiveTab('list');
        fetchBatches();
      } else {
        alert('Erreur lors de l\'enregistrement.');
      }
    } catch (err) { console.error(err); }
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
            <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Module de Ferraillage</h1>
            <p className="text-gray-400 mt-2">Suivi et documentation de la destruction ou du recyclage des matériels réformés.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-[#3b4371] pb-2">
          <button 
            onClick={() => setActiveTab('new')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'new' ? 'bg-[#ff5722] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a3059]'}`}
          >
            <Truck className="w-4 h-4" />
            <span>Nouvel Envoi</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'list' ? 'bg-[#ff5722] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a3059]'}`}
          >
            <History className="w-4 h-4" />
            <span>Historique des Envois</span>
          </button>
        </div>

        {activeTab === 'new' && (
          <form onSubmit={handleSubmit} className="bg-[#2a3059] rounded-lg p-6 shadow-lg border border-[#3b4371] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 font-medium block mb-1">Prestataire *</label>
                  <select 
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    required
                  >
                    <option value="">Sélectionnez un prestataire (ex: Recyclage S.A.)</option>
                    {providers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {providers.length === 0 && <p className="text-xs text-yellow-500 mt-1">Aucun prestataire configuré. Ajoutez-en un par API / BDD.</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium block mb-1">Certificat (Optionnel)</label>
                  <input 
                    type="text" 
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5722]"
                    placeholder="N° de certificat de destruction"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium block mb-1">Poids total (kg)</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(e.target.value)}
                    className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    placeholder="Ex: 1450.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 font-medium block mb-1">Notes / Observations</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-full min-h-[120px] bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                  placeholder="Véhicule de transport, nom du chauffeur..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#3b4371]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#ff5722] font-semibold">Articles expédiés</h3>
                <button type="button" onClick={addNewItemRow} className="flex items-center space-x-1 text-sm bg-[#1e2343] hover:bg-[#3b4371] px-3 py-1 rounded transition-colors">
                  <Plus className="w-4 h-4" /><span>Ajouter un article</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-[#1e2343]/50 rounded border border-dashed border-[#3b4371]">
                  Cliquez sur "Ajouter un article" pour lister le matériel ferraillé.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-end bg-[#1e2343] p-3 rounded border border-[#3b4371]">
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-400 block mb-1">Matériel</label>
                        <select 
                          value={item.materialId}
                          onChange={(e) => updateItem(idx, 'materialId', e.target.value)}
                          className="w-full bg-[#2a3059] border-none rounded px-2 py-1.5 text-sm focus:outline-none text-white"
                          required
                        >
                          <option value="">Sélectionner</option>
                          {materials.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-xs text-gray-400 block mb-1">Provenant de (Lieu)</label>
                        <select 
                          value={item.locationId}
                          onChange={(e) => updateItem(idx, 'locationId', e.target.value)}
                          className="w-full bg-[#2a3059] border-none rounded px-2 py-1.5 text-sm focus:outline-none text-white"
                          required
                        >
                          <option value="">Sélectionner</option>
                          {locations.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="text-xs text-gray-400 block mb-1">Qté</label>
                        <input 
                          type="number"
                          min="0"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-full bg-[#2a3059] border-none rounded px-2 py-1.5 text-sm focus:outline-none text-white"
                          required
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeItem(idx)}
                        className="p-1.5 bg-red-900/50 text-red-400 hover:bg-red-500/50 rounded transition-colors mb-[2px]"
                      >
                       Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#3b4371]">
              <button 
                type="submit" 
                className="flex items-center space-x-2 bg-[#ff5722] hover:bg-[#e64a19] text-white px-6 py-2 rounded-md transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer l'expédition</span>
              </button>
            </div>
          </form>
        )}

        {/* History Tab */}
        {activeTab === 'list' && (
          <div className="bg-[#2a3059] rounded-lg shadow-lg border border-[#3b4371] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1e2343] border-b border-[#3b4371]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Prestataire</th>
                    <th className="px-6 py-4 font-medium">Certificat</th>
                    <th className="px-6 py-4 font-medium">Poids (kg)</th>
                    <th className="px-6 py-4 font-medium">Statut</th>
                    <th className="px-6 py-4 font-medium">Articles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4371]">
                  {batches.length === 0 && (
                     <tr><td colSpan={6} className="text-center py-6">Aucun historique d'envoi.</td></tr>
                  )}
                  {batches.map(batch => (
                    <tr key={batch.id} className="hover:bg-[#1e2343]/30">
                      <td className="px-6 py-4">{new Date(batch.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-white font-medium">{batch.provider?.name}</td>
                      <td className="px-6 py-4 text-gray-400">{batch.certificateNumber || '-'}</td>
                      <td className="px-6 py-4">{batch.totalWeight}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400">
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="text-xs bg-[#1e2343] p-2 rounded max-wxs">
                          {batch.items.map((i:any) => (
                            <li key={i.id} className="truncate">- {i.material?.name} ({i.quantity})</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
