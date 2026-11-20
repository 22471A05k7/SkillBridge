import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {Eye,EyeOff,ArrowRight,CheckCircle2} from 'lucide-react'
import {useApp} from '../context/AppContext'
export default function Auth({mode='login'}){
 const register=mode==='register'; const navigate=useNavigate(); const {authenticate,addActivity}=useApp()
 const [form,setForm]=useState({name:'',email:'',password:'',confirm:'',education:'',college:''})
 const [show,setShow]=useState(false); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
 const change=e=>setForm({...form,[e.target.name]:e.target.value})
 const submit=async e=>{
  e.preventDefault(); setError('')
  if(!form.email.includes('@')||form.password.length<8){setError('Enter a valid email and password with at least 8 characters.');return}
  if(register&&(!form.name.trim()||form.password!==form.confirm)){setError(register&&!form.name.trim()?'Name is required.':'Passwords do not match.');return}
  setLoading(true)
  try{
   await authenticate(register?'register':'login',{name:form.name,email:form.email,password:form.password,education:form.education,college:form.college})
   addActivity(register?'Account registered':'Signed in')
   navigate(register?'/onboarding':'/app')
  }catch(requestError){setError(requestError.message)}
  finally{setLoading(false)}
 }
 return <div className="auth-page"><Link className="brand auth-brand" to="/"><span className="brand-mark">S</span><b>SkillBridge</b></Link><div className="auth-card">
  <div className="auth-copy"><span className="eyebrow">YOUR CAREER JOURNEY</span><h1>{register?'Create your profile':'Welcome back'}</h1><p>{register?'Build a career-ready skill profile in minutes.':'Continue where you left off.'}</p><div className="auth-quote"><CheckCircle2/><div><b>Personalized by design</b><small>Recommendations based on your goals</small></div></div></div>
  <form onSubmit={submit}>
   <h2>{register?'Start for free':'Log in'}</h2>
   {register&&<label>Full name<input name="name" value={form.name} onChange={change} placeholder="Aarav Sharma"/></label>}
   <label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com"/></label>
   <label>Password<div className="password"><input name="password" type={show?'text':'password'} value={form.password} onChange={change} placeholder="At least 8 characters"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>
   {register&&<><label>Confirm password<div className="password"><input name="confirm" type={show?'text':'password'} value={form.confirm} onChange={change} placeholder="Repeat password"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label><div className="form-grid"><label>Education level<select name="education" value={form.education} onChange={change}><option value="">Select level</option><option>High School</option><option>Diploma</option><option>Bachelor</option><option>Master</option><option>Working Professional</option></select></label><label>College name<input name="college" value={form.college} onChange={change} placeholder="Your institution"/></label></div></>}
   {error&&<div className="form-error">{error}</div>}
   <button className="btn primary full" type="submit" disabled={loading}>{loading?'Please wait…':register?'Create account':'Log in'}<ArrowRight/></button>
   <p className="auth-switch">{register?'Already have an account?':'New to SkillBridge?'} <Link to={register?'/login':'/register'}>{register?'Log in':'Create account'}</Link></p>
   <small className="demo-note">Your account is stored by the SkillBridge backend. Use at least 8 characters for your password.</small>
  </form>
 </div></div>
}
