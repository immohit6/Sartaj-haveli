/* Sartaj Royal Group: shared script for every page. Content comes from the database (edited in /admin), with site-content.json as a fallback. */
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function validId(x){return typeof x==='string'&&(/^https:\/\/[\w.\-]+\/[\w\-\/.%]{1,300}$/.test(x)||(/^[\w\-\/.]{1,120}\.(jpe?g|png|webp|avif)$/i.test(x)&&x.indexOf('..')<0))}
  function pUrl(x){return x}
  var SB=window.SRG_SB||{}, SBOK=!!(SB.url&&SB.anonKey&&/^https:\/\//.test(SB.url)); if(SBOK)SB.url=SB.url.replace(/\/+$/,'');
  function sbH(extra){var h={apikey:SB.anonKey,Authorization:'Bearer '+SB.anonKey}; if(extra)for(var k in extra)h[k]=extra[k]; return h}
  function digits(s){return String(s||'').replace(/\D/g,'')}
  function clone(o){return JSON.parse(JSON.stringify(o))}
  function pad2(n){return (n<10?'0':'')+n}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function inr(n){return '₹'+Math.round(n).toLocaleString('en-IN')}
  function todayISO(){var t=new Date();return t.getFullYear()+'-'+pad2(t.getMonth()+1)+'-'+pad2(t.getDate())}
  function lc1(s){return /^[A-Z][a-z]/.test(s)?s.charAt(0).toLowerCase()+s.slice(1):s}
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- settings (same shape the admin page edits) ---------- */
  var F4=function(a,b,c,d){return [a,b,c,d].map(function(x){return {v:x[0],l:x[1]}})};
  var DEF={
    brand:'Sartaj Royal Group', tagline:'Weddings, functions and fine dining.',
    wa:'', phone:'', email:'', address:'', hours:'', maps:'', formUrl:'',
    promo:'Now planning weddings for the 2026 to 2027 season.',
    flags:{prices:false,cap:false,cal:false,menu:false},
    media:{hero:'',heroVideo:'',dish:'',baBefore:'',baAfter:'',tour:''},
    gallery:[], reviews:[],
    stats:{events:'',since:'',rating:''}, ig:{handle:'',link:''},
    story:{title:'Four venues. One family.',text:'',name:'',role:'',photo:''},
    faq:[{q:'Can we bring our own decorator?',a:''},{q:'What time does the music have to stop?',a:''},{q:'Is alcohol allowed?',a:''},{q:'How much advance do we pay, and can we cancel?',a:''},{q:'Are rooms available for family?',a:''},{q:'Do you cater Jain or other special diets?',a:''}],
    sale:{on:false,name:'',pct:10,start:'',end:'',text:''},
    plates:[
      {name:'Silver',price:800,items:['Veg menu, 6 items','Hall and basic lighting','Welcome drinks']},
      {name:'Gold',price:1200,items:['Veg and non-veg, 10 items','Stage and themed decor','Welcome drinks and dessert']},
      {name:'Royal',price:1800,items:['Full menu, live counters','Premium decor and lighting','Dedicated event manager']}
    ],
    addons:[{name:'Extra decor',fee:150000,per:false},{name:'DJ and sound',fee:40000,per:false},{name:'Photo and video',fee:90000,per:false},{name:'Live chaat counter',fee:150,per:true}],
    menu:[{n:'Paneer Tikka',k:'Veg',p:''},{n:'Dal Makhani',k:'Veg',p:''},{n:'Sarson da Saag',k:'Veg',p:''},{n:'Butter Chicken',k:'Non-veg',p:''},{n:'Amritsari Fish',k:'Non-veg',p:''},{n:'Mutton Rogan Josh',k:'Non-veg',p:''}],
    venues:[
      {name:'Sartaj Haveli',short:'Sartaj Haveli',kind:'Banquet hall and restaurant',blurb:'Dine in a heritage haveli, or take over the whole banquet hall for the evening. One kitchen, one team, both sides of your celebration.',about:'',city:'',address:'',photo:'',gallery:[],facts:F4(['','Guests'],['','Halls'],['Daily','Lunch and dinner'],['','Parking']),cap:{b:300,t:400,c:450},booked:[]},
      {name:'Kings Villa Palace',short:'Kings Villa',kind:'Weddings and functions',blurb:'Open lawns, a grand stage and room for the biggest guest lists. Built for the wedding you have been picturing for years.',about:'',city:'',address:'',photo:'',gallery:[],facts:F4(['','Guests'],['','Cars parked'],['','Suites'],['','Halls']),cap:{b:1000,t:1400,c:1500},booked:[]},
      {name:'Grand Marrie Villa Palace',short:'Grand Marrie',kind:'Weddings and functions',blurb:'A chandelier hall for receptions and engagements that feel intimate and still look grand.',about:'',city:'',address:'',photo:'',gallery:[],facts:F4(['','Guests'],['','Halls'],['','Suites'],['','Parking']),cap:{b:600,t:800,c:900},booked:[]},
      {name:'Victoria Palace',short:'Victoria Palace',kind:'Weddings and functions',blurb:'A palace setting for weddings and family functions, styled the way you want it, down to the last detail.',about:'',city:'',address:'',photo:'',gallery:[],facts:F4(['','Guests'],['','Halls'],['','Cars parked'],['','Suites']),cap:{b:500,t:700,c:800},booked:[]}
    ]
  };
  DEF.venues.forEach(function(v){v.pa='';v.hi='';v.best='';v.price='';v.parking='';v.rooms='';v.ac='';v.landmark='';v.tour=''});
  function merge(a,b){
    if(Array.isArray(b))return clone(b);
    if(b&&typeof b==='object'&&a&&typeof a==='object'&&!Array.isArray(a)){
      var o={}; Object.keys(a).forEach(function(k){o[k]=a[k]});
      Object.keys(b).forEach(function(k){o[k]=(k in a)?merge(a[k],b[k]):b[k]}); return o;
    }
    return b===undefined?a:b;
  }
  function build(j){
    j=(j&&typeof j==='object')?j:{};
    var c=merge(DEF,j);
    c.venues=DEF.venues.map(function(d,i){var v=merge(d,(j.venues&&j.venues[i])||{}); while(v.facts.length<4)v.facts.push({v:'',l:''}); v.facts=v.facts.slice(0,4); return v});
    c.plates=DEF.plates.map(function(d,i){return merge(d,(j.plates&&j.plates[i])||{})});
    ['addons','menu','reviews','gallery','faq'].forEach(function(k){if(!Array.isArray(j[k]))c[k]=clone(DEF[k])});
    return c;
  }
  var CFG=build({}), LANG='en';
  try{var sl=localStorage.getItem('srg_lang'); if(/^(en|pa|hi)$/.test(sl||''))LANG=sl}catch(x){}
  var PGEL=document.querySelector('[data-page]'), PAGE=PGEL.getAttribute('data-page')||'home', VI=+(PGEL.getAttribute('data-venue')||0);
  var HREF=['sartaj-haveli.html','kings-villa-palace.html','grand-marrie-villa-palace.html','victoria-palace.html'];
  var SHEETBG=['linear-gradient(160deg,#1C6354,#0B2F27)','linear-gradient(160deg,#124A3D,#06120F)','linear-gradient(160deg,#5E4814,#0B2F27)','linear-gradient(160deg,#16221E,#0B2F27)'];
  var LOC={en:'en-AU',pa:'pa-IN',hi:'hi-IN'};

  /* ---------- language ---------- */
  var D={
    'Now planning weddings for the 2026 to 2027 season.':['ਹੁਣ 2026 ਤੋਂ 2027 ਦੇ ਵਿਆਹਾਂ ਦੇ ਸੀਜ਼ਨ ਲਈ ਬੁਕਿੰਗ ਚੱਲ ਰਹੀ ਹੈ।','अब 2026 से 2027 के शादी सीज़न की बुकिंग चल रही है।'],
    'Check date':['ਤਾਰੀਖ਼ ਪੁੱਛੋ','तारीख़ पूछें'],
    'Venues':['ਵੈਨਿਊ','वेन्यू'],'Planner':['ਪਲੈਨਰ','प्लानर'],'Packages':['ਪੈਕੇਜ','पैकेज'],'Calendar':['ਕੈਲੰਡਰ','कैलेंडर'],'Dining':['ਖਾਣਾ','भोजन'],
    'Weddings · Functions · Fine dining':['ਵਿਆਹ · ਸਮਾਗਮ · ਸ਼ਾਨਦਾਰ ਖਾਣਾ','शादी · समारोह · शानदार भोजन'],
    'Four venues. One family of hosts. Choose the palace that suits your guests, your date and the day you have pictured.':['ਚਾਰ ਵੈਨਿਊ। ਇੱਕ ਪਰਿਵਾਰ ਦੀ ਮੇਜ਼ਬਾਨੀ। ਆਪਣੇ ਮਹਿਮਾਨਾਂ, ਤਾਰੀਖ਼ ਅਤੇ ਸੁਪਨਿਆਂ ਦੇ ਦਿਨ ਮੁਤਾਬਕ ਆਪਣਾ ਮਹਿਲ ਚੁਣੋ।','चार वेन्यू। मेज़बानों का एक परिवार। अपने मेहमानों, तारीख़ और सपनों के दिन के हिसाब से अपना महल चुनें।'],
    'Plan my event':['ਮੇਰਾ ਸਮਾਗਮ ਪਲੈਨ ਕਰੋ','मेरा आयोजन प्लान करें'],
    'Book a table':['ਟੇਬਲ ਬੁੱਕ ਕਰੋ','टेबल बुक करें'],
    'Weddings':['ਵਿਆਹ','शादियाँ'],'Engagements':['ਮੰਗਣੀਆਂ','सगाइयाँ'],'Receptions':['ਰਿਸੈਪਸ਼ਨ','रिसेप्शन'],'Fine dining':['ਸ਼ਾਨਦਾਰ ਖਾਣਾ','शानदार भोजन'],'Family functions':['ਪਰਿਵਾਰਕ ਸਮਾਗਮ','पारिवारिक समारोह'],
    'Banquet hall and restaurant':['ਬੈਂਕੁਇਟ ਹਾਲ ਅਤੇ ਰੈਸਟੋਰੈਂਟ','बैंक्वेट हॉल और रेस्टोरेंट'],
    'Weddings and functions':['ਵਿਆਹ ਅਤੇ ਸਮਾਗਮ','शादी और समारोह'],
    'Dine in a heritage haveli, or take over the whole banquet hall for the evening. One kitchen, one team, both sides of your celebration.':['ਵਿਰਾਸਤੀ ਹਵੇਲੀ ਵਿੱਚ ਖਾਣੇ ਦਾ ਆਨੰਦ ਲਓ, ਜਾਂ ਸ਼ਾਮ ਲਈ ਪੂਰਾ ਬੈਂਕੁਇਟ ਹਾਲ ਆਪਣੇ ਨਾਮ ਕਰਵਾਓ। ਇੱਕ ਰਸੋਈ, ਇੱਕ ਟੀਮ, ਤੁਹਾਡੇ ਜਸ਼ਨ ਦੇ ਦੋਵੇਂ ਪਾਸੇ।','विरासती हवेली में भोजन का आनंद लें, या शाम के लिए पूरा बैंक्वेट हॉल अपने नाम कर लें। एक रसोई, एक टीम, आपके जश्न के दोनों रंग।'],
    'Open lawns, a grand stage and room for the biggest guest lists. Built for the wedding you have been picturing for years.':['ਖੁੱਲ੍ਹੇ ਲਾਅਨ, ਸ਼ਾਨਦਾਰ ਸਟੇਜ ਅਤੇ ਸਭ ਤੋਂ ਵੱਡੀ ਮਹਿਮਾਨ ਸੂਚੀ ਲਈ ਥਾਂ। ਉਸ ਵਿਆਹ ਲਈ ਬਣਿਆ ਜਿਸਦਾ ਸੁਪਨਾ ਤੁਸੀਂ ਸਾਲਾਂ ਤੋਂ ਵੇਖਿਆ ਹੈ।','खुले लॉन, भव्य स्टेज और सबसे बड़ी मेहमान सूची के लिए जगह। उस शादी के लिए बना, जिसका सपना आपने सालों से देखा है।'],
    'A chandelier hall for receptions and engagements that feel intimate and still look grand.':['ਰਿਸੈਪਸ਼ਨ ਅਤੇ ਮੰਗਣੀਆਂ ਲਈ ਝੂਮਰਾਂ ਵਾਲਾ ਹਾਲ, ਜੋ ਆਪਣਾਪਨ ਵੀ ਦਿੰਦਾ ਹੈ ਅਤੇ ਸ਼ਾਨਦਾਰ ਵੀ ਲੱਗਦਾ ਹੈ।','रिसेप्शन और सगाई के लिए झूमरों वाला हॉल, जो अपनापन भी देता है और भव्य भी लगता है।'],
    'A palace setting for weddings and family functions, styled the way you want it, down to the last detail.':['ਵਿਆਹਾਂ ਅਤੇ ਪਰਿਵਾਰਕ ਸਮਾਗਮਾਂ ਲਈ ਮਹਿਲ ਵਰਗਾ ਮਾਹੌਲ, ਤੁਹਾਡੀ ਪਸੰਦ ਮੁਤਾਬਕ ਸਜਾਇਆ, ਹਰ ਛੋਟੀ ਗੱਲ ਤੱਕ।','शादियों और पारिवारिक समारोहों के लिए महल जैसा माहौल, आपकी पसंद के मुताबिक़ सजा हुआ, हर छोटी बात तक।'],
    'Guests':['ਮਹਿਮਾਨ','मेहमान'],'Halls':['ਹਾਲ','हॉल'],'Cars parked':['ਗੱਡੀਆਂ ਦੀ ਪਾਰਕਿੰਗ','गाड़ियों की पार्किंग'],'Suites':['ਸੂਟ','सूट'],'Daily':['ਰੋਜ਼ਾਨਾ','रोज़ाना'],'Lunch and dinner':['ਦੁਪਹਿਰ ਅਤੇ ਰਾਤ ਦਾ ਖਾਣਾ','दोपहर और रात का भोजन'],'Parking':['ਪਾਰਕਿੰਗ','पार्किंग'],
    'Explore Sartaj Haveli':['Sartaj Haveli ਵੇਖੋ','Sartaj Haveli देखें'],'Explore Kings Villa':['Kings Villa ਵੇਖੋ','Kings Villa देखें'],'Explore Grand Marrie':['Grand Marrie ਵੇਖੋ','Grand Marrie देखें'],'Explore Victoria Palace':['Victoria Palace ਵੇਖੋ','Victoria Palace देखें'],
    'Celebrations':['ਸਮਾਗਮ','समारोह'],'Whatever the occasion,':['ਮੌਕਾ ਕੋਈ ਵੀ ਹੋਵੇ,','मौक़ा कोई भी हो,'],'we have the room.':['ਸਾਡੇ ਕੋਲ ਥਾਂ ਹੈ।','हमारे पास जगह है।'],
    'Birthdays and parties':['ਜਨਮਦਿਨ ਅਤੇ ਪਾਰਟੀਆਂ','जन्मदिन और पार्टियाँ'],'Corporate events':['ਕਾਰਪੋਰੇਟ ਸਮਾਗਮ','कॉर्पोरेट आयोजन'],'Dinner for two, or two hundred':['ਦੋ ਜਣਿਆਂ ਲਈ ਡਿਨਰ, ਜਾਂ ਦੋ ਸੌ ਲਈ','दो के लिए डिनर, या दो सौ के लिए'],
    'From the milni to the vidaai, hosted properly.':['ਮਿਲਣੀ ਤੋਂ ਲੈ ਕੇ ਵਿਦਾਈ ਤੱਕ, ਪੂਰੇ ਸਲੀਕੇ ਨਾਲ।','मिलनी से लेकर विदाई तक, पूरे सलीक़े से।'],
    'Rings, family and a table that feels warm.':['ਮੁੰਦਰੀਆਂ, ਪਰਿਵਾਰ ਅਤੇ ਅਪਣੱਤ ਭਰਿਆ ਮਾਹੌਲ।','अंगूठियाँ, परिवार और अपनेपन से भरा माहौल।'],
    'Big guest lists, stage, music and a long dinner service.':['ਵੱਡੀ ਮਹਿਮਾਨ ਸੂਚੀ, ਸਟੇਜ, ਸੰਗੀਤ ਅਤੇ ਲੰਮਾ ਡਿਨਰ।','बड़ी मेहमान सूची, स्टेज, संगीत और लंबा डिनर।'],
    'Milestones, anniversaries and family get-togethers.':['ਖ਼ਾਸ ਪੜਾਅ, ਵਰ੍ਹੇਗੰਢਾਂ ਅਤੇ ਪਰਿਵਾਰਕ ਮਿਲਣੀਆਂ।','ख़ास पड़ाव, सालगिरहें और पारिवारिक मिलन।'],
    'Dinners, launches and annual gatherings.':['ਡਿਨਰ, ਲਾਂਚ ਅਤੇ ਸਾਲਾਨਾ ਇਕੱਠ।','डिनर, लॉन्च और वार्षिक आयोजन।'],
    'The Sartaj Haveli restaurant, open daily.':['Sartaj Haveli ਰੈਸਟੋਰੈਂਟ, ਰੋਜ਼ਾਨਾ ਖੁੱਲ੍ਹਾ।','Sartaj Haveli रेस्टोरेंट, रोज़ खुला।'],
    'Seating layouts':['ਬੈਠਣ ਦੇ ਨਕਸ਼ੇ','बैठने की व्यवस्था'],'See how your guests fit.':['ਵੇਖੋ ਤੁਹਾਡੇ ਮਹਿਮਾਨ ਕਿਵੇਂ ਬੈਠਣਗੇ।','देखें आपके मेहमान कैसे बैठेंगे।'],
    'Banquet':['ਬੈਂਕੁਇਟ','बैंक्वेट'],'Theatre':['ਥੀਏਟਰ','थिएटर'],'Cocktail':['ਕਾਕਟੇਲ','कॉकटेल'],
    'Guests in this layout. Sample figures until your real capacities are added.':['ਇਸ ਲੇਆਊਟ ਵਿੱਚ ਮਹਿਮਾਨ। ਤੁਹਾਡੀ ਅਸਲ ਸਮਰੱਥਾ ਜੋੜਨ ਤੱਕ ਇਹ ਨਮੂਨਾ ਅੰਕੜੇ ਹਨ।','इस लेआउट में मेहमान। आपकी असली क्षमता जुड़ने तक ये नमूना आँकड़े हैं।'],
    'STAGE':['ਸਟੇਜ','स्टेज'],
    'Package builder':['ਪੈਕੇਜ ਬਣਾਓ','पैकेज बनाएँ'],'Build your event. See the cost as you go.':['ਆਪਣਾ ਸਮਾਗਮ ਬਣਾਓ। ਨਾਲੋ-ਨਾਲ ਖ਼ਰਚਾ ਵੇਖੋ।','अपना आयोजन बनाएँ। साथ-साथ ख़र्च देखें।'],
    'Pick a package, add what you need and drag the guest count. Prices below are samples until you share your real rates.':['ਇੱਕ ਪੈਕੇਜ ਚੁਣੋ, ਲੋੜੀਂਦਾ ਜੋੜੋ ਅਤੇ ਮਹਿਮਾਨਾਂ ਦੀ ਗਿਣਤੀ ਖਿੱਚੋ। ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਕੀਮਤਾਂ ਨਮੂਨਾ ਹਨ, ਅਸਲ ਰੇਟ ਮਿਲਣ ਤੱਕ।','एक पैकेज चुनें, ज़रूरत की चीज़ें जोड़ें और मेहमानों की संख्या खिसकाएँ। नीचे की क़ीमतें नमूना हैं, असली रेट मिलने तक।'],
    'Silver':['ਸਿਲਵਰ','सिल्वर'],'Gold':['ਗੋਲਡ','गोल्ड'],'Royal':['ਰਾਇਲ','रॉयल'],
    '₹800 per plate':['ਪ੍ਰਤੀ ਪਲੇਟ ₹800','₹800 प्रति प्लेट'],'₹1,200 per plate':['ਪ੍ਰਤੀ ਪਲੇਟ ₹1,200','₹1,200 प्रति प्लेट'],'₹1,800 per plate':['ਪ੍ਰਤੀ ਪਲੇਟ ₹1,800','₹1,800 प्रति प्लेट'],
    'Veg menu, 6 items':['ਸ਼ਾਕਾਹਾਰੀ ਮੇਨੂ, 6 ਪਕਵਾਨ','शाकाहारी मेन्यू, 6 व्यंजन'],'Hall and basic lighting':['ਹਾਲ ਅਤੇ ਸਧਾਰਨ ਰੋਸ਼ਨੀ','हॉल और सामान्य रोशनी'],'Welcome drinks':['ਸੁਆਗਤੀ ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ','स्वागत पेय'],
    'Veg and non-veg, 10 items':['ਸ਼ਾਕਾਹਾਰੀ ਤੇ ਮਾਸਾਹਾਰੀ, 10 ਪਕਵਾਨ','शाकाहारी और मांसाहारी, 10 व्यंजन'],'Stage and themed decor':['ਸਟੇਜ ਅਤੇ ਥੀਮ ਵਾਲੀ ਸਜਾਵਟ','स्टेज और थीम वाली सजावट'],'Welcome drinks and dessert':['ਸੁਆਗਤੀ ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ ਅਤੇ ਮਿਠਾਈ','स्वागत पेय और मिठाई'],
    'Full menu, live counters':['ਪੂਰਾ ਮੇਨੂ, ਲਾਈਵ ਕਾਊਂਟਰ','पूरा मेन्यू, लाइव काउंटर'],'Premium decor and lighting':['ਪ੍ਰੀਮੀਅਮ ਸਜਾਵਟ ਅਤੇ ਰੋਸ਼ਨੀ','प्रीमियम सजावट और रोशनी'],'Dedicated event manager':['ਸਮਰਪਿਤ ਈਵੈਂਟ ਮੈਨੇਜਰ','समर्पित इवेंट मैनेजर'],
    'Extra decor +₹1,50,000':['ਵਾਧੂ ਸਜਾਵਟ +₹1,50,000','अतिरिक्त सजावट +₹1,50,000'],'DJ and sound +₹40,000':['ਡੀਜੇ ਅਤੇ ਸਾਊਂਡ +₹40,000','डीजे और साउंड +₹40,000'],'Photo and video +₹90,000':['ਫੋਟੋ ਅਤੇ ਵੀਡੀਓ +₹90,000','फ़ोटो और वीडियो +₹90,000'],'Live chaat counter +₹150 per plate':['ਲਾਈਵ ਚਾਟ ਕਾਊਂਟਰ +₹150 ਪ੍ਰਤੀ ਪਲੇਟ','लाइव चाट काउंटर +₹150 प्रति प्लेट'],
    'extra decor':['ਵਾਧੂ ਸਜਾਵਟ','अतिरिक्त सजावट'],'DJ and sound':['ਡੀਜੇ ਅਤੇ ਸਾਊਂਡ','डीजे और साउंड'],'photo and video':['ਫੋਟੋ ਅਤੇ ਵੀਡੀਓ','फ़ोटो और वीडियो'],'live chaat counter':['ਲਾਈਵ ਚਾਟ ਕਾਊਂਟਰ','लाइव चाट काउंटर'],
    'Estimated total':['ਅਨੁਮਾਨਿਤ ਕੁੱਲ','अनुमानित कुल'],'Send this estimate':['ਇਹ ਅਨੁਮਾਨ ਭੇਜੋ','यह अनुमान भेजें'],
    'Availability':['ਉਪਲਬਧਤਾ','उपलब्धता'],'Find a date that is still open.':['ਅਜਿਹੀ ਤਾਰੀਖ਼ ਲੱਭੋ ਜੋ ਹਾਲੇ ਖਾਲੀ ਹੈ।','ऐसी तारीख़ ढूँढें जो अभी ख़ाली है।'],
    'Sample dates only. We will connect this to your real bookings.':['ਸਿਰਫ਼ ਨਮੂਨਾ ਤਾਰੀਖ਼ਾਂ। ਅਸੀਂ ਇਸਨੂੰ ਤੁਹਾਡੀਆਂ ਅਸਲ ਬੁਕਿੰਗਾਂ ਨਾਲ ਜੋੜਾਂਗੇ।','सिर्फ़ नमूना तारीख़ें। हम इसे आपकी असली बुकिंग से जोड़ेंगे।'],
    'Choose an open date.':['ਖਾਲੀ ਤਾਰੀਖ਼ ਚੁਣੋ।','ख़ाली तारीख़ चुनें।'],'Use this date':['ਇਹ ਤਾਰੀਖ਼ ਵਰਤੋ','यह तारीख़ चुनें'],'Open':['ਖਾਲੀ','ख़ाली'],'Booked':['ਬੁੱਕ','बुक'],', booked':[', ਬੁੱਕ',', बुक'],', open':[', ਖਾਲੀ',', ख़ाली'],
    'See it before you book':['ਬੁਕਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਵੇਖੋ','बुकिंग से पहले देखें'],'Walk in. Then watch it transform.':['ਅੰਦਰ ਆਓ। ਫਿਰ ਵੇਖੋ ਇਹ ਕਿਵੇਂ ਬਦਲਦਾ ਹੈ।','अंदर आइए। फिर देखिए यह कैसे बदलता है।'],
    'Empty hall to wedding night':['ਖਾਲੀ ਹਾਲ ਤੋਂ ਵਿਆਹ ਦੀ ਰਾਤ ਤੱਕ','ख़ाली हॉल से शादी की रात तक'],
    'Drag the slider. Real before and after photos replace these drawings.':['ਸਲਾਈਡਰ ਖਿੱਚੋ। ਇਹਨਾਂ ਚਿੱਤਰਾਂ ਦੀ ਥਾਂ ਅਸਲ ਪਹਿਲਾਂ ਅਤੇ ਬਾਅਦ ਦੀਆਂ ਫੋਟੋਆਂ ਲੱਗਣਗੀਆਂ।','स्लाइडर खिसकाएँ। इन चित्रों की जगह असली पहले और बाद की फ़ोटो लगेंगी।'],
    'Empty hall':['ਖਾਲੀ ਹਾਲ','ख़ाली हॉल'],'Wedding setup':['ਵਿਆਹ ਦੀ ਸਜਾਵਟ','शादी की सजावट'],
    'Take the walkthrough':['ਵਾਕਥਰੂ ਵੇਖੋ','वॉकथ्रू देखें'],'Drag to look around. Tap a spot to learn about it.':['ਆਲੇ-ਦੁਆਲੇ ਵੇਖਣ ਲਈ ਖਿੱਚੋ। ਜਾਣਕਾਰੀ ਲਈ ਕਿਸੇ ਥਾਂ ਨੂੰ ਛੂਹੋ।','आसपास देखने के लिए खिसकाएँ। जानकारी के लिए किसी जगह को छुएँ।'],
    'Entrance':['ਪ੍ਰਵੇਸ਼','प्रवेश'],'Dining floor':['ਡਾਇਨਿੰਗ ਫ਼ਲੋਰ','डाइनिंग फ़्लोर'],'Stage':['ਸਟੇਜ','स्टेज'],'Bridal suite':['ਦੁਲਹਨ ਦਾ ਕਮਰਾ','दुल्हन का कमरा'],
    'Grand entrance. Guests arrive under the main arch and are welcomed with flowers and music.':['ਸ਼ਾਨਦਾਰ ਪ੍ਰਵੇਸ਼। ਮਹਿਮਾਨ ਮੁੱਖ ਮਹਿਰਾਬ ਹੇਠੋਂ ਆਉਂਦੇ ਹਨ ਅਤੇ ਫੁੱਲਾਂ ਤੇ ਸੰਗੀਤ ਨਾਲ ਉਨ੍ਹਾਂ ਦਾ ਸੁਆਗਤ ਹੁੰਦਾ ਹੈ।','भव्य प्रवेश। मेहमान मुख्य मेहराब के नीचे से आते हैं और फूलों व संगीत से उनका स्वागत होता है।'],
    'Dining floor. Round tables, buffet counters and space to move around comfortably.':['ਡਾਇਨਿੰਗ ਫ਼ਲੋਰ। ਗੋਲ ਮੇਜ਼, ਬੁਫ਼ੇ ਕਾਊਂਟਰ ਅਤੇ ਆਰਾਮ ਨਾਲ ਘੁੰਮਣ ਲਈ ਥਾਂ।','डाइनिंग फ़्लोर। गोल मेज़ें, बुफ़े काउंटर और आराम से घूमने की जगह।'],
    'Stage. Raised, lit and ready for the couple, the band or the speeches.':['ਸਟੇਜ। ਉੱਚੀ, ਰੌਸ਼ਨ ਅਤੇ ਜੋੜੇ, ਬੈਂਡ ਜਾਂ ਭਾਸ਼ਣਾਂ ਲਈ ਤਿਆਰ।','स्टेज। ऊँची, रोशन और जोड़े, बैंड या भाषणों के लिए तैयार।'],
    'Bridal suite. A private room for the couple and family to get ready.':['ਦੁਲਹਨ ਦਾ ਕਮਰਾ। ਜੋੜੇ ਅਤੇ ਪਰਿਵਾਰ ਦੇ ਤਿਆਰ ਹੋਣ ਲਈ ਨਿੱਜੀ ਕਮਰਾ।','दुल्हन का कमरा। जोड़े और परिवार के तैयार होने के लिए निजी कमरा।'],
    'Photo or video walkthrough placeholder. Drag to look around.':['ਫੋਟੋ ਜਾਂ ਵੀਡੀਓ ਵਾਕਥਰੂ ਦੀ ਥਾਂ। ਆਲੇ-ਦੁਆਲੇ ਵੇਖਣ ਲਈ ਖਿੱਚੋ।','फ़ोटो या वीडियो वॉकथ्रू की जगह। आसपास देखने के लिए खिसकाएँ।'],
    'Wedding planner':['ਵਿਆਹ ਪਲੈਨਰ','वेडिंग प्लानर'],'Three questions. One clear timeline.':['ਤਿੰਨ ਸਵਾਲ। ਇੱਕ ਸਾਫ਼ ਸਮਾਂ-ਸਾਰਣੀ।','तीन सवाल। एक साफ़ समय-सारणी।'],
    'When is the big day?':['ਵੱਡਾ ਦਿਨ ਕਦੋਂ ਹੈ?','बड़ा दिन कब है?'],'Within 3 months':['ਤਿੰਨ ਮਹੀਨਿਆਂ ਦੇ ਅੰਦਰ','तीन महीने के भीतर'],'3 to 6 months':['3 ਤੋਂ 6 ਮਹੀਨੇ','3 से 6 महीने'],'6 to 12 months':['6 ਤੋਂ 12 ਮਹੀਨੇ','6 से 12 महीने'],'More than a year':['ਇੱਕ ਸਾਲ ਤੋਂ ਵੱਧ','एक साल से ज़्यादा'],
    'How many guests are you expecting?':['ਤੁਸੀਂ ਕਿੰਨੇ ਮਹਿਮਾਨਾਂ ਦੀ ਉਮੀਦ ਕਰ ਰਹੇ ਹੋ?','आप कितने मेहमानों की उम्मीद कर रहे हैं?'],'Under 150':['150 ਤੋਂ ਘੱਟ','150 से कम'],'150 to 400':['150 ਤੋਂ 400','150 से 400'],'400 to 800':['400 ਤੋਂ 800','400 से 800'],'800 or more':['800 ਜਾਂ ਵੱਧ','800 या ज़्यादा'],
    'What matters most to you?':['ਤੁਹਾਡੇ ਲਈ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਕੀ ਹੈ?','आपके लिए सबसे ज़रूरी क्या है?'],'The food':['ਖਾਣਾ','खाना'],'The decor and look':['ਸਜਾਵਟ ਅਤੇ ਦਿੱਖ','सजावट और लुक'],'Music and fun':['ਸੰਗੀਤ ਅਤੇ ਮਸਤੀ','संगीत और मस्ती'],'Staying on budget':['ਬਜਟ ਵਿੱਚ ਰਹਿਣਾ','बजट में रहना'],
    'Your timeline':['ਤੁਹਾਡੀ ਸਮਾਂ-ਸਾਰਣੀ','आपकी समय-सारणी'],
    'Ask for a tasting early and decide your counters before anything else.':['ਸ਼ੁਰੂ ਵਿੱਚ ਹੀ ਚੱਖਣ ਲਈ ਕਹੋ ਅਤੇ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਕਾਊਂਟਰ ਤੈਅ ਕਰੋ।','शुरू में ही टेस्टिंग माँगें और सबसे पहले अपने काउंटर तय करें।'],
    'Share reference pictures with us early so the decor team can plan lighting and flowers.':['ਸਜਾਵਟ ਟੀਮ ਰੋਸ਼ਨੀ ਅਤੇ ਫੁੱਲਾਂ ਦੀ ਯੋਜਨਾ ਬਣਾ ਸਕੇ, ਇਸ ਲਈ ਸਾਨੂੰ ਪਹਿਲਾਂ ਹੀ ਮਿਸਾਲ ਦੀਆਂ ਤਸਵੀਰਾਂ ਭੇਜੋ।','सजावट टीम रोशनी और फूलों की योजना बना सके, इसलिए हमें पहले ही रेफ़रेंस तस्वीरें भेजें।'],
    'Book your DJ or band first, since the best ones go quickly in wedding season.':['ਆਪਣਾ ਡੀਜੇ ਜਾਂ ਬੈਂਡ ਪਹਿਲਾਂ ਬੁੱਕ ਕਰੋ, ਕਿਉਂਕਿ ਵਿਆਹਾਂ ਦੇ ਸੀਜ਼ਨ ਵਿੱਚ ਵਧੀਆ ਵਾਲੇ ਜਲਦੀ ਬੁੱਕ ਹੋ ਜਾਂਦੇ ਹਨ।','अपना डीजे या बैंड पहले बुक करें, क्योंकि शादी के सीज़न में अच्छे वाले जल्दी बुक हो जाते हैं।'],
    'Lock your guest count first. It drives most of the cost.':['ਪਹਿਲਾਂ ਮਹਿਮਾਨਾਂ ਦੀ ਗਿਣਤੀ ਪੱਕੀ ਕਰੋ। ਜ਼ਿਆਦਾਤਰ ਖ਼ਰਚਾ ਇਸੇ ’ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।','पहले मेहमानों की संख्या पक्की करें। ज़्यादातर ख़र्च इसी पर निर्भर करता है।'],
    'Our seating and package tools above will help you pick the right palace quickly.':['ਉੱਪਰ ਦਿੱਤੇ ਬੈਠਣ ਅਤੇ ਪੈਕੇਜ ਟੂਲ ਤੁਹਾਨੂੰ ਸਹੀ ਮਹਿਲ ਜਲਦੀ ਚੁਣਨ ਵਿੱਚ ਮਦਦ ਕਰਨਗੇ।','ऊपर दिए बैठने और पैकेज टूल आपको सही महल जल्दी चुनने में मदद करेंगे।'],
    'Lock your venue and date':['ਆਪਣਾ ਵੈਨਿਊ ਅਤੇ ਤਾਰੀਖ਼ ਪੱਕੀ ਕਰੋ','अपना वेन्यू और तारीख़ पक्की करें'],'Book your photographer and videographer':['ਫੋਟੋਗ੍ਰਾਫ਼ਰ ਅਤੇ ਵੀਡੀਓਗ੍ਰਾਫ਼ਰ ਬੁੱਕ ਕਰੋ','फ़ोटोग्राफ़र और वीडियोग्राफ़र बुक करें'],'Finalise the guest list':['ਮਹਿਮਾਨ ਸੂਚੀ ਪੱਕੀ ਕਰੋ','मेहमानों की सूची तय करें'],'Taste the menu and choose dishes':['ਮੇਨੂ ਚੱਖੋ ਅਤੇ ਪਕਵਾਨ ਚੁਣੋ','मेन्यू चखें और व्यंजन चुनें'],'Choose a decor theme':['ਸਜਾਵਟ ਦੀ ਥੀਮ ਚੁਣੋ','सजावट की थीम चुनें'],'Send invitations':['ਸੱਦੇ ਪੱਤਰ ਭੇਜੋ','निमंत्रण भेजें'],'Book music, DJ and entertainment':['ਸੰਗੀਤ, ਡੀਜੇ ਅਤੇ ਮਨੋਰੰਜਨ ਬੁੱਕ ਕਰੋ','संगीत, डीजे और मनोरंजन बुक करें'],'Finish outfits and fittings':['ਪੋਸ਼ਾਕਾਂ ਅਤੇ ਫਿਟਿੰਗ ਪੂਰੀ ਕਰੋ','पोशाकें और फिटिंग पूरी करें'],'Confirm final headcount with us':['ਸਾਡੇ ਨਾਲ ਆਖ਼ਰੀ ਗਿਣਤੀ ਪੱਕੀ ਕਰੋ','हमारे साथ अंतिम गिनती पक्की करें'],'Walk through the hall with our team':['ਸਾਡੀ ਟੀਮ ਨਾਲ ਹਾਲ ਦਾ ਚੱਕਰ ਲਗਾਓ','हमारी टीम के साथ हॉल देख लें'],
    'Start now':['ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ','अभी शुरू करें'],'Final week':['ਆਖ਼ਰੀ ਹਫ਼ਤਾ','आख़िरी हफ़्ता'],'Send this plan to us':['ਇਹ ਯੋਜਨਾ ਸਾਨੂੰ ਭੇਜੋ','यह योजना हमें भेजें'],'Start again':['ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ','फिर से शुरू करें'],
    'Sartaj Haveli restaurant':['Sartaj Haveli ਰੈਸਟੋਰੈਂਟ','Sartaj Haveli रेस्टोरेंट'],'Dinner worth the drive.':['ਅਜਿਹਾ ਡਿਨਰ ਜਿਸ ਲਈ ਸਫ਼ਰ ਕਰਨਾ ਬਣਦਾ ਹੈ।','ऐसा डिनर जिसके लिए सफ़र करना बनता है।'],
    'All':['ਸਾਰੇ','सभी'],'Veg':['ਸ਼ਾਕਾਹਾਰੀ','शाकाहारी'],'Non-veg':['ਮਾਸਾਹਾਰੀ','मांसाहारी'],
    'Paneer Tikka':['ਪਨੀਰ ਟਿੱਕਾ','पनीर टिक्का'],'Dal Makhani':['ਦਾਲ ਮੱਖਣੀ','दाल मखनी'],'Sarson da Saag':['ਸਰ੍ਹੋਂ ਦਾ ਸਾਗ','सरसों का साग'],'Butter Chicken':['ਬਟਰ ਚਿਕਨ','बटर चिकन'],'Amritsari Fish':['ਅੰਮ੍ਰਿਤਸਰੀ ਫਿਸ਼','अमृतसरी फ़िश'],'Mutton Rogan Josh':['ਮਟਨ ਰੋਗਨ ਜੋਸ਼','मटन रोगन जोश'],
    'Sample dishes. We will load your real menu.':['ਨਮੂਨਾ ਪਕਵਾਨ। ਅਸੀਂ ਤੁਹਾਡਾ ਅਸਲ ਮੇਨੂ ਪਾਵਾਂਗੇ।','नमूना व्यंजन। हम आपका असली मेन्यू डालेंगे।'],
    'Share the basics. We reply on WhatsApp.':['ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ ਭੇਜੋ। ਅਸੀਂ WhatsApp ’ਤੇ ਜਵਾਬ ਦੇਵਾਂਗੇ।','बुनियादी जानकारी भेजें। हम WhatsApp पर जवाब देंगे।'],
    'Your name':['ਤੁਹਾਡਾ ਨਾਮ','आपका नाम'],'Phone':['ਫ਼ੋਨ','फ़ोन'],'Event':['ਸਮਾਗਮ','आयोजन'],'Venue':['ਵੈਨਿਊ','वेन्यू'],'Date':['ਤਾਰੀਖ਼','तारीख़'],
    'Wedding':['ਵਿਆਹ','शादी'],'Engagement':['ਮੰਗਣੀ','सगाई'],'Birthday or party':['ਜਨਮਦਿਨ ਜਾਂ ਪਾਰਟੀ','जन्मदिन या पार्टी'],'Corporate event':['ਕਾਰਪੋਰੇਟ ਸਮਾਗਮ','कॉर्पोरेट आयोजन'],'Dinner out':['ਬਾਹਰ ਡਿਨਰ','बाहर डिनर'],'Any venue':['ਕੋਈ ਵੀ ਵੈਨਿਊ','कोई भी वेन्यू'],
    'Name':['ਨਾਮ','नाम'],'Your message':['ਤੁਹਾਡਾ ਸੁਨੇਹਾ','आपका संदेश'],'Copy message':['ਸੁਨੇਹਾ ਕਾਪੀ ਕਰੋ','संदेश कॉपी करें'],'Copied':['ਕਾਪੀ ਹੋ ਗਿਆ','कॉपी हो गया'],
    'Once your WhatsApp number is set, this button opens the chat with this message already written.':['ਜਦੋਂ ਤੁਹਾਡਾ WhatsApp ਨੰਬਰ ਲੱਗ ਜਾਵੇਗਾ, ਇਹ ਬਟਨ ਇਹ ਸੁਨੇਹਾ ਲਿਖ ਕੇ ਚੈਟ ਖੋਲ੍ਹੇਗਾ।','जब आपका WhatsApp नंबर लग जाएगा, यह बटन इस संदेश के साथ चैट खोलेगा।'],
    'Weddings, functions and fine dining.':['ਵਿਆਹ, ਸਮਾਗਮ ਅਤੇ ਸ਼ਾਨਦਾਰ ਖਾਣਾ।','शादी, समारोह और शानदार भोजन।'],
    'Close':['ਬੰਦ ਕਰੋ','बंद करें'],
    'Request a callback':['ਕਾਲ ਬੈਕ ਲਈ ਬੇਨਤੀ ਕਰੋ','कॉल बैक का अनुरोध करें'],
    'Leave your number and we will call you at a time that suits you.':['ਆਪਣਾ ਨੰਬਰ ਛੱਡੋ, ਅਸੀਂ ਤੁਹਾਡੇ ਸਮੇਂ ਮੁਤਾਬਕ ਕਾਲ ਕਰਾਂਗੇ।','अपना नंबर छोड़ें, हम आपके समय के हिसाब से कॉल करेंगे।'],
    'Best time to call':['ਕਾਲ ਕਰਨ ਦਾ ਵਧੀਆ ਸਮਾਂ','कॉल करने का सही समय'],'Any time':['ਕਿਸੇ ਵੀ ਵੇਲੇ','किसी भी समय'],'Morning':['ਸਵੇਰ','सुबह'],'Afternoon':['ਦੁਪਹਿਰ','दोपहर'],'Evening':['ਸ਼ਾਮ','शाम'],
    'Call me back':['ਮੈਨੂੰ ਕਾਲ ਕਰੋ','मुझे कॉल करें'],'Open WhatsApp':['WhatsApp ਖੋਲ੍ਹੋ','WhatsApp खोलें'],
    'Gallery':['ਗੈਲਰੀ','गैलरी'],'A look inside.':['ਅੰਦਰ ਇੱਕ ਝਲਕ।','अंदर एक झलक।'],
    'What our guests say':['ਸਾਡੇ ਮਹਿਮਾਨ ਕੀ ਕਹਿੰਦੇ ਹਨ','हमारे मेहमान क्या कहते हैं'],
    'Pick a package, add what you need and drag the guest count.':['ਇੱਕ ਪੈਕੇਜ ਚੁਣੋ, ਲੋੜੀਂਦਾ ਜੋੜੋ ਅਤੇ ਮਹਿਮਾਨਾਂ ਦੀ ਗਿਣਤੀ ਖਿੱਚੋ।','एक पैकेज चुनें, ज़रूरत की चीज़ें जोड़ें और मेहमानों की संख्या खिसकाएँ।'],
    'Guests in this layout.':['ਇਸ ਲੇਆਊਟ ਵਿੱਚ ਮਹਿਮਾਨ।','इस लेआउट में मेहमान।'],
    'Drag the slider to compare.':['ਤੁਲਨਾ ਲਈ ਸਲਾਈਡਰ ਖਿੱਚੋ।','तुलना के लिए स्लाइडर खिसकाएँ।'],
    'Admin':['Admin','Admin'],
'Check availability':['ਉਪਲਬਧਤਾ ਪੁੱਛੋ','उपलब्धता पूछें'],
    'Dine in a heritage haveli, or take over the whole banquet hall for the evening.':['ਵਿਰਾਸਤੀ ਹਵੇਲੀ ਵਿੱਚ ਖਾਣਾ ਖਾਓ, ਜਾਂ ਸ਼ਾਮ ਲਈ ਪੂਰਾ ਬੈਂਕੁਇਟ ਹਾਲ ਆਪਣੇ ਨਾਮ ਕਰਵਾਓ।','विरासती हवेली में भोजन करें, या शाम के लिए पूरा बैंक्वेट हॉल अपने नाम कर लें।'],
    'Open lawns, a grand stage and room for the biggest guest lists.':['ਖੁੱਲ੍ਹੇ ਲਾਅਨ, ਸ਼ਾਨਦਾਰ ਸਟੇਜ ਅਤੇ ਸਭ ਤੋਂ ਵੱਡੀ ਮਹਿਮਾਨ ਸੂਚੀ ਲਈ ਥਾਂ।','खुले लॉन, भव्य स्टेज और सबसे बड़ी मेहमान सूची के लिए जगह।'],
    'A chandelier hall for receptions and engagements that feel intimate and look grand.':['ਰਿਸੈਪਸ਼ਨ ਅਤੇ ਮੰਗਣੀਆਂ ਲਈ ਝੂਮਰਾਂ ਵਾਲਾ ਹਾਲ, ਜਿੱਥੇ ਅਪਣੱਤ ਵੀ ਹੈ ਤੇ ਸ਼ਾਨ ਵੀ।','रिसेप्शन और सगाई के लिए झूमरों वाला हॉल, जहाँ अपनापन भी है और शान भी।'],
    'A palace setting for weddings and family functions, styled your way.':['ਵਿਆਹਾਂ ਅਤੇ ਪਰਿਵਾਰਕ ਸਮਾਗਮਾਂ ਲਈ ਮਹਿਲ ਵਰਗਾ ਮਾਹੌਲ, ਤੁਹਾਡੀ ਪਸੰਦ ਮੁਤਾਬਕ ਸਜਿਆ।','शादियों और पारिवारिक समारोहों के लिए महल जैसा माहौल, आपकी पसंद के मुताबिक़ सजा हुआ।'],
    'per plate':['ਪ੍ਰਤੀ ਪਲੇਟ','प्रति प्लेट'],
    'Contact':['ਸੰਪਰਕ','संपर्क'],
    'Our venues':['ਸਾਡੇ ਵੈਨਿਊ','हमारे वेन्यू'],
    'Four places to celebrate. Pick the one that fits your day.':['ਜਸ਼ਨ ਮਨਾਉਣ ਲਈ ਚਾਰ ਥਾਵਾਂ। ਆਪਣੇ ਦਿਨ ਮੁਤਾਬਕ ਚੁਣੋ।','जश्न के लिए चार जगहें। अपने दिन के हिसाब से चुनें।'],
    'Explore':['ਵੇਖੋ','देखें'],
    'Simple packages, clear prices.':['ਸਿੱਧੇ ਪੈਕੇਜ, ਸਾਫ਼ ਕੀਮਤਾਂ।','सीधे पैकेज, साफ़ क़ीमतें।'],
    'See all packages':['ਸਾਰੇ ਪੈਕੇਜ ਵੇਖੋ','सभी पैकेज देखें'],
    'See the gallery':['ਗੈਲਰੀ ਵੇਖੋ','गैलरी देखें'],
    'Reviews':['ਸਮੀਖਿਆਵਾਂ','समीक्षाएँ'],
    'Planning something special?':['ਕੁਝ ਖ਼ਾਸ ਪਲੈਨ ਕਰ ਰਹੇ ਹੋ?','कुछ ख़ास प्लान कर रहे हैं?'],
    'Tell us the date and we will tell you what is open.':['ਸਾਨੂੰ ਤਾਰੀਖ਼ ਦੱਸੋ, ਅਸੀਂ ਦੱਸਾਂਗੇ ਕੀ ਖਾਲੀ ਹੈ।','हमें तारीख़ बताइए, हम बताएँगे क्या ख़ाली है।'],
    'About this venue':['ਇਸ ਵੈਨਿਊ ਬਾਰੇ','इस वेन्यू के बारे में'],
    'Other venues':['ਹੋਰ ਵੈਨਿਊ','अन्य वेन्यू'],
    'Packages and prices':['ਪੈਕੇਜ ਅਤੇ ਕੀਮਤਾਂ','पैकेज और क़ीमतें'],
    'Photos are on their way.':['ਫੋਟੋਆਂ ਜਲਦੀ ਆ ਰਹੀਆਂ ਹਨ।','फ़ोटो जल्द आ रही हैं।'],
    'Tell us about your event.':['ਸਾਨੂੰ ਆਪਣੇ ਸਮਾਗਮ ਬਾਰੇ ਦੱਸੋ।','हमें अपने आयोजन के बारे में बताइए।'],
    'Address':['ਪਤਾ','पता'],
    'Opening hours':['ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ','खुलने का समय'],
    'Directions':['ਦਿਸ਼ਾਵਾਂ','रास्ता'],
    'Call':['ਕਾਲ','कॉल'],'Callback':['ਕਾਲ ਬੈਕ','कॉल बैक'],
    'Our story':['ਸਾਡੀ ਕਹਾਣੀ','हमारी कहानी'],'Our story is coming soon.':['ਸਾਡੀ ਕਹਾਣੀ ਜਲਦੀ ਆ ਰਹੀ ਹੈ।','हमारी कहानी जल्द आ रही है।'],
    'Events hosted':['ਸਮਾਗਮਾਂ ਦੀ ਮੇਜ਼ਬਾਨੀ','आयोजनों की मेज़बानी'],'Venues, one family':['ਵੈਨਿਊ, ਇੱਕ ਪਰਿਵਾਰ','वेन्यू, एक परिवार'],'Hosting families since':['ਪਰਿਵਾਰਾਂ ਦੀ ਮੇਜ਼ਬਾਨੀ ਸਾਲ','परिवारों की मेज़बानी वर्ष'],'Guest rating':['ਮਹਿਮਾਨਾਂ ਦੀ ਰੇਟਿੰਗ','मेहमानों की रेटिंग'],
    'Compare venues':['ਵੈਨਿਊ ਦੀ ਤੁਲਨਾ','वेन्यू की तुलना'],'Which palace fits your day?':['ਕਿਹੜਾ ਮਹਿਲ ਤੁਹਾਡੇ ਦਿਨ ਲਈ ਠੀਕ ਹੈ?','कौन सा महल आपके दिन के लिए ठीक है?'],
    'Type':['ਕਿਸਮ','प्रकार'],'Best for':['ਸਭ ਤੋਂ ਵਧੀਆ ਲਈ','किसके लिए सबसे अच्छा'],'Guests (banquet)':['ਮਹਿਮਾਨ (ਬੈਂਕੁਇਟ)','मेहमान (बैंक्वेट)'],'Starting price':['ਸ਼ੁਰੂਆਤੀ ਕੀਮਤ','शुरुआती क़ीमत'],'Guest rooms':['ਮਹਿਮਾਨ ਕਮਰੇ','मेहमान कमरे'],'Air conditioning':['ਏਅਰ ਕੰਡੀਸ਼ਨਿੰਗ','एयर कंडीशनिंग'],'View venue':['ਵੈਨਿਊ ਵੇਖੋ','वेन्यू देखें'],
    'Good to know':['ਜਾਣਨ ਯੋਗ','जानने योग्य'],'Questions we hear a lot.':['ਸਵਾਲ ਜੋ ਸਾਨੂੰ ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਹਨ।','सवाल जो हमसे अक्सर पूछे जाते हैं।'],'Ask on WhatsApp':['WhatsApp ’ਤੇ ਪੁੱਛੋ','WhatsApp पर पूछें'],
    'Follow along':['ਨਾਲ ਜੁੜੇ ਰਹੋ','जुड़े रहें'],'Fresh from our halls':['ਸਾਡੇ ਹਾਲਾਂ ਤੋਂ ਤਾਜ਼ਾ','हमारे हॉल से ताज़ा'],'Follow on Instagram':['Instagram ’ਤੇ ਫ਼ਾਲੋ ਕਰੋ','Instagram पर फ़ॉलो करें'],
    'Find us':['ਸਾਨੂੰ ਲੱਭੋ','हमें ढूँढें'],'Easy to reach, easy to park.':['ਪਹੁੰਚਣਾ ਆਸਾਨ, ਪਾਰਕਿੰਗ ਆਸਾਨ।','पहुँचना आसान, पार्किंग आसान।'],'Get directions':['ਰਸਤਾ ਵੇਖੋ','रास्ता देखें'],
    'Walk through':['ਅੰਦਰ ਦੀ ਝਲਕ','अंदर की झलक'],'Step inside before you visit.':['ਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਅੰਦਰ ਝਾਤ ਮਾਰੋ।','आने से पहले अंदर झाँक लें।'],'Book a visit':['ਵਿਜ਼ਿਟ ਬੁੱਕ ਕਰੋ','विज़िट बुक करें'],'Near':['ਨੇੜੇ','पास'],
    'Food':['ਖਾਣਾ','भोजन'],'Veg and non-veg':['ਸ਼ਾਕਾਹਾਰੀ ਤੇ ਮਾਸਾਹਾਰੀ','शाकाहारी और मांसाहारी'],'Jain':['ਜੈਨ','जैन'],'Not sure yet':['ਅਜੇ ਪੱਕਾ ਨਹੀਂ','अभी पक्का नहीं'],'Budget per plate (optional)':['ਪ੍ਰਤੀ ਪਲੇਟ ਬਜਟ (ਜ਼ਰੂਰੀ ਨਹੀਂ)','प्रति प्लेट बजट (वैकल्पिक)'],
    'This page is not here.':['ਇਹ ਪੰਨਾ ਇੱਥੇ ਨਹੀਂ ਹੈ।','यह पन्ना यहाँ नहीं है।'],'Back to the home page':['ਮੁੱਖ ਪੰਨੇ ’ਤੇ ਵਾਪਸ','मुख्य पन्ने पर वापस'],
    'Visit and contact':['ਮਿਲੋ ਅਤੇ ਸੰਪਰਕ ਕਰੋ','मिलें और संपर्क करें']
  };
  var HERO={en:{ev:'Every',w:['wedding,','engagement,','reception,','celebration,'],a:'fit',b:'for',c:'royalty.'},
            pa:{ev:'ਹਰ',w:['ਵਿਆਹ,','ਮੰਗਣੀ,','ਰਿਸੈਪਸ਼ਨ,','ਜਸ਼ਨ,'],a:'ਸ਼ਾਹੀ',b:'ਸ਼ਾਨ ਦੇ',c:'ਕਾਬਲ।'},
            hi:{ev:'हर',w:['शादी,','सगाई,','रिसेप्शन,','जश्न,'],a:'शाही',b:'ठाठ के',c:'क़ाबिल।'}};
  var MON={en:['January','February','March','April','May','June','July','August','September','October','November','December'],
           pa:['ਜਨਵਰੀ','ਫ਼ਰਵਰੀ','ਮਾਰਚ','ਅਪ੍ਰੈਲ','ਮਈ','ਜੂਨ','ਜੁਲਾਈ','ਅਗਸਤ','ਸਤੰਬਰ','ਅਕਤੂਬਰ','ਨਵੰਬਰ','ਦਸੰਬਰ'],
           hi:['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्तूबर','नवंबर','दिसंबर']};
  var DOW={en:['S','M','T','W','T','F','S'],pa:['ਐ','ਸੋ','ਮੰ','ਬੁੱ','ਵੀ','ਸ਼ੁ','ਸ਼'],hi:['र','सो','मं','बु','गु','शु','श']};
  function tr(s){var e=D[s]; if(!e||LANG==='en')return s; return e[LANG==='pa'?0:1]}
  function i18n(root){
    var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,null), n, list=[];
    while((n=w.nextNode()))list.push(n);
    list.forEach(function(n){
      var p=n.parentElement; if(!p||p.closest('script,style,[data-dyn]'))return;
      if(n._o===undefined){var t=n.nodeValue.trim(); n._t=t; n._o=(t&&D[t])?n.nodeValue:null}
      if(n._o===null)return;
      n.nodeValue=LANG==='en'?n._o:n._o.replace(n._t,D[n._t][LANG==='pa'?0:1]);
    });
    $$('[placeholder]').forEach(function(el){if(el._ph===undefined)el._ph=D[el.getAttribute('placeholder')]?el.getAttribute('placeholder'):null; if(el._ph)el.setAttribute('placeholder',tr(el._ph))});
    document.documentElement.setAttribute('lang',LANG);
  }

  /* ---------- sale, prices ---------- */
  function saleOn(){var s=CFG.sale; if(!s||!s.on||!(+s.pct>0))return false; var t=todayISO(); if(s.start&&t<s.start)return false; if(s.end&&t>s.end)return false; return true}
  function EFF(i){var p=+CFG.plates[i].price||0; return saleOn()?Math.round(p*(1-(+CFG.sale.pct)/100)/10)*10:p}
  function priceHtml(i){var b=+CFG.plates[i].price||0; return saleOn()?'<s>'+inr(b)+'</s> '+inr(EFF(i))+' '+tr('per plate'):inr(b)+' '+tr('per plate')}
  function fmtD(iso){var p=iso.split('-'); return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString(LOC[LANG],{day:'numeric',month:'long'})}
  function setPh(art,id){
    if(!art)return; var o=art.querySelector(':scope > .ph'); if(o)o.remove();
    if(validId(id)){var p=document.createElement('div');p.className='ph';p.style.backgroundImage='url('+pUrl(id)+')';art.appendChild(p);art.classList.add('has')}
    else art.classList.remove('has');
  }
  function artHtml(i,photo){
    var ph=validId(photo)?'<div class="ph" style="background-image:url('+pUrl(photo)+')"></div>':'';
    return '<div class="art'+(ph?' has':'')+'" style="background:'+SHEETBG[i%4]+'"><div class="glow" style="width:60%;height:50%;left:20%;top:5%;background:#E3C374"></div><div class="arches"><div class="arch"></div><div class="arch"></div><div class="arch"></div><div class="arch"></div><div class="arch"></div></div>'+ph+'</div>';
  }
  function vn(v){return (LANG==='pa'&&v.pa)||(LANG==='hi'&&v.hi)||v.name}
  function isVid(u){return typeof u==='string'&&/^https:\/\/[\w.\-]+\/[\w\-\/.%]{1,300}\.(mp4|webm)$/i.test(u)}
  function ytId(u){var m=/^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?(?:[^#]*&)?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/.exec(u||''); return m?m[1]:''}
  function mapQ(v){return [v.name,v.address||CFG.address,v.city].filter(Boolean).join(', ')}
  function factsOf(v,n){return v.facts.filter(function(f){return String(f.v).trim()&&String(f.l).trim()}).slice(0,n||4)}

  /* ---------- header, footer, floating buttons ---------- */
  function renderChrome(){
    var V=CFG.venues, file=location.pathname.split('/').pop()||'index.html', wa=digits(CFG.wa);
    function on(h){return file===h?' class="on"':''}
    var sOn=saleOn(), ptxt=sOn?(CFG.sale.text||((CFG.sale.name||'Sale')+': '+CFG.sale.pct+'% off our packages'+(CFG.sale.end?' until '+fmtD(CFG.sale.end):'')+'.')):CFG.promo;
    var h='';
    if(ptxt)h+='<div class="promo"><span data-dyn>'+esc(sOn?ptxt:tr(ptxt))+'</span> <a href="contact.html#enquire">Check date</a></div>';
    h+='<header class="nav"><div class="wrap nav-in"><a class="brand" href="index.html" data-dyn>'+brandHtml()+'</a>'
      +'<nav class="links" aria-label="Main"><div class="dd"><button type="button" aria-haspopup="true">Venues ▾</button><div class="dd-menu" data-dyn>'+V.map(function(v,i){return '<a href="'+HREF[i]+'">'+esc(vn(v))+'</a>'}).join('')+'</div></div>'
      +'<a href="packages.html"'+on('packages.html')+'>Packages</a><a href="gallery.html"'+on('gallery.html')+'>Gallery</a>'+(hasStory()?'<a href="story.html"'+on('story.html')+'>Our story</a>':'')+'<a href="contact.html"'+on('contact.html')+'>Contact</a></nav>'
      +'<div class="nav-r"><div class="lang" role="group" aria-label="Language"><button type="button" data-l="en" aria-pressed="'+(LANG==='en')+'">EN</button><button type="button" data-l="pa" aria-pressed="'+(LANG==='pa')+'">ਪੰਜਾਬੀ</button><button type="button" data-l="hi" aria-pressed="'+(LANG==='hi')+'">हिन्दी</button></div>'
      +'<button class="btn btn-gold nav-cta" type="button" data-cb>Request a callback</button><button class="burger" type="button" id="burger" aria-label="Menu" aria-expanded="false">☰</button></div></div>'
      +'<div class="mmenu" id="mmenu"><small>Venues</small><span data-dyn>'+V.map(function(v,i){return '<a href="'+HREF[i]+'">'+esc(vn(v))+'</a>'}).join('')+'</span><small>Explore</small><a href="packages.html">Packages</a><a href="gallery.html">Gallery</a>'+(hasStory()?'<a href="story.html">Our story</a>':'')+'<a href="contact.html">Contact</a><a href="#" data-cb>Request a callback</a></div></header>';
    $('#hdr').innerHTML=h;
    var lines='';
    function line(x){lines+='<div>'+x+'</div>'}
    if(CFG.address)line(esc(CFG.address));
    if(CFG.phone)line('<a href="tel:+'+digits(CFG.phone)+'">'+esc(CFG.phone)+'</a>');
    if(wa)line('<a href="https://wa.me/'+wa+'" target="_blank" rel="noopener">WhatsApp</a>');
    if(CFG.email)line(esc(CFG.email));
    if(CFG.hours)line(esc(CFG.hours));
    if(/^https?:\/\//.test(CFG.maps||''))line('<a href="'+esc(CFG.maps)+'" target="_blank" rel="noopener">Get directions</a>');
    $('#ftr').innerHTML='<footer><div class="wrap"><div class="foot"><div><div class="brand" data-dyn style="margin-bottom:8px">'+brandHtml()+'</div><div data-dyn>'+esc(tr(CFG.tagline))+'</div><div class="cl" data-dyn style="margin-top:12px">'+lines+'</div></div>'
      +'<div><b>Venues</b><span data-dyn>'+V.map(function(v,i){return '<a href="'+HREF[i]+'">'+esc(vn(v))+'</a>'}).join('')+'</span></div>'
      +'<div><b>Explore</b><a href="packages.html">Packages</a><a href="gallery.html">Gallery</a>'+(hasStory()?'<a href="story.html">Our story</a>':'')+'<a href="contact.html">Contact</a><a href="#" data-cb>Request a callback</a></div></div>'
      +'<div class="copy" data-dyn>© '+new Date().getFullYear()+' '+esc(CFG.brand)+'</div></div></footer>';
    var fl=$('#flt'); if(fl){
      var wm='Hello '+CFG.brand+', I would like to check a date'+(PAGE==='venue'?' at '+CFG.venues[VI].name:'')+'.', wh=wa?'https://wa.me/'+wa+'?text='+encodeURIComponent(wm):'', ph=digits(CFG.phone);
      var wsvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9 8.5c.3 3 3 5.7 6 6l1.2-1.3-2-1-1 .8c-.9-.4-1.7-1.2-2.1-2.1l.8-1-1-2z" fill="currentColor"/></svg>';
      var psvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
      var dsvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      fl.innerHTML=(wh?'<a class="wafab" href="'+esc(wh)+'" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">'+wsvg+'<span>WhatsApp</span></a>':'')
        +'<nav class="mbar" aria-label="Quick actions">'+(ph?'<a href="tel:+'+ph+'">'+psvg+'<span>Call</span></a>':'<a href="#" data-cb>'+psvg+'<span>Callback</span></a>')+(wh?'<a class="mb-wa" href="'+esc(wh)+'" target="_blank" rel="noopener">'+wsvg+'<span>WhatsApp</span></a>':'')+'<a class="mb-go" href="contact.html#enquire">'+dsvg+'<span>Check date</span></a></nav>';
    }
    ['cbVenue'].forEach(function(id){var s=$('#'+id); if(!s)return; var k=s.selectedIndex; s.innerHTML='<option>Any venue</option>'+V.map(function(v){return '<option>'+esc(v.name)+'</option>'}).join(''); s.selectedIndex=Math.max(0,k)});
  }
  function hasStory(){return !!String((CFG.story&&CFG.story.text)||'').trim()}
  function brandHtml(){
    return '<svg class="bmark" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M5 24 3.5 11l7 6 5.5-9 5.5 9 7-6L27 24z"/><path d="M6.5 28h19"/><circle cx="3.5" cy="9.5" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="28.5" cy="9.5" r="1.6"/></svg><span class="btxt">'+esc(CFG.brand)+'</span>';
  }
  function injectExtras(){
    var e=$('#ext'); if(!e)return;
    e.innerHTML='<div id="flt"></div><div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Photo viewer"><button class="lb-x" type="button" data-lbx aria-label="Close">×</button><button class="lb-p" type="button" data-lbp aria-label="Previous photo">‹</button><img id="lbImg" alt=""><button class="lb-n" type="button" data-lbn aria-label="Next photo">›</button><div class="lb-c" id="lbC" aria-live="polite"></div></div>'
    +'<button class="fab" id="cbFab" type="button" data-cb>Request a callback</button>'
    +'<div class="modal" id="cbModal" role="dialog" aria-modal="true" aria-labelledby="cbTitle" hidden><div class="mbox"><h3 id="cbTitle">Request a callback</h3><p>Leave your number and we will call you at a time that suits you.</p>'
    +'<form id="cbForm" novalidate><div class="f"><label for="cbName">Your name</label><input id="cbName" type="text" autocomplete="name" placeholder="Name" maxlength="80"></div>'
    +'<div class="f"><label for="cbPhone">Phone</label><input id="cbPhone" type="tel" autocomplete="tel" placeholder="Phone" maxlength="30"></div>'
    +'<div class="f"><label for="cbTime">Best time to call</label><select id="cbTime"><option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></div>'
    +'<div class="f"><label for="cbVenue">Venue</label><select id="cbVenue"><option>Any venue</option></select></div>'
    +'<p class="msg" id="cbMsg" hidden aria-live="polite"></p>'
    +'<div class="row"><button class="btn btn-dark" type="submit" id="cbGo">Call me back</button><button class="btn btn-line" type="button" id="cbClose">Close</button></div></form></div></div>'
    +'<div class="modal lmodal" id="langModal" role="dialog" aria-modal="true" aria-labelledby="langTitle" hidden><div class="mbox lbox" data-dyn>'
    +'<div class="lbrand">'+esc(CFG.brand)+'</div>'
    +'<h3 id="langTitle">Choose your language</h3>'
    +'<p class="lsub"><span lang="pa">ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ</span> &nbsp;·&nbsp; <span lang="hi">अपनी भाषा चुनें</span></p>'
    +'<div class="lang-pick"><button type="button" data-l="en" lang="en">English</button><button type="button" data-l="pa" lang="pa">ਪੰਜਾਬੀ</button><button type="button" data-l="hi" lang="hi">हिन्दी</button></div>'
    +'<p class="lnote">You can change this any time from the menu at the top.</p></div></div>';
    maybeAskLang();
  }
  /* first visit: ask which language to show the site in */
  function hasSavedLang(){try{return /^(en|pa|hi)$/.test(localStorage.getItem('srg_lang')||'')}catch(x){return true}}
  function storageWorks(){try{localStorage.setItem('srg_t','1');localStorage.removeItem('srg_t');return true}catch(x){return false}}
  function maybeAskLang(){
    if(/[?&]preview=1/.test(location.search)||hasSavedLang()||!storageWorks())return;
    var m=$('#langModal'); if(!m)return; m.hidden=false; document.body.classList.add('lock');
    var f=m.querySelector('button'); if(f)f.focus();
  }
  function hideLang(){var m=$('#langModal'); if(m&&!m.hidden){m.hidden=true; document.body.classList.remove('lock')}}

  /* ---------- callback request ---------- */
  var cbLast=null;
  function cbSay(t,bad){var m=$('#cbMsg'); m.textContent=t; m.hidden=!t; m.style.color=bad?'#8C2F2F':''}
  function openCb(){
    cbLast=document.activeElement; cbSay(''); $('#cbGo').hidden=false; $('#cbModal').hidden=false; document.body.classList.add('lock');
    var n=$('#fName'), p=$('#fPhone'); if(n&&n.value&&!$('#cbName').value)$('#cbName').value=n.value; if(p&&p.value&&!$('#cbPhone').value)$('#cbPhone').value=p.value;
    if(PAGE==='venue')$('#cbVenue').selectedIndex=VI+1;
    $('#cbName').focus();
  }
  function closeCb(){$('#cbModal').hidden=true; document.body.classList.remove('lock'); if(cbLast&&cbLast.focus)cbLast.focus()}
  var T3={
    en:{ok:'Thank you. We have your number and will call you back soon.',bad:'Please enter your name and a phone number we can call.',fail:'We could not save this online right now. Please use WhatsApp or the enquiry form so it reaches us.'},
    pa:{ok:'ਧੰਨਵਾਦ। ਸਾਡੇ ਕੋਲ ਤੁਹਾਡਾ ਨੰਬਰ ਹੈ, ਅਸੀਂ ਜਲਦੀ ਹੀ ਕਾਲ ਕਰਾਂਗੇ।',bad:'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ ਅਤੇ ਫ਼ੋਨ ਨੰਬਰ ਲਿਖੋ।',fail:'ਇਸ ਵੇਲੇ ਇਹ ਆਨਲਾਈਨ ਸੰਭਾਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ WhatsApp ਜਾਂ ਪੁੱਛਗਿੱਛ ਫ਼ਾਰਮ ਵਰਤੋ।'},
    hi:{ok:'धन्यवाद। हमारे पास आपका नंबर है, हम जल्दी ही कॉल करेंगे।',bad:'कृपया अपना नाम और फ़ोन नंबर लिखें।',fail:'अभी यह ऑनलाइन सहेजा नहीं जा सका। कृपया WhatsApp या पूछताछ फ़ॉर्म इस्तेमाल करें।'}
  };
  async function storeCb(rec){
    if(SBOK){
      var r=await fetch(SB.url+'/rest/v1/callbacks',{method:'POST',headers:sbH({'Content-Type':'application/json',Prefer:'return=minimal'}),
        body:JSON.stringify({name:rec.name,phone:rec.phone,time:rec.time||'',venue:rec.venue||'',lang:rec.lang||'en'})});
      if(r.ok)return;
    }
    throw new Error('nostore');
  }
  async function submitCb(e){
    e.preventDefault();
    var nm=$('#cbName').value.trim().slice(0,80), ph=$('#cbPhone').value.trim().slice(0,30), t=T3[LANG];
    if(!nm||digits(ph).length<7){cbSay(t.bad,true);return}
    var go=$('#cbGo'); go.disabled=true;
    var rec={name:nm,phone:ph,time:$('#cbTime').value,venue:$('#cbVenue').value,at:Date.now(),done:false,lang:LANG};
    try{await storeCb(rec); cbSay(t.ok); go.hidden=true; $('#cbForm').reset()}
    catch(err){
      var wa=digits(CFG.wa), x=wa?' https://wa.me/'+wa+'?text='+encodeURIComponent('Hello '+CFG.brand+', please call me back. I am '+nm+', phone '+ph+'.'):'';
      cbSay(t.fail+x,true);
    }
    go.disabled=false;
  }

  /* ---------- home ---------- */
  function renderHome(){
    setPh($('#heroArt'),CFG.media.hero); heroMedia(); renderProof(); renderCompare(); renderIg();
    $('#vgrid').innerHTML=CFG.venues.map(function(v,i){
      var fs=factsOf(v,3);
      return '<a class="vcard rv" href="'+HREF[i]+'">'+artHtml(i,v.photo)+'<div class="eyebrow" data-dyn>'+esc(tr(v.kind))+'</div><h3>'+esc(vn(v))+'</h3><p data-dyn>'+esc(tr(v.blurb).slice(0,120))+(tr(v.blurb).length>120?'…':'')+'</p>'
        +(fs.length?'<div class="chips" data-dyn>'+fs.map(function(f){return '<span class="chip">'+esc(f.v)+' '+esc(tr(f.l))+'</span>'}).join('')+'</div>':'')+'<span class="go" data-dyn>'+tr('Explore')+' →</span></a>';
    }).join('');
    $('#pkTease').innerHTML=CFG.plates.map(function(p,i){
      return '<a class="pk rv" href="packages.html"><b data-dyn>'+esc(p.name)+'</b><span class="price" data-dyn>'+priceHtml(i)+'</span><ul data-dyn>'+p.items.filter(function(x){return String(x).trim()}).map(function(x){return '<li>'+esc(tr(x))+'</li>'}).join('')+'</ul></a>';
    }).join('');
    $('#saleBar').innerHTML=saleOn()?'<span class="sale-badge" data-dyn>'+esc(CFG.sale.name||'Sale')+' · '+(+CFG.sale.pct)+'% off</span>':'';
    var gal=CFG.gallery.filter(validId), gs=$('#galTease'); gs.hidden=!gal.length;
    $('#galGrid').innerHTML=gal.slice(0,6).map(function(id){return tile(id)}).join('');
    var rv=CFG.reviews.filter(function(r){return String(r.text).trim()}), rs=$('#reviews'); rs.hidden=!rv.length;
    $('#revGrid').innerHTML=rv.map(function(r){return '<figure class="rev" data-dyn><p>“'+esc(r.text)+'”</p><b>'+esc(r.name)+'</b>'+(r.detail?'<small>'+esc(r.detail)+'</small>':'')+'</figure>'}).join('');
    var H=HERO[LANG], hw=$$('#hero-h1 .w'); if(hw.length){hw[0].textContent=H.ev; hw[1].textContent=H.a; hw[2].textContent=H.b; hw[3].textContent=H.c; $$('#rot span').forEach(function(s,i){s.textContent=H.w[i]})}
  }
  var slideT=null;
  function heroMedia(){
    var art=$('#heroArt'); if(!art)return; var o=art.querySelector(':scope > .hmedia'); if(o)o.remove(); clearInterval(slideT);
    var vid=CFG.media.heroVideo, h='', cls='';
    var photos=[CFG.media.hero].concat(CFG.gallery).filter(validId); photos=photos.filter(function(x,i){return photos.indexOf(x)===i}).slice(0,4);
    if(isVid(vid)&&!reduce){h='<video class="hvid" src="'+esc(vid)+'" '+(validId(CFG.media.hero)?'poster="'+esc(CFG.media.hero)+'" ':'')+'autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>'}
    else if(photos.length>1){
      h=photos.map(function(id,i){return '<div class="hs'+(i?'':' on')+'" style="background-image:url('+pUrl(id)+')"></div>'}).join('')+'<div class="hdots" aria-hidden="true">'+photos.map(function(x,i){return '<i'+(i?'':' class="on"')+'></i>'}).join('')+'</div>';
      cls=' slides';
    }
    if(!h)return;
    var d=document.createElement('div'); d.className='hmedia'+cls; d.innerHTML=h; art.appendChild(d); art.classList.add('has');
    if(cls&&!reduce){var hs=d.querySelectorAll('.hs'), dots=d.querySelectorAll('.hdots i'), k=0; slideT=setInterval(function(){hs[k].classList.remove('on'); dots[k].classList.remove('on'); k=(k+1)%hs.length; hs[k].classList.add('on'); dots[k].classList.add('on')},5500)}
  }
  function renderProof(){
    var el=$('#proof'); if(!el)return; var st=CFG.stats||{}, it=[];
    if(String(st.events||'').trim())it.push([esc(st.events),'Events hosted']);
    it.push([CFG.venues.length,'Venues, one family']);
    if(String(st.since||'').trim())it.push([esc(st.since),'Hosting families since']);
    if(String(st.rating||'').trim())it.push([esc(st.rating)+' <i class="st" aria-hidden="true">★</i>','Guest rating']);
    el.hidden=it.length<2;
    $('#proofGrid').innerHTML=it.map(function(x){return '<div><b>'+x[0]+'</b><span>'+tr(x[1])+'</span></div>'}).join('');
  }
  function renderCompare(){
    var el=$('#cmpSec'); if(!el)return; var V=CFG.venues;
    var rows=[['Best for',function(v){return v.best}],['Guests (banquet)',function(v){return (CFG.flags.cap&&+v.cap.b)?(+v.cap.b).toLocaleString('en-IN'):''}],['Starting price',function(v){return v.price}],['Parking',function(v){return v.parking}],['Guest rooms',function(v){return v.rooms}],['Air conditioning',function(v){return v.ac}]]
      .filter(function(r){return V.some(function(v){return String(r[1](v)||'').trim()})});
    el.hidden=!rows.length; if(!rows.length)return;
    var h='<table class="cmp"><thead><tr><td></td>'+V.map(function(v,i){return '<th scope="col"><a href="'+HREF[i]+'">'+esc(vn(v))+'</a></th>'}).join('')+'</tr></thead><tbody>'
      +'<tr><th scope="row">'+tr('Type')+'</th>'+V.map(function(v){return '<td>'+esc(tr(v.kind))+'</td>'}).join('')+'</tr>'
      +rows.map(function(r){return '<tr><th scope="row">'+tr(r[0])+'</th>'+V.map(function(v){var x=String(r[1](v)||'').trim(); return '<td>'+(x?esc(x):'<span class="dash">–</span>')+'</td>'}).join('')+'</tr>'}).join('')
      +'<tr class="go"><td></td>'+V.map(function(v,i){return '<td><a class="btn btn-gold" href="'+HREF[i]+'">'+tr('View venue')+'</a></td>'}).join('')+'</tr></tbody></table>';
    $('#cmpWrap').innerHTML=h;
  }
  function renderIg(){
    var el=$('#igSec'); if(!el)return; var ig=CFG.ig||{}, hd=String(ig.handle||'').replace(/^@/,'').replace(/[^\w.]/g,'');
    el.hidden=!hd; if(!hd)return;
    var url=/^https:\/\//.test(ig.link||'')?ig.link:'https://www.instagram.com/'+hd+'/';
    $('#igHandle').textContent='@'+hd; $('#igBtn').href=url;
    var ph=[]; CFG.gallery.filter(validId).forEach(function(x){ph.push(x)}); CFG.venues.forEach(function(v){if(validId(v.photo))ph.push(v.photo); v.gallery.filter(validId).forEach(function(x){ph.push(x)})});
    ph=ph.filter(function(x,i){return ph.indexOf(x)===i}).slice(0,6);
    $('#igGrid').innerHTML=ph.map(function(id){return '<a href="'+esc(url)+'" target="_blank" rel="noopener" aria-label="Open Instagram" style="background-image:url('+pUrl(id)+')"></a>'}).join('');
    $('#igGrid').hidden=!ph.length;
  }
  /* photo tile (opens the viewer) */
  function tile(id){return '<div role="button" tabindex="0" data-src="'+esc(id)+'" aria-label="Open photo" style="background-image:url('+pUrl(id)+')"></div>'}
  var rotI=0;
  function startRot(){
    var rw=$$('#rot span'); if(!rw.length||reduce)return;
    setInterval(function(){var prev=rotI; rotI=(rotI+1)%rw.length; rw[prev].className='out'; rw[rotI].className='cur'; setTimeout(function(){rw[prev].className=''},950)},2600);
  }

  /* ---------- venue page ---------- */
  var seatM='b', cm, cy, cSel=null, startM, startY, TD=new Date();
  function renderVenue(){
    var v=CFG.venues[VI];
    $('#vArt').innerHTML=artHtml(VI,v.photo);
    $('#vKind').textContent=tr(v.kind); $('#vName').textContent=vn(v); $('#vBlurb').textContent=tr(v.blurb);
    document.title=vn(v)+' | '+CFG.brand;
    var loc=[v.city,v.address].filter(Boolean).join(' · '), lo=$('#vLoc'); lo.textContent=loc; lo.hidden=!loc;
    var ab=$('#vAbout'); ab.textContent=v.about||''; ab.hidden=!v.about;
    var fs=factsOf(v,4), fe=$('#vFacts'); fe.hidden=!fs.length; fe.innerHTML=fs.map(function(f){return '<div><b>'+esc(f.v)+'</b>'+esc(tr(f.l))+'</div>'}).join('');
    $('#vAboutSec').hidden=!v.about; $('#vChips').innerHTML=fs.map(function(f){return '<span class="chip">'+esc(f.v)+' '+esc(tr(f.l))+'</span>'}).join('');
    var g=v.gallery.filter(validId), gs=$('#vGalSec'); gs.hidden=!g.length;
    $('#vGal').innerHTML=g.map(function(id){return tile(id)}).join('');
    renderVenueExtras(v);
    $('#others').innerHTML=CFG.venues.map(function(o,i){if(i===VI)return '';return '<a class="vcard rv in" href="'+HREF[i]+'">'+artHtml(i,o.photo)+'<div class="eyebrow" data-dyn>'+esc(tr(o.kind))+'</div><h3>'+esc(vn(o))+'</h3><span class="go" data-dyn>'+tr('Explore')+' →</span></a>'}).join('');
    /* restaurant menu on Sartaj Haveli */
    var ms=$('#menuSec'); if(ms&&ms.getAttribute('data-on')==='1'){
      setPh($('#dishArt'),CFG.media.dish);
      $('#menu').innerHTML=CFG.menu.filter(function(x){return String(x.n).trim()}).map(function(x){var k=x.k==='Non-veg'?'Non-veg':'Veg'; return '<li data-k="'+k+'"><span data-dyn>'+esc(tr(x.n))+(x.p?'<i class="pr"> '+esc(x.p)+'</i>':'')+'</span><small>'+tr(k)+'</small></li>'}).join('');
      var mf=$('#mchips [aria-pressed="true"]'); filterMenu(mf?mf.getAttribute('data-d'):'All');
      var mn=$('#menuNote'); mn.hidden=!!CFG.flags.menu;
    }
    var sn=$('#seatNote'); sn.textContent=CFG.flags.cap?tr('Guests in this layout.'):tr('Guests in this layout. Sample figures until your real capacities are added.');
    var cn=$('#calNote'); cn.textContent=CFG.flags.cal?tr('Dates marked as booked are not available. Choose an open date and send it to us.'):tr('Sample dates only. We will connect this to your real bookings.');
    drawSeat(); drawCal();
  }
  function renderVenueExtras(v){
    var q=encodeURIComponent(mapQ(v)), has=!!(v.address||CFG.address||v.city), ms=$('#vMapSec');
    if(ms){ms.hidden=!has;
      if(has){
        var mp=$('#vMap'); var src='https://maps.google.com/maps?q='+q+'&output=embed'; if(mp.getAttribute('data-q')!==q){mp.setAttribute('data-q',q); mp.innerHTML='<iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+src+'"></iframe>'}
        $('#vDir').href='https://www.google.com/maps/dir/?api=1&destination='+q;
        var rows=''; function r(ic,t){if(t)rows+='<li><b>'+ic+'</b><span>'+esc(t)+'</span></li>'}
        r(tr('Address'),[v.address||CFG.address,v.city].filter(Boolean).join(', ')); r(tr('Parking'),v.parking); r('Near',v.landmark);
        $('#vInfo').innerHTML=rows; $('#vInfo').hidden=!rows;
      }}
    var ts=$('#vTourSec'); if(ts){var t=String(v.tour||'').trim(), yid=ytId(t), box=$('#vTour'); ts.hidden=!(yid||isVid(t));
      if(yid)box.innerHTML='<iframe title="Walk-through video" loading="lazy" allowfullscreen src="https://www.youtube-nocookie.com/embed/'+yid+'"></iframe>';
      else if(isVid(t))box.innerHTML='<video controls playsinline preload="metadata" src="'+esc(t)+'"></video>'; else box.innerHTML='';}
  }
  function filterMenu(d){$$('#menu li').forEach(function(li){li.hidden=!(d==='All'||li.getAttribute('data-k')===d)})}
  function circ(cx,cy,r,cls,d){return '<circle class="'+cls+' pop" cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="animation-delay:'+d+'ms"/>'}
  function drawSeat(){
    var s='<rect class="s-stage pop" x="170" y="12" width="300" height="30" rx="8"/><text class="s-label" x="320" y="32" text-anchor="middle">'+tr('STAGE')+'</text>';
    if(seatM==='b'){
      for(var r=0;r<3;r++)for(var c=0;c<5;c++){var cx=90+c*115, cyy=105+r*100, d=(r*5+c)*45; s+=circ(cx,cyy,24,'s-table',d); for(var k=0;k<8;k++){var a=k*Math.PI/4; s+=circ((cx+Math.cos(a)*35).toFixed(1),(cyy+Math.sin(a)*35).toFixed(1),4.5,'s-seat',d+120)}}
    } else if(seatM==='t'){
      for(var r2=0;r2<9;r2++)for(var c2=0;c2<22;c2++){if(c2===10||c2===11)continue; s+='<rect class="s-row pop" x="'+(48+c2*24)+'" y="'+(70+r2*32)+'" width="16" height="16" rx="4" style="animation-delay:'+((r2*22+c2)*8)+'ms"/>'}
    } else {
      for(var r3=0;r3<4;r3++)for(var c3=0;c3<8;c3++){var x=60+c3*72+(r3%2?36:0), y=88+r3*74, d3=(r3*8+c3)*30; s+=circ(x,y,13,'s-high',d3)+circ(x-26,y+4,4,'s-seat',d3+100)+circ(x+26,y-4,4,'s-seat',d3+100)+circ(x+4,y+26,4,'s-seat',d3+100)}
    }
    $('#seatSvg').innerHTML=s;
    var n=+CFG.venues[VI].cap[seatM]||0, el=$('#seatCap'), from=+(el.getAttribute('data-v')||0); el.setAttribute('data-v',n);
    if(reduce){el.textContent=n.toLocaleString('en-IN');return}
    var t0=performance.now(); cancelAnimationFrame(el._r);
    (function st(t){var k=clamp((t-t0)/650,0,1), e=1-Math.pow(1-k,3); el.textContent=Math.round(from+(n-from)*e).toLocaleString('en-IN'); if(k<1)el._r=requestAnimationFrame(st)})(t0);
  }
  function booked(y,m,d){
    if(CFG.flags.cal)return (CFG.venues[VI].booked||[]).indexOf(y+'-'+pad2(m+1)+'-'+pad2(d))>-1;
    var dow=new Date(y,m,d).getDay(), h=(d*7+m*13+VI*5+y)%10; return (dow===0||dow===6)?h<6:h<2;
  }
  function drawCal(){
    if(cm===undefined){cm=TD.getMonth();cy=TD.getFullYear();startM=cm;startY=cy}
    $('#calTitle').textContent=MON[LANG][cm]+' '+cy;
    var first=new Date(cy,cm,1).getDay(), days=new Date(cy,cm+1,0).getDate(), h='', today=new Date(TD.getFullYear(),TD.getMonth(),TD.getDate());
    DOW[LANG].forEach(function(x){h+='<div class="dow" aria-hidden="true">'+x+'</div>'});
    for(var i=0;i<first;i++)h+='<button class="day empty" tabindex="-1" aria-hidden="true"></button>';
    for(var d=1;d<=days;d++){
      var b=booked(cy,cm,d), key=cy+'-'+cm+'-'+d, dis=b||(new Date(cy,cm,d)<today);
      h+='<button class="day'+(cSel===key?' sel':'')+'" data-d="'+d+'"'+(dis?' disabled':'')+' aria-label="'+d+' '+MON[LANG][cm]+tr(b?', booked':', open')+'">'+d+'</button>';
    }
    $('#cal').innerHTML=h; setPick();
  }
  var calSel=null;
  function setPick(){
    var el=$('#calPick'), use=$('#calUse'); if(!calSel){el.textContent=tr('Choose an open date.');use.hidden=true;return}
    var v=CFG.venues[VI], ds=calSel.toLocaleDateString(LOC[LANG],{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    el.textContent=LANG==='pa'?v.name+' ਵਿੱਚ '+ds+' ਖਾਲੀ ਹੈ।':(LANG==='hi'?v.name+' में '+ds+' ख़ाली है।':ds+' is open at '+v.name+'.');
    use.hidden=false; use.href='contact.html?venue='+VI+'&date='+calSel.getFullYear()+'-'+pad2(calSel.getMonth()+1)+'-'+pad2(calSel.getDate())+'#enquire';
  }

  /* ---------- packages page ---------- */
  var pkI=1, addOn=[];
  function pkInfo(){
    var g=+$('#pkGuests').value, total=EFF(pkI)*g, names=[];
    CFG.addons.forEach(function(a,i){if(addOn[i]){total+=a.per?(+a.fee||0)*g:(+a.fee||0);names.push(lc1(a.name))}});
    return {g:g,total:total,names:names};
  }
  function renderPackages(){
    if(addOn.length!==CFG.addons.length)addOn=CFG.addons.map(function(){return false});
    pkI=clamp(pkI,0,CFG.plates.length-1);
    $('#pkGrid').innerHTML=CFG.plates.map(function(p,i){return '<button class="pk" aria-pressed="'+(i===pkI)+'" data-p="'+i+'"><b data-dyn>'+esc(p.name)+'</b><span class="price" data-dyn>'+priceHtml(i)+'</span><ul data-dyn>'+p.items.filter(function(x){return String(x).trim()}).map(function(x){return '<li>'+esc(tr(x))+'</li>'}).join('')+'</ul></button>'}).join('');
    $('#addons').innerHTML=CFG.addons.map(function(a,i){return '<button class="add" aria-pressed="'+!!addOn[i]+'" data-a="'+i+'" data-dyn>'+esc(tr(a.name))+' +'+inr(+a.fee||0)+(a.per?' '+tr('per plate'):'')+'</button>'}).join('');
    $('#saleBar').innerHTML=saleOn()?'<span class="sale-badge" data-dyn>'+esc(CFG.sale.name||'Sale')+' · '+(+CFG.sale.pct)+'% off</span>':'';
    var sub=$('#pkSub'); sub.textContent=CFG.flags.prices?tr('Pick a package, add what you need and drag the guest count.'):tr('Pick a package, add what you need and drag the guest count. Prices below are samples until you share your real rates.');
    pkCalc();
  }
  function pkLine(){
    var I=pkInfo(), pn=CFG.plates[pkI].name, pr=inr(EFF(pkI)), nl=I.names.map(tr).join(', '), tt=inr(I.total), smp=!CFG.flags.prices, out={};
    if(LANG==='pa'){out.line=pn+' ਪੈਕੇਜ, ਪ੍ਰਤੀ ਪਲੇਟ '+pr+', '+I.g+' ਮਹਿਮਾਨਾਂ ਲਈ'+(nl?', ਨਾਲ '+nl:'')+(smp?'। ਨਮੂਨਾ ਕੀਮਤਾਂ।':'।'); out.msg=pn+' ਪੈਕੇਜ'+(nl?' ਨਾਲ '+nl:'')+', ਲਗਭਗ '+tt+', '+I.g+' ਮਹਿਮਾਨਾਂ ਲਈ'}
    else if(LANG==='hi'){out.line=pn+' पैकेज, '+pr+' प्रति प्लेट, '+I.g+' मेहमानों के लिए'+(nl?', साथ में '+nl:'')+(smp?'। नमूना क़ीमतें।':'।'); out.msg=pn+' पैकेज'+(nl?' के साथ '+nl:'')+', लगभग '+tt+', '+I.g+' मेहमानों के लिए'}
    else{out.line=pn+' at '+pr+' per plate for '+I.g+' guests'+(nl?', plus '+nl:'')+(smp?'. Sample prices.':'.'); out.msg=pn+' package'+(nl?' with '+nl:'')+', about '+tt+' for '+I.g+' guests'}
    out.total=I.total; out.g=I.g; return out;
  }
  function pkCalc(){
    var o=pkLine(); $('#pkOut').textContent=o.g;
    var el=$('#pkTotal'), from=+(el.getAttribute('data-v')||0); el.setAttribute('data-v',o.total);
    if(reduce)el.textContent=inr(o.total); else{var t0=performance.now(); cancelAnimationFrame(el._r); (function st(t){var k=clamp((t-t0)/600,0,1), e=1-Math.pow(1-k,3); el.textContent=inr(from+(o.total-from)*e); if(k<1)el._r=requestAnimationFrame(st)})(t0)}
    $('#pkLine').textContent=o.line;
    $('#pkSend').href='contact.html?guests='+o.g+'&pkg='+encodeURIComponent(o.msg)+'#enquire';
  }

  /* ---------- gallery page ---------- */
  function renderGallery(){
    var all=[]; CFG.gallery.filter(validId).forEach(function(id){all.push(id)});
    CFG.venues.forEach(function(v){if(validId(v.photo))all.push(v.photo); v.gallery.filter(validId).forEach(function(id){all.push(id)})});
    var seen={}; all=all.filter(function(id){if(seen[id])return false; seen[id]=1; return true});
    $('#galGrid').className='gal'+(all.length?'':' soft');
    $('#galGrid').innerHTML=all.length?all.map(function(id){return tile(id)}).join(''):'<div></div><div></div><div></div><div></div><div></div><div></div>';
    $('#galEmpty').hidden=!!all.length;
    var b=CFG.media.baBefore, a=CFG.media.baAfter, bs=$('#baSec'); bs.hidden=!(validId(b)&&validId(a));
    $('#baBefore').style.backgroundImage=validId(b)?'url('+pUrl(b)+')':''; $('#baAfter').style.backgroundImage=validId(a)?'url('+pUrl(a)+')':'';
  }

  /* ---------- contact page ---------- */
  function renderContact(){
    var q=new URLSearchParams(location.search);
    var fv=$('#fVenue'), k=fv.selectedIndex; fv.innerHTML='<option>Any venue</option>'+CFG.venues.map(function(v){return '<option>'+esc(v.name)+'</option>'}).join('');
    if(q.get('venue')!==null&&!fv._set){fv.selectedIndex=clamp((+q.get('venue'))+1,0,4); fv._set=1} else fv.selectedIndex=Math.max(0,k);
    if(!$('#fDate')._set){if(q.get('date')&&/^\d{4}-\d{2}-\d{2}$/.test(q.get('date')))$('#fDate').value=q.get('date'); if(q.get('guests'))$('#fGuests').value=clamp(+q.get('guests')||0,0,5000)||''; $('#fDate')._set=1}
    var rows='';
    function row(l,v){if(v)rows+='<div><small>'+l+'</small>'+v+'</div>'}
    row(tr('Address'),esc(CFG.address)); row(tr('Phone'),CFG.phone?'<a href="tel:+'+digits(CFG.phone)+'">'+esc(CFG.phone)+'</a>':''); row('WhatsApp',digits(CFG.wa)?'<a href="https://wa.me/'+digits(CFG.wa)+'" target="_blank" rel="noopener">'+esc(CFG.wa)+'</a>':'');
    row('Email',esc(CFG.email)); row(tr('Opening hours'),esc(CFG.hours)); row(tr('Directions'),/^https?:\/\//.test(CFG.maps||'')?'<a href="'+esc(CFG.maps)+'" target="_blank" rel="noopener">Google Maps</a>':'');
    var ie=$('#cInfo'); ie.hidden=!rows; ie.innerHTML=rows;
    $('#waNote').hidden=!!digits(CFG.wa);
    renderFaq(); renderMsg();
  }
  function renderFaq(){
    var el=$('#faqSec'); if(!el)return; var f=(CFG.faq||[]).filter(function(x){return String(x.q).trim()&&String(x.a).trim()}); el.hidden=!f.length;
    $('#faqList').innerHTML=f.map(function(x){return '<details><summary>'+esc(x.q)+'</summary><p>'+esc(x.a)+'</p></details>'}).join('');
    var wa=digits(CFG.wa), b=$('#faqWa'); if(b){b.hidden=!wa; if(wa)b.href='https://wa.me/'+wa+'?text='+encodeURIComponent('Hello '+CFG.brand+', I have a question.')}
  }
  var PKG=(function(){try{return new URLSearchParams(location.search).get('pkg')||''}catch(x){return ''}})();
  function renderMsg(){
    var b=$('#bubble'); if(!b)return;
    var nm=$('#fName').value.trim(), phone=$('#fPhone').value.trim(), e=$('#fEvent').value, food=($('#fFood').selectedIndex>0?$('#fFood').value:''), bud=$('#fBudget').value.trim(), v=$('#fVenue').value, d=$('#fDate').value, n=$('#fGuests').value, anyV=($('#fVenue').selectedIndex===0), BR=CFG.brand, msg;
    if(LANG==='pa') msg='ਸਤ ਸ੍ਰੀ ਅਕਾਲ, '+BR+' ਜੀ। ਮੇਰਾ ਨਾਮ '+(nm||'[ਤੁਹਾਡਾ ਨਾਮ]')+' ਹੈ। ਮੈਨੂੰ '+e+' ਲਈ ਤਾਰੀਖ਼ ਅਤੇ ਪੈਕੇਜ ਦੀ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।'+(anyV?'':' ਵੈਨਿਊ: '+v+'।')+(d?' ਤਾਰੀਖ਼: '+d+'।':'')+(n?' ਮਹਿਮਾਨ: ਲਗਭਗ '+n+'।':'')+(food?' ਖਾਣਾ: '+food+'।':'')+(bud?' ਬਜਟ: ਪ੍ਰਤੀ ਪਲੇਟ '+bud+'।':'')+(PKG?' ਮੈਨੂੰ ਇਹ ਪਸੰਦ ਹੈ: '+PKG+'।':'')+(phone?' ਮੇਰਾ ਫ਼ੋਨ: '+phone+'।':'');
    else if(LANG==='hi') msg='नमस्ते '+BR+' जी। मेरा नाम '+(nm||'[आपका नाम]')+' है। मुझे '+e+' के लिए तारीख़ और पैकेज की जानकारी चाहिए।'+(anyV?'':' वेन्यू: '+v+'।')+(d?' तारीख़: '+d+'।':'')+(n?' मेहमान: लगभग '+n+'।':'')+(food?' भोजन: '+food+'।':'')+(bud?' बजट: प्रति प्लेट '+bud+'।':'')+(PKG?' मुझे यह पसंद है: '+PKG+'।':'')+(phone?' मेरा फ़ोन: '+phone+'।':'');
    else msg='Hello '+BR+', I am '+(nm||'[your name]')+'. I am planning a '+e.toLowerCase()+(anyV?'':' at '+v)+(d?' on '+d:'')+(n?' for about '+n+' guests':'')+'.'+(food?' Food: '+food.toLowerCase()+'.':'')+(bud?' Budget is about '+bud+' per plate.':'')+(PKG?' I like the '+PKG+'.':'')+' Please share availability and packages.'+(phone?' You can reach me on '+phone+'.':'');
    b.textContent=msg;
    var wa=digits(CFG.wa), a=$('#waSend'); a.hidden=!wa; if(wa)a.href='https://wa.me/'+wa+'?text='+encodeURIComponent(msg);
  }

  function renderStory(){
    var st=CFG.story||{}, tx=String(st.text||'').trim(), el=$('#stBody');
    $('#stTitle').textContent=st.title||'Our story';
    $('#stEmpty').hidden=!!tx; $('#stMain').hidden=!tx; if(!tx)return;
    el.innerHTML=tx.split(/\n\s*\n/).map(function(p){return '<p>'+esc(p.trim()).replace(/\n/g,'<br>')+'</p>'}).join('');
    var ph=$('#stPhoto'); setPh(ph,st.photo);
    var sg=$('#stSign'); sg.innerHTML=(st.name?'<b>'+esc(st.name)+'</b>':'')+(st.role?'<small>'+esc(st.role)+'</small>':''); sg.hidden=!(st.name||st.role);
  }

  /* ---------- photo viewer ---------- */
  var LB={list:[],i:0,x:0};
  function lbOpen(box,tile){
    LB.list=Array.prototype.slice.call(box.querySelectorAll(':scope > [data-src]')).map(function(t){return t.getAttribute('data-src')}); LB.i=Math.max(0,LB.list.indexOf(tile.getAttribute('data-src')));
    LB.back=document.activeElement; $('#lb').hidden=false; document.body.classList.add('lock'); lbShow(); $('#lb .lb-x').focus();
  }
  function lbShow(){var n=LB.list.length; $('#lbImg').src=LB.list[LB.i]; $('#lbC').textContent=(LB.i+1)+' / '+n; $('#lb').classList.toggle('one',n<2)}
  function lbGo(d){var n=LB.list.length; if(n<2)return; LB.i=(LB.i+d+n)%n; lbShow()}
  function lbClose(){$('#lb').hidden=true; document.body.classList.remove('lock'); $('#lbImg').removeAttribute('src'); if(LB.back&&LB.back.focus)LB.back.focus()}

  /* ---------- render everything ---------- */
  function renderAll(){
    renderChrome();
    if(PAGE==='home')renderHome();
    if(PAGE==='venue')renderVenue();
    if(PAGE==='packages')renderPackages();
    if(PAGE==='gallery')renderGallery();
    if(PAGE==='contact')renderContact();
    if(PAGE==='packages')renderFaq();
    if(PAGE==='story')renderStory();
    i18n(document.body);
    observe();
  }
  var io=null;
  function observe(){
    var els=$$('.rv:not(.in)');
    if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
    if(!io)io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(e){io.observe(e)});
  }
  function setLang(l){LANG=l; try{localStorage.setItem('srg_lang',l)}catch(x){} renderAll()}

  /* ---------- events (delegated, so re-rendering is safe) ---------- */
  document.addEventListener('click',function(e){
    var t=e.target, b;
    if((b=t.closest('[data-l]'))){setLang(b.getAttribute('data-l'));hideLang();return}
    if(t.closest('[data-lbx]')||t.id==='lb'){lbClose();return}
    if(t.closest('[data-lbp]')){lbGo(-1);return}
    if(t.closest('[data-lbn]')){lbGo(1);return}
    if((b=t.closest('[data-src]'))&&b.parentNode&&(b.parentNode.classList.contains('gal'))){lbOpen(b.parentNode,b);return}
    if(t.closest('[data-cb]')){e.preventDefault();var mm=$('#mmenu');if(mm)mm.classList.remove('open');openCb();return}
    if(t.closest('#burger')){var m=$('#mmenu'),o=m.classList.toggle('open');$('#burger').setAttribute('aria-expanded',o);return}
    if(t.closest('#cbClose')||t.id==='cbModal'){closeCb();return}
    if((b=t.closest('#seatLayout .pill'))){seatM=b.getAttribute('data-m');$$('#seatLayout .pill').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});drawSeat();return}
    if(t.closest('#calPrev')){if(cy===startY&&cm===startM)return;cm--;if(cm<0){cm=11;cy--}drawCal();return}
    if(t.closest('#calNext')){if((cy-startY)*12+(cm-startM)>=12)return;cm++;if(cm>11){cm=0;cy++}drawCal();return}
    if((b=t.closest('#cal .day[data-d]'))){var d=+b.getAttribute('data-d'); cSel=cy+'-'+cm+'-'+d; calSel=new Date(cy,cm,d); drawCal();return}
    if((b=t.closest('.pk[data-p]'))&&PAGE==='packages'){pkI=+b.getAttribute('data-p');$$('.pk').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});pkCalc();return}
    if((b=t.closest('.add[data-a]'))){var i=+b.getAttribute('data-a');addOn[i]=!addOn[i];b.setAttribute('aria-pressed',addOn[i]?'true':'false');pkCalc();return}
    if((b=t.closest('#mchips .mchip'))){$$('#mchips .mchip').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});filterMenu(b.getAttribute('data-d'));return}
    if(t.closest('#copyBtn')){
      var txt=$('#bubble').textContent, ok=$('#copied');
      var done=function(){ok.hidden=false;setTimeout(function(){ok.hidden=true},1800)};
      var fb=function(){var r=document.createRange();r.selectNodeContents($('#bubble'));var s=window.getSelection();s.removeAllRanges();s.addRange(r);done()};
      try{navigator.clipboard.writeText(txt).then(done,fb)}catch(x){fb()}
    }
  });
  document.addEventListener('submit',function(e){if(e.target.id==='cbForm')submitCb(e); else if(e.target.id==='enqForm')e.preventDefault()});
  document.addEventListener('input',function(e){
    if(e.target.id==='pkGuests')pkCalc();
    else if(e.target.closest&&e.target.closest('#enqForm'))renderMsg();
    else if(e.target.id==='baRange')$('#ba').style.setProperty('--p',e.target.value+'%');
  });
  document.addEventListener('change',function(e){if(e.target.closest&&e.target.closest('#enqForm'))renderMsg()});
  document.addEventListener('touchstart',function(e){if(e.target.closest&&e.target.closest('#lb')&&e.touches.length===1)LB.x=e.touches[0].clientX},{passive:true});
  document.addEventListener('touchend',function(e){if(e.target.closest&&e.target.closest('#lb')&&e.changedTouches.length){var d=e.changedTouches[0].clientX-LB.x; if(Math.abs(d)>50)lbGo(d<0?1:-1)}},{passive:true});
  document.addEventListener('keydown',function(e){
    var lb=$('#lb'); if(lb&&!lb.hidden){if(e.key==='Escape')lbClose(); else if(e.key==='ArrowLeft')lbGo(-1); else if(e.key==='ArrowRight')lbGo(1); return}
    if((e.key==='Enter'||e.key===' ')&&e.target.getAttribute&&e.target.getAttribute('data-src')&&e.target.parentNode.classList.contains('gal')){e.preventDefault();lbOpen(e.target.parentNode,e.target);return}
    if(e.key==='Escape'&&$('#langModal')&&!$('#langModal').hidden){setLang('en');hideLang();return} if(e.key==='Escape'&&$('#cbModal')&&!$('#cbModal').hidden)closeCb()});

  /* ---------- boot ---------- */
  injectExtras(); renderAll(); startRot();
  /* ---------- admin preview mode (the admin shows this page in a frame) ---------- */
  var PREV=/[?&]preview=1/.test(location.search);
  if(PREV){
    document.documentElement.classList.add('srg-prev');
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a'); if(a){e.preventDefault()}},true);
    window.addEventListener('message',function(e){
      if(e.origin!==location.origin||!e.data||typeof e.data!=='object')return;
      if(e.data.srg==='cfg'){CFG=build(e.data.cfg||{}); renderAll()}
      if(e.data.srg==='focus'){
        var old=document.querySelector('.srg-hl'); if(old)old.classList.remove('srg-hl');
        var tg=document.querySelector('.srg-tag'); if(tg)tg.remove();
        document.querySelectorAll('.rv').forEach(function(x){x.classList.add('in')});
        var el=document.querySelector(String(e.data.sel||'')); if(!el)return;
        var note='Your photo shows here';
        if(el.hidden){el.hidden=false; note=e.data.force||'This section appears once you add a photo'}
        el.classList.add('srg-hl'); el.scrollIntoView({block:'center'});
        var t=document.createElement('div'); t.className='srg-tag'; t.textContent='\u25BC '+note; document.body.appendChild(t);
      }
    });
    try{parent.postMessage({srg:'ready'},location.origin)}catch(x){}
  }
  function applyCfg(j){ if(j&&typeof j==='object'&&Object.keys(j).length){CFG=build(j); renderAll(); return true} return false }
  function fromFile(){ fetch('site-content.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(applyCfg).catch(function(){}) }
  if(PREV){} else if(SBOK){
    fetch(SB.url+'/rest/v1/site_config?id=eq.1&select=data',{headers:sbH(),cache:'no-store'}).then(function(r){return r.ok?r.json():[]})
      .then(function(rows){ if(!(rows&&rows[0]&&applyCfg(rows[0].data)))fromFile() }).catch(fromFile);
  } else fromFile();
})();
