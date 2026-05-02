export default function AisleChip({ icon, label, active = false }) {
  return (
    <button
      type="button"
      className={[
        'flex-shrink-0 px-6 py-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition-colors',
        active
          ? 'bg-primary/10 border-primary/20'
          : 'bg-[#E9F0E5] border-[#DDE5D9] hover:bg-[#DDE5D9]'
      ].join(' ')}
    >
      <span className="text-2xl" aria-hidden>{icon}</span>
      <span
        className={[
          'text-base font-bold tracking-tight',
          active ? 'text-accent' : 'text-text-secondary'
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  )
}
