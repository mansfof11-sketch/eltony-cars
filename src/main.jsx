import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, CarFront, Wallet, UsersRound, ChartNoAxesCombined, Search, Plus, Bell, Menu, X, ArrowDownLeft, ArrowUpRight, CircleDollarSign, Bike, ChevronLeft, Download, CalendarDays, CheckCircle2, Clock3, FileText, Settings, TrendingUp, HandCoins } from 'lucide-react';
import './style.css';

const initialVehicles = [
  { id: 1, name: 'تويوتا كورولا', type: 'عربية', year: '2020', plate: 'س م ن ٢٤٥', buyer: 'محمد أحمد', seller: 'عماد الحاج', buy: 150000, sell: 180000, date: '15/10/2026', status: 'تم البيع' },
  { id: 2, name: 'هيونداي فيرنا', type: 'عربية', year: '2017', plate: 'د ب ج ٨١٢', buyer: '—', seller: 'أبو ياسين', buy: 25000, sell: 0, date: '12/10/2026', status: 'في المعرض' },
  { id: 3, name: 'بي إم دبليو', type: 'موتوسيكل', year: '2022', plate: 'موتو ٣٥١', buyer: 'خالد سمير', seller: 'محمود السيد', buy: 80000, sell: 95000, date: '10/10/2026', status: 'تم البيع' },
  { id: 4, name: 'ياماها', type: 'موتوسيكل', year: '2023', plate: 'موتو ٩٠٢', buyer: '—', seller: 'أحمد علي', buy: 40000, sell: 0, date: '08/10/2026', status: 'في المعرض' },
];
const initialMoves = [
  { id: 1, title: 'تحصيل مقدم بيع تويوتا كورولا', category: 'تحصيل من عميل', amount: 60000, kind: 'in', date: '15/10/2026' },
  { id: 2, title: 'شراء هيونداي فيرنا', category: 'شراء مخزون', amount: 25000, kind: 'out', date: '12/10/2026' },
  { id: 3, title: 'مصاريف نقل وترخيص', category: 'مصروفات', amount: 2500, kind: 'out', date: '11/10/2026' },
  { id: 4, title: 'تحصيل قسط من عميل', category: 'تحصيل قسط', amount: 8000, kind: 'in', date: '10/10/2026' },
];
const initialPartners = [
  { id: 1, name: 'أحمد محمود', capital: 300000, added: 20000, profit: 24500, withdrawn: 10000, paid: 10000, note: 'نسبة حسب الاتفاق' },
  { id: 2, name: 'محمد علي', capital: 150000, added: 0, profit: 12250, withdrawn: 5000, paid: 5000, note: 'نسبة حسب الاتفاق' },
];
const money = n => new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 }).format(n || 0) + ' ج.م';

