export const levelValue={Beginner:1,Intermediate:2,Advanced:3,Expert:4}
export function calculateGap(role,skills){
 const map=Object.fromEntries(skills.map(s=>[s.name,s.level]))
 let score=0,total=0,matching=[],missing=[],weak=[],strong=[]
 Object.entries(role.required).forEach(([name,weight])=>{
  total+=weight
  const level=map[name], required=role.proficiency[name]||2
  if(!level){missing.push({name,weight,required});return}
  const current=levelValue[level]
  const ratio=Math.min(current/required,1)
  score+=weight*ratio
  if(ratio>=.75){matching.push({name,level,weight}); if(current>=required) strong.push(name)} else weak.push({name,level,required})
 })
 const readiness=Math.round(score/total*100)
 const radar=Object.keys(role.required).slice(0,7).map(name=>{
  const current=map[name]?levelValue[map[name]]*25:0
  const target=(role.proficiency[name]||2)*25
  return {skill:name,current:Math.min(current,100),target:Math.min(target,100)}
 })
 return {readiness,gap:100-readiness,matching,missing,weak,strong,radar}
}
