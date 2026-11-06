import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Plus,
  Pin,
  CheckCircle2,
  Send,
  Search,
  Filter,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { Discussion } from '../../types';

export const DiscussionForum: React.FC = () => {
  const {
    currentUser,
    activeRole,
    classes,
    subjects,
    discussions,
    addDiscussion,
    addDiscussionReply,
    markReplyHelpful,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(
    discussions[0] || null
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // New discussion form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyText, setReplyText] = useState('');

  const filteredDiscussions = discussions.filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q);
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Judul dan isi pertanyaan tidak boleh kosong.', 'error');
      return;
    }

    addDiscussion('sbj-mtk', 'cls-7a', newTitle.trim(), newContent.trim());
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscussion || !replyText.trim()) return;

    addDiscussionReply(selectedDiscussion.id, replyText.trim());
    setReplyText('');

    // Update active view
    const updated = discussions.find((d) => d.id === selectedDiscussion.id);
    if (updated) setSelectedDiscussion(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Forum Tanya Jawab & Diskusi Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Ruang interaksi akademik untuk bertanya soal, berdiskusi materi, dan bimbingan langsung dari dewan guru.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto ${
            activeRole === 'guru'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          Mulai Diskusi Baru
        </button>
      </div>

      {/* Main Forum Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topics List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari topik diskusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto">
            {filteredDiscussions.map((disc) => {
              const isSelected = selectedDiscussion?.id === disc.id;

              return (
                <div
                  key={disc.id}
                  onClick={() => setSelectedDiscussion(disc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      Kelas VII-A
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {disc.replies.length} Balasan
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-1">
                    {disc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {disc.content}
                  </p>

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    <img
                      src={disc.user_avatar}
                      alt={disc.user_name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate font-semibold text-slate-700">{disc.user_name}</span>
                    <span>•</span>
                    <span className="uppercase">{disc.user_role}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Conversation Stream */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          {selectedDiscussion ? (
            <>
              {/* Topic Original Post */}
              <div className="pb-4 border-b border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedDiscussion.user_avatar}
                      alt={selectedDiscussion.user_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {selectedDiscussion.user_name}
                      </h4>
                      <span className="text-[10px] font-semibold text-blue-700 uppercase">
                        {selectedDiscussion.user_role} • {selectedDiscussion.created_at}
                      </span>
                    </div>
                  </div>

                  {selectedDiscussion.is_pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                  {selectedDiscussion.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedDiscussion.content}
                </p>
              </div>

              {/* Replies Thread */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Balasan ({selectedDiscussion.replies.length})
                </h4>

                {selectedDiscussion.replies.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Belum ada balasan. Jadilah yang pertama memberikan jawaban!
                  </p>
                ) : (
                  selectedDiscussion.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                        rep.is_helpful
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rep.user_avatar}
                            alt={rep.user_name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900">{rep.user_name}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                              rep.user_role === 'guru'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {rep.user_role}
                          </span>
                        </div>

                        {rep.is_helpful && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Jawaban Membantu
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 leading-relaxed">{rep.content}</p>

                      {activeRole === 'guru' && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => markReplyHelpful(selectedDiscussion.id, rep.id)}
                            className="text-[10px] font-bold text-emerald-700 hover:underline"
                          >
                            {rep.is_helpful ? 'Batalkan Tanda Membantu' : '✓ Tandai Jawaban Membantu'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik tanggapan atau penjelasan Anda..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim
                </button>
              </form>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Pilih salah satu topik diskusi di panel kiri.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Topic */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Buat Topik Diskusi Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Topik / Pertanyaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Tanya cara penyelesaian soal no 4 pecahan aljabar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Pertanyaan Lengkap *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan pertanyaan Anda secara jelas agar guru atau teman dapat membantu..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md"
                >
                  Terbitkan Topik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
