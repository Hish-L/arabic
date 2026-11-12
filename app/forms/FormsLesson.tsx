'use client';
import {useState} from 'react';
import JoiningDiagram from './JoiningDiagram';
import {formPositions,letterForm} from '../../lib/forms';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH||'';
export default function FormsLesson(){
 const [letter,setLetter]=useState<'س'|'ش'>('س'),[fatha,setFatha]=useState(false);
 return <>
 <header className="app-bar forms-app-bar"><a className="brand no-underline text-inherit" href={`${basePath}/`}><span className="logo" aria-hidden="true">🌈</span><span>Seen &amp; Sheen</span></a><nav className="forms-nav" aria-label="Pages"><a className="secondary" href={`${basePath}/`}>← Games</a><a className="forms-link" aria-current="page" href={`${basePath}/forms/`}>👐 Forms</a></nav><button className="fatha-toggle" role="switch" aria-checked={fatha} aria-label="Fatḥa" onClick={()=>setFatha(value=>!value)}><span className="arabic" lang="ar">◌َ</span> Fatḥa <span className="toggle-track" aria-hidden="true"><span/></span></button></header>
 <main className="forms-shell">
 <div className="forms-intro"><h1>Letters hold hands!</h1><p>Arabic goes this way <span aria-label="right to left">←</span></p></div>
 <div className="letter-picker" role="group" aria-label="Choose a letter">{(['س','ش'] as const).map((value,i)=><button key={value} aria-pressed={letter===value} className={`letter-choice ${i===1?'pink':''}`} onClick={()=>setLetter(value)}><span className="arabic" lang="ar">{value}</span><span>{i===0?'Seen':'Sheen'}</span></button>)}</div>
 <div className="forms-grid">{formPositions.map((form,i)=><section className={`form-tile form-tile-${i}`} key={form.id} aria-labelledby={`form-${form.id}`}><div className="form-title"><h2 id={`form-${form.id}`}>{form.title}</h2><span className="form-sample arabic" lang="ar" dir="rtl" aria-hidden="true">{letterForm(letter,form.id,fatha)}</span></div><JoiningDiagram letter={letter} position={form.id} fatha={fatha}/><p>{form.hint}</p></section>)}</div>
 <details className="parent-note"><summary>For grown-ups</summary><p>The hands show joining directions, not the way to hold a pencil. Beginning forms join to the left; middle forms join both sides; ending forms join to the right. Some letters do not join to the next letter, so Seen or Sheen can appear in its standalone shape even inside a word. These cards show the connected forms.</p></details>
 </main></>;
}
