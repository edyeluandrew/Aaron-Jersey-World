import { NavLink } from 'react-router-dom';
import { ADMIN_NAV } from '@/constants/adminNavigation';

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-brand-black text-white lg:block">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="font-heading text-xl tracking-wider text-brand-red">ADMIN</p>
        <p className="text-xs text-white/60">Aaron Jersey World</p>
      </div>
      <nav className="space-y-1 p-4" aria-label="Admin navigation">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `block rounded-button px-4 py-2.5 text-sm font-semibold transition ${
                isActive ? 'bg-brand-red text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
