import React,{useState} from 'react'
import {Send,RefreshCw} from 'lucide-react'
import {interviewQuestions} from '../data/interviewQuestions'
import {careerRoles} from '../data/careerRoles'
import {useApp} from '../context/AppContext'
export default function MockInterview(){
 const {profile,setProfile,interviews,setInterviews,addActivity}=useApp();const [role,setRole]=useState(profile.career),[difficulty,setDifficulty]=useState('Intermediate'),[idx,setIdx]=useState(0),[answer,setAnswer]=useState(''),[feedback,setFeedback]=useState(null)
 const qs=interviewQuestions[role]||interviewQuestions['React Developer']
 const submit=()=>{if(!answer.trim())return;const score=Math.min(95,55+answer.trim().split(/\s+/).length*2+(answer.length>150?10:0));const fb={score,strengths:answer.length>100?'Detailed response':'Direct response',improvements:['Add a concrete example','Explain trade-offs','Conclude with the outcome'],answer};setFeedback(fb);setInterviews([{id:Date.now(),role,difficulty,score,date:new Date().toLocaleDateString()},...interviews]);addActivity('Mock interview answer evaluated')}
 const next=()=>{setIdx((idx+1)%qs.length);setAnswer('');setFeedback(null)}
 return <div><div className="page-heading"><div><span className="eyebrow">MOCK INTERVIEW</span><h1>Practice with confidence</h1><p>Demo interview feedback is simulated and rule-based.</p></div></div><div className="interview-controls"><label>Job role<select value={role} onChange={e=>{setRole(e.target.value);setProfile({...profile,career:e.target.value});setIdx(0);setFeedback(null)}}>{careerRoles.map(r=><option key={r.title}>{r.title}</option>)}</select></label><label>Difficulty<select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></div>
 <div className="interview-grid"><section className="card interview-card"><div className="question-label">{qs[idx].type} · Question {idx+1}</div><h2>{qs[idx].q}</h2><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Structure your answer here..."/><div className="interview-actions"><button className="btn secondary" onClick={next}><RefreshCw/>Next question</button><button className="btn primary" onClick={submit}><Send/>Submit for demo feedback</button></div></section>
 <aside className="card feedback-card"><h3>Simulated feedback</h3>{feedback?<><div className="feedback-score"><b>{feedback.score}</b><span>/100</span></div><h4>Strengths</h4><p>{feedback.strengths}</p><h4>Improve</h4><ul>{feedback.improvements.map(x=><li key={x}>{x}</li>)}</ul></>:<p className="empty-inline">Submit an answer to receive feedback.</p>}</aside></div></div>
}
