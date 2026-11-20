import React from 'react'
import {useNavigate} from 'react-router-dom'
import {ArrowRight,Briefcase} from 'lucide-react'
import {careerRoles} from '../data/careerRoles'
import {useApp} from '../context/AppContext'
export default function CareerExplorer(){
 const {profile,setProfile,addActivity}=useApp();const navigate=useNavigate()
 const select=r=>{setProfile({...profile,career:r.title});addActivity('Career goal changed: '+r.title);navigate('/app/gap')}
 return <div><div className="page-heading"><div><span className="eyebrow">CAREER EXPLORER</span><h1>Find your direction</h1><p>Explore roles and set your next career goal.</p></div></div><div className="career-grid">{careerRoles.map(r=><article className={'career-card '+(profile.career===r.title?'selected':'')} key={r.title}><div className="career-icon"><Briefcase/></div><h3>{r.title}</h3><p>{r.description}</p><div className="tag-list">{Object.keys(r.required).slice(0,4).map(s=><span key={s}>{s}</span>)}</div><p className="career-overview">{r.overview}</p><button className="btn secondary full" onClick={()=>select(r)}>{profile.career===r.title?'Selected goal':'Set as goal'}<ArrowRight/></button></article>)}</div></div>
}
