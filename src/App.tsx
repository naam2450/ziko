import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Mail, 
  Linkedin, 
  Award, 
  GraduationCap, 
  Briefcase,
  ChevronRight,
  BrainCircuit,
  Zap,
  Plus,
  Trash2,
  Settings,
  X,
  Save,
  Lock,
  LogIn,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
}

const Section = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={cn("py-20 px-6 md:px-12 lg:px-24", className)}>
    {children}
  </section>
);

const LoginPage = ({ onLogin, onCancel }: { onLogin: (pass: string) => Promise<void>, onCancel: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(password);
    } catch (err: any) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-100"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h2 className="text-2xl font-bold">Admin Login</h2>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password Dashboard</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Masukkan password..."
              required
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            {loading ? 'Memverifikasi...' : <><LogIn size={20} /> Masuk</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPage = ({ onLogout }: { onLogout: () => void }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExp, setNewExp] = useState({ title: '', company: '', period: '', description: '' });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const res = await fetch('/api/experiences');
    const data = await res.json();
    setExperiences(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExp)
    });
    setNewExp({ title: '', company: '', period: '', description: '' });
    fetchExperiences();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
    fetchExperiences();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={onLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors">
            <LogOut size={20} /> Keluar
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-emerald-600" /> Tambah Pengalaman
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Posisi</label>
                <input 
                  value={newExp.title}
                  onChange={(e) => setNewExp({...newExp, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Perusahaan/Instansi</label>
                <input 
                  value={newExp.company}
                  onChange={(e) => setNewExp({...newExp, company: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Periode</label>
                <input 
                  value={newExp.period}
                  onChange={(e) => setNewExp({...newExp, period: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. 2023 - 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={newExp.description}
                  onChange={(e) => setNewExp({...newExp, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={3}
                  required
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-all flex items-center justify-center gap-2">
                <Save size={18} /> Simpan
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Daftar Pengalaman</h2>
            {experiences.length === 0 && <p className="text-slate-400 italic">Belum ada data pengalaman.</p>}
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start group">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{exp.title}</h3>
                  <p className="text-sm text-emerald-700 font-medium">{exp.company}</p>
                  <p className="text-xs text-slate-400 mb-2">{exp.period}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{exp.description}</p>
                </div>
                <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      fetch('/api/experiences')
        .then(res => res.json())
        .then(data => setExperiences(data));
    }
  }, [isAdmin]);

  const handleLogin = async (password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    const data = await res.json();
    if (data.success) {
      setIsAdmin(true);
      setShowLogin(false);
      localStorage.setItem('admin-token', data.token);
    } else {
      throw new Error(data.message);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin-token');
  };

  if (isAdmin) {
    return <AdminPage onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {showLogin && <LoginPage onLogin={handleLogin} onCancel={() => setShowLogin(false)} />}
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold tracking-tight text-xl text-emerald-800">M. Zamzam Azizi</span>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600 items-center">
            <a href="#about" className="hover:text-emerald-600 transition-colors">Tentang</a>
            <a href="#experience" className="hover:text-emerald-600 transition-colors">Pengalaman</a>
            <a href="#skills" className="hover:text-emerald-600 transition-colors">Keahlian</a>
            <a href="#contact" className="hover:text-emerald-600 transition-colors">Kontak</a>
            <button onClick={() => setShowLogin(true)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Admin Panel">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Section className="pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4">Muhammad Zamzam Azizi</h2>
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            Lulusan Ilmu & Teknologi Pangan
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Inovasi Pangan Berbasis Sains,<br />
            <span className="text-emerald-700 italic font-serif">Ditempa oleh Karakter Pejuang.</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed">
            Menggabungkan ketajaman riset akademis Universitas Brawijaya dengan disiplin karakter SMAIT As-Syifa untuk menghadirkan solusi pangan masa depan.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#contact" className="px-8 py-3 bg-emerald-800 text-white rounded-full font-medium hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20">
              Hubungi Saya
            </a>
            <a href="#experience" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-all">
              Lihat Pengalaman
            </a>
          </div>
        </motion.div>
      </Section>

      {/* About Me */}
      <Section id="about" className="bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <div className="sticky top-24">
              <h2 className="text-3xl font-bold mb-4">Profil Naratif</h2>
              <div className="w-12 h-1 bg-emerald-600 mb-6"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <GraduationCap size={20} className="text-emerald-600" />
                  <span className="text-sm">Universitas Brawijaya</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <span className="text-sm">Alumni SMAIT As-Syifa</span>
                </div>
              </div>
            </div>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                Perjalanan saya dimulai di lingkungan <span className="font-semibold text-emerald-800">SMAIT As-Syifa Boarding School</span>, di mana nilai-nilai spiritual, disiplin tinggi, dan ketangguhan mental menjadi fondasi karakter saya. Di sana, saya belajar bahwa keberhasilan bukan hanya tentang kecerdasan intelektual, tetapi tentang integritas dan daya juang yang konsisten.
              </p>
              <p>
                Karakter tersebut saya bawa ke bangku kuliah di <span className="font-semibold text-emerald-800">Ilmu dan Teknologi Pangan, Universitas Brawijaya</span>. Di sinilah saya mengasah keahlian teknis dalam analisis laboratorium, pengembangan produk (R&D), dan pemahaman mendalam tentang keamanan pangan. Saya bukan sekadar peneliti yang terpaku pada data; saya adalah seorang komunikator yang mampu menerjemahkan kompleksitas sains menjadi narasi yang menarik dan mudah dipahami.
              </p>
              <p>
                Saya percaya bahwa inovasi pangan terbaik lahir dari perpaduan antara presisi data ilmiah dan tanggung jawab moral untuk memberikan manfaat bagi masyarakat. Dengan semangat "Mahasiswa Sukses" yang kreatif dan bertanggung jawab, saya siap berkontribusi dalam memajukan industri pangan nasional.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pengalaman & Kontribusi</h2>
            <p className="text-slate-600">Bukti nyata dedikasi, riset, dan tanggung jawab profesional.</p>
          </div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={exp.id}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 border-l-2 border-emerald-100"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white"></div>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{exp.title}</h3>
                    <span className="text-sm font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">{exp.period}</span>
                  </div>
                  <p className="font-medium text-emerald-700 mb-4">{exp.company}</p>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" className="bg-emerald-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Beaker className="text-emerald-400" size={32} />
                <h2 className="text-3xl font-bold">Hard Skills</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Food Science", icon: BookOpen },
                  { name: "R&D Formulation", icon: BrainCircuit },
                  { name: "Lab Analysis", icon: Beaker },
                  { name: "Food Safety (HACCP)", icon: ShieldCheck },
                  { name: "Sensory Evaluation", icon: Zap },
                  { name: "Data Visualization", icon: MessageSquare }
                ].map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                    <skill.icon size={20} className="text-emerald-400" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Award className="text-emerald-400" size={32} />
                <h2 className="text-3xl font-bold">Soft Skills</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Effective Communication", icon: MessageSquare },
                  { name: "Creative Thinking", icon: BrainCircuit },
                  { name: "Resilience (Daya Juang)", icon: ShieldCheck },
                  { name: "High Responsibility", icon: Award },
                  { name: "Public Speaking", icon: MessageSquare },
                  { name: "Team Leadership", icon: Briefcase }
                ].map((skill) => (
                  <div key={skill.name} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                    <skill.icon size={20} className="text-emerald-400" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Mari Berkolaborasi</h2>
          <p className="text-lg text-slate-600 mb-12">
            Saya selalu terbuka untuk diskusi mengenai inovasi pangan, riset, maupun peluang profesional lainnya.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <a href="mailto:m.zamzam.azizi@gmail.com" className="group p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h4 className="font-bold mb-1">Email</h4>
              <p className="text-sm text-slate-500">m.zamzam.azizi@gmail.com</p>
            </a>
            
            <a href="https://linkedin.com/in/m-zamzam-azizi" target="_blank" rel="noopener noreferrer" className="group p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Linkedin size={24} />
              </div>
              <h4 className="font-bold mb-1">LinkedIn</h4>
              <p className="text-sm text-slate-500">linkedin.com/in/m-zamzam-azizi</p>
            </a>
            
            <div className="p-8 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={24} />
              </div>
              <h4 className="font-bold mb-1">Lokasi</h4>
              <p className="text-sm text-slate-500">Malang / Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Muhammad Zamzam Azizi. Dibuat dengan dedikasi dan karakter pejuang.
        </p>
      </footer>
    </div>
  );
}
