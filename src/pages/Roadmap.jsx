import React from 'react'
import {RefreshCw,CheckCircle2,Clock3,BookOpen,Plus} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {careerRoles} from '../data/careerRoles'
import {calculateGap} from '../utils/scoring'
export default function Roadmap(){
 const {profile,skills,roadmap,setRoadmap,addActivity}=useApp()
 const role=careerRoles.find(r=>r.title===profile.career)||careerRoles[0]
 const generate=()=>{const gap=calculateGap(role,skills);const names=[...gap.missing.slice(0,6).map(s=>s.name),...gap.weak.slice(0,2).map(s=>s.name),...Object.keys(role.required).slice(0,3)].filter((v,i,a)=>a.indexOf(v)===i).slice(0,8)
 const next=[];names.forEach((name,i)=>next.push({id:Date.now()+i,week:Math.floor(i/2)+1,topic:name+' fundamentals',description:'Learn core concepts, complete practical exercises and review common interview questions.',estimatedHours:Math.max(2,Math.min(6,Math.round(profile.weeklyHours/3))),difficulty:i<3?'Beginner':'Intermediate',resources:['Official documentation','SkillBridge practice','YouTube tutorial'],completed:false,notes:''}))
 setRoadmap(next);addActivity('Learning roadmap generated')}
 const toggle=id=>{setRoadmap(roadmap.map(t=>t.id===id?{...t,completed:!t.completed}:t));addActivity('Learning task updated')}
 const complete=roadmap.filter(t=>t.completed).length,pct=roadmap.length?Math.round(complete/roadmap.length*100):0
 const weeks=[...new Set(roadmap.map(t=>t.week))]
 return <div><div className="page-heading"><div><span className="eyebrow">PERSONALIZED ROADMAP</span><h1>Your learning plan</h1><p>Build toward {profile.career} with a focused weekly schedule.</p></div><button className="btn primary" onClick={generate}><RefreshCw/>Regenerate roadmap</button></div>
 <div className="roadmap-progress card"><div><span>Roadmap completion</span><b>{pct}%</b></div><div className="progress large"><i style={{width:pct+'%'}}/></div><small>{complete} of {roadmap.length} tasks completed</small></div>
 {roadmap.length?weeks.map(w=><section className="roadmap-week" key={w}><div className="week-title"><b>Week {w}</b><span>{roadmap.filter(t=>t.week===w).filter(t=>t.completed).length}/{roadmap.filter(t=>t.week===w).length} complete</span></div>{roadmap.filter(t=>t.week===w).map(t=><article className={'roadmap-task '+(t.completed?'completed':'')} key={t.id}><button className="task-check" onClick={()=>toggle(t.id)}><CheckCircle2/></button><div className="task-main"><div><h3>{t.topic}</h3><span className={'badge '+t.difficulty.toLowerCase()}>{t.difficulty}</span></div><p>{t.description}</p><div className="task-meta"><span><Clock3/> {t.estimatedHours} hours</span><span><BookOpen/> {t.resources.join(' · ')}</span></div><textarea value={t.notes} onChange={e=>setRoadmap(roadmap.map(x=>x.id===t.id?{...x,notes:e.target.value}:x))} placeholder="Add personal notes..."/></div></article>)}</section>):<div className="empty-state card"><div><Plus/></div><h2>Your roadmap is ready to generate</h2><p>We’ll use your skill gaps and weekly availability to create a practical plan.</p><button className="btn primary" onClick={generate}>Generate my roadmap</button></div>}
 </div>
}
