const TAB_KEY='bakery-qc-active-tab';
const SECTION_KEY='bakery-qc-active-section';
const DATE_KEY='bakery-qc-active-date';
const DRAFT_PREFIX='bakery-qc-page-draft:';

const read=(key:string,fallback:string)=>{try{return localStorage.getItem(key)||fallback}catch{return fallback}};
const write=(key:string,value:string)=>{try{localStorage.setItem(key,value)}catch{}};

export const getPersistedTab=<T extends string>(fallback:T):T=>read(TAB_KEY,fallback) as T;
export const persistTab=(tab:string)=>write(TAB_KEY,tab);
export const getPersistedSection=(fallback:1|2):1|2=>{const value=read(SECTION_KEY,String(fallback));return value==='2'?2:1};
export const persistSection=(section:1|2)=>write(SECTION_KEY,String(section));
export const getPersistedDate=(fallback:string)=>read(DATE_KEY,fallback);
export const persistDate=(date:string)=>write(DATE_KEY,date);

const draftKey=()=>`${DRAFT_PREFIX}${location.pathname}:${read(TAB_KEY,'dashboard')}`;
const getControls=()=>Array.from(document.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('main input, main select, main textarea'));

const capture=()=>{const controls=getControls();if(!controls.length)return;const values=controls.map((el,index)=>({index,tag:el.tagName,type:(el as HTMLInputElement).type||'',value:(el as HTMLInputElement).value??'',checked:(el as HTMLInputElement).checked??false}));try{localStorage.setItem(draftKey(),JSON.stringify(values))}catch{}};

const nativeValueSetter=(el:HTMLInputElement|HTMLTextAreaElement,value:string)=>{const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set;if(setter)setter.call(el,value);else el.value=value};

const restore=()=>{try{const raw=localStorage.getItem(draftKey());if(!raw)return;const saved=JSON.parse(raw) as Array<{index:number;tag:string;type:string;value:string;checked:boolean}>;const controls=getControls();saved.forEach(item=>{const el=controls[item.index];if(!el)return;if(el instanceof HTMLInputElement&&['checkbox','radio'].includes(el.type)){el.checked=!!item.checked;el.dispatchEvent(new Event('change',{bubbles:true}));}else if(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement){nativeValueSetter(el,item.value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}else if(el instanceof HTMLSelectElement){el.value=item.value;el.dispatchEvent(new Event('change',{bubbles:true}));}})}catch{}}

export const clearCurrentPageDraft=()=>{try{localStorage.removeItem(draftKey())}catch{}};

export const installPagePersistence=()=>{const onInput=()=>capture();const onChange=()=>capture();const onSubmit=()=>{window.setTimeout(clearCurrentPageDraft,50)};document.addEventListener('input',onInput,true);document.addEventListener('change',onChange,true);document.addEventListener('submit',onSubmit,true);const timers=[50,150,350,700,1200].map(ms=>window.setTimeout(restore,ms));restore();return()=>{document.removeEventListener('input',onInput,true);document.removeEventListener('change',onChange,true);document.removeEventListener('submit',onSubmit,true);timers.forEach(window.clearTimeout)}};
