
'use client';
import { useEffect, useMemo, useState } from 'react';

type Sense = 'Продажа' | 'Прогрев' | 'Личное';
type Goal = 'Продажа' | 'Вовлечение' | 'Прогрев' | 'Экспертность';

type Post = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  sense: Sense;
  goal: Goal;
};

const LS_KEY = 'tg-content-tracker-v1';

export default function Page() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [title, setTitle] = useState('');
  const [sense, setSense] = useState<Sense>('Прогрев');
  const [goal, setGoal] = useState<Goal>('Вовлечение');
  const [posts, setPosts] = useState<Post[]>([]);

  // Calculator state
  const [budget, setBudget] = useState<number>(10000);
  const [cpc, setCpc] = useState<number>(20);
  const [conv, setConv] = useState<number>(35);

  // Load/save localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPosts(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(posts));
  }, [posts]);

  function addPost() {
    if (!title.trim()) return;
    const p: Post = {
      id: crypto.randomUUID(),
      date,
      title: title.trim(),
      sense,
      goal,
    };
    setPosts(prev => [p, ...prev]);
    setTitle('');
  }

  function deletePost(id: string) {
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  const postsForDay = useMemo(() => posts.filter(p => p.date === date), [posts, date]);

  const counts = useMemo(() => {
    const total = postsForDay.length || 1;
    const sale = postsForDay.filter(p => p.sense === 'Продажа').length;
    const warm = postsForDay.filter(p => p.sense === 'Прогрев').length;
    const personal = postsForDay.filter(p => p.sense === 'Личное').length;
    return {
      total: postsForDay.length,
      sale, warm, personal,
      salePct: Math.round((sale/total)*100),
      warmPct: Math.round((warm/total)*100),
      personalPct: Math.round((personal/total)*100),
    };
  }, [postsForDay]);

  const advice = useMemo(() => {
    if (counts.total === 0) return 'Пока нет постов — добавь хотя бы один.';
    if (counts.sale === 0) return 'У тебя нет продающих постов — добавь хотя бы один.';
    if (counts.salePct > 50) return 'Продаж больше 50% — подписчики могут устать. Разбавь прогревом/личным.';
    return 'Баланс норм, продолжай!';
  }, [counts]);

  // Calculator
  const clicks = Math.floor((budget || 0) / (cpc || 1));
  const subs = Math.floor(clicks * (conv || 0) / 100);
  const cps = subs > 0 ? Math.round((budget || 0) / subs) : 0;

  return (
    <main className="container py-8 space-y-6">
      <header className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-white/10 grid place-items-center">🚀</div>
        <div>
          <h1 className="text-2xl font-semibold">Контент-трекер для запусков</h1>
          <p className="text-white/60 text-sm">Веди баланс постов и считай подписчиков</p>
        </div>
        <div className="ml-auto">
          <a className="btn" href="/manifest.webmanifest">Установить как иконку</a>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: form */}
        <section className="card space-y-4">
          <h2 className="text-lg font-semibold">Добавить пост</h2>

          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2">
              <span className="text-sm text-white/70">Дата</span>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="input mt-1" />
            </label>
            <label className="col-span-2">
              <span className="text-sm text-white/70">Заголовок</span>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Например: Кейсы по Telegram Ads" className="input mt-1" />
            </label>
            <label>
              <span className="text-sm text-white/70">Смысл</span>
              <select value={sense} onChange={e=>setSense(e.target.value as Sense)} className="input mt-1">
                <option>Продажа</option>
                <option>Прогрев</option>
                <option>Личное</option>
              </select>
            </label>
            <label>
              <span className="text-sm text-white/70">Цель</span>
              <select value={goal} onChange={e=>setGoal(e.target.value as Goal)} className="input mt-1">
                <option>Продажа</option>
                <option>Вовлечение</option>
                <option>Прогрев</option>
                <option>Экспертность</option>
              </select>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-white/60 text-sm">Посты сохраняются в браузере (LocalStorage)</div>
            <button onClick={addPost} className="btn">Добавить пост</button>
          </div>

          {postsForDay.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium mb-2">Сегодняшние посты</h3>
              <ul className="space-y-2">
                {postsForDay.map(p => (
                  <li key={p.id} className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                    <div className="text-xs px-2 py-1 rounded-lg bg-white/10">{p.sense}</div>
                    <div className="text-xs px-2 py-1 rounded-lg bg-white/10">{p.goal}</div>
                    <div className="text-sm flex-1 truncate">{p.title}</div>
                    <button onClick={()=>deletePost(p.id)} className="btn">Удалить</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Right: dashboard */}
        <section className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="kpi"><div className="text-white/60 text-xs">Постов</div><div className="text-2xl font-semibold">{counts.total}</div></div>
            <div className="kpi"><div className="text-white/60 text-xs">Продажа</div><div className="text-2xl font-semibold">{counts.sale} <span className="text-white/50 text-sm">({counts.salePct}%)</span></div></div>
            <div className="kpi"><div className="text-white/60 text-xs">Прогрев</div><div className="text-2xl font-semibold">{counts.warm} <span className="text-white/50 text-sm">({counts.warmPct}%)</span></div></div>
            <div className="kpi"><div className="text-white/60 text-xs">Личное</div><div className="text-2xl font-semibold">{counts.personal} <span className="text-white/50 text-sm">({counts.personalPct}%)</span></div></div>
          </div>

          <div className="card border-accent/20">
            <div className="text-sm text-white/70 mb-1">Совет ИИ</div>
            <div className="text-base">{advice}</div>
          </div>

          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Калькулятор подписчиков</h2>
            <div className="grid grid-cols-3 gap-3">
              <label><span className="text-sm text-white/70">Бюджет (₽)</span><input type="number" value={budget} onChange={e=>setBudget(parseInt(e.target.value||'0'))} className="input mt-1" /></label>
              <label><span className="text-sm text-white/70">Цена клика (₽)</span><input type="number" value={cpc} onChange={e=>setCpc(parseInt(e.target.value||'0'))} className="input mt-1" /></label>
              <label><span className="text-sm text-white/70">Конверсия в подписку (%)</span><input type="number" value={conv} onChange={e=>setConv(parseInt(e.target.value||'0'))} className="input mt-1" /></label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="kpi"><div className="text-white/60 text-xs">Клики</div><div className="text-2xl font-semibold">{clicks}</div></div>
              <div className="kpi"><div className="text-white/60 text-xs">Подписчики</div><div className="text-2xl font-semibold">{subs}</div></div>
              <div className="kpi"><div className="text-white/60 text-xs">Цена подписчика</div><div className="text-2xl font-semibold">{cps} ₽</div></div>
            </div>
          </div>
        </section>
      </div>

      <footer className="text-center text-white/40 text-xs pt-2">
        Сделано с ❤️ и GPT. Данные не уходят на сервер — всё хранится в вашем браузере.
      </footer>
    </main>
  );
}
