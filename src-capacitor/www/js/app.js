(function(e){function t(t){for(var o,a,s=t[0],c=t[1],d=t[2],l=0,u=[];l<s.length;l++)a=s[l],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&u.push(r[a][0]),r[a]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);f&&f(t);while(u.length)u.shift()();return i.push.apply(i,d||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],o=!0,a=1;a<n.length;a++){var s=n[a];0!==r[s]&&(o=!1)}o&&(i.splice(t--,1),e=c(c.s=n[0]))}return e}var o={},a={2:0},r={2:0},i=[];function s(e){return c.p+"js/"+({1:"chunk-common"}[e]||e)+".js"}function c(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n={1:1,3:1,4:1,5:1,6:1,7:1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var o="css/"+({1:"chunk-common"}[e]||e)+"."+{1:"041fceb5",3:"c613b2a5",4:"aad2a182",5:"72a5b154",6:"6d0953f1",7:"5880dbc5",8:"31d6cfe0",9:"31d6cfe0",10:"31d6cfe0",11:"31d6cfe0",12:"31d6cfe0",13:"31d6cfe0",14:"31d6cfe0",15:"31d6cfe0",16:"31d6cfe0",17:"31d6cfe0",18:"31d6cfe0"}[e]+".css",r=c.p+o,i=document.getElementsByTagName("link"),s=0;s<i.length;s++){var d=i[s],l=d.getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(l===o||l===r))return t()}var u=document.getElementsByTagName("style");for(s=0;s<u.length;s++){d=u[s],l=d.getAttribute("data-href");if(l===o||l===r)return t()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=t,f.onerror=function(t){var o=t&&t.target&&t.target.src||r,i=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=o,delete a[e],f.parentNode.removeChild(f),n(i)},f.href=r;var p=document.getElementsByTagName("head")[0];p.appendChild(f)})).then((function(){a[e]=0})));var o=r[e];if(0!==o)if(o)t.push(o[2]);else{var i=new Promise((function(t,n){o=r[e]=[t,n]}));t.push(o[2]=i);var d,l=document.createElement("script");l.charset="utf-8",l.timeout=120,c.nc&&l.setAttribute("nonce",c.nc),l.src=s(e);var u=new Error;d=function(t){l.onerror=l.onload=null,clearTimeout(f);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;u.message="Loading chunk "+e+" failed.\n("+o+": "+a+")",u.name="ChunkLoadError",u.type=o,u.request=a,n[1](u)}r[e]=void 0}};var f=setTimeout((function(){d({type:"timeout",target:l})}),12e4);l.onerror=l.onload=d,document.head.appendChild(l)}return Promise.all(t)},c.m=e,c.c=o,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)c.d(n,o,function(t){return e[t]}.bind(null,o));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="",c.oe=function(e){throw console.error(e),e};var d=window["webpackJsonp"]=window["webpackJsonp"]||[],l=d.push.bind(d);d.push=t,d=d.slice();for(var u=0;u<d.length;u++)t(d[u]);var f=l;i.push([0,0]),n()})({0:function(e,t,n){e.exports=n("2f39")},"2f39":function(e,t,n){"use strict";n.r(t);var o={};n.r(o),n.d(o,"setcounterAd",(function(){return E})),n.d(o,"setAds",(function(){return k})),n.d(o,"setShow",(function(){return _})),n.d(o,"setStartedRecommended",(function(){return L})),n.d(o,"setStartedFavorites",(function(){return q})),n.d(o,"clearFavorites",(function(){return C})),n.d(o,"pushFavorites",(function(){return M})),n.d(o,"unshiftFavorites",(function(){return T})),n.d(o,"removeFavorite",(function(){return B})),n.d(o,"pushFavoritesPosts",(function(){return V})),n.d(o,"clearRecommended",(function(){return J})),n.d(o,"pushRecommended",(function(){return z})),n.d(o,"pushRecommendedPosts",(function(){return D})),n.d(o,"clearNotifications",(function(){return Q})),n.d(o,"pushNotifications",(function(){return U})),n.d(o,"readedNotification",(function(){return H})),n.d(o,"removeNotification",(function(){return K})),n.d(o,"default",(function(){return G}));n("5319");var a=n("c973"),r=n.n(a),i=(n("7d6e"),n("e54f"),n("985d"),n("31cd"),n("2b0e")),s=n("1f91"),c=n("42d2"),d=n("b05d"),l=n("5dab"),u=n("7518"),f=n("f508"),p=n("2a19"),m=n("436b");i["default"].use(d["a"],{config:{},lang:s["a"],iconSet:c["a"],plugins:{AppVisibility:l["a"],BottomSheet:u["a"],Loading:f["a"],Notify:p["a"],Dialog:m["a"]}});var h=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"q-app"}},[e.online?n("router-view"):n("div",{staticClass:"fit absolute-top bg-dark"},[n("div",{staticClass:"absolute-center full-width text-white text-center"},[n("q-icon",{staticStyle:{"font-size":"3em"},attrs:{name:"wifi_off"}}),n("p",{staticClass:"q-mt-sm q-mb-md text-h6"},[e._v("Você está sem internet.")]),n("q-btn",{attrs:{color:"white","text-color":"black",icon:"refresh",label:"Atualizar"}})],1)])],1)},g=[],v=n("81c3");const{Network:b,PushNotifications:w}=v["b"];var y={name:"App",data:()=>({online:navigator.onLine,ready:!1}),created(){b.addListener("networkStatusChange",e=>{this.online=e.connected,this.online&&!this.ready&&(this.getFavorites(),this.getRecommended(),localStorage.getItem("account")&&this.getNotifications(),this.ready=!0)}),this.online&&(this.getFavorites(),this.getRecommended(),localStorage.getItem("account")&&this.getNotifications(),this.ready=!0),w.addListener("pushNotificationReceived",e=>{this.getFavorites()}),w.addListener("pushNotificationActionPerformed",e=>{this.getFavorites()})},methods:{getFavorites:function(){if(this.$store.commit("pages/setStartedFavorites",[0,0]),this.$store.commit("pages/clearFavorites"),localStorage.getItem("account")){const e=this.$storage.getObj("account");e.following&&e.following.length&&this.$axios.get("favorites/6/6/0/"+e.following.map(e=>e.page).join(",")).then(e=>{this.$store.commit("pages/pushFavorites",e.data.data)})}else if(localStorage.getItem("following")){const e=this.$storage.getObj("following");e.length&&this.$axios.get("favorites/6/6/0/"+e.map(e=>e.page).join(",")).then(e=>{this.$store.commit("pages/pushFavorites",e.data.data)})}},getRecommended:function(){if(this.$store.commit("pages/setStartedRecommended",[0,0]),this.$store.commit("pages/clearRecommended"),localStorage.getItem("account")){const e=this.$storage.getObj("account");this.$axios.get("recommended/6/6/0/"+e.following.map(e=>e.page).join(",")).then(e=>{this.$store.commit("pages/pushRecommended",e.data.data)})}else if(localStorage.getItem("following")){const e=this.$storage.getObj("following");this.$axios.get("recommended/6/6/0/"+e.map(e=>e.page).join(",")).then(e=>{this.$store.commit("pages/pushRecommended",e.data.data)})}else this.$axios.get("recommended/6/6").then(e=>{this.$store.commit("pages/pushRecommended",e.data.data)})},getNotifications:function(){this.$axios.get("notification/me").then(e=>{this.$store.commit("pages/clearNotifications"),this.$store.commit("pages/pushNotifications",e.data.data)})}}},S=y,P=n("2877"),x=n("0016"),$=n("9c40"),j=n("eebe"),N=n.n(j),O=Object(P["a"])(S,h,g,!1,null,null,null),I=O.exports;N()(O,"components",{QIcon:x["a"],QBtn:$["a"]});var R=n("2f62"),F=function(){return{ads:6,counterAd:0,show:0,favorites:[],recommended:[],notifications:[],startedRecommended:[0,0],startedFavorites:[0,0]}},A=n("e378");n("a434");const E=e=>{e.counterAd++},k=e=>{e.ads*=3},_=(e,t)=>{e.show=t},L=(e,t)=>{e.startedRecommended=t},q=(e,t)=>{e.startedFavorites=t},C=e=>{e.favorites=[]},M=(e,t)=>{t.forEach(t=>{e.favorites.push(t)})},T=(e,t)=>{e.favorites.unshift(t)},B=(e,t)=>{const n=e.favorites.findIndex(e=>e.id===t.id);e.favorites.splice(n,1)},V=(e,t)=>{const n=e.favorites.findIndex(e=>e.id===t[0].page_id);t.forEach(t=>{e.favorites[n].posts.push(t)})},J=e=>{e.recommended=[]},z=(e,t)=>{t.forEach(t=>{e.recommended.push(t)})},D=(e,t)=>{const n=e.recommended.findIndex(e=>e.id===t[0].page_id);t.forEach(t=>{e.recommended[n].posts.push(t)})},Q=e=>{e.notifications=[]},U=(e,t)=>{t.forEach(t=>{e.notifications.push(t)})},H=(e,t)=>{const n=e.notifications.findIndex(e=>e.id===t.id);e.notifications.splice(n,1,t)},K=(e,t)=>{const n=e.notifications.findIndex(e=>e.id===t.id);e.notifications.splice(n,1)};var G=function(){return{ads:6,counterAd:0,show:0,favorites:[],recommended:[],notifications:[],startedRecommended:[0,0],startedFavorites:[0,0]}},W=n("980d"),X={namespaced:!0,state:F,getters:A,mutations:o,actions:W};i["default"].use(R["a"]);var Y=function(){const e=new R["a"].Store({modules:{pages:X},strict:!1});return e},Z=n("8c4f");n("e6cf");const ee=[{path:"/",component:()=>Promise.all([n.e(0),n.e(8)]).then(n.bind(null,"713b")),children:[{path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(3)]).then(n.bind(null,"8b24"))},{path:"/configurations",name:"configurations",component:()=>Promise.all([n.e(0),n.e(1),n.e(11)]).then(n.bind(null,"857c"))},{path:"/register",name:"register",component:()=>Promise.all([n.e(0),n.e(14)]).then(n.bind(null,"c98e"))},{path:"/remove",name:"remove",component:()=>Promise.all([n.e(0),n.e(15)]).then(n.bind(null,"2252"))},{path:"/page",name:"page",component:()=>Promise.all([n.e(0),n.e(1),n.e(13)]).then(n.bind(null,"98de"))},{path:"/newpage",name:"newpage",component:()=>Promise.all([n.e(0),n.e(1),n.e(5)]).then(n.bind(null,"a386"))},{path:"/search",name:"search",component:()=>Promise.all([n.e(0),n.e(1),n.e(4)]).then(n.bind(null,"5c65"))},{path:"/profile",name:"profile",component:()=>Promise.all([n.e(0),n.e(1),n.e(10)]).then(n.bind(null,"2ff9"))},{path:"/notifications",name:"notifications",component:()=>Promise.all([n.e(0),n.e(12)]).then(n.bind(null,"2c6c"))},{path:"/newImageMessage",name:"newImageMessage",component:()=>Promise.all([n.e(0),n.e(1),n.e(6)]).then(n.bind(null,"59a8"))},{path:"/newTextMessage",name:"newTextMessage",component:()=>Promise.all([n.e(0),n.e(1),n.e(7)]).then(n.bind(null,"caed"))},{path:"/newVideoMessage",name:"newVideoMessage",component:()=>Promise.all([n.e(0),n.e(1),n.e(18)]).then(n.bind(null,"921e"))},{path:"/admin",name:"admin",component:()=>Promise.all([n.e(0),n.e(1),n.e(16)]).then(n.bind(null,"fbcc"))},{path:"/notification",name:"notification",component:()=>Promise.all([n.e(0),n.e(17)]).then(n.bind(null,"9e7b"))}]},{path:"*",component:()=>n.e(9).then(n.bind(null,"e51e"))}];var te=ee;i["default"].use(Z["a"]);var ne=function(){const e=new Z["a"]({scrollBehavior:()=>({x:0,y:0}),routes:te,mode:"hash",base:""});return e},oe=function(){return ae.apply(this,arguments)};function ae(){return ae=r()((function*(){const e="function"===typeof Y?yield Y({Vue:i["default"]}):Y,t="function"===typeof ne?yield ne({Vue:i["default"],store:e}):ne;e.$router=t;const n={router:t,store:e,render:e=>e(I),el:"#q-app"};return{app:n,store:e,router:t}})),ae.apply(this,arguments)}var re=n("bc3a"),ie=n.n(re),se=n("eb11"),ce=n.n(se);const de=ie.a.create({baseURL:"https://cite-dccb7.rj.r.appspot.com/api/",headers:{Authorization:"Bearer "+(localStorage.getItem("bear")?JSON.parse(ce.a.decompress(localStorage.getItem("bear"))):null)}});de.interceptors.response.use((function(e){return f["a"].hide(),e.data.message&&p["a"].create({type:"positive",position:"top",message:e.data.message}),e}),e=>{if(f["a"].hide(),e.response.data.errors)for(var t in e.response.data.errors)p["a"].create({type:"negative",position:"top",message:e.response.data.errors[t]});else if(e.response.data.error)p["a"].create({type:"negative",position:"top",message:e.response.data.error});else{const t=parseInt(e.response.status);let n;401===t?n="Requisição não autorizada.":403===t?n="Requisição não permitida.":404===t?n="Requisição não encontrada.":422===t?n="Requisição não processada.":500===t&&(n="Erro."),p["a"].create({type:"negative",position:"top",message:n})}return Promise.reject(e)}),i["default"].prototype.$axios=de;const le={setObj:function(e,t){return localStorage.setItem(e,ce.a.compress(JSON.stringify(t)))},getObj:function(e,t=!0){return localStorage.getItem(e)?JSON.parse(ce.a.decompress(localStorage.getItem(e))):t?[]:{}}};i["default"].prototype.$storage=le;const{PushNotifications:ue}=v["b"];localStorage.getItem("fcmtoken")||(ue.register(),ue.addListener("registration",e=>{localStorage.setItem("fcmtoken",e.value)}),ue.addListener("registrationError",e=>{console.error("Error on registration: "+JSON.stringify(e))}));var fe=n("a925"),pe={failed:"Action failed",success:"Action was successful"},me={"en-us":pe};i["default"].use(fe["a"]);const he=new fe["a"]({locale:"en-us",fallbackLocale:"en-us",messages:me});var ge=({app:e})=>{e.i18n=he};const ve="";function be(){return we.apply(this,arguments)}function we(){return we=r()((function*(){const{app:e,store:t,router:n}=yield oe();let o=!1;const a=e=>{o=!0;const t=Object(e)===e?n.resolve(e).route.fullPath:e;window.location.href=t},r=window.location.href.replace(window.location.origin,""),s=[void 0,void 0,void 0,ge];for(let d=0;!1===o&&d<s.length;d++)if("function"===typeof s[d])try{yield s[d]({app:e,router:n,store:t,Vue:i["default"],ssrContext:null,redirect:a,urlPath:r,publicPath:ve})}catch(c){return c&&c.url?void(window.location.href=c.url):void console.error("[Quasar] boot error:",c)}!0!==o&&(i["default"].prototype.$q.capacitor=window.Capacitor,new i["default"](e))})),we.apply(this,arguments)}be()},"31cd":function(e,t,n){},"980d":function(e,t){},e378:function(e,t){}});