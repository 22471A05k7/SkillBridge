import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { apiRequest } from '../utils/api'
import { loadStorage, saveStorage } from '../utils/storage'

const AppContext = createContext(null)
const defaults = {
  profile:{name:'Aarav Sharma',email:'aarav@example.com',education:'Bachelor',college:'State University',weeklyHours:8,career:'React Developer',onboarded:false},
  theme:'light', skills:[{name:'HTML',category:'Frontend Development',level:'Advanced'},{name:'CSS',category:'Frontend Development',level:'Intermediate'},{name:'JavaScript',category:'Programming Languages',level:'Intermediate'},{name:'React',category:'Frontend Development',level:'Beginner'},{name:'Git',category:'Development Tools',level:'Intermediate'}],
  roadmap:[], assessments:[], interviews:[], resumeAnalysis:null, chatHistory:[], activities:[{title:'Profile created',time:'Today'}],
  readinessHistory:[{month:'Jan',score:42},{month:'Feb',score:48},{month:'Mar',score:57},{month:'Apr',score:64}],
}

export function AppProvider({children}) {
  const [profile,setProfile]=useState(()=>loadStorage('sb_profile',defaults.profile))
  const [authenticated,setAuthenticated]=useState(false)
  const [authLoading,setAuthLoading]=useState(true)
  const [syncError,setSyncError]=useState('')
  const [theme,setTheme]=useState(()=>loadStorage('sb_theme',defaults.theme))
  const [skills,setSkills]=useState(()=>loadStorage('sb_skills',defaults.skills))
  const [roadmap,setRoadmap]=useState(()=>loadStorage('sb_roadmap',defaults.roadmap))
  const [assessments,setAssessments]=useState(()=>loadStorage('sb_assessments',defaults.assessments))
  const [interviews,setInterviews]=useState(()=>loadStorage('sb_interviews',defaults.interviews))
  const [resumeAnalysis,setResumeAnalysis]=useState(()=>loadStorage('sb_resume',defaults.resumeAnalysis))
  const [chatHistory,setChatHistory]=useState(()=>loadStorage('sb_chat',defaults.chatHistory))
  const [activities,setActivities]=useState(()=>loadStorage('sb_activities',defaults.activities))
  const [readinessHistory,setReadinessHistory]=useState(()=>loadStorage('sb_history',defaults.readinessHistory))
  const initialized=useRef(false)
  const saveQueue=useRef(Promise.resolve())
  const saveTimer=useRef(null)

  const applyServerState=useCallback((state,user,registering=false)=>{
    const savedProfile=state.profile||{}
    setProfile({...defaults.profile,...savedProfile,name:savedProfile.name||user.name,email:user.email,...(registering?{onboarded:false}:{})})
    setTheme(state.theme||defaults.theme)
    setSkills(state.skills||defaults.skills)
    setRoadmap(state.roadmap||defaults.roadmap)
    setAssessments(state.assessments||defaults.assessments)
    setInterviews(state.interviews||defaults.interviews)
    setResumeAnalysis(state.resumeAnalysis??defaults.resumeAnalysis)
    setChatHistory(state.chatHistory||defaults.chatHistory)
    setActivities(state.activities||defaults.activities)
    setReadinessHistory(state.readinessHistory||defaults.readinessHistory)
  },[])

  useEffect(()=>{
    let active=true
    apiRequest('/auth/me').then(async user=>{
      const state=await apiRequest('/state')
      if(!active)return
      applyServerState(state,user)
      initialized.current=true
      setAuthenticated(true)
    }).catch(error=>{
      if(active&&error.status!==401)setSyncError(error.message)
    }).finally(()=>{
      if(active){
        initialized.current=true
        setAuthLoading(false)
      }
    })
    return ()=>{active=false}
  },[applyServerState])

  const authenticate=useCallback(async(mode,credentials)=>{
    const body=mode==='register'
      ?{name:credentials.name,email:credentials.email,password:credentials.password}
      :{email:credentials.email,password:credentials.password}
    const user=await apiRequest(`/auth/${mode}`,{method:'POST',body})
    const state=await apiRequest('/state')
    if(mode==='register'){
      state.profile={...defaults.profile,...(state.profile||{}),name:user.name,email:user.email,education:credentials.education||defaults.profile.education,college:credentials.college||'',onboarded:false}
    }
    applyServerState(state,user,mode==='register')
    initialized.current=true
    setAuthenticated(true)
    setSyncError('')
    return user
  },[applyServerState])

  const snapshot={profile,theme,skills,roadmap,assessments,interviews,resumeAnalysis,chatHistory,activities,readinessHistory}
  const saveSnapshot=useCallback(state=>{
    saveQueue.current=saveQueue.current.catch(()=>{}).then(()=>apiRequest('/state',{method:'PUT',body:state}))
    return saveQueue.current
  },[])

  useEffect(()=>saveStorage('sb_profile',profile),[profile])
  useEffect(()=>saveStorage('sb_theme',theme),[theme])
  useEffect(()=>saveStorage('sb_skills',skills),[skills])
  useEffect(()=>saveStorage('sb_roadmap',roadmap),[roadmap])
  useEffect(()=>saveStorage('sb_assessments',assessments),[assessments])
  useEffect(()=>saveStorage('sb_interviews',interviews),[interviews])
  useEffect(()=>saveStorage('sb_resume',resumeAnalysis),[resumeAnalysis])
  useEffect(()=>saveStorage('sb_chat',chatHistory),[chatHistory])
  useEffect(()=>saveStorage('sb_activities',activities),[activities])
  useEffect(()=>saveStorage('sb_history',readinessHistory),[readinessHistory])
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme])
  useEffect(()=>{
    if(!authenticated||!initialized.current)return
    window.clearTimeout(saveTimer.current)
    saveTimer.current=window.setTimeout(()=>saveSnapshot(snapshot).then(()=>setSyncError('')).catch(error=>setSyncError(error.message)),300)
    return ()=>window.clearTimeout(saveTimer.current)
  },[authenticated,profile,theme,skills,roadmap,assessments,interviews,resumeAnalysis,chatHistory,activities,readinessHistory,saveSnapshot])

  const logout=useCallback(async()=>{
    window.clearTimeout(saveTimer.current)
    try {
      await saveSnapshot(snapshot)
      await apiRequest('/auth/logout',{method:'POST'})
      setAuthenticated(false)
      setSyncError('')
    } catch(error) {
      setSyncError(error.message)
      setAuthenticated(false)
    }
  },[saveSnapshot,snapshot])

  const resetDemo=useCallback(async()=>{
    const cleanState={...defaults,profile:{...defaults.profile,name:profile.name,email:profile.email}}
    try {
      await apiRequest('/state',{method:'PUT',body:cleanState})
      await apiRequest('/auth/logout',{method:'POST'})
      Object.keys(localStorage).filter(key=>key.startsWith('sb_')).forEach(key=>localStorage.removeItem(key))
      window.location.assign('/')
    } catch(error) {
      setSyncError(error.message)
    }
  },[profile.name,profile.email])
  const addActivity=useCallback(title=>setActivities(items=>[{title,time:'Just now'},...items].slice(0,8)),[])
  const value=useMemo(()=>({profile,setProfile,authenticated,authLoading,syncError,authenticate,logout,theme,setTheme,skills,setSkills,roadmap,setRoadmap,assessments,setAssessments,interviews,setInterviews,resumeAnalysis,setResumeAnalysis,chatHistory,setChatHistory,activities,setActivities,readinessHistory,setReadinessHistory,resetDemo,addActivity}),[profile,authenticated,authLoading,syncError,authenticate,logout,theme,skills,roadmap,assessments,interviews,resumeAnalysis,chatHistory,activities,readinessHistory,resetDemo,addActivity])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp=()=>useContext(AppContext)
