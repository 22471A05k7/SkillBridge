import React,{useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Radar,RadarChart,PolarGrid,PolarAngleAxis,ResponsiveContainer,BarChart,Bar,XAxis,YAxis,Tooltip,PieChart,Pie,Cell,LineChart,Line} from 'recharts'
import {ArrowRight,Clock3,CheckCircle2,Target,TrendingUp} from 'lucide-react'
import {useApp} from '../context/AppContext'
import {careerRoles} from '../data/careerRoles'
import {calculateGap} from '../utils/scoring'
export default function Dashboard(){
 const {profile,skills,roadmap,activities,readinessHistory}=useApp()
 const role=careerRoles.find(r=>r.title===profile.career)||careerRoles[0]; const gap=useMemo(()=>calculateGap(role,skills),[role,skills])
 const completed=roadmap.filter(t=>t.completed).length
 const pie=[{name:'Strong',value:gap.strong.length||skills.length},{name:'Missing',value:gap.missing.length},{name:'Weak',value:gap.weak.length}]
 const colors=['#6366f1','#f59e0b','#dbe1ea']
 const week=[{name:'M',hours:1},{name:'T',hours:2},{name:'W',hours:1.5},{name:'T',hours:2},{name:'F',hours:1},{name:'S',hours:3},{name:'S',hours:2}]
 const nextTasks=roadmap.slice(0,3)
 return <div><div className="page-heading"><div><span className="eyebrow">OVERVIEW</span><h1>Welcome back, {profile.name?.split(' ')[0]||'Learner'} 👋</h1><p>Here's how your career readiness is progressing.</p></div><Link className="btn primary" to="/app/roadmap">View roadmap <ArrowRight/></Link></div>
 <div className="goal-strip"><div><span>CAREER GOAL</span><b>{profile.career}</b></div><div className="goal-score"><b>{gap.readiness}%</b><span>Career readiness</span></div></div>
 <div className="stat-grid">{[['Career readiness',gap.readiness+'%','+8% this month',TrendingUp],['Total skills',skills.length,'Across 6 categories',Target],['Strong skills',gap.strong.length||skills.length,'Ready for matching roles',CheckCircle2],['Learning hours',profile.weeklyHours+'h','Weekly availability',Clock3]].map(([label,value,detail,Icon])=> <article className="stat-card" key={label}><div><span>{label}</span><b>{value}</b><small>{detail}</small></div><div className="stat-icon"><Icon/></div></article>)}</div>
 <div className="dashboard-grid"><section className="card readiness-card"><div className="card-head"><div><span>CAREER READINESS</span><h3>Progress overview</h3></div><Link to="/app/gap">View analysis</Link></div><div className="chart-height"><ResponsiveContainer width="100%" height="100%"><LineChart data={readinessHistory}><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip/><Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer></div></section>
 <section className="card"><div className="card-head"><div><span>SKILL DISTRIBUTION</span><h3>Your capabilities</h3></div></div><div className="chart-height pie-chart"><ResponsiveContainer><PieChart><Pie data={pie} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>{pie.map((_,i)=><Cell key={i} fill={colors[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></section>
 <section className="card">
  <div className="card-head"><div><span>SKILL COMPARISON</span><h3>Current vs required</h3></div></div>
  <div className="chart-height">
   <ResponsiveContainer>
    <RadarChart data={gap.radar}>
     <PolarGrid/>
     <PolarAngleAxis dataKey="skill" tick={{fontSize:10}}/>
     <Radar dataKey="target" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.25}/>
     <Radar dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45}/>
     <Tooltip/>
    </RadarChart>
   </ResponsiveContainer>
  </div>
 </section>
 <section className="card"><div className="card-head"><div><span>WEEKLY LEARNING</span><h3>Hours completed</h3></div></div><div className="chart-height"><ResponsiveContainer><BarChart data={week}><XAxis dataKey="name" axisLine={false} tickLine={false}/><YAxis hide/><Tooltip/><Bar dataKey="hours" fill="#818cf8" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></section></div>
 <div className="bottom-grid"><section className="card"><div className="card-head"><div><span>LEARNING ROADMAP</span><h3>Your next steps</h3></div><Link to="/app/roadmap">View all</Link></div>{nextTasks.map(t=><div className="activity-row" key={t.id}><span className={t.completed?'task-check done':'task-check'}><CheckCircle2/></span><div><b>{t.topic}</b><small>{t.estimatedHours}h · {t.difficulty}</small></div></div>)}{nextTasks.length===0&&<p className="empty-inline">Generate a roadmap to see your next learning tasks.</p>}</section>
 <section className="card"><div className="card-head"><div><span>ACTIVITY</span><h3>Recent updates</h3></div></div>{activities.slice(0,4).map((a,i)=><div className="activity-row" key={i}><span className="activity-dot"/><div><b>{a.title}</b><small>{a.time}</small></div></div>)}</section></div>
 </div>
}
