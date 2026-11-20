import React, {useState} from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard,UserRound,Compass,Target,Route,ClipboardCheck,MessagesSquare,Bot,FileSearch,ChartNoAxesCombined,Settings,ShieldCheck,LogOut,Menu,X,Bell,Search } from 'lucide-react'
import { useApp } from '../context/AppContext'

const links=[
 ['Dashboard','/app',LayoutDashboard],['My Skills','/app/skills',UserRound],['Career Explorer','/app/careers',Compass],['Skill Gap','/app/gap',Target],['Learning Roadmap','/app/roadmap',Route],['Assessment','/app/assessment',ClipboardCheck],['Mock Interview','/app/interview',MessagesSquare],['AI Assistant','/app/assistant',Bot],['Resume Matcher','/app/resume',FileSearch],['Analytics','/app/analytics',ChartNoAxesCombined],['Profile','/app/profile',Settings],['Admin Demo','/app/admin',ShieldCheck]
]
export default function Layout(){
 const [open,setOpen]=useState(false)
 const {profile,logout:signOut}=useApp()
 const navigate=useNavigate()
 const logout=async()=>{try{await signOut()}finally{navigate('/login')}}
 return <div className="app-shell">
  <aside className={open?'sidebar open':'sidebar'}>
   <div className="brand" onClick={()=>navigate('/app')}><span className="brand-mark">S</span><b>SkillBridge</b></div>
   <button className="sidebar-close icon-button" onClick={()=>setOpen(false)}><X/></button>
   <nav>{links.map(([label,path,Icon])=> <NavLink key={path} to={path} end={path==='/'||path===' /app'} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'nav-link active':'nav-link'}><Icon/><span>{label}</span></NavLink>)}</nav>
  </aside>
  {open&&<div className="scrim" onClick={()=>setOpen(false)}/>}
  <main className="main">
   <header className="topbar"><button className="menu-button icon-button" onClick={()=>setOpen(true)}><Menu/></button><div className="searchbox"><Search/><input placeholder="Search skills, careers, resources..." /></div><Bell className="top-icon"/><div className="avatar">{profile.name?.[0]||'U'}</div></header>
   <div className="page"><Outlet/></div>
  </main>
  <button className="mobile-signout" onClick={logout}><LogOut/></button>
 </div>
}
