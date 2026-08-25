import React from 'react';
import { FileDown, Printer, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const labels: Record<string,string> = {
  operatingParameters:'موازين الخامات والتشغيل (IPC)', ipcCompliance:'مطابقة أصناف IPC', defects:'عيوب الجودة',
  coreTemperatures:'درجات الحرارة والأوزان', metalDetector:'نقاط التحكم الحرجة', electricSieve:'الغربال الكهربائي',
  additiveWeights:'أوزان الإضافات', sensoryEvaluations:'التقييم الحسي وسلامة الغذاء', ncr:'عدم المطابقة (NCR)',
  sanitationLogs:'التطهير والنظافة', foodSafetyLogs:'اشتراطات سلامة الغذاء', releaseForms:'إذن الإفراج عن المنتج التام',
  productWeights:'مواصفات أوزان المنتجات'
};

const fields: Record<string,string> = {
  id:'المعرّف', date:'التاريخ', day:'اليوم', reportDate:'تاريخ التقرير', report_date:'تاريخ التقرير', bakerySection:'قسم المخبوزات',
  department:'القسم', decision:'القرار', notes:'ملاحظات', productName:'الصنف', product_name:'الصنف', product:'المنتج', productId:'كود الصنف', product_id:'كود الصنف', unit:'الوحدة',
  quantity:'الكمية', criterion:'المعيار', category:'التصنيف', createdAt:'تاريخ الإنشاء', created_at:'تاريخ الإنشاء', updatedAt:'تاريخ التحديث',
  updated_at:'تاريخ التحديث', closedAt:'تاريخ الإغلاق', closed_at:'تاريخ الإغلاق', archivedAt:'تاريخ الأرشفة', archived_at:'تاريخ الأرشفة',
  status:'الحالة', complianceStatus:'حالة المطابقة', compliance_status:'حالة المطابقة', name:'الاسم', code:'الكود', time:'الوقت', stage:'المرحلة',
  morningShift:'وردية الصباح', eveningShift:'وردية المساء', mandatoryConditions:'الشروط الإلزامية', rawMaterialsCompliant:'مطابقة الخامات',
  ccpOprpReportsCompliant:'مطابقة CCP/OPRP', labAnalysisCompliant:'مطابقة التحاليل المعملية', labelAndPackagingCompliant:'مطابقة البطاقات والتعبئة',
  customerRequirementsCompliant:'مطابقة متطلبات العميل', qaReleaseOfficerName:'مسؤول الإفراج', storekeeperName:'أمين المخزن', products:'المنتجات',
  reason:'سبب عدم المطابقة', savedAt:'وقت التسجيل', saved_at:'وقت التسجيل', verifiedBy:'تم التحقق بواسطة', verified_by:'تم التحقق بواسطة',
  responsiblePerson:'المسؤول', responsible_person:'المسؤول', correctiveAction:'الإجراء التصحيحي', corrective_action:'الإجراء التصحيحي',
  machineCode:'كود الماكينة', machine_code:'كود الماكينة', fryerCode:'كود القلاية', fryer_code:'كود القلاية', coreTemperature:'درجة حرارة المركز',
  temperature:'درجة الحرارة', duration:'المدة', isCompliant:'مطابق', is_compliant:'مطابق', packagingQuality:'جودة التعبئة', packaging_quality:'جودة التعبئة',
  afterStatus:'الحالة بعد الإجراء', beforeStatus:'الحالة قبل الإجراء', responsible:'المسؤول', score:'الدرجة', comments:'التعليقات', sampleCode:'كود العينة',
  sample_code:'كود العينة', inspectorName:'اسم المفتش', inspector_name:'اسم المفتش', reportId:'رقم التقرير', dailyReportId:'رقم التقرير اليومي',
  daily_report_id:'رقم التقرير اليومي', sectionsCompleted:'الأقسام المكتملة', sections_completed:'الأقسام المكتملة', totalSections:'إجمالي الأقسام',
  total_sections:'إجمالي الأقسام', createdBy:'أنشأه', created_by:'أنشأه', verified:'تم التحقق', verifiedAt:'وقت التحقق', verified_at:'وقت التحقق',
  defectType:'نوع العيب', defect_type:'نوع العيب', description:'وصف العيب', action:'الإجراء', severity:'درجة الخطورة', frequency:'التكرار', shift:'الوردية',
  criticalDeviation:'انحراف حرج', critical_deviation:'انحراف حرج', defectSummary:'تفاصيل العيوب', defect_summary:'تفاصيل العيوب'
};

const values: Record<string,string> = {
  archived:'مؤرشف', open:'مفتوح', closed:'مغلق', pending:'قيد الانتظار', pending_review:'قيد المراجعة', pass:'ناجح', passed:'مطابق',
  fail:'غير مطابق', failed:'غير مطابق', compliant:'مطابق', noncompliant:'غير مطابق', non_compliant:'غير مطابق', 'non-compliant':'غير مطابق',
  approved:'معتمد', rejected:'مرفوض', conforming:'مطابق', nonconforming:'غير مطابق', start:'بداية', mid:'منتصف', middle:'منتصف', end:'نهاية',
  final:'نهائي', bakery:'قسم المخبوزات', daily_product:'منتج يومي', dailyProduct:'منتج يومي', yes:'نعم', no:'لا', true:'نعم', false:'لا'
};

const label=(key:string)=>fields[key]||labels[key]||key.replace(/([A-Z])/g,' $1').replace(/_/g,' ').trim();
const display=(v:unknown):string=>{
  if(v===null||v===undefined||v==='') return '—';
  if(typeof v==='boolean') return v?'نعم':'لا';
  if(typeof v==='number') return String(v);
  if(typeof v==='string'){
    const direct=values[v]; if(direct) return direct;
    const n=v.trim().toLowerCase().replace(/-/g,'_'); if(values[n]) return values[n];
    return v.replace(/\bnon[_ -]?compliant\b/gi,'غير مطابق').replace(/\bcompliant\b/gi,'مطابق').replace(/\barchived\b/gi,'مؤرشف')
      .replace(/\bopen\b/gi,'مفتوح').replace(/\bclosed\b/gi,'مغلق').replace(/\bpending(?:[_ -]?review)?\b/gi,'قيد الانتظار')
      .replace(/\bapproved\b/gi,'معتمد').replace(/\brejected\b/gi,'مرفوض').replace(/\bstart\b/gi,'بداية').replace(/\bmid(dle)?\b/gi,'منتصف')
      .replace(/\bend\b/gi,'نهاية').replace(/\bpass(ed)?\b/gi,'مطابق').replace(/\bfail(ed)?\b/gi,'غير مطابق');
  }
  return String(v);
};

const asRows=(data:unknown):Record<string,unknown>[]=>Array.isArray(data)?data.filter(v=>v&&typeof v==='object') as Record<string,unknown>[]:[];
const hasData=(key:string,data:unknown)=>Array.isArray(data)?data.length>0:(!!data&&typeof data==='object'&&Object.keys(data as object).length>0);
const valueAt=(row:Record<string,unknown>,key:string):unknown=>{
  if(Object.prototype.hasOwnProperty.call(row,key)) return row[key];
  const camel=key.replace(/_([a-z])/g,(_,c)=>String(c).toUpperCase());
  if(Object.prototype.hasOwnProperty.call(row,camel)) return row[camel];
  const snake=key.replace(/[A-Z]/g,m=>`_${m.toLowerCase()}`);
  if(Object.prototype.hasOwnProperty.call(row,snake)) return row[snake];
  return undefined;
};

const defectFields: Array<[string,string]> = [
  ['oversize','زيادة الحجم'],['undersize','نقص الحجم'],['overweight','زيادة الوزن'],['underweight','نقص الوزن'],
  ['dark_color','لون داكن'],['light_color','لون فاتح'],['burnt_parts','أجزاء محروقة'],['deflated_product','منتج منكمش'],
  ['gaps_in_pieces','فراغات بين القطع'],['dry_product','منتج جاف'],['doughy_product','منتج عجيني'],['non_laminated','عدم التوريق'],
  ['bitter_taste','طعم مر'],['rancid_taste','طعم زنخ'],['filling_leakage','تسريب الحشوة'],['excess_filling','زيادة الحشوة'],
  ['insufficient_filling','نقص الحشوة'],['no_filling','بدون حشوة'],['heavy_texture','قوام ثقيل'],['light_texture','قوام خفيف'],
  ['excess_glaze','زيادة التغطية'],['insufficient_glaze','نقص التغطية'],['surface_spots','بقع سطحية'],['surface_peeling','تقشر السطح'],
  ['surface_cracks','تشقق السطح'],['foreign_matters','مواد غريبة'],['expiry_date_defect','عيب تاريخ الصلاحية'],
  ['sealing_defect','عيب الغلق'],['printing_defect','عيب الطباعة'],['undesired_smell','رائحة غير مرغوبة']
];
const summarizeDefect=(row:Record<string,unknown>):string=>{
  const details=defectFields.filter(([key])=>Number(valueAt(row,key)??0)>0).map(([key,name])=>`${name}: ${display(valueAt(row,key))}`);
  return details.length?details.join(' • '):'تم تسجيل الفحص بدون عيوب كمية محددة';
};

const StatusBadge:React.FC<{status?:unknown}>=({status})=>{const s=String(status??'');const bad=/non|غير|fail|مرفوض/i.test(s);return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${bad?'bg-rose-50 text-rose-700 border border-rose-200':'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{bad?<AlertTriangle className="w-3.5 h-3.5"/>:<CheckCircle2 className="w-3.5 h-3.5"/>}{display(status)}</span>};

const SimpleTable:React.FC<{rows:Record<string,unknown>[];columns:string[]}>=({rows,columns})=><div className="overflow-auto rounded-xl border border-slate-200"><table className="w-full min-w-[760px] text-sm border-collapse"><thead><tr className="bg-slate-50">{columns.map(k=><th key={k} className="border-b border-slate-200 px-3 py-3 text-right font-black text-slate-700 whitespace-nowrap">{label(k)}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i} className={i%2?'bg-slate-50/40':'bg-white'}>{columns.map(k=>{const v=valueAt(r,k);return <td key={k} className="border-b border-slate-100 px-3 py-3 align-top text-slate-700">{k==='status'||k==='complianceStatus'||k==='compliance_status'?<StatusBadge status={v}/>:typeof v==='object'&&v!==null?<span className="text-xs leading-6">{JSON.stringify(v)}</span>:display(v)}</td>})}</tr>)}</tbody></table></div>;

const renderSectionData=(key:string,data:unknown)=>{
  const rows=asRows(data);
  if(!rows.length) return <div className="py-8 text-center text-slate-400">لا توجد بيانات مسجلة لهذا القسم.</div>;
  if(key==='defects'){
    const normalized=rows.map(r=>({...r,defect_summary:summarizeDefect(r)}));
    return <SimpleTable rows={normalized} columns={['date','product_name','stage','time','defect_summary','status','critical_deviation']}/>;
  }
  if(key==='ipcCompliance') return <SimpleTable rows={rows} columns={['productName','status','reason','savedAt']}/>;
  if(key==='releaseForms'){
    const normalized=rows.map(r=>({...r,products:Array.isArray(r.products)?(r.products as any[]).map(p=>`${p?.productName??p?.product_name??'—'} (${p?.quantity??'—'} ${p?.unit??''})`).join('، '):'—'}));
    return <SimpleTable rows={normalized} columns={['date','day','decision','products','qaReleaseOfficerName','storekeeperName','notes']}/>;
  }
  if(key==='sanitationLogs'){
    const flat:Record<string,unknown>[]=[];rows.forEach(r=>(Array.isArray(r.items)?r.items:[]).forEach((item:any)=>flat.push({date:valueAt(r,'date'),equipmentName:item?.equipmentName??item?.equipment_name,equipmentCode:item?.equipmentCode??item?.equipment_code,morningShift:item?.morningShift?.startShift??item?.morning_shift?.startShift,eveningShift:item?.eveningShift?.startShift??item?.evening_shift?.startShift})));return flat.length?<SimpleTable rows={flat} columns={['date','equipmentName','equipmentCode','morningShift','eveningShift']}/>:<SimpleTable rows={rows} columns={['date','items']}/>;
  }
  if(key==='foodSafetyLogs'){
    const flat:Record<string,unknown>[]=[];rows.forEach(r=>(Array.isArray(r.checks)?r.checks:[]).forEach((c:any)=>flat.push({date:valueAt(r,'date'),category:c?.category,criterion:c?.criterion,morningShift:c?.morningShift?.startShift??c?.morning_shift?.startShift,eveningShift:c?.eveningShift?.startShift??c?.evening_shift?.startShift})));return flat.length?<SimpleTable rows={flat} columns={['date','category','criterion','morningShift','eveningShift']}/>:<SimpleTable rows={rows} columns={['date','checks']}/>;
  }
  if(key==='sensoryEvaluations') return <SimpleTable rows={rows} columns={['date','productName','sampleCode','score','comments','inspectorName']}/>;
  if(key==='ncr') return <SimpleTable rows={rows} columns={['date','status','responsiblePerson','correctiveAction','verifiedBy','comments']}/>;
  const cols=[...new Set(rows.flatMap(r=>Object.keys(r)))].filter(k=>!['id'].includes(k)).slice(0,12);return <SimpleTable rows={rows} columns={cols}/>;
};

const Section:React.FC<{sectionKey:string;title:string;data:unknown;onPrint:()=>void}>=({sectionKey,title,data,onPrint})=><section data-report-key={sectionKey} className="report-section bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-l from-slate-50 to-white flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><FileText className="w-5 h-5"/></div><h2 className="text-lg font-black text-slate-800">{title}</h2></div><button onClick={onPrint} className="no-print inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold hover:bg-slate-50"><Printer className="w-4 h-4"/>حفظ القسم PDF</button></div><div className="p-5">{renderSectionData(sectionKey,data)}</div></section>;

export const ArchivedReportViewer:React.FC<{reportDate:string;status:string;sectionsCompleted?:number;totalSections?:number;snapshot:Record<string,unknown>;engineerName:string}>=({reportDate,status,sectionsCompleted,totalSections,snapshot,engineerName})=>{
  const sections=Object.entries(snapshot).filter(([k,v])=>hasData(k,v));
  const rowCount=sections.reduce((n,[,v])=>n+(Array.isArray(v)?v.length:1),0);
  const defectRows=asRows(snapshot.defects).length;
  const nonCompliant=Object.entries(snapshot).reduce((n,[,v])=>n+asRows(v).filter(r=>/non|غير|fail/i.test(String(valueAt(r,'status')??valueAt(r,'complianceStatus')??''))).length,0);
  const reportCode='QC-IS-FM-01-06';
  const print=(only?:string)=>{
    const area=only?document.querySelector(`[data-report-key="${only}"]`):document.getElementById('archived-report-print-area');
    const html=area?.outerHTML||''; const win=window.open('','_blank','width=1200,height=900'); if(!win)return;
    const header=only?'':`<div class="report-header"><div><h1>التقرير اليومي للجودة — ${reportDate}</h1><p>الحالة: ${display(status)} | الأقسام: ${sectionsCompleted??0}/${totalSections??sections.length}</p></div><div><p><b>المهندس المسجل:</b> ${engineerName||'—'}</p><p><b>كود التقرير:</b> ${reportCode}</p></div></div>`;
    const footer=`<div class="pdf-footer"><span>كود التقرير: ${reportCode}</span><span>المهندس المسجل: ${engineerName||'—'}</span><span>تقرير مراقبة جودة يومي</span></div>`;
    win.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>التقرير اليومي للجودة - ${reportDate}</title><style>body{font-family:Arial,Tahoma,sans-serif;color:#172033;background:#fff;margin:18px 22px 55px;line-height:1.55;direction:rtl}.no-print{display:none!important}.report-header{display:flex;justify-content:space-between;gap:24px;border:1px solid #dbe2ea;border-radius:14px;padding:16px;margin-bottom:18px;background:#f8fafc}.report-header h1{margin:0 0 6px;font-size:22px}.report-section{border:1px solid #dbe2ea;border-radius:14px;margin:0 0 18px;overflow:hidden;break-inside:auto;page-break-inside:auto}.report-section>div:first-child{background:#f8fafc;border-bottom:1px solid #dbe2ea;padding:12px 14px}.report-section h2{font-size:17px;margin:0}.report-section>div:last-child{padding:14px}table{width:100%;border-collapse:collapse;font-size:10px;direction:rtl}th,td{border:1px solid #d8dee7;padding:6px 7px;text-align:right;vertical-align:top}th{background:#f1f5f9;font-weight:700}tr:nth-child(even) td{background:#fafbfd}.pdf-footer{position:fixed;bottom:0;left:0;right:0;border-top:1px solid #9aa5b1;background:#fff;padding:7px 0;font-size:9px;display:flex;justify-content:space-between;direction:rtl}@page{size:A4;margin:12mm 10mm 20mm}</style></head><body>${header}${html}${footer}</body></html>`);win.document.close();win.focus();setTimeout(()=>win.print(),400);
  };
  return <div className="space-y-5">
    <div className="no-print grid grid-cols-2 lg:grid-cols-4 gap-3"><div className="rounded-2xl border bg-white p-4"><div className="text-xs text-slate-500">الأقسام المسجلة</div><div className="text-2xl font-black mt-1">{sections.length}</div></div><div className="rounded-2xl border bg-white p-4"><div className="text-xs text-slate-500">إجمالي السجلات</div><div className="text-2xl font-black mt-1">{rowCount}</div></div><div className="rounded-2xl border bg-white p-4"><div className="text-xs text-slate-500">العيوب</div><div className="text-2xl font-black mt-1">{defectRows}</div></div><div className="rounded-2xl border bg-white p-4"><div className="text-xs text-slate-500">حالات غير مطابقة</div><div className="text-2xl font-black mt-1 text-rose-600">{nonCompliant}</div></div></div>
    <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4"><div><div className="font-black text-slate-800">التقرير اليومي للجودة — {reportDate}</div><div className="text-sm text-slate-500">المهندس المسجل: {engineerName||'—'} · الكود: {reportCode}</div></div><button onClick={()=>print()} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-600 text-white font-black shadow-sm hover:bg-rose-700"><FileDown className="w-5 h-5"/>تصدير التقرير كامل PDF</button></div>
    <div id="archived-report-print-area" className="space-y-5">{sections.map(([key,value])=><Section key={key} sectionKey={key} title={labels[key]||label(key)} data={value} onPrint={()=>print(key)}/>)}</div>
  </div>;
};
