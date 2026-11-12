export const targetLetters = ['س', 'ش'] as const;
export const distractorLetters = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];
export function shuffled<T>(items: readonly T[]): T[] {
 const result=[...items];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
 return result;
}
export function newDeck(){return shuffled([0,0,0,1,1,1])}
export function listeningChoices(target:number):string[]{
 if(target!==0&&target!==1)throw new RangeError('Target must be Seen or Sheen');
 return shuffled([targetLetters[target],...shuffled(distractorLetters).slice(0,4)]);
}
