import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import MySkills from './pages/MySkills'
import CareerExplorer from './pages/CareerExplorer'
import SkillGap from './pages/SkillGap'
import Roadmap from './pages/Roadmap'
import Assessment from './pages/Assessment'
import MockInterview from './pages/MockInterview'
import Assistant from './pages/Assistant'
import ResumeMatcher from './pages/ResumeMatcher'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import { useApp } from './context/AppContext'

export default function App(){
 const {authenticated,profile,authLoading,syncError}=useApp()
 const protectedRoute=(element)=>authLoading?<div className="backend-loading">Connecting to SkillBridge…</div>:authenticated?element:<Navigate to="/login" replace/>
 return <>
  {syncError&&<div className="backend-status" role="alert">{syncError}</div>}
  <Routes>
  <Route path="/" element={<Landing/>}/>
  <Route path="/login" element={<Auth mode="login"/>}/>
  <Route path="/register" element={<Auth mode="register"/>}/>
  <Route path="/onboarding" element={protectedRoute(profile.onboarded?<Navigate to="/app"/>:<Onboarding/>)} />
  <Route path="/app" element={protectedRoute(<Layout/>)}>
   <Route index element={<Dashboard/>}/>
   <Route path="skills" element={<MySkills/>}/>
   <Route path="careers" element={<CareerExplorer/>}/>
   <Route path="gap" element={<SkillGap/>}/>
   <Route path="roadmap" element={<Roadmap/>}/>
   <Route path="assessment" element={<Assessment/>}/>
   <Route path="interview" element={<MockInterview/>}/>
   <Route path="assistant" element={<Assistant/>}/>
   <Route path="resume" element={<ResumeMatcher/>}/>
   <Route path="analytics" element={<Analytics/>}/>
   <Route path="profile" element={<Profile/>}/>
   <Route path="admin" element={<Admin/>}/>
  </Route>
  <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
 </>
}
