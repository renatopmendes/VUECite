(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{"9e7b":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("q-header",[a("q-toolbar",{staticClass:"bg-dark"},[a("q-btn",{attrs:{dense:"",flat:"","aria-label":"Back",icon:"arrow_back"},on:{click:function(e){return t.$router.go(-1)}}}),a("q-space"),a("div",{staticClass:"text-body1"},[t._v("\n        Notificar\n      ")]),a("q-space"),a("q-btn",{attrs:{dense:"",flat:"","aria-label":"Home",icon:"home",to:"/"}})],1)],1),a("q-page-container",[a("q-page",[a("q-form",{staticClass:"q-pa-md absolute-center full-width text-center",on:{submit:t.send}},[a("q-input",{attrs:{autofocus:"",filled:"",required:"",minlength:"3",maxlength:"32",label:"Título"},model:{value:t.notification.subject,callback:function(e){t.$set(t.notification,"subject",e)},expression:"notification.subject"}}),a("br"),a("q-input",{attrs:{filled:"",required:"",minlength:"10",label:"Mensagem",type:"textarea"},model:{value:t.notification.message,callback:function(e){t.$set(t.notification,"message",e)},expression:"notification.message"}}),a("q-btn",{staticClass:"q-mt-xl",attrs:{round:"","aria-label":"OK",color:"positive",icon:"done",type:"submit"}})],1)],1)],1)],1)},n=[],o=(a("5319"),{name:"Notification",data:function(){return{notification:{}}},created(){const t=this.$storage.getObj("account");t.role<9&&this.$router.replace("/")},methods:{send:function(){this.$q.loading.show(),this.$route.query.user?this.$axios.post("notification/user/"+this.$route.query.user,this.notification):this.$axios.post("notification/user",this.notification)}}}),s=o,c=a("2877"),r=a("e359"),l=a("65c6"),u=a("9c40"),f=a("2c91"),b=a("09e3"),d=a("9989"),p=a("0378"),m=a("27f9"),h=a("eebe"),q=a.n(h),g=Object(c["a"])(s,i,n,!1,null,null,null);e["default"]=g.exports;q()(g,"components",{QHeader:r["a"],QToolbar:l["a"],QBtn:u["a"],QSpace:f["a"],QPageContainer:b["a"],QPage:d["a"],QForm:p["a"],QInput:m["a"]})}}]);