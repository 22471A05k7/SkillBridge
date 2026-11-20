import React,{useState} from 'react'
import {Send,Trash2,Bot,User} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {careerRoles} from '../data/careerRoles'
import {calculateGap} from '../utils/scoring'
export default function Assistant(){
 const {profile,skills,chatHistory,setChatHistory}=useApp();const [input,setInput]=useState('')
 const role=careerRoles.find(r=>r.title===profile.career)||careerRoles[0];const gap=calculateGap(role,skills)
 const answer=text=>{
  const l=text.toLowerCase()
  if(l.includes('missing'))return `Your most important missing skills for ${role.title} are ${gap.missing.slice(0,5).map(s=>s.name).join(', ')||'none at this stage'}.`
  if(l.includes('roadmap')||l.includes('30-day'))return `For a 30-day plan: spend the first 7 days on ${gap.missing[0]?.name||Object.keys(role.required)[0]}, days 8–21 on ${Object.keys(role.required).slice(1,3).join(' and ')}, then build a portfolio project in the final week.`
  if(l.includes('javascript'))return 'Strengthen JavaScript by practicing ES6+, closures, async/await, array methods and DOM concepts. Build 3 small projects and explain each implementation out loud.'
  if(l.includes('react'))return `Practice React Hooks, component architecture, state management and testing. Your recommended React priorities are ${gap.missing.filter(s=>['React','Redux Toolkit','TypeScript','Testing'].includes(s.name)).map(s=>s.name).join(', ')||'advanced component patterns and testing'}.`
  if(l.includes('ready')||l.includes('career'))return `Your demo readiness score is ${gap.readiness}%. Focus on high-weight missing skills, complete roadmap tasks and take assessments to improve it.`
  if(l.includes('interview'))return 'Practice explaining: component lifecycle vs Hooks, state vs props, React rendering, REST API integration, Git workflows and one STAR behavioral example.'
  return `As a rule-based demo assistant, I recommend learning ${gap.missing[0]?.name||'advanced role skills'} next for ${role.title}. Your current readiness is ${gap.readiness}%.`
 }
 const send=(text=input)=>{if(!text.trim())return;const user={role:'user',text:text.trim()},bot={role:'bot',text:answer(text)};setChatHistory([...chatHistory,user,bot]);setInput('')}
 const suggestions=['What skills should I learn?','What are my missing skills?','Create a 30-day roadmap','How can I improve my JavaScript?','Give me React interview questions','How can I improve career readiness?']
 return <div><div className="page-heading"><div><span className="eyebrow">AI DEMO ASSISTANT</span><h1>Career guidance</h1><p>Personalized guidance from a rule-based frontend demo.</p></div><button className="btn secondary" onClick={()=>setChatHistory([])}><Trash2/>Clear conversation</button></div><div className="chat-layout"><aside className="suggestions card"><h3>Suggested questions</h3>{suggestions.map(s=><button key={s} onClick={()=>send(s)}>{s}</button>)}</aside><section className="chat card"><div className="chat-messages">{chatHistory.length?chatHistory.map((m,i)=><div className={'chat-message '+m.role} key={i}><div className="chat-avatar">{m.role==='bot'?<Bot/>:<User/>}</div><p>{m.text}</p></div>):<div className="chat-welcome"><Bot/><h2>How can I help your career?</h2><p>Ask for missing skills, a roadmap or interview practice.</p></div>}</div><form className="chat-input" onSubmit={e=>{e.prevent;e.preventDefault();send()}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about your career..."/><button type="submit"><Send/></button></form></section></div></div>
}
