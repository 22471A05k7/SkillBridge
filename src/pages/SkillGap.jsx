import React,{useMemo} from 'react'
import {Radar,RadarChart,PolarGrid,PolarAngleAxis,ResponsiveContainer,Tooltip} from 'recharts'
import {Briefcase,CheckCircle2,TriangleAlert,Target,Info} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {careerRoles} from '../data/careerRoles'
import {calculateGap} from '../utils/scoring'
export default function SkillGap(){
 const {profile,setProfile,skills,addActivity}=useApp();const role=careerRoles.find(r=>r.title===profile.career)||careerRoles[0];const gap=useMemo(()=>calculateGap(role,skills),[role,skills])
 const change=e=>{setProfile({...profile,career:e.target.value});addActivity('Career goal changed')}
 return <div><div className="page-heading"><div><span className="eyebrow">SKILL GAP ANALYSIS</span><h1>Know exactly what to learn</h1><p>Weighted comparison of your profile and target role.</p></div><label className="role-select">Target role<select value={profile.career} onChange={change}>{careerRoles.map(r=><option key={r.title}>{r.title}</option>)}</select></label></div>
 <div className="gap-summary"><article className="score-card"><div className="score-ring" style={{'--score':gap.readiness*3.6+'deg'}}><div><b>{gap.readiness}%</b><small>READY</small></div></div><div><span>Career readiness</span><h3>{gap.gap}% skill gap</h3></div></article><div className="gap-stats"><div><b>{gap.matching.length}</b><span>Matching skills</span></div><div><b>{gap.strong.length}</b><span>Strong skills</span></div><div><b>{gap.weak.length}</b><span>Weak skills</span></div><div><b>{gap.missing.length}</b><span>Missing skills</span></div></div></div>
 <div className="gap-grid"><section className="card"><div className="card-head"><div><span>COMPARISON</span><h3>Skill radar</h3></div></div><div className="chart-height"><ResponsiveContainer><RadarChart data={gap.radar}><PolarGrid/><PolarAngleAxis dataKey="skill" tick={{fontSize:10}}/><Radar name="Required" dataKey="target" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.25}/><Radar name="Current" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45}/><Tooltip/></RadarChart></ResponsiveContainer></div></section>
 <section className="card gap-list"><div className="card-head"><div><span>PRIORITY ACTIONS</span><h3>Recommended next steps</h3></div></div>{gap.missing.slice(0,4).map(s=><div className="gap-row" key={s.name}><span className="gap-icon"><Target/></span><div><b>Learn {s.name}</b><small>{s.weight}% role importance</small></div><span className="badge">Missing</span></div>)}</section></div>
 <div className="gap-columns"><section><h3><CheckCircle2/>Matching skills</h3>{gap.matching.map(s=><div key={s.name}>{s.name}<span>{s.level}</span></div>)}</section><section><h3><TriangleAlert/>Weak skills</h3>{gap.weak.map(s=><div key={s.name}>{s.name}<span>{s.level}</span></div>)}</section></div>
 <div className="algorithm-note"><Info/><div><b>How the readiness score works</b><p>Each required skill contributes its role weight. A level ratio (Beginner=1, Intermediate=2, Advanced=3, Expert=4) is compared with the role requirement, capped at 100%. The weighted score is divided by total role weights.</p></div></div>
 </div>
}
