"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, Trash2, FileText, Truck, AlertTriangle } from 'lucide-react';

export default function ReceptionPage() {
    const [receptions, setReceptions] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const initialFormState = {
        receptionNumber: '',
        supplierId: '',
        locationId: '',
        deliveryDate: new Date().toISOString().split('T')[0],
        driverName: '',
        truckNumber: '',
        notes: '',
        items: [{ materialId: '', quantity: 1, unitPrice: 0, batchNumber: '' }]
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [receptionsRes, suppliersRes, locationsRes, materialsRes] = await Promise.all([
                fetch('/api/receptions'),
                fetch('/api/suppliers'),
                fetch('/api/locations'),
                fetch('/api/materials')
            ]);
            
            setReceptions(await receptionsRes.json());
            setSuppliers(await suppliersRes.json());
            setLocations(await locationsRes.json());
            setMaterials(await materialsRes.json());
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddReception = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/receptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                setFormData(initialFormState);
                fetchData();
            } else {
                alert("Erreur lors de la création de la réception.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleValidateReception = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir valider cette réception ? Cela mettra à jour l'inventaire.")) return;
        
        try {
            const res = await fetch(`/api/receptions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'VALIDATED' })
            });
            if (res.ok) {
                fetchData();
            } else {
                alert("Erreur lors de la validation.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { materialId: '', quantity: 1, unitPrice: 0, batchNumber: '' }]
        });
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value };
        setFormData({ ...formData, items: newItems });
    };

    return (
        <div className="min-h-screen bg-[#1e2343] p-8 text-white font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header section */}
                <div className="flex flex-col space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 bg-[#ff5722] hover:bg-[#e64a19] text-white px-4 py-2 rounded-md w-fit transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Retour au tableau de bord</span>
                    </Link>
                    <div className="flex justify-between items-center">
                        <h1 className="text-[#ff5722] text-3xl font-bold tracking-tight">Réception de Matériel</h1>
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
                        >
                            {showForm ? <ArrowLeft className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                            <span>{showForm ? "Annuler" : "Nouvelle Réception"}</span>
                        </button>
                    </div>
                </div>

                {/* Form Registration */}
                {showForm && (
                    <div className="bg-[#2a3059] rounded-lg p-8 shadow-lg border border-[#3b4371]">
                        <h2 className="text-xl font-semibold mb-6 flex items-center"><FileText className="mr-2"/> Enregistrer un Bon de Livraison (BL)</h2>
                        <form onSubmit={handleAddReception} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">N° de Réception / BL *</label>
                                    <input required type="text" value={formData.receptionNumber} onChange={e => setFormData({...formData, receptionNumber: e.target.value})} className="w-full bg-[#1e2343] border border-[#3b4371] rounded p-2 text-white focus:outline-none focus:border-[#ff5722]" placeholder="BL-2024-001" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Fournisseur *</label>
                                    <select required value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})} className="w-full bg-[#1e2343] border border-[#3b4371] rounded p-2 text-white focus:outline-none focus:border-[#ff5722]">
                                        <option value="">Sélectionnez un fournisseur</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Lieu de déchargement *</label>
                                    <select required value={formData.locationId} onChange={e => setFormData({...formData, locationId: e.target.value})} className="w-full bg-[#1e2343] border border-[#3b4371] rounded p-2 text-white focus:outline-none focus:border-[#ff5722]">
                                        <option value="">Sélectionnez un lieu</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.site?.name})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Date de livraison *</label>
                                    <input required type="date" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} className="w-full bg-[#1e2343] border border-[#3b4371] rounded p-2 text-white focus:outline-none focus:border-[#ff5722]"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom du Chauffeur</label>
                                    <input type="text" value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="w-full bg-[#1e2343] border border-[#3b4371] rounded p-2 text-white focus:outline-none focus:border-[#ff5722]" placeholder="Jean Dupont" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Immatriculation Camion</label>
                                    <input type="text" value={formData.truckNumber} onChange={e => setFormData({...formData, truckNumber: e.target.value})} className="w-full bg-[#1e2343] border border-[#3b4371] rounded p-2 text-white focus:outline-none focus:border-[#ff5722]" placeholder="AB-123-CD" />
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-[#3b4371]">
                                <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                                    <span>Articles Reçus</span>
                                    <button type="button" onClick={handleAddItem} className="text-sm bg-[#ff5722] hover:bg-[#e64a19] px-3 py-1 rounded transition-colors">+ Ajouter une ligne</button>
                                </h3>
                                
                                <div className="space-y-4">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-[#1e2343] p-4 rounded-md border border-[#3b4371]">
                                            <div className="w-full md:w-1/3">
                                                <label className="block text-xs text-gray-400 mb-1">Matériel / Description *</label>
                                                <select required value={item.materialId} onChange={e => handleItemChange(index, 'materialId', e.target.value)} className="w-full bg-[#2a3059] border border-[#3b4371] rounded p-2 text-white text-sm">
                                                    <option value="">Sélectionnez un article</option>
                                                    {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.sku})</option>)}
                                                </select>
                                            </div>
                                            <div className="w-full md:w-1/6">
                                                <label className="block text-xs text-gray-400 mb-1">Quantité *</label>
                                                <input required type="number" min="0.1" step="any" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-full bg-[#2a3059] border border-[#3b4371] rounded p-2 text-white text-sm"/>
                                            </div>
                                            <div className="w-full md:w-1/6">
                                                <label className="block text-xs text-gray-400 mb-1">Prix Unitaire</label>
                                                <input type="number" step="any" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full bg-[#2a3059] border border-[#3b4371] rounded p-2 text-white text-sm"/>
                                            </div>
                                            <div className="w-full md:w-1/4">
                                                <label className="block text-xs text-gray-400 mb-1">Lot / Coulée (Optionnel)</label>
                                                <input type="text" value={item.batchNumber} onChange={e => handleItemChange(index, 'batchNumber', e.target.value)} className="w-full bg-[#2a3059] border border-[#3b4371] rounded p-2 text-white text-sm" placeholder="Lot N°..."/>
                                            </div>
                                            <div className="w-full md:w-auto">
                                                {formData.items.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors w-full md:w-auto">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-[#3b4371]">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Notes & Observations</label>
                                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-[#1e2343] border border-[#3b4371] rounded p-2 text-white focus:outline-none focus:border-[#ff5722] h-20" placeholder="État du matériel, remarques sur le transport..."></textarea>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-[#ff5722] hover:bg-[#e64a19] text-white px-8 py-3 rounded-md font-bold transition-colors">
                                    Enregistrer la Réception
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* History List */}
                {!showForm && (
                     <div className="bg-[#2a3059] rounded-lg p-8 shadow-lg border border-[#3b4371]">
                        <h2 className="text-xl font-semibold mb-6 flex items-center"><Truck className="mr-2"/> Historique des Réceptions</h2>
                        
                        {loading ? (
                            <p className="text-gray-400 italic">Chargement des données...</p>
                        ) : receptions.length === 0 ? (
                            <div className="text-center py-10 bg-[#1e2343] rounded-lg border border-dashed border-[#3b4371]">
                                <AlertTriangle className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                                <p className="text-gray-400">Aucune réception enregistrée pour le moment.</p>
                                <p className="text-sm text-gray-500 mt-1">Créez votre première réception en cliquant sur le bouton ci-dessus.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#3b4371] text-gray-400 text-sm">
                                            <th className="pb-3 px-4 font-medium">N° BL</th>
                                            <th className="pb-3 px-4 font-medium">Date</th>
                                            <th className="pb-3 px-4 font-medium">Fournisseur</th>
                                            <th className="pb-3 px-4 font-medium">Lieu</th>
                                            <th className="pb-3 px-4 font-medium">Statut</th>
                                            <th className="pb-3 px-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {receptions.map((rec) => (
                                            <tr key={rec.id} className="border-b border-[#3b4371]/50 hover:bg-[#3b4371]/20 transition-colors">
                                                <td className="py-4 px-4 font-medium text-[#ff5722]">{rec.receptionNumber}</td>
                                                <td className="py-4 px-4">{new Date(rec.deliveryDate).toLocaleDateString()}</td>
                                                <td className="py-4 px-4">{rec.supplier?.name || "N/A"}</td>
                                                <td className="py-4 px-4">{rec.location?.name || "N/A"}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        rec.status === 'VALIDATED' ? 'bg-green-500/20 text-green-400' :
                                                        rec.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {rec.status === 'VALIDATED' ? 'Validé (En Stock)' :
                                                         rec.status === 'REJECTED' ? 'Rejeté' : 'En Attente'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    {rec.status === 'PENDING' && (
                                                        <button 
                                                            onClick={() => handleValidateReception(rec.id)}
                                                            className="flex items-center space-x-1 ml-auto text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 px-3 py-1.5 rounded transition-colors"
                                                            title="Valider la réception et ajouter au stock"
                                                        >
                                                            <Check className="w-4 h-4"/>
                                                            <span>Valider</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                     </div>
                )}

            </div>
        </div>
    );
}
