import { Button } from '@/components/ui/button'
import { MdArrowForward } from 'react-icons/md'

export default function NetworkCard({ item }) {
  const Icon = item.icon

  return (
    <div className="bg-[#EFF6EA] rounded-[3rem] p-12 lg:p-16 shadow-[0_8px_24px_rgba(23,29,22,0.06)] flex flex-col relative overflow-hidden border border-[#DDE5D9] transition-transform hover:-translate-y-1 duration-300">
      <div className={item.bubbleClass} />
      <div className="relative z-10 flex-1 flex flex-col">
        <div className={item.iconWrapClass}>
          <Icon size={36} />
        </div>

        <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
          {item.title}
        </h3>

        <p className="text-text-secondary text-lg mb-12 max-w-md leading-relaxed font-medium">
          {item.description}
        </p>

        <div className="mt-auto">
          <Button className={item.buttonClass}>
            {item.cta}
            <MdArrowForward size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
