'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, FileSignature, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ReformePage() {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [inventories, setInventories] = useState<any[]>([]);
  const [reforms, setReforms] = useState<any[]>([]);

  // Form states
  const [requesterName, setRequesterName] = useState('');
  const [reason, setReason] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ inventoryId: string; quantity: number }[]>([]);

  useEffect(() => {
    fetchInventory();
    fetchReforms();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) setInventories(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchReforms = async () => {
    try {
      const res = await fetch('/api/reforms');
      if (res.ok) setReforms(await res.json());
    } catch (e) { console.error(e); }
  };

  const addItemToReform = (inventoryId: string) => {
    if (!selectedItems.find(i => i.inventoryId === inventoryId)) {
      setSelectedItems([...selectedItems, { inventoryId, quantity: 1 }]);
    }
  };

  const updateItemQuantity = (inventoryId: string, quantity: number) => {
    setSelectedItems(selectedItems.map(item => 
      item.inventoryId === inventoryId ? { ...item, quantity } : item
    ));
  };

  const removeItem = (inventoryId: string) => {
    setSelectedItems(selectedItems.filter(i => i.inventoryId !== inventoryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName || selectedItems.length === 0) return alert('Veuillez remplir les informations requises.');

    try {
      const res = await fetch('/api/reforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterName, reason, items: selectedItems })
      });

      if (res.ok) {
        alert('Demande de réforme envoyée.');
        setRequesterName('');
        setReason('');
        setSelectedItems([]);
        setActiveTab('list');
        fetchReforms();
      } else {
        const err = await res.json();
        alert(err.error || 'Erreur');
      }
    } catch (err) { console.error(err); }
  };

  const updateReformStatus = async (id: string, status: string) => {
    if (!confirm(`Confirmez-vous le statut ${status} ?`)) return;
    try {
      const res = await fetch(`/api/reforms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert('Statut mis à jour.');
        fetchReforms();
        fetchInventory(); // Inventory has likely changed
      } else {
        alert('Erreur lors de la mise à jour.');
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
            <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Module de Réforme</h1>
            <p className="text-gray-400 mt-2">Gérez la mise hors-service et le retrait des équipements défectueux ou obsolètes de l'inventaire.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-[#3b4371] pb-2">
          <button 
            onClick={() => setActiveTab('new')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'new' ? 'bg-[#ff5722] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a3059]'}`}
          >
            <FileSignature className="w-4 h-4" />
            <span>Demander une Réforme</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'list' ? 'bg-[#ff5722] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a3059]'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Validation & Historique</span>
          </button>
        </div>

        {/* New Request Tab */}
        {activeTab === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side: Available Inventory */}
            <div className="bg-[#2a3059] rounded-lg p-6 shadow-lg border border-[#3b4371]">
              <h3 className="text-[#ff5722] font-semibold mb-4">Stock Disponible (Choisir les articles)</h3>
              <div className="overflow-y-auto max-h-[400px]">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1e2343]">
                    <tr>
                      <th className="px-3 py-2">Matériel</th>
                      <th className="px-3 py-2">Lieu</th>
                      <th className="px-3 py-2">Qté. dispo</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventories.map(inv => (
                      <tr key={inv.id} className="border-b border-[#3b4371] hover:bg-[#1e2343]/50">
                        <td className="px-3 py-2 font-medium text-white">{inv.material.name}</td>
                        <td className="px-3 py-2">{inv.location.name}</td>
                        <td className="px-3 py-2 text-green-400 font-bold">{inv.quantity}</td>
                        <td className="px-3 py-2 text-right">
                          <button 
                            type="button"
                            onClick={() => addItemToReform(inv.id)}
                            className="bg-[#3b4371] hover:bg-[#ff5722] text-white px-2 py-1 rounded transition-colors text-xs"
                          >
                            Sélectionner
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right side: Form */}
            <form onSubmit={handleSubmit} className="bg-[#2a3059] rounded-lg p-6 shadow-lg border border-[#3b4371] flex flex-col space-y-6">
              <h3 className="text-[#ff5722] font-semibold">Rédaction de la D.R. (Demande de Réforme)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 font-medium block mb-1">Demandeur *</label>
                  <input 
                    type="text" 
                    value={requesterName}
                    onChange={e => setRequesterName(e.target.value)}
                    className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 font-medium block mb-1">Motif / Justification</label>
                  <textarea 
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full bg-[#1e2343] border border-[#3b4371] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#ff5722]"
                    rows={3}
                  />
                </div>
              </div>

              <div className="bg-[#1e2343] rounded-md p-4 flex-1">
                <h4 className="text-sm text-gray-300 font-medium mb-3">Articles sélectionnés</h4>
                {selectedItems.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">Aucun article sélectionné.</p>
                ) : (
                  <ul className="space-y-3">
                    {selectedItems.map((item, idx) => {
                      const inv = inventories.find(i => i.id === item.inventoryId);
                      return (
                        <li key={idx} className="flex items-center justify-between text-sm bg-[#2a3059] p-2 rounded border border-[#3b4371]">
                          <span className="text-white truncate pr-2 w-1/2">{inv?.material.name}</span>
                          <div className="flex items-center space-x-2 w-1/2 justify-end">
                            <label className="text-xs text-gray-400">Qté:</label>
                            <input 
                              type="number"
                              min="0"
                              max={inv?.quantity || 0}
                              step="0.01"
                              value={item.quantity}
                              onChange={e => updateItemQuantity(item.inventoryId, parseFloat(e.target.value))}
                              className="w-20 bg-[#1e2343] border border-[#3b4371] rounded px-2 py-1 focus:outline-none"
                            />
                            <button type="button" onClick={() => removeItem(item.inventoryId)} className="text-red-400 hover:text-red-300">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button 
                type="submit" 
                className="flex justify-center items-center space-x-2 bg-[#ff5722] hover:bg-[#e64a19] text-white px-6 py-3 rounded-md transition-colors font-medium w-full"
              >
                <Save className="w-5 h-5" />
                <span>Soumettre la demande</span>
              </button>
            </form>
          </div>
        )}

        {/* Requests & Approval Tab */}
        {activeTab === 'list' && (
          <div className="bg-[#2a3059] rounded-lg shadow-lg border border-[#3b4371] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1e2343] border-b border-[#3b4371]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Demandeur</th>
                    <th className="px-6 py-4 font-medium">Articles</th>
                    <th className="px-6 py-4 font-medium">Motif</th>
                    <th className="px-6 py-4 font-medium">Statut</th>
                    <th className="px-6 py-4 font-medium text-right">Approbat. / Retrait</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b4371]">
                  {reforms.length === 0 && (
                     <tr><td colSpan={6} className="text-center py-6">Aucune demande</td></tr>
                  )}
                  {reforms.map(ref => (
                    <tr key={ref.id} className="hover:bg-[#1e2343]/30">
                      <td className="px-6 py-4">{new Date(ref.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-white font-medium">{ref.requesterName}</td>
                      <td className="px-6 py-4">
                        <ul className="text-xs bg-[#1e2343] p-2 rounded">
                          {ref.items.map((i:any) => (
                            <li key={i.id}>- {i.inventory?.material?.name} ({i.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-xs">{ref.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ref.status === 'APPROVED' ? 'bg-green-900/50 text-green-400' : 
                          ref.status === 'REJECTED' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {ref.status === 'PENDING' && (
                          <>
                            <button onClick={() => updateReformStatus(ref.id, 'APPROVED')} className="p-1 bg-green-900/50 hover:bg-green-500/50 text-green-400 rounded transition-colors" title="Approuver et déduire du stock">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => updateReformStatus(ref.id, 'REJECTED')} className="p-1 bg-red-900/50 hover:bg-red-500/50 text-red-400 rounded transition-colors" title="Rejeter">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
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
