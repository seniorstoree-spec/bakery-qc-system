import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderBanner } from '../common/HeaderBanner';
import { CheckCircle2, ShieldCheck, UserCheck, Package, Archive, Loader2 } from 'lucide-react';
import { archiveReport, getOrCreateDailyReport } from '../../services/archiveService';
import { qualityFormPersistence } from '../../services/qualityPersistenceService';

export const ProductReleaseModule: React.FC = () => {
  const { activeSection, releaseFormB1, updateReleaseFormB1, releaseFormB2, updateReleaseFormB2, currentUser, activeDate } = useApp();
  const form = activeSection === 1 ? releaseFormB1 : releaseFormB2;
  const updateForm = activeSection === 1 ? updateReleaseFormB1 : updateReleaseFormB2;
  const [archiving,setArchiving]=useState(false);
  const [archiveSuccess,setArchiveSuccess]=useState(false);
  const [archiveError,setArchiveError]=useState('');

  const handleQaSignOff=()=>{
    if(!currentUser.permissions.canApproveRelease)return alert('تنبيه: يتطلب اعتماد إذن الإفراج النهائي صلاحيات مدير الجودة / رئيس قسم المراقبة.');
    const now=new Date().toISOString();
    void updateForm({decision:'approved',qaReleaseOfficerName:currentUser.name,qaReleaseOfficerSignature:currentUser.name,qaReleaseOfficerTimestamp:now});
  };

  const handleStorekeeperSignOff=()=>{
    if(form.decision!=='approved')return alert('تنبيه: لا يمكن لأمين المخزن استلام التشغيلة قبل اعتماد إذن الإفراج من إدارة الجودة.');
    const now=new Date().toISOString();
    void updateForm({storekeeperName:currentUser.name,storekeeperSignature:currentUser.name,storekeeperTimestamp:now});
  };

  const handleArchiveReport=async()=>{
    if(archiving)return;
    setArchiving(true); setArchiveError(''); setArchiveSuccess(false);
    try{
      const daily=await getOrCreateDailyReport(activeDate);
      const nextForm={...form,dailyReportId:daily.id};
      const saved=await qualityFormPersistence.saveRelease(nextForm);
      if(activeSection===1) await updateReleaseFormB1(saved); else await updateReleaseFormB2(saved);
      await archiveReport(daily.id);
      setArchiveSuccess(true);
    }catch(error){
      console.error('Archive report failed',error);
      setArchiveError(error instanceof Error?error.message:'تعذر تخزين التقرير في الأرشيف');
    }finally{setArchiving(false);}
  };

  return <div className="space-y-6 animate-fadeIn pb-12">
    <HeaderBanner title="إذن الإفراج عن المنتج التام (Finished Product Release Approval)" subtitle="الاعتماد الإلكتروني للإفراج والتخزين والتسليم" docCode="QC-IS-FM-01-16" revNo="0" date={activeDate}/>

    {archiveSuccess&&<div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-bold"><CheckCircle2 className="w-5 h-5"/><span>تم التخزين في الأرشيف بنجاح.</span></div>}
    {archiveError&&<div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 font-bold">تعذر تخزين التقرير في الأرشيف: {archiveError}</div>}

    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><div className="flex items-center gap-2 text-emerald-700 font-extrabold"><Archive className="w-5 h-5"/><span>تخزين التقرير بالكامل في الأرشيف</span></div><p className="text-xs text-slate-500 mt-1">يتم حفظ بيانات إذن الإفراج وربطها بالتقرير اليومي قبل نقل التقرير للأرشيف.</p></div>
        <button type="button" onClick={handleArchiveReport} disabled={archiving} className="min-w-56 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-60">{archiving?<Loader2 className="w-4 h-4 animate-spin"/>:<Archive className="w-4 h-4"/>}<span>{archiving?'جارٍ التخزين...':'تخزين التقرير في الأرشيف'}</span></button>
      </div>
    </div>

    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
      <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600"/><h2 className="font-extrabold">إذن الإفراج عن المنتج التام</h2></div>
      <div className="mt-4 text-sm">التاريخ: <b>{activeDate}</b> — الحالة: <b>{form.decision}</b> — عدد الأصناف: <b>{form.products.length.toLocaleString('en-US')}</b></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900"><div className="font-bold flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-600"/>اعتماد الجودة</div><button onClick={handleQaSignOff} className="mt-3 w-full p-3 rounded-xl bg-emerald-600 text-white font-bold">اعتماد إذن الإفراج النهائي</button></div>
      <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900"><div className="font-bold flex items-center gap-2"><Package className="w-4 h-4 text-blue-600"/>استلام المخزن</div><button onClick={handleStorekeeperSignOff} disabled={form.decision!=='approved'} className="mt-3 w-full p-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50">تأكيد استلام التشغيلة</button></div>
    </div>
  </div>;
};
