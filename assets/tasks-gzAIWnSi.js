import{cy as k,r as g,b as A,g as B,j as u,k as S}from"./index-DM-QqcYL.js";const h="tasks",K="todo",N="done",U="archive",I="taskGroups",C="YYYY-MM-DD HH:mm:ss",b="all",O=()=>({getItem:()=>{const i=JSON.parse(localStorage.getItem(I));return(i==null?void 0:i.length)?i:[]},setItem:i=>localStorage.setItem(I,JSON.stringify(i))}),{getItem:y,setItem:p}=O(),D={id:"all",name:"全部",checked:!0,edited:!1,color:"",isDeleted:!1},E=y();E.length||p([D]);const M=k("taskGroup",()=>{const e=g(y());return{tags:e,add:s=>(e.value.push(s),p(e.value),e),update:s=>(e.value=e.value.map(n=>n.id===s.id?{...n,...s}:n),p(e.value),e),remove:s=>(e.value=e.value.map(n=>n.id===s.id?{...n,isDeleted:!0}:n),p(e.value),s),checkTag:s=>{e.value=e.value.map(n=>(n.id===s.id?n.checked=!0:n.checked=!1,n))}}});var x={exports:{}};(function(e,m){(function(i,a){e.exports=a()})(A,function(){return function(i,a,l){a.prototype.isBetween=function(s,n,t,o){var r=l(s),c=l(n),f=(o=o||"()")[0]==="(",d=o[1]===")";return(f?this.isAfter(r,t):!this.isBefore(r,t))&&(d?this.isBefore(c,t):!this.isAfter(c,t))||(f?this.isBefore(r,t):!this.isAfter(r,t))&&(d?this.isAfter(c,t):!this.isBefore(c,t))}}})})(x);var w=x.exports;const R=B(w),j=()=>({getItem:()=>{const a=JSON.parse(localStorage.getItem(h));return(a==null?void 0:a.length)?a:[]},setItem:a=>{localStorage.setItem(h,JSON.stringify(a))},save2Local:a=>{const l="tasks.json",s=document.createElement("a"),n=new Blob([a],{type:"application/json"});s.style.display="none",s.download=l,s.href=URL.createObjectURL(n),document.body.appendChild(s),s.click(),URL.revokeObjectURL(s.href),document.body.removeChild(s)}}),G=j;u.extend(R);const{setItem:T,getItem:L}=G(),J=k(h,()=>{const e=g(L()),m=S(()=>t=>{var o;return t.id===b?e.value:(o=e.value)==null?void 0:o.filter(r=>r.groupTag===t.id)}),i=S(()=>t=>{var o;return(o=e.value)==null?void 0:o.filter(r=>r.id===t)[0]});return{tasks:e,tasksByGroupTag:m,tasksById:i,addTask:t=>{var o;return(o=e.value)==null||o.push(t),T(e.value),e},updateTask:t=>{var o;return e.value=(o=e.value)==null?void 0:o.map(r=>r.id===t.id?{...r,...t}:r),T(e.value),e},toTop:t=>{var o;if((o=e.value)!=null&&o.length){const r=e.value.findIndex(c=>c.id===t.id);t.isTop?(e.value=e.value.map(c=>(delete c.isTop,c)),e.value.splice(r,1),e.value.unshift(t)):(delete t.isTop,e.value[r]=t)}return T(e.value),e},searchTasks:(t,o)=>{const r="YYYY-MM-DD",{createTime:c="day"}=t,f=d=>{const v=u(d.createTime).format(r);if(c==="day")return u().isSame(v,"day");if(c==="weak")return u(v).isBetween(u(),u().subtract(7,"day"));if(c==="month")return u(v).isBetween(u(),u().subtract(30,"day"))};return o.filter(d=>f(d))}}});export{C as D,K as T,N as a,U as b,J as c,b as d,G as e,R as i,M as u};