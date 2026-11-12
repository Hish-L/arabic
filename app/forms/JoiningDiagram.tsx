'use client';
import {useLayoutEffect,useRef} from 'react';
import {formPositions,letterForm,type LetterPosition} from '../../lib/forms';
function Hand({side}:{side:'left'|'right'}){
 return <svg className={`joining-hand joining-hand-${side}`} viewBox="0 0 180 150" aria-hidden="true">
 <g transform={side==='right'?'translate(180 0) scale(-1 1)':undefined}>
 <path d="M176 55 L143 55 Q131 40 112 34 L74 8 Q62 3 57 13 Q52 22 65 31 L89 54 L30 37 Q16 33 13 44 Q10 54 26 58 L73 67 L15 62 Q1 61 1 73 Q1 84 15 85 L71 88 L17 90 Q3 91 5 102 Q7 112 21 111 L80 110 L43 121 Q30 126 34 136 Q38 145 52 140 L113 124 Q135 123 146 105 L176 105 Z" fill="#ffd3af" stroke="#b87755" strokeWidth="3" strokeLinejoin="round"/>
 <path d="M114 55 Q91 74 104 101 M91 73 Q112 72 127 85 M38 43 L36 52 M27 68 L26 79 M29 96 L29 105 M51 125 L55 134" fill="none" stroke="#d59c77" strokeWidth="2.5" strokeLinecap="round"/>
 <path d="M161 56 V104 H180 V56 Z" fill="#ffc44e" stroke="#d89a2a" strokeWidth="2"/>
 </g></svg>;
}
export default function JoiningDiagram({letter,position,fatha}:{letter:'س'|'ش';position:LetterPosition;fatha:boolean}){
 const form=formPositions.find(p=>p.id===position)!;
 const diagram=useRef<HTMLDivElement>(null),glyph=useRef<HTMLSpanElement>(null),baseline=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{
  let disposed=false,frame=0;
  function align(){
   if(disposed||!diagram.current||!glyph.current||!baseline.current)return;
   const style=getComputedStyle(glyph.current),context=document.createElement('canvas').getContext('2d');
   if(!context)return;
   context.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
   // The tatweel is the actual horizontal joining stroke in this font.
   const metrics=context.measureText('ـ');
   const joinY=baseline.current.getBoundingClientRect().top+(metrics.actualBoundingBoxDescent-metrics.actualBoundingBoxAscent)/2;
   diagram.current.querySelectorAll<SVGSVGElement>('.joining-hand').forEach(hand=>{
    const slot=hand.parentElement!.getBoundingClientRect();
    // Cuff spans y=56..104 in the hand's 150-unit viewBox; its centre is y=80.
    const wristY=slot.top+slot.height*(80/150);
    hand.style.transform=`translateY(${(joinY-wristY).toFixed(2)}px)`;
   });
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(align)}
  const observer=new ResizeObserver(schedule);
  if(diagram.current)observer.observe(diagram.current);
  if(glyph.current)observer.observe(glyph.current);
  document.fonts.ready.then(()=>{if(!disposed)schedule()});
  document.fonts.addEventListener('loadingdone',schedule);
  align();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.fonts.removeEventListener('loadingdone',schedule)};
 },[letter,position,fatha]);
 return <div ref={diagram} className={`joining-diagram joining-${position}`} role="img" aria-label={`${letterForm(letter,position,fatha)} — ${form.title}. ${form.hint}`}>
 <div className="hand-slot">{form.left&&<Hand side="left"/>}</div>
 <span ref={glyph} className="joining-letter arabic" lang="ar" dir="rtl">{letterForm(letter,position,fatha)}<span ref={baseline} className="joining-baseline" aria-hidden="true"/></span>
 <div className="hand-slot">{form.right&&<Hand side="right"/>}</div>
 </div>;
}
