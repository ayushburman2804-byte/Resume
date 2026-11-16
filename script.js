(function(){
  var root=document.documentElement;
  try{ if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches) root.setAttribute("data-theme","light"); }catch(e){}
  document.getElementById("theme").onclick=function(){ root.setAttribute("data-theme", root.getAttribute("data-theme")==="light"?"dark":"light"); };

  var LABELS=["a national case comp win","₹2 lakh+ in sales","a founder’s office seat","a social media campaign","2 lakh+ linkedin impressions","a mystery box turned 20×","32 participants onboarded","a campus ambassadorship","a gold medal in swimming","a power bi dashboard","a mckinsey forward badge","a runner-up finish"];
  var box=document.getElementById("luck"),bk=document.getElementById("bk"),bkl=document.getElementById("bkl"),cnt=document.getElementById("count"),wide=document.getElementById("wide");
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){ cnt.textContent="animation paused (reduced motion)"; return; }
  var W=box.clientWidth,H=box.clientHeight,bx=W/2,tx=W/2,bw=160,items=[],caught=0,spawn=0,last=performance.now(),lastInput=0,keys={},idx=0,t0=last;
  function measure(){W=box.clientWidth;H=box.clientHeight;}
  function width(){return 120+wide.value*3;}
  function pointer(x){tx=x-box.getBoundingClientRect().left;lastInput=performance.now();}
  box.addEventListener("mousemove",function(e){pointer(e.clientX);});
  box.addEventListener("touchmove",function(e){pointer(e.touches[0].clientX);},{passive:true});
  box.addEventListener("touchstart",function(e){pointer(e.touches[0].clientX);},{passive:true});
  window.addEventListener("keydown",function(e){if(e.key==="ArrowLeft")keys.l=1;if(e.key==="ArrowRight")keys.r=1;lastInput=performance.now();});
  window.addEventListener("keyup",function(e){if(e.key==="ArrowLeft")keys.l=0;if(e.key==="ArrowRight")keys.r=0;});
  window.addEventListener("resize",measure);
  function make(){
    var el=document.createElement("span");el.className="fall";el.textContent=LABELS[idx++%LABELS.length];box.appendChild(el);
    var w=el.offsetWidth;items.push({el:el,w:w,x:16+Math.random()*Math.max(1,W-w-32),y:-24,v:50+Math.random()*40,got:false});
  }
  function frame(now){
    var dt=Math.min((now-last)/1000,0.05);last=now;
    if(!document.hidden){
      bw=width();
      if(keys.l)tx-=420*dt;if(keys.r)tx+=420*dt;
      if(now-lastInput>2500)tx=W/2+Math.sin((now-t0)/1400)*W*0.32;
      tx=Math.max(bw/2,Math.min(W-bw/2,tx));
      bx+=(tx-bx)*Math.min(1,dt*9);
      bk.style.width=bw+"px";bk.style.transform="translateX("+(bx-bw/2)+"px)";
      bkl.style.transform="translateX("+(bx-50)+"px)";
      spawn-=dt;if(spawn<=0&&items.length<7){make();spawn=0.9;}
      var top=H-58-26;
      for(var i=items.length-1;i>=0;i--){
        var f=items[i];
        if(f.got){f.life-=dt;f.el.style.opacity=Math.max(0,f.life/0.7);if(f.life<=0){f.el.remove();items.splice(i,1);}continue;}
        f.y+=f.v*dt;f.el.style.transform="translate("+f.x+"px,"+f.y+"px)";
        var cx=f.x+f.w/2;
        if(f.y>=top-8&&f.y<=top+8&&cx>bx-bw/2&&cx<bx+bw/2){f.got=true;f.life=0.7;f.el.classList.add("got");caught++;cnt.textContent="caught: "+caught;}
        else if(f.y>H){f.el.remove();items.splice(i,1);}
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

(function(){
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function ease(t){return 1-Math.pow(1-t,3);}
  function count(el,to,dur,fmt){
    if(reduce){el.textContent=fmt(to);return;}
    var s=performance.now();(function go(n){var t=Math.min((n-s)/dur,1);el.textContent=fmt(Math.round(to*ease(t)));if(t<1)requestAnimationFrame(go);})(s);
  }
  // stats count up
  var nums=document.getElementById("numbers"),done=false;
  function runNums(){if(done)return;done=true;nums.querySelectorAll("[data-to]").forEach(function(el){var pre=el.getAttribute("data-pre")||"",suf=el.getAttribute("data-suf")||"";count(el,+el.getAttribute("data-to"),1200,function(v){return pre+v+suf;});});}
  if("IntersectionObserver" in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){runNums();o.disconnect();}},{threshold:.3}).observe(nums);}else{runNums();}
  // mystery box
  var box=document.getElementById("box"),amt=document.getElementById("amt"),note=document.getElementById("amtnote"),opened=false;
  box.onclick=function(){
    if(opened){opened=false;box.textContent="📦";amt.textContent="₹700";amt.classList.remove("win");note.textContent="my mystery box challenge. click the box to open it.";return;}
    opened=true;box.classList.remove("shake");void box.offsetWidth;box.classList.add("shake");
    setTimeout(function(){box.textContent="💰";amt.classList.add("win");note.textContent="₹700 estimated start into ₹14,000 in sales: 20×. click to reset.";
      count(amt,14000,1400,function(v){return "₹"+Math.max(v,700).toLocaleString("en-IN");});},520);
  };
  // hot chocolate scroll mug
  var fill=document.getElementById("fill"),mug=document.getElementById("mug"),tip=document.getElementById("tip");
  function onScroll(){
    var h=document.documentElement.scrollHeight-window.innerHeight,p=h>0?Math.min(1,window.scrollY/h):0;
    fill.style.height=Math.round(p*100)+"%";
    var full=p>0.97;mug.classList.toggle("full",full);tip.textContent=full?"cheers! let\u2019s talk":Math.round(p*100)+"%";
  }
  window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);onScroll();

  // typing helper
  var typers=new WeakMap();
  function typeInto(el,text){var id=(typers.get(el)||0)+1;typers.set(el,id);if(reduce){el.textContent=text;return;}var i=0;(function go(){if(typers.get(el)!==id)return;el.textContent=text.slice(0,i++);if(i<=text.length)setTimeout(go,16);})();}
  function wire(boxId,handler,startKey){
    var wrap=document.getElementById(boxId),btns=wrap.querySelectorAll(".chip");
    btns.forEach(function(b){b.onclick=function(){btns.forEach(function(x){x.classList.remove("on");});b.classList.add("on");handler(b.getAttribute("data-k"));};});
    if(startKey)handler(startKey);
  }

  // what do you need?
  var NEED={
    sales:{h:"i get a crowd interested and close the deal.",l:["<b>₹2 lakh+ in sales</b> at cozee co through direct selling, outreach and social media","<b>32 participants</b> onboarded one-on-one for iimun ranchi","<b>₹700 into ₹14,000</b> in the mystery box challenge by negotiating and deciding fast"]},
    ops:{h:"i work with founders on live priorities.",l:["founder’s office at <b>alfred scholar</b>: research, outreach, briefs and trackers","<b>cozee co</b>: sourcing, pricing, packaging and order fulfilment","won a <b>national-level case competition</b> at iim indore"]},
    social:{h:"i plan it, write it, measure it.",l:["<b>torq wars</b>: content calendar, captions, hooks, posts and reels","<b>2 lakh+ linkedin impressions</b> through regular posting","two influencers (100k+ followers each) for the <b>myfirstvote</b> campaign"]},
    data:{h:"i turn messy data into decisions.",l:["<b>excel</b>: pivot tables, xlookup, power query, data cleaning","<b>sql</b> (select, join, group by) and <b>power bi</b> dashboards with dax basics","an <b>e-commerce sales analysis</b> from raw data to dashboard, plus python basics"]}
  };
  var np=document.getElementById("needpanel");
  wire("needchips",function(k){var d=NEED[k];np.innerHTML="<h3>"+d.h+"</h3><ul>"+d.l.map(function(x){return "<li>"+x+"</li>";}).join("")+"</ul><div class=\"pills\"><a class=\"pill\" href=\"mailto:ayushburman2804@gmail.com?subject=Let%27s%20talk\">talk about this</a></div>";},"sales");

  // timeline
  var TL=[
    "cmhq science outreach: co-led a hands-on science session at local government schools (jun 2023 – jan 2024).",
    "iimun myfirstvote: onboarded 32 participants for iimun ranchi (mar – jul). started as house captain of leopard house. runner-up at carmel summit and infinity by cbcv.",
    "house captain at loyola high school, coordinating students across house events. finished school at loyola high school, jamshedpur (2012 – 2025).",
    "started the bba at iim bangalore and studies at mesa school of business. mystery box challenge. co-founded cozee co. interning at alfred scholar and torq wars."
  ];
  var YEARS=["2023","2024","2025","2026"],tlr=document.getElementById("tlr"),yr=document.getElementById("yr"),tt=document.getElementById("tltext"),tbs=document.querySelectorAll("#tlabels button");
  function showTl(i){yr.textContent=YEARS[i];tt.textContent=TL[i];tbs.forEach(function(b,j){b.classList.toggle("on",j===i);});}
  tlr.oninput=function(){showTl(+tlr.value);};
  tbs.forEach(function(b){b.onclick=function(){tlr.value=b.getAttribute("data-i");showTl(+tlr.value);};});
  showTl(3);

  // ask me anything
  var ASK={
    hire:"i get crowds interested and close the deal: ₹2 lakh+ in sales at cozee co, 32 participants onboarded, a national case competition win. i learn fast and take on real work.",
    win:"winning a national-level case competition at iim indore. also close to my heart: turning an estimated ₹700 into ₹14,000 in the mystery box challenge.",
    learn:"data: excel, sql, power bi and python basics. and how a business really runs, by co-founding cozee co and working in a founder’s office.",
    next:"a business internship with real work, where i can learn fast and take on live problems. open to sales, strategy, growth or data."
  };
  var ap=document.getElementById("askpanel");
  wire("askchips",function(k){typeInto(ap,ASK[k]);},null);

  // jump palette (press /)
  var pal=document.getElementById("pal"),pq=document.getElementById("palq"),pl=document.getElementById("pall"),sel=0,cur=[];
  var CMDS=[
    {t:"home",h:"#home"},{t:"what do you need?",h:"#need"},{t:"what i do",h:"#work"},{t:"timeline",h:"#timeline"},{t:"wins",h:"#wins"},{t:"side quests",h:"#quests"},{t:"ask me anything",h:"#ask"},{t:"contact",h:"#contact"},
    {t:"email ayush",h:"mailto:ayushburman2804@gmail.com"},{t:"open linkedin",h:"https://linkedin.com/in/ayush-burman-362874417",ext:1},{t:"toggle light / dark",fn:function(){document.getElementById("theme").click();}}
  ];
  function draw(){var q=pq.value.toLowerCase();cur=CMDS.filter(function(c){return c.t.indexOf(q)>-1;});sel=0;pl.innerHTML="";cur.forEach(function(c,i){var li=document.createElement("li");li.textContent=c.t;if(i===0)li.className="sel";li.onclick=function(){run(c);};pl.appendChild(li);});}
  function run(c){close();if(c.fn)c.fn();else if(c.ext)window.open(c.h,"_blank","noopener");else location.href=c.h;}
  function open(){pal.classList.remove("hidden");pq.value="";draw();pq.focus();}
  function close(){pal.classList.add("hidden");}
  function mark(){Array.prototype.forEach.call(pl.children,function(li,i){li.classList.toggle("sel",i===sel);});}
  window.addEventListener("keydown",function(e){
    var typing=/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName||"");
    if(e.key==="/"&&!typing){e.preventDefault();open();return;}
    if(pal.classList.contains("hidden"))return;
    if(e.key==="Escape")close();
    else if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(sel+1,cur.length-1);mark();}
    else if(e.key==="ArrowUp"){e.preventDefault();sel=Math.max(sel-1,0);mark();}
    else if(e.key==="Enter"&&cur[sel])run(cur[sel]);
  });
  pq.oninput=draw;pal.addEventListener("click",function(e){if(e.target===pal)close();});
})();
