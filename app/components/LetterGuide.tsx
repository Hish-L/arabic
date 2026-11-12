// A rounded handwriting guide shared by the tracing and dot activities.
export const letterBody = 'M 855 365 C 875 465 755 480 730 385 C 750 485 590 505 570 415 C 590 540 510 620 390 610 C 250 600 205 500 255 425';
export const dotPositions = [{x:710,y:135},{x:620,y:275},{x:800,y:275}];
export default function LetterGuide({sheen=false,fatha=false,trace=false}:{sheen?:boolean;fatha?:boolean;trace?:boolean}){
 const ink=trace?'#d9c9f2':'#7040b9';
 return <g aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
  <path d={letterBody} stroke={ink} strokeWidth={trace?68:38}/>
  {trace&&<path d={letterBody} stroke="#a98bcf" strokeWidth="3" strokeDasharray="8 12"/>}
  {sheen&&dotPositions.map(({x,y},i)=><circle key={i} cx={x} cy={y} r={27} fill={ink}/>)}
  {fatha&&<path d="M 655 65 L 755 30" stroke={ink} strokeWidth={trace?35:18}/>}
 </g>;
}
