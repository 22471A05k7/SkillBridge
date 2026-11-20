import React,{useState} from 'react'
import {Users,Briefcase,ClipboardCheck,Database,Plus} from 'lucide-react'
import {careerRoles,skillCatalog} from '../data/careerRoles'
import {assessmentQuestions} from '../data/assessmentQuestions'
export default function Admin(){
 const [tab,setTab]=useState('Overview')
 return <div><div className="page-heading"><div><span className="eyebrow">SIMULATED ADMIN</span><h1>Platform administration</h1><p>Demo access only. This dashboard has no real security authorization.</p></div></div><div className="admin-tabs">{['Overview','Users','Skills','Careers','Assessments'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
 {tab==='Overview'&&<div className="stat-grid">{[[Users,'Demo users','128'],[Database,'Technical skills',String(skillCatalog.length)],[Briefcase,'Career roles',String(careerRoles.length)],[ClipboardCheck,'Assessment subjects',String(Object.keys(assessmentQuestions).length)]].map(([Icon,label,value])=><article className="stat-card" key={label}><div><span>{label}</span><b>{value}</b></div><div className="stat-icon"><Icon/></div></article>)}</div>}
 {tab==='Users'&&<section className="card admin-table"><h3>Demo users</h3>{['Aarav Sharma','Maya Kapoor','Arjun Patel','Sara Khan'].map((n,i)=><div key={n}><b>{n}</b><span>{i===0?'Admin':'Student'}</span><span>Active</span></div>)}</section>}
 {tab==='Skills'&&<section className="card admin-table"><h3>Technical skills</h3>{skillCatalog.map((s,i)=><div key={i}><b>{s[0]}</b><span>{s[1]}</span><button><Plus/></button></div>)}</section>}
 {tab==='Careers'&&<section className="card admin-table"><h3>Career roles</h3>{careerRoles.map(r=><div key={r.title}><b>{r.title}</b><span>{Object.keys(r.required).length} required skills</span><button>Edit</button></div>)}</section>}
 {tab==='Assessments'&&<section className="card admin-table"><h3>Assessment subjects</h3>{Object.entries(assessmentQuestions).map(([subject,qs])=><div key={subject}><b>{subject}</b><span>{qs.length} questions</span><button>Manage</button></div>)}</section>}
 </div>
}
