import React,{useState} from 'react'
import {Upload,Search,CheckCircle2,TriangleAlert,FileText} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {careerRoles} from '../data/careerRoles'
export default function ResumeMatcher(){
 const {profile,setProfile,resumeAnalysis,setResumeAnalysis,addActivity}=useApp();const [text,setText]=useState(''),[roleName,setRoleName]=useState(profile.career),[loading,setLoading]=useState(false)
 const parsePdf=async file=>{
  setLoading(true)
  try{const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString();const pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;let out='';for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const content=await page.getTextContent();out+=content.items.map(x=>x.str).join(' ')+' '}setText(out)}catch{setText('') }
  setLoading(false)
 }
 const analyze=()=>{
  const role=careerRoles.find(r=>r.title===roleName)||careerRoles[0];const lower=text.toLowerCase();const req=Object.keys(role.required);const matched=req.filter(s=>lower.includes(s.toLowerCase()));const missing=req.filter(s=>!lower.includes(s.toLowerCase()));const score=matched.length?Math.round(matched.length/req.length*100):0
  const recommendations=['Add measurable project outcomes','Include a concise technical skills section','Mirror role keywords naturally','Link GitHub and portfolio work']
  const analysis={score,matched,missing,recommendations,role:roleName};setResumeAnalysis(analysis);setProfile({...profile,career:roleName});addActivity('Resume keyword analysis completed')
 }
 return <div><div className="page-heading"><div><span className="eyebrow">RESUME SKILL MATCHER</span><h1>Match your resume</h1><p>Keyword-based demo analysis, not a guaranteed ATS score.</p></div></div><div className="resume-grid"><section className="card resume-input"><label className="upload-area"> <Upload/><b>{loading?'Reading PDF...':'Upload PDF resume'}</b><small>PDF parsing is performed in your browser</small><input type="file" accept=".pdf" onChange={e=>e.target.files[0]&&parsePdf(e.target.files[0])}/></label><label>Or paste resume text<textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste experience, skills and projects..."/></label><label>Target role<select value={roleName} onChange={e=>setRoleName(e.target.value)}>{careerRoles.map(r=><option key={r.title}>{r.title}</option>)}</select></label><button className="btn primary" onClick={analyze}><Search/>Analyze resume</button></section>
 {resumeAnalysis&&<section className="card resume-results"><div className="resume-score"><div><b>{resumeAnalysis.score}%</b><span>Keyword match</span></div></div><h3><CheckCircle2/>Matched skills</h3><div className="tag-list">{resumeAnalysis.matched.map(s=><span key={s}>{s}</span>)}</div><h3><TriangleAlert/>Missing keywords</h3><div className="tag-list missing">{resumeAnalysis.missing.map(s=><span key={s}>{s}</span>)}</div><h3><FileText/>Resume improvements</h3><ul>{resumeAnalysis.recommendations.map(r=><li key={r}>{r}</li>)}</ul></section>}</div></div>
}
