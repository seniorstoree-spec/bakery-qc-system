insert into public.roles (name,description,is_system) values
('Developer','صلاحيات مطلقة لإدارة التطبيق',true),('مهندس جودة','دور مهندس الجودة',true),('مشرف','دور المشرف',true),('رئيس قسم','دور رئيس القسم',true),('Senior','دور السينيور',true)
on conflict(name) do nothing;

insert into public.permissions (key,name,description) values
('app.full_access','صلاحيات مطلقة','إدارة كاملة للتطبيق'),
('sections.create','إضافة الأقسام','إضافة أقسام جديدة'),
('sections.update','تعديل الأقسام','تعديل الأقسام'),
('sections.delete','حذف الأقسام','حذف الأقسام'),
('users.manage','إدارة المستخدمين','إضافة وتعديل وحذف المستخدمين'),
('roles.manage','إدارة الأدوار والصلاحيات','إدارة الأدوار والصلاحيات'),
('content.manage','إدارة النصوص','إدارة النصوص'),
('theme.manage','إدارة المظهر','إدارة الخطوط والألوان'),
('branding.manage','إدارة الهوية','إدارة الشعار'),
('audit.read','مراجعة السجل','قراءة سجل العمليات')
on conflict(key) do nothing;

insert into public.role_permissions(role_id,permission_id)
select r.id,p.id from public.roles r cross join public.permissions p where r.name='Developer'
on conflict do nothing;

insert into public.app_sections(key,name,sort_order) values
('dashboard','لوحة التحكم',1),('ipc','الرقابة أثناء التشغيل',2),('defects','سجل العيوب',3),
('weights_temp','الأوزان ودرجات الحرارة',4),('ccp_oprp','CCP / OPRP',5),
('sensory_food_safety','التقييم الحسي وسلامة الغذاء',6),('product_release','إفراج المنتج',7)
on conflict(key) do nothing;