function App() {
  const [page, setPage] = useState('الرئيسية');
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [moves, setMoves] = useState(initialMoves);
  const [partners, setPartners] = useState(initialPartners);
  const [search, setSearch] = useState('');
  const [showVehicle, setShowVehicle] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  const sold = vehicles.filter(v => v.status === 'تم البيع');
  const stock = vehicles.filter(v => v.status === 'في المعرض');
  const totalProfit = sold.reduce((s,v) => s + v.sell - v.buy, 0);
  const cashBalance = 215500 + moves.reduce((s,m)=>s + (m.kind==='in'?m.amount:-m.amount),0) - 40500;
  const filteredVehicles = useMemo(() => vehicles.filter(v => [v.name,v.type,v.plate,v.seller,v.buyer].join(' ').toLowerCase().includes(search.toLowerCase())), [vehicles, search]);

  function notify(msg) { setToast(msg); setTimeout(()=>setToast(''), 3000); }
  function addVehicle(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const buy = Number(f.get('buy') || 0);
    const v = { id: Date.now(), name: f.get('name'), type: f.get('type'), year: f.get('year') || '—', plate: f.get('plate') || '—', seller: f.get('seller') || '—', buyer: '—', buy, sell: 0, date: new Date().toLocaleDateString('ar-EG'), status: 'في المعرض' };
    setVehicles(prev=>[v,...prev]); setShowVehicle(false); notify('تمت إضافة المركبة للنموذج بنجاح');
  }
  function addMove(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const m = { id: Date.now(), title: f.get('title'), category: f.get('category'), amount: Number(f.get('amount') || 0), kind: f.get('kind'), date: new Date().toLocaleDateString('ar-EG') };
    setMoves(prev=>[m,...prev]); setShowMove(false); notify('تمت إضافة الحركة للنموذج');
  }
  function addPartner(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const p = { id: Date.now(), name: f.get('name'), capital: Number(f.get('capital')||0), added: 0, profit: 0, withdrawn: 0, paid: 0, note: f.get('note') || 'يُحدد حسب الاتفاق' };
    setPartners(prev=>[p,...prev]); setShowPartner(false); notify('تمت إضافة الشخص للنموذج');
  }

  const nav = [
    ['الرئيسية', LayoutDashboard], ['السيارات والموتوسيكلات', CarFront], ['الخزنة', Wallet], ['حسابات الشركاء', UsersRound], ['التقارير', ChartNoAxesCombined]
  ];
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}>
      <div className="brand"><div className="brand-mark"><CarFront size={25}/></div><div><b>إدارة المعرض</b><small>نظام مبيعات وحسابات</small></div><button className="close-nav" onClick={()=>setMobileNav(false)}><X/></button></div>
      <div className="profile"><div className="avatar">م</div><div><b>مدير المعرض</b><small>حساب تجريبي للعرض</small></div><span className="online-dot"/></div>
      <div className="nav-label">القائمة الرئيسية</div>
      <nav>{nav.map(([name,Icon])=><button key={name} className={`nav-item ${page===name?'active':''}`} onClick={()=>{setPage(name);setMobileNav(false);setSearch('')}}><Icon size={19}/><span>{name}</span>{page===name&&<ChevronLeft size={16} className="nav-arrow"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><HandCoins size={20}/></div><b>محتاج مساعدة؟</b><p>التصميم ده نموذج أولي قابل للتعديل حسب طريقة شغلك.</p><button onClick={()=>notify('هنضيف بيانات التواصل في النسخة النهائية')}>اعرف أكتر <ChevronLeft size={14}/></button></div><div className="version">نسخة تجريبية للعرض <span>v0.1</span></div></div>
    </aside>
    {mobileNav && <div className="scrim" onClick={()=>setMobileNav(false)}/>}
    <main className="main">
      <header className="topbar"><button className="hamburger" onClick={()=>setMobileNav(true)}><Menu/></button><div className="crumb">لوحة التحكم <ChevronLeft size={14}/><b>{page}</b></div><div className="top-actions"><span className="today"><CalendarDays size={15}/> الثلاثاء، 13 أكتوبر 2026</span><button className="icon-button" onClick={()=>notify('لا توجد إشعارات جديدة')}><Bell size={19}/><i/></button><div className="mini-avatar">م</div></div></header>
      <div className="content">
        {page==='الرئيسية' && <Dashboard vehicles={vehicles} sold={sold} stock={stock} totalProfit={totalProfit} cashBalance={cashBalance} moves={moves} partners={partners} setPage={setPage} />}
        {page==='السيارات والموتوسيكلات' && <Vehicles vehicles={filteredVehicles} search={search} setSearch={setSearch} onAdd={()=>setShowVehicle(true)} />}
        {page==='الخزنة' && <Cashbox moves={moves} cashBalance={cashBalance} onAdd={()=>setShowMove(true)} />}
        {page==='حسابات الشركاء' && <Partners partners={partners} onAdd={()=>setShowPartner(true)} />}
        {page==='التقارير' && <Reports vehicles={vehicles} moves={moves} partners={partners} totalProfit={totalProfit} cashBalance={cashBalance} />}
        <footer>© 2026 إدارة المعرض <span>نموذج مبدئي — البيانات المعروضة تجريبية وليست حسابات حقيقية</span></footer>
      </div>
    </main>
    {showVehicle&&<Modal title="إضافة عربية / موتوسيكل" onClose={()=>setShowVehicle(false)}><form onSubmit={addVehicle} className="form-grid"><Field label="اسم المركبة" name="name" placeholder="مثال: تويوتا كورولا" required/><label className="field"><span>النوع</span><select name="type"><option>عربية</option><option>موتوسيكل</option></select></label><Field label="سنة الصنع" name="year" placeholder="2022"/><Field label="رقم اللوحة / الشاسيه" name="plate" placeholder="رقم المركبة"/><Field label="اسم البائع" name="seller" placeholder="اسم البائع"/><Field label="ثمن الشراء (ج.م)" name="buy" type="number" placeholder="0" required/><div className="form-actions"><button type="button" className="btn-light" onClick={()=>setShowVehicle(false)}>إلغاء</button><button className="btn-primary"><Plus size={17}/> حفظ المركبة</button></div></form></Modal>}
    {showMove&&<Modal title="إضافة حركة خزنة" onClose={()=>setShowMove(false)}><form onSubmit={addMove} className="form-grid"><Field label="بيان الحركة" name="title" placeholder="مثال: مصروف نقل" required/><label className="field"><span>نوع الحركة</span><select name="kind"><option value="in">إيراد / مبلغ داخل</option><option value="out">مصروف / مبلغ خارج</option></select></label><label className="field"><span>التصنيف</span><select name="category"><option>تحصيل من عميل</option><option>تحصيل قسط</option><option>شراء مخزون</option><option>مصروفات</option><option>إيداع رأس مال</option><option>سحب</option></select></label><Field label="المبلغ (ج.م)" name="amount" type="number" placeholder="0" required/><div className="form-actions"><button type="button" className="btn-light" onClick={()=>setShowMove(false)}>إلغاء</button><button className="btn-primary"><Plus size={17}/> حفظ الحركة</button></div></form></Modal>}
    {showPartner&&<Modal title="إضافة حساب شخص / شريك" onClose={()=>setShowPartner(false)}><form onSubmit={addPartner} className="form-grid"><Field label="اسم الشخص" name="name" placeholder="الاسم بالكامل" required/><Field label="رأس المال (ج.م)" name="capital" type="number" placeholder="0" required/><Field label="ملاحظات الاتفاق" name="note" placeholder="تُراجع تفاصيل الاتفاق"/><div className="note-box">نسبة الربح وطريقة توزيع الأرباح لا يتم افتراضهما في النموذج؛ يتم تحديدهما بعد توثيق الاتفاق.</div><div className="form-actions"><button type="button" className="btn-light" onClick={()=>setShowPartner(false)}>إلغاء</button><button className="btn-primary"><Plus size={17}/> إضافة الحساب</button></div></form></Modal>}
    {toast&&<div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </div>;
}
function Field({label,name,placeholder,type='text',required=false}) {return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required}/></label>}
function PageHeading({eyebrow,title,desc,action}) {return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>}
function Stat({label,value,sub,icon:Icon,tone='blue'}) {return <div className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={21}/></div></div><strong>{value}</strong><small>{sub}</small></div>}
function Dashboard({vehicles,sold,stock,totalProfit,cashBalance,moves,partners,setPage}) {
 const recent = [...moves].slice(0,4);
 return <><PageHeading eyebrow="نظرة عامة" title="أهلاً بيك في إدارة المعرض 👋" desc="تابع حركة المعرض والحسابات من مكان واحد." action={<button className="btn-primary" onClick={()=>setPage('السيارات والموتوسيكلات')}><Plus size={18}/> تسجيل حركة جديدة</button>}/>
 <div className="welcome-banner"><div className="welcome-copy"><span className="banner-pill"><span/> لوحة متابعة المعرض</span><h2>كل حساباتك في مكان واحد</h2><p>تابع المركبات والمبيعات والخزنة وحسابات الأشخاص بسهولة.</p><button onClick={()=>setPage('التقارير')}>عرض ملخص التقارير <ChevronLeft size={16}/></button></div><div className="banner-illustration"><div className="circle one"/><div className="circle two"/><CarFront size={100} strokeWidth={1.2}/><Bike size={48} strokeWidth={1.4}/></div></div>
 <div className="section-title"><div><h2>ملخص المعرض</h2><p>الأرقام المعروضة تجريبية لتوضيح شكل النظام.</p></div><span className="period"><CalendarDays size={15}/> ملخص عام</span></div>
 <div className="stats-grid"><Stat label="إجمالي المركبات" value={vehicles.length} sub="كل المركبات المسجلة" icon={CarFront}/><Stat label="تم البيع" value={sold.length} sub="مركبات تم تسجيل بيعها" icon={CheckCircle2} tone="green"/><Stat label="موجود في المعرض" value={stock.length} sub="مركبات لم تُبع بعد" icon={Bike} tone="purple"/><Stat label="أرباح البيع المبدئية" value={money(totalProfit)} sub="قبل المصاريف وأي تسويات" icon={TrendingUp} tone="orange"/></div>
 <div className="dashboard-columns"><section className="panel"><div className="panel-head"><div><h3>آخر حركات الخزنة</h3><p>أحدث المبالغ المسجلة في النموذج</p></div><button className="text-button" onClick={()=>setPage('الخزنة')}>عرض الكل <ChevronLeft size={15}/></button></div><div className="activity-list">{recent.map(m=><div className="activity-row" key={m.id}><div className={`activity-icon ${m.kind}`}>{m.kind==='in'?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}</div><div className="activity-main"><b>{m.title}</b><small>{m.category} · {m.date}</small></div><strong className={m.kind==='in'?'positive':'negative'}>{m.kind==='in'?'+':'−'}{money(m.amount)}</strong></div>)}</div></section>
 <section className="panel"><div className="panel-head"><div><h3>حسابات الأشخاص</h3><p>ملخص تجريبي لرأس المال والأرباح</p></div><button className="text-button" onClick={()=>setPage('حسابات الشركاء')}>عرض الحسابات <ChevronLeft size={15}/></button></div><div className="partner-mini-list">{partners.slice(0,3).map(p=><div className="partner-mini" key={p.id}><div className="avatar soft">{p.name.slice(0,1)}</div><div className="activity-main"><b>{p.name}</b><small>رأس المال: {money(p.capital+p.added)}</small></div><div className="partner-profit"><b>{money(p.profit)}</b><small>أرباح مسجلة تجريبيًا</small></div></div>)}</div><div className="disclaimer"><i/> الأرباح هنا أمثلة للعرض فقط، ويجب اعتماد طريقة الحساب حسب الاتفاق الفعلي.</div></section></div></>;
}
function Vehicles({vehicles,search,setSearch,onAdd}) {return <><PageHeading eyebrow="المخزون والمبيعات" title="السيارات والموتوسيكلات" desc="سجّل المركبات وتابع ثمن الشراء والبيع وحالة كل مركبة." action={<button className="btn-primary" onClick={onAdd}><Plus size={18}/> إضافة مركبة</button>}/><div className="toolbar"><div className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث باسم المركبة أو اللوحة أو الشخص..."/></div><span className="count-label">{vehicles.length} مركبة</span></div><div className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>المركبة</th><th>النوع</th><th>ثمن الشراء</th><th>ثمن البيع</th><th>الربح المبدئي</th><th>البائع</th><th>المشتري</th><th>الحالة</th></tr></thead><tbody>{vehicles.map(v=><tr key={v.id}><td><b>{v.name}</b><small className="cell-sub">{v.plate} · {v.year}</small></td><td>{v.type}</td><td>{money(v.buy)}</td><td>{v.sell?money(v.sell):'—'}</td><td>{v.sell?<b className="positive">{money(v.sell-v.buy)}</b>:'—'}</td><td>{v.seller}</td><td>{v.buyer}</td><td><span className={`badge ${v.status==='تم البيع'?'success':'info'}`}>{v.status}</span></td></tr>)}</tbody></table>{vehicles.length===0&&<div className="empty-state">مفيش نتائج مطابقة للبحث.</div>}</div></div><div className="tip-box"><FileText size={19}/><div><b>معلومة مهمة</b><p>الربح الظاهر هنا هو الفرق بين سعر البيع والشراء فقط، قبل خصم النقل والتصليح والعمولات وأي مصروفات أخرى.</p></div></div></>}
function Cashbox({moves,cashBalance,onAdd}) {const income=moves.filter(m=>m.kind==='in').reduce((s,m)=>s+m.amount,0), expense=moves.filter(m=>m.kind==='out').reduce((s,m)=>s+m.amount,0);return <><PageHeading eyebrow="الحسابات اليومية" title="الخزنة وحركة الأموال" desc="تابع المبالغ الداخلة والخارجة وسبب كل حركة." action={<button className="btn-primary" onClick={onAdd}><Plus size={18}/> إضافة حركة</button>}/><div className="stats-grid three"><Stat label="رصيد تجريبي" value={money(cashBalance)} sub="يحتاج مطابقته مع الرصيد الفعلي" icon={Wallet}/><Stat label="إجمالي المبالغ الداخلة" value={money(income)} sub="حسب الحركات الظاهرة هنا" icon={ArrowDownLeft} tone="green"/><Stat label="إجمالي المبالغ الخارجة" value={money(expense)} sub="حسب الحركات الظاهرة هنا" icon={ArrowUpRight} tone="orange"/></div><div className="panel table-panel"><div className="panel-head"><div><h3>سجل حركات الخزنة</h3><p>البيانات تجريبية لتجربة شكل الصفحة</p></div><button className="btn-light" onClick={()=>window.print()}><Download size={16}/> طباعة الصفحة</button></div><div className="table-wrap"><table><thead><tr><th>التاريخ</th><th>بيان الحركة</th><th>التصنيف</th><th>نوع الحركة</th><th>المبلغ</th></tr></thead><tbody>{moves.map(m=><tr key={m.id}><td>{m.date}</td><td><b>{m.title}</b></td><td>{m.category}</td><td><span className={`badge ${m.kind==='in'?'success':'danger'}`}>{m.kind==='in'?'مبلغ داخل':'مبلغ خارج'}</span></td><td className={m.kind==='in'?'positive':'negative'}><b>{m.kind==='in'?'+':'−'}{money(m.amount)}</b></td></tr>)}</tbody></table></div></div><div className="tip-box"><Wallet size={19}/><div><b>مهم قبل التشغيل الحقيقي</b><p>الرصيد النهائي لازم يُحسب من رصيد افتتاحي معتمد وكل الحركات المالية، مع منع تكرار الحركة وتسجيل من أضافها أو عدّلها.</p></div></div></>}
function Partners({partners,onAdd}) {return <><PageHeading eyebrow="رأس المال والحسابات" title="حسابات الأشخاص والشركاء" desc="تابع رأس المال والحركات والمبالغ المسجلة لكل شخص." action={<button className="btn-primary" onClick={onAdd}><Plus size={18}/> إضافة حساب</button>}/><div className="note-box wide-note">تنبيه: الأرقام والأرباح المعروضة تجريبية. لن يتم اعتماد طريقة توزيع الأرباح أو الخسائر إلا بعد تحديد الاتفاق الفعلي ومراجعته.</div><div className="stats-grid three"><Stat label="عدد الحسابات" value={partners.length} sub="أشخاص مسجلون في النموذج" icon={UsersRound}/><Stat label="إجمالي رأس المال" value={money(partners.reduce((s,p)=>s+p.capital+p.added,0))} sub="رأس المال والإضافات المسجلة" icon={CircleDollarSign} tone="purple"/><Stat label="أرباح مسجلة تجريبيًا" value={money(partners.reduce((s,p)=>s+p.profit,0))} sub="ليست حسابات نهائية" icon={TrendingUp} tone="green"/></div><div className="panel table-panel"><div className="panel-head"><div><h3>كشف حساب مبدئي</h3><p>يمكن توسيعه لاحقًا ليعرض كل حركة بالتاريخ والمستند</p></div></div><div className="table-wrap"><table><thead><tr><th>اسم الشخص</th><th>رأس المال</th><th>إضافات</th><th>أرباح مسجلة</th><th>مسحوبات</th><th>أرباح مدفوعة</th><th>ملاحظة</th></tr></thead><tbody>{partners.map(p=><tr key={p.id}><td><div className="person-cell"><div className="avatar soft">{p.name.slice(0,1)}</div><b>{p.name}</b></div></td><td>{money(p.capital)}</td><td>{money(p.added)}</td><td className="positive"><b>{money(p.profit)}</b></td><td>{money(p.withdrawn)}</td><td>{money(p.paid)}</td><td><span className="badge neutral">{p.note}</span></td></tr>)}</tbody></table></div></div><div className="tip-box"><UsersRound size={19}/><div><b>كشف الحساب النهائي</b><p>هنضيف تفاصيل الاتفاق، وتواريخ الإيداع والسحب، وتوزيع الربح والخسارة، وصافي المستحقات بعد ما صاحب المعرض يوضح طريقة الحساب.</p></div></div></>}
function Reports({vehicles,moves,partners,totalProfit,cashBalance}) {return <><PageHeading eyebrow="ملخصات ومراجعة" title="التقارير" desc="نظرة أولية على أهم الأرقام المسجلة في النموذج." action={<button className="btn-light" onClick={()=>window.print()}><Download size={17}/> طباعة / حفظ PDF</button>}/><div className="stats-grid"><Stat label="عدد المركبات" value={vehicles.length} sub="المخزون وحركة البيع" icon={CarFront}/><Stat label="الربح المبدئي من البيع" value={money(totalProfit)} sub="قبل المصروفات والتسويات" icon={TrendingUp} tone="green"/><Stat label="حركات الخزنة" value={moves.length} sub="حركات مسجلة في النموذج" icon={Wallet} tone="purple"/><Stat label="حسابات الأشخاص" value={partners.length} sub="أشخاص مسجلون" icon={UsersRound} tone="orange"/></div><div className="report-grid"><div className="panel report-card"><div className="report-icon"><CarFront/></div><h3>تقرير المخزون والمبيعات</h3><p>المركبات الموجودة، والمباعة، وأسعار الشراء والبيع والربح المبدئي.</p><button className="text-button" onClick={()=>window.print()}>طباعة ملخص <ChevronLeft size={15}/></button></div><div className="panel report-card"><div className="report-icon green"><Wallet/></div><h3>تقرير الخزنة</h3><p>المبالغ الداخلة والخارجة والحركات المسجلة والرصيد التجريبي.</p><b className="report-value">{money(cashBalance)}</b></div><div className="panel report-card"><div className="report-icon purple"><UsersRound/></div><h3>تقرير حسابات الأشخاص</h3><p>رأس المال والإضافات والأرباح والمسحوبات المسجلة تجريبيًا.</p><b className="report-value">{partners.length} حساب</b></div></div><div className="note-box wide-note">هذا نموذج واجهات فقط: البيانات تجريبية ومؤقتة داخل المتصفح، ولا يوجد حتى الآن تسجيل دخول حقيقي أو قاعدة بيانات أو اعتماد محاسبي. لا تستخدمه لتسجيل أموال المعرض الفعلية.</div></>}
function Modal({title,onClose,children}) {return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal"><div className="modal-head"><div><h2>{title}</h2><p>املأ البيانات المطلوبة ثم احفظها في النموذج التجريبي.</p></div><button className="icon-button" onClick={onClose}><X/></button></div>{children}</div></div>}
createRoot(document.getElementById('root')).render(<App/>);