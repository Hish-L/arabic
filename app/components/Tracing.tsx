'use client';
import {useEffect,useRef,useState,type PointerEvent,type ReactNode} from 'react';
import LetterGuide from './LetterGuide';
export default function Tracing({fatha,toggle,hear,exit}:{fatha:boolean;toggle:ReactNode;hear:(index:number)=>void;exit:()=>void}){
 const [letter,setLetter]=useState(0),[strokes,setStrokes]=useState<string[]>([]);
 const pointer=useRef<number|null>(null);
 useEffect(()=>{const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[]);
 useEffect(()=>{pointer.current=null;setStrokes([])},[fatha]);
 function point(event:PointerEvent<SVGSVGElement>){const matrix=event.currentTarget.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());return `${Math.max(0,Math.min(1000,p.x)).toFixed(1)} ${Math.max(0,Math.min(760,p.y)).toFixed(1)}`}
 function begin(event:PointerEvent<SVGSVGElement>){if(pointer.current!==null||(event.pointerType==='mouse'&&event.button!==0))return;event.preventDefault();const p=point(event);if(!p)return;pointer.current=event.pointerId;event.currentTarget.setPointerCapture(event.pointerId);setStrokes(old=>[...old,`M ${p} L ${p}`])}
 function draw(event:PointerEvent<SVGSVGElement>){if(pointer.current!==event.pointerId)return;event.preventDefault();const p=point(event);if(p)setStrokes(old=>old.length?[...old.slice(0,-1),`${old[old.length-1]} L ${p}`]:old)}
 function end(event:PointerEvent<SVGSVGElement>){if(pointer.current!==event.pointerId)return;pointer.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}
 function clear(){pointer.current=null;setStrokes([])}
 return <section className="tracing-screen" aria-label="Letter tracing">
  <div className="tracing-toolbar"><button className="secondary" onClick={exit}>← Back</button>{toggle}<button className="secondary" onClick={()=>hear(letter)}>🔊 Listen</button><button className="secondary" onClick={clear}>↻ Clear</button><button className="primary" onClick={()=>{clear();setLetter(i=>1-i)}}>Next →</button></div>
  <p className="tracing-hint">Trace with your finger <span className="arabic" lang="ar">{letter===0?(fatha?'سَ':'س'):(fatha?'شَ':'ش')}</span></p>
  <svg className="tracing-canvas" viewBox="0 0 1000 760" aria-label={`Trace ${letter===0?'س':'ش'}${fatha?'َ':''} with a finger, stylus, or mouse`} onPointerDown={begin} onPointerMove={draw} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={()=>{pointer.current=null}}>
   <LetterGuide sheen={letter===1} fatha={fatha} trace/>
   <g fill="none" stroke="#1296c7" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" opacity=".85" pointerEvents="none">{strokes.map((d,i)=><path key={i} d={d}/>)}</g>
  </svg>
 </section>;
}
