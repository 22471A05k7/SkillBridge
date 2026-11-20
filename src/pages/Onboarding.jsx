import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Check,ChevronLeft,ChevronRight} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {careerRoles,skillCatalog} from '../data/careerRoles'
export default function Onboarding(){
 const [step,setStep]=useState(1),[data,setData]=useState({name:'',education:'',college:'',skills:['HTML','CSS','JavaScript'],career:'React Developer',hours:8})
 const [levels,setLevels]=useState({HTML:'Intermediate',CSS:'Beginner',JavaScript:'Beginner'})
 const {profile,setProfile,setSkills,addActivity}=useApp(); const navigate=useNavigate()
 if(profile.name&&!data.name)setData(d=>({...d,name:profile.name,education:profile.education,college:profile.college}))
 const titles=['Personal information','Education details','Add existing skills','Set proficiency','Choose dream role','Weekly availability']
 const next=()=>{
  if(step<6)return setStep(step+1)
  const nextProfile={...profile,...data,onboarded:true}
  setProfile(nextProfile)
  setSkills(data.skills.map(name=>{const catalog=skillCatalog.find(s=>s[0]===name);return{name,category:catalog?.[1]||'Development Tools',level:levels[name]||'Beginner'}}))
  addActivity('Career profile generated');navigate('/app')
 }
 const toggle=name=>setData(d=>({...d,skills:d.skills.includes(name)?d.skills.filter(x=>x!==name):[...d.skills,name]}))
 return <div className="onboarding-page"><div className="onboarding-brand"><span className="brand-mark">S</span><b>SkillBridge</b></div><div className="onboarding-card"><div className="progress-head"><span>Step {step} of 6</span><div>{titles.map((_,i)=><i key={i} className={i+1<=step?'done':''}/>)}</div></div><h1>{titles[step-1]}</h1>
 {step===1&&<div className="form-stack"><label>Full name<input value={data.name} onChange={e=>setData({...data,name:e.target.value})}/></label><label>Email address<input value={profile.email} disabled/></label></div>}
 {step===2&&<div className="form-stack"><label>Education level<select value={data.education} onChange={e=>setData({...data,education:e.target.value})}><option>Bachelor</option><option>Master</option><option>Diploma</option><option>High School</option></select></label><label>College or institution<input value={data.college} onChange={e=>setData({...data,college:e.target.value})}/></label></div>}
 {step===3&&<div className="skill-picker">{['HTML','CSS','JavaScript','React','Java','Python','SQL','Git','Testing','Figma','Docker'].map(name=><button type="button" key={name} className={data.skills.includes(name)?'selected':''} onClick={()=>toggle(name)}>{name}{data.skills.includes(name)&&<Check/>}</button>)}</div>}
 {step===4&&<div className="form-stack">{data.skills.map(name=><label key={name}>{name}<select value={levels[name]||'Beginner'} onChange={e=>setLevels({...levels,[name]:e.target.value})}><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select></label>)}</div>}
 {step===5&&<div className="role-picker">{careerRoles.map(r=><button type="button" key={r.title} className={data.career===r.title?'selected':''} onClick={()=>setData({...data,career:r.title})}><b>{r.title}</b><small>{r.description}</small></button>)}</div>}
 {step===6&&<div className="form-stack"><label>Available learning hours per week<div className="range-row"><input type="range" min="1" max="30" value={data.hours} onChange={e=>setData({...data,hours:+e.target.value})}/><b>{data.hours}h</b></div></label><div className="summary-box"><span>Career goal</span><b>{data.career}</b><span>Existing skills</span><b>{data.skills.length}</b></div></div>}
 <div className="onboarding-actions">{step>1&&<button className="btn secondary" onClick={()=>setStep(step-1)}><ChevronLeft/>Back</button>}<button className="btn primary" onClick={next}>{step===6?'Generate career profile':'Continue'}<ChevronRight/></button></div></div></div>
}
