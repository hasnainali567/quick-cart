export default function FlowStep({ item }) {
  const Icon = item.icon

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-10 border border-[#DDE5D9] shadow-[0_8px_24px_rgba(23,29,22,0.06)] transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2 z-10">
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full border border-[#DDE5D9] flex items-center justify-center text-xs font-bold text-text-secondary z-20 shadow-sm">
          {item.step}
        </div>
        <Icon className={item.accent ? 'text-accent-orange' : 'text-accent'} size={36} />
      </div>

      <h3 className="text-2xl font-bold mb-4 text-text-primary tracking-tight text-center">{item.title}</h3>
      <p className="text-text-secondary text-center max-w-[260px] mx-auto leading-relaxed">{item.description}</p>
    </div>
  )
}
