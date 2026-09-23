'use client';

import { useState } from 'react';
import { Faq } from '@/lib/types/database';
import { addFaq, updateFaq, deleteFaq } from '@/app/actions/faqs';
import { Edit2, Trash2, Plus, Loader2, X } from 'lucide-react';

export default function FaqList({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = (faq?: Faq) => {
    if (faq) {
      setEditingFaq(faq);
    } else {
      setEditingFaq(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('is_active', formData.get('is_active') === 'on' ? 'true' : 'false');
    
    let result;
    if (editingFaq) {
      formData.append('id', editingFaq.id);
      result = await updateFaq(formData);
    } else {
      result = await addFaq(formData);
    }

    if (result.error) {
      setError(result.error);
    } else {
      // Optimizasyon için sayfayı yenilemek yerine state'i güncelleyebiliriz veya window.location.reload() yapabiliriz.
      window.location.reload();
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
    
    const result = await deleteFaq(id);
    if (!result.error) {
      setFaqs(faqs.filter(f => f.id !== id));
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      <button 
        onClick={() => handleOpenModal()}
        className="mb-6 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>Yeni Soru Ekle</span>
      </button>

      <div className="bg-[#0d1527] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-sm">
              <th className="p-4 font-medium w-16">Sıra</th>
              <th className="p-4 font-medium">Soru</th>
              <th className="p-4 font-medium">Durum</th>
              <th className="p-4 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Henüz soru eklenmemiş.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-gray-300 font-medium">{faq.sort_order}</td>
                  <td className="p-4 text-gray-300">
                    <div className="font-medium text-white mb-1">{faq.question}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{faq.answer}</div>
                  </td>
                  <td className="p-4">
                    {faq.is_active ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs font-medium">
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenModal(faq)}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d1527] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">
                {editingFaq ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm border border-red-500/20">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Soru</label>
                <input
                  type="text"
                  name="question"
                  defaultValue={editingFaq?.question}
                  required
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Cevap</label>
                <textarea
                  name="answer"
                  defaultValue={editingFaq?.answer}
                  required
                  rows={4}
                  className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Sıralama</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingFaq?.sort_order ?? 0}
                    className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end pb-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={editingFaq ? editingFaq.is_active : true}
                      className="w-5 h-5 rounded border-white/10 bg-[#090d16] text-blue-500 focus:ring-blue-500 focus:ring-offset-[#090d16]"
                    />
                    <span className="text-sm font-medium text-gray-300">Aktif</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
