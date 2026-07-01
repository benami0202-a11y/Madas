import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, UserPlus, ClipboardCheck, Trophy, X } from 'lucide-react';

const ACTIONS = [
  { label: 'הוסף חניך', icon: UserPlus, to: '/cadets?new=1' },
  { label: 'סימון נוכחות', icon: ClipboardCheck, to: '/attendance' },
  { label: 'טבלת ניקוד', icon: Trophy, to: '/scoreboard' },
];

export function FAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col items-start gap-3 lg:bottom-8 lg:left-8">
      <AnimatePresence>
        {open &&
          ACTIONS.map((action, i) => (
            <motion.button
              key={action.to}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => {
                navigate(action.to);
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-semibold text-gray-700 shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <action.icon size={16} />
              </span>
              {action.label}
            </motion.button>
          ))}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.9 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-600/40"
        aria-label="פעולות מהירות"
      >
        <motion.span animate={{ rotate: open ? 135 : 0 }}>{open ? <X size={24} /> : <Plus size={24} />}</motion.span>
      </motion.button>
    </div>
  );
}
