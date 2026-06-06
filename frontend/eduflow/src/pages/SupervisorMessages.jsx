import { useState, useEffect } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import SupervisorSidebar from '../components/SupervisorSidebar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/supervisor').then(res => {
      const firstProject = res.data.projets?.[0];
      if (firstProject) {
        api.get(`/projects/${firstProject.id}/messages`)
          .then(r => setMessages(r.data || []))
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <SupervisorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Messages</h1>
            <p className="text-gray-400 text-xs mt-0.5">Communiquez avec vos étudiants</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-400 cursor-pointer" />
            <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {(user?.prenom || 'E')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom}</p>
                <p className="text-xs text-gray-400">Encadrant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-1">Messages</h2>
          <p className="text-gray-400 text-sm mb-5">Échanges du projet</p>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Chargement...</div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <MessageSquare size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">Aucun message.</p>
                </div>
              ) : messages.map((m, i) => (
                <div key={i} className="p-5 flex justify-between items-start border-b border-white/10 hover:bg-white/[0.02] transition">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
                      {(m.sender?.prenom || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{m.sender?.prenom} {m.sender?.nom}</p>
                      <p className="text-gray-400 text-sm mt-1">{m.contenu}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs shrink-0 ml-4">
                    {new Date(m.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
