export type LetterPosition = 'beginning' | 'middle' | 'end' | 'alone';
export const formPositions = [
 {id:'beginning',title:'Beginning',hint:'I hold the next letter.',left:true,right:false},
 {id:'middle',title:'Middle',hint:'I hold both neighbours.',left:true,right:true},
 {id:'end',title:'End',hint:'I hold the letter before me.',left:false,right:true},
 {id:'alone',title:'On my own',hint:'No hands to hold.',left:false,right:false},
] as const;
export function letterForm(letter:'س'|'ش',position:LetterPosition,fatha=false){
 const center=letter+(fatha?'َ':'');
 return (position==='middle'||position==='end'?'ـ':'')+center+(position==='beginning'||position==='middle'?'ـ':'');
}
