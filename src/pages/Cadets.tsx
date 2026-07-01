import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Search } from 'lucide-react';
import { useCadets } from '@/hooks/useCadets';
import { CadetCard } from '@/components/cadets/CadetCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CadetForm } from '@/components/cadets/CadetForm';
import { EmptyState } from '@/components/ui/EmptyState';
import type { FitnessLevel, Team } from '@/types';
import { FITNESS_LEVEL_LABELS, TEAM_LABELS } from '@/types';
import { cn } from '@/lib/utils';

type SortKey = 'name' | 'score' | 'attendance';

export default function Cadets() {
  const { cadetsWithStats, addCadet } = useCadets();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(searchParams.get('new') === '1');
  const [teamFilter, setTeamFilter] = useState<Team | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<FitnessLevel | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('score');

  const filtered = useMemo(() => {
    let list = cadetsWithStats;
    if (teamFilter !== 'all') list = list.filter((c) => c.cadet.team === teamFilter);
    if (levelFilter !== 'all') list = list.filter((c) => c.cadet.fitnessLevel === levelFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.cadet.fullName.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortKey === 'name') return a.cadet.fullName.localeCompare(b.cadet.fullName, 'he');
      if (sortKey === 'score') return b.score - a.score;
      return b.attendance - a.attendance;
    });
  }, [cadetsWithStats, teamFilter, levelFilter, query, sortKey]);

  function closeForm() {
    setFormOpen(false);
    if (searchParams.get('new')) {
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">חניכים</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{cadetsWithStats.length} חניכים בפלוגה</p>
        </div>
        <Button icon={<UserPlus size={18} />} onClick={() => setFormOpen(true)}>
          הוסף חניך
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש לפי שם..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pe-9 ps-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 sm:max-w-xs dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="score">מיין לפי ניקוד</option>
          <option value="attendance">מיין לפי נוכחות</option>
          <option value="name">מיין לפי שם</option>
        </select>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={teamFilter === 'all'} onClick={() => setTeamFilter('all')}>
          כל הצוותים
        </FilterChip>
        {(Object.keys(TEAM_LABELS) as Team[]).map((t) => (
          <FilterChip key={t} active={teamFilter === t} onClick={() => setTeamFilter(t)}>
            {TEAM_LABELS[t]}
          </FilterChip>
        ))}
        <span className="mx-1 w-px shrink-0 self-stretch bg-gray-200 dark:bg-gray-700" />
        <FilterChip active={levelFilter === 'all'} onClick={() => setLevelFilter('all')}>
          כל הרמות
        </FilterChip>
        {(Object.keys(FITNESS_LEVEL_LABELS) as FitnessLevel[]).map((l) => (
          <FilterChip key={l} active={levelFilter === l} onClick={() => setLevelFilter(l)}>
            {FITNESS_LEVEL_LABELS[l]}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="לא נמצאו חניכים" description="נסה לשנות את הסינון או החיפוש" />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(({ cadet, score, attendance }) => (
            <CadetCard key={cadet.id} cadet={cadet} score={score} attendance={attendance} />
          ))}
        </motion.div>
      )}

      <Modal open={formOpen} onClose={closeForm} title="הוספת חניך חדש">
        <CadetForm
          onSubmit={(values) => {
            addCadet(values);
            closeForm();
          }}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700',
      )}
    >
      {children}
    </button>
  );
}
