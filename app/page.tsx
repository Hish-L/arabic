'use client';
import {useEffect,useRef,useState} from 'react';
import Tracing from './components/Tracing';
import LetterGuide, {dotPositions} from './components/LetterGuide';
import {newDeck,listeningChoices} from '../lib/game';

const basePath=process.env.NEXT_PUBLIC_BASE_PATH||'';

type Mode='learn'|'play'|'hunt'|'dots'|'trace';
const letters=[{char:'س',fatha:'سَ',name:'Seen',sound:'sa',arabicName:'سِين',note:'No dots. Just a smile!'},{char:'ش',fatha:'شَ',name:'Sheen',sound:'sha',arabicName:'شِين',note:'Three dots on top!'}];
const activities:[Mode,string][]=[['learn','🔊 Listen'],['play','⭐ Play'],['hunt','🎧 Find'],['dots','🟣 Dots'],['trace','✍️ Trace']];
export default function Game(){
 const [mode,setMode]=useState<Mode>('learn'),[fatha,setFatha]=useState(false),[sound,setSound]=useState(true),[best,setBest]=useState(false),[round,setRound]=useState(0),[deck,setDeck]=useState([0,1,0,1,0,1]),[order,setOrder]=useState([0,1]),[answered,setAnswered]=useState(false),[dots,setDots]=useState<number[]>([]),[message,setMessage]=useState('');
 const filledDots=useRef<number[]>([]);
 const [choices,setChoices]=useState<string[]>([]);
 const [recordingsReady,setRecordingsReady]=useState(false);
 const player=useRef<HTMLAudioElement|null>(null);
 useEffect(()=>{const controller=new AbortController();Promise.all(['seen','sheen','sa','sha'].map(name=>fetch(`${basePath}/audio/${name}.wav`,{method:'HEAD',signal:controller.signal}).then(r=>r.ok))).then(results=>setRecordingsReady(results.every(Boolean))).catch(()=>{});return()=>controller.abort()},[]);
 const speechTimer=useRef<ReturnType<typeof setTimeout>|null>(null),request=useRef(0),utteranceRef=useRef<SpeechSynthesisUtterance|null>(null);
 const audio=useRef<AudioContext|null>(null),locked=useRef(false),nextButton=useRef<HTMLButtonElement>(null);

 useEffect(()=>{try{setBest(localStorage.getItem('seen-sheen-stars')==='6')}catch{}return()=>{request.current++;player.current?.pause();if(speechTimer.current)clearTimeout(speechTimer.current);window.speechSynthesis?.cancel();void audio.current?.close()}},[]);
 useEffect(()=>{if(answered)nextButton.current?.focus()},[answered]);
 function stopSpeech(){request.current++;player.current?.pause();if(speechTimer.current)clearTimeout(speechTimer.current);window.speechSynthesis?.cancel()}
 function reward(){if(!sound)return;try{const context=audio.current??new AudioContext();audio.current=context;void context.resume();[523,659,784].forEach((frequency,i)=>{const oscillator=context.createOscillator(),gain=context.createGain(),start=context.currentTime+i*.12;oscillator.connect(gain);gain.connect(context.destination);oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.07,start);gain.gain.exponentialRampToValueAtTime(.001,start+.22);oscillator.start(start);oscillator.stop(start+.23)})}catch{}}
 function hear(index:number,withFatha=fatha){
  if(!sound){setMessage('Tap 🔇 to turn sound on.');return}
  stopSpeech();setMessage('');const current=request.current;
  const synthesis=window.speechSynthesis;
  const speak=(useDefault=false)=>{
   if(current!==request.current)return;
   if(!synthesis){setMessage('Try Chrome for spoken audio.');return}
   const voices=synthesis.getVoices();const arabic=useDefault?undefined:voices.find(v=>v.lang.startsWith('ar'));
   const english=voices.find(v=>v.lang.startsWith('en')&&v.localService)||voices.find(v=>v.lang.startsWith('en'));
   const phrase=arabic?(withFatha?letters[index].fatha:letters[index].arabicName):(withFatha?(index===0?'sah':'shah'):(index===0?'seen':'sheen'));
   const utterance=new SpeechSynthesisUtterance(phrase);utteranceRef.current=utterance;
   utterance.lang=arabic?.lang||english?.lang||'en-US';if(arabic||english)utterance.voice=arabic||english!;
   utterance.rate=.75;utterance.pitch=1.12;utterance.volume=1;
   let began=false;
   utterance.onstart=()=>{began=true;if(speechTimer.current)clearTimeout(speechTimer.current)};
   utterance.onerror=()=>{if(current!==request.current)return;if(speechTimer.current)clearTimeout(speechTimer.current);if(!useDefault){speak(true)}else setMessage('Try Chrome for spoken audio.')};
   synthesis.resume();synthesis.speak(utterance);
   speechTimer.current=setTimeout(()=>{if(current!==request.current||began)return;utterance.onerror=null;synthesis.cancel();if(!useDefault)speak(true);else setMessage('Try Chrome for spoken audio.')},2500);
  };
  const name=withFatha?(index===0?'sa':'sha'):(index===0?'seen':'sheen');
  // Prefer optional recordings; fall back to browser speech when not generated yet.
  if(!recordingsReady){speak();return}
  const recording=new Audio(`${basePath}/audio/${name}.wav`);player.current=recording;
  void recording.play().catch(()=>{if(current===request.current)speak()});
 }
 function changeMode(value:Mode){
  stopSpeech();setMode(value);setMessage('');setAnswered(false);locked.current=false;
  if(value==='play'||value==='hunt'){
   const rounds=newDeck();setRound(0);setDeck(rounds);setOrder(Math.random()>.5?[0,1]:[1,0]);
   if(value==='hunt')setChoices(listeningChoices(rounds[0]));
   hear(rounds[0]);
  }
  if(value==='dots'){filledDots.current=[];setDots([])}
 }
 function choose(index:number){
  if(locked.current)return;
  if(index!==deck[round]){setMessage(mode==='hunt'?'Try again! Tap 🔊 to listen.':deck[round]===0?'Try no dots!':'Try three dots!');return}
  stopSpeech();locked.current=true;setAnswered(true);setMessage('Yes! ⭐');reward();
 }
 function next(){
  if(!locked.current)return;stopSpeech();const nextRound=round+1;
  setRound(nextRound);setAnswered(false);locked.current=false;setMessage('');setOrder(Math.random()>.5?[0,1]:[1,0]);
  if(nextRound===6){setBest(true);try{localStorage.setItem('seen-sheen-stars','6')}catch{}reward()}
  else {if(mode==='hunt')setChoices(listeningChoices(deck[nextRound]));hear(deck[nextRound])}
 }

 function addDot(index:number){
  if(filledDots.current.includes(index))return;
  const updated=[...filledDots.current,index];filledDots.current=updated;setDots(updated);
  setMessage(updated.length===3?'You did it! ⭐':`${updated.length} / 3`);if(updated.length===3)reward();
 }
 function resetDots(){filledDots.current=[];setDots([]);setMessage('')}
 function toggleFatha(){
  const enabled=!fatha;stopSpeech();setFatha(enabled);setMessage('');
  if((mode==='play'||mode==='hunt')&&round<6&&!answered)hear(deck[round],enabled);
 }
 function card(index:number,quiz=false){const letter=letters[index];return <button key={index} className={`letter-card ${index===1?'purple':''} ${quiz&&answered&&deck[round]===index?'correct':''}`} onClick={()=>quiz?choose(index):hear(index)} disabled={quiz&&answered} aria-label={quiz?(fatha?letter.fatha:letter.char):(fatha?letter.sound:letter.name)}><span className="speaker" aria-hidden="true">{quiz?'':'♫'}</span><span className="arabic big-letter" lang="ar">{fatha?letter.fatha:letter.char}</span>{!quiz&&<span className="card-name">{fatha?letter.sound:letter.name}</span>}</button>}
 const isQuiz=mode==='play'||mode==='hunt';
 const complete=isQuiz&&round===6;
 const fathaToggle=<button className="fatha-toggle" role="switch" aria-checked={fatha} aria-label="Fatḥa" onClick={toggleFatha}><span className="arabic" lang="ar">◌َ</span> Fatḥa <span className="toggle-track" aria-hidden="true"><span/></span></button>;
 if(mode==='trace')return <Tracing fatha={fatha} toggle={fathaToggle} hear={hear} exit={()=>changeMode('learn')}/>;
 return <>
 <div className="decoration" aria-hidden="true">✳</div><div className="decoration right" aria-hidden="true">✦</div>
 <header className="app-bar"><a className="brand no-underline text-inherit" href={`${basePath}/`}><span className="logo" aria-hidden="true">🌈</span><span>Seen &amp; Sheen</span></a><div className="activity-menu"><nav className="tabs" role="tablist" aria-label="Letter activities">{activities.map(([value,label],i)=><button key={value} id={`tab-${value}`} className="tab" role="tab" aria-selected={mode===value} tabIndex={mode===value?0:-1} aria-controls="panel" onClick={()=>changeMode(value)} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?activities.length-1:(i+(e.key==='ArrowRight'?1:activities.length-1))%activities.length;changeMode(activities[n][0]);document.getElementById(`tab-${activities[n][0]}`)?.focus()}}>{label}</button>)}</nav><a className="forms-link" href={`${basePath}/forms/`}>👐 Forms</a>{fathaToggle}</div><button className="sound" aria-label={sound?'Mute sound':'Turn sound on'} aria-pressed={sound} onClick={()=>{setSound(!sound);stopSpeech()}}>{sound?'🔊':'🔇'}</button></header>
 <main className="shell">

 <section className="stage" id="panel" role="tabpanel" aria-labelledby={`tab-${mode}`}>

 {mode==='learn'&&<><div className="text-center"><h1>{fatha?'Say sa. Say sha!':'Tap & listen!'}</h1></div><div className="cards">{card(0)}{card(1)}</div><div className="tip">{fatha?<><span className="arabic fatha-example" lang="ar">◌َ</span><b>Fatḥa = a</b></>:<><span lang="ar" className="arabic">س</span> No dots <span className="tip-divider">•</span><span lang="ar" className="arabic">ش</span> Three dots</>}</div></>}
 {isQuiz&&!complete&&<><div className="progress" aria-label={`${round+(answered?1:0)} of 6 stars earned`}>{Array.from({length:6},(_,i)=><span key={i} className={`star ${i<round+(answered?1:0)?'earned':''}`} aria-hidden="true">★</span>)}</div><div className="text-center"><h2>Listen & find!</h2><button className="secondary" onClick={()=>hear(deck[round])}>🔊 Listen</button></div>
 {mode==='hunt'?<div className="hunt-cards" role="group" aria-label="Choose the letter you hear">{choices.map((char,i)=><button key={`${round}-${char}`} className={`hunt-card hunt-color-${i} ${answered&&char===letters[deck[round]].char?'correct':''}`} disabled={answered} aria-label={fatha?`${char}َ`:char} onClick={()=>choose(letters.findIndex(letter=>letter.char===char))}><span className="arabic" lang="ar">{fatha?`${char}َ`:char}</span></button>)}</div>:<div className="cards">{order.map(i=>card(i,true))}</div>}</>}

 {complete&&<div className="complete"><div className="celebrate" aria-hidden="true">🌟🌱🌟</div><h2>You did it!</h2><div className="progress" aria-label="6 stars earned">⭐⭐⭐⭐⭐⭐</div><p className="my-5 arabic" lang="ar">{fatha?'سَ · شَ':'س · ش'}</p><button className="primary" onClick={()=>changeMode(mode)}>Play again ↻</button><div className="mt-4"><button className="secondary" onClick={()=>{if(fatha)changeMode('dots');else{setFatha(true);changeMode('learn')}}}>{fatha?'Add dots':'Try fatḥa →'}</button></div></div>}
 {mode==='dots'&&<div className="text-center"><h2>Add the dots!</h2><p className="hint">Tap 3 dots.</p><div className="dot-board"><svg viewBox="0 0 1000 760" aria-label="Add three dots to make Sheen"><LetterGuide fatha={fatha}/></svg>{dotPositions.map(({x,y},i)=><button key={i} className={`fill-dot ${dots.includes(i)?'filled':''}`} style={{left:`${x/10}%`,top:`${y/7.6}%`}} aria-label={`Dot ${i+1}`} aria-pressed={dots.includes(i)} onClick={()=>addDot(i)}><span aria-hidden="true"/></button>)}</div><button className="secondary" onClick={resetDots}>↻ Again</button></div>}

 {!complete&&<p className="feedback mt-4" role="status" aria-live="polite">{message}</p>}
 {mode==='learn'&&<div className="foot"><button className="primary" onClick={()=>changeMode('play')}>Play →</button></div>}
 {isQuiz&&!complete&&<div className="next-wrap">{answered&&<button ref={nextButton} className="primary" onClick={next}>{round===5?'My stars ★':'Next →'}</button>}</div>}

 </section><details className="parent-note"><summary>For grown-ups</summary><p>Chrome is recommended for spoken audio. Optional saved clips also work without browser speech. English voices use simple approximations: “seen,” “sheen,” “sah,” and “shah.”</p><p>{best?'Six-star badge earned!':'Tap a letter to listen. Fatḥa changes Seen to sa and Sheen to sha.'}</p></details></main></>;
}
