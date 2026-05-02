import { MdAdd } from 'react-icons/md'

export default function DealCard({ item }) {
  return (
    <article className="bg-white p-6 rounded-[2rem] border border-[#DDE5D9] group relative transition-all hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-56 mb-6 bg-[#E9F0E5] rounded-2xl p-4 flex items-center justify-center overflow-hidden">
        <img
          alt={item.name}
          src={item.image}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        {item.badge ? (
          <span className="absolute top-3 right-3 bg-accent-orange text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
            {item.badge}
          </span>
        ) : null}
      </div>

      <h4 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors text-text-primary">
        {item.name}
      </h4>
      <p className="text-sm text-text-secondary mb-6 line-clamp-2">The best value on today's arrivals.</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-text-primary">{item.price}</span>
          {item.originalPrice ? (
            <span className="text-sm text-text-secondary line-through font-medium">{item.originalPrice}</span>
          ) : null}
        </div>

        <button
          type="button"
          className="w-12 h-12 bg-[#E3EADF] rounded-2xl flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all border border-[#DDE5D9] hover:border-accent"
          aria-label={`Add ${item.name}`}
        >
          <MdAdd size={22} />
        </button>
      </div>
    </article>
  )
}
