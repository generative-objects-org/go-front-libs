!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.goFrontLibs=e():t.goFrontLibs=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e,n){!function(e,n){"use strict";t.exports=function(){var t=624,e=397,n=function(e){void 0===e&&(e=(new Date).getTime()),this.mt=new Array(t),this.mti=625,this.seed(e)};n.prototype.seed=function(e){var n;for(this.mt[0]=e>>>0,this.mti=1;this.mti<t;this.mti++)n=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&n)>>>16)<<16)+1812433253*(65535&n)+this.mti,this.mt[this.mti]>>>=0},n.prototype.seedArray=function(e){var n,r=1,i=0,o=t>e.length?t:e.length;for(this.seed(19650218);o>0;o--)n=this.mt[r-1]^this.mt[r-1]>>>30,this.mt[r]=(this.mt[r]^(1664525*((4294901760&n)>>>16)<<16)+1664525*(65535&n))+e[i]+i,this.mt[r]>>>=0,i++,++r>=t&&(this.mt[0]=this.mt[623],r=1),i>=e.length&&(i=0);for(o=623;o;o--)n=this.mt[r-1]^this.mt[r-1]>>>30,this.mt[r]=(this.mt[r]^(1566083941*((4294901760&n)>>>16)<<16)+1566083941*(65535&n))-r,this.mt[r]>>>=0,++r>=t&&(this.mt[0]=this.mt[623],r=1);this.mt[0]=2147483648},n.prototype.int=function(){var n,r,i=new Array(0,2567483615);if(this.mti>=t){for(625===this.mti&&this.seed(5489),r=0;r<227;r++)n=2147483648&this.mt[r]|2147483647&this.mt[r+1],this.mt[r]=this.mt[r+e]^n>>>1^i[1&n];for(;r<623;r++)n=2147483648&this.mt[r]|2147483647&this.mt[r+1],this.mt[r]=this.mt[r+(e-t)]^n>>>1^i[1&n];n=2147483648&this.mt[623]|2147483647&this.mt[0],this.mt[623]=this.mt[396]^n>>>1^i[1&n],this.mti=0}return n=this.mt[this.mti++],n^=n>>>11,n^=n<<7&2636928640,n^=n<<15&4022730752,(n^=n>>>18)>>>0},n.prototype.int31=function(){return this.int()>>>1},n.prototype.real=function(){return this.int()*(1/4294967295)},n.prototype.realx=function(){return(this.int()+.5)*(1/4294967296)},n.prototype.rnd=function(){return this.int()*(1/4294967296)},n.prototype.random=n.prototype.rnd,n.prototype.rndHiRes=function(){var t=this.int()>>>5,e=this.int()>>>6;return(67108864*t+e)*(1/9007199254740992)};var r=new n;return n.random=function(){return r.rnd()},n}()}()},function(t,e,n){"use strict";n.r(e);var r={};n.r(r),n.d(r,"newGuid",function(){return h}),n.d(r,"isGuid",function(){return p}),n.d(r,"EMPTY_GUID",function(){return m});var i={};n.r(i),n.d(i,"buildPrimaryKey",function(){return y}),n.d(i,"createEmptyDataset",function(){return O}),n.d(i,"buildDataset",function(){return E}),n.d(i,"addEntitiesToDataset",function(){return w}),n.d(i,"cleanResultFromRefMentions",function(){return b});var o={};n.r(o),n.d(o,"predicateToString",function(){return C}),n.d(o,"isConditionGroup",function(){return I}),n.d(o,"isCondition",function(){return M});var s={};n.r(s),n.d(s,"MODES",function(){return T}),n.d(s,"FORM_ACTIONS",function(){return N}),n.d(s,"FormComponentMixinFactory",function(){return _});var a={};n.r(a),n.d(a,"MultipleEntitiesComponentMixinFactory",function(){return $});var u={};n.r(u),n.d(u,"SingleEntityComponentMixinFactory",function(){return F});var c=n(0),l=n.n(c);
/*!
   Adapted by T. Villaren from Math.uuid.js (v1.4)
   http://www.broofa.com
   mailto:robert@broofa.com

   Copyright (c) 2010 Robert Kieffer

   Initially dual licensed under the MIT and GPL licenses.
   Used under the MIT License
*/
const f="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");let d=new l.a;function h(){for(var t,e=f,n=new Array(36),r=0,i=0;i<36;i++)8==i||13==i||18==i||23==i?n[i]="-":14==i?n[i]="4":(r<=2&&(r=33554432+16777216*d.random()|0),t=15&r,r>>=4,n[i]=e[19==i?3&t|8:t]);return n.join("")}function p(t){return t===m||/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)}const m="00000000-0000-0000-0000-000000000000";function y(t,...e){var n;if(!t||"object"!=typeof t)throw new Error("buildPrimaryKey takes an entity object as first parameter");if(0==e.length)throw new Error("buildPrimaryKey takes at least one key name as second parameter");return 1==e.length?n=t[e]:(n={},e.forEach(e=>{n[e]=t[e]})),n}function O(){return{InternalObjectId:0,ObjectsDataSet:{$type:"ObjectsDataSet"}}}function E(t,e,...n){let r={InternalObjectId:0,ObjectsDataSet:{$type:"ObjectsDataSet"}};if(e&&e.length>0){if(!n||0==n.length)throw new Error("You must specify the PK field(s) for the main entity");r.PrimaryKey=y(e[0],n),w(t,e,r)}return r}function w(t,e,n){if(!t)throw new Error('You must specify the resourceName to use for this dataset ("main entity")');if(!n)throw new Error("You must specify the dataset to add entities to");let r=n.InternalObjectId,i=r;return t+"ObjectsDataSet"in n.ObjectsDataSet||(n.ObjectsDataSet[t+"ObjectsDataSet"]={},n.ObjectsDataSet[t+"ObjectsDataSet"][t+"Objects"]={}),e.forEach((e,o)=>{n.ObjectsDataSet[t+"ObjectsDataSet"][t+"Objects"][o+1+r]=e,i=o+r+1}),n.InternalObjectId=i,n}function b(t,e){return t instanceof Array?function(t,e){let n=[];return t.forEach(t=>{var r=b(t,e);null!=r&&n.push(r)}),n}(t,e):t instanceof Object?function(t,e){if(1===Object.keys(t).length&&t.hasOwnProperty("$ref"))return null;return Object.keys(t).forEach(n=>{if(e.indexOf(n)>-1){let r=g(e,n);t[n]=b(t[n],r)}else if(void 0!==e.find(t=>t.indexOf(n)>-1)){let r=g(e,n);t[n]=b(t[n],r)}}),t}(t,e):t}function g(t,e){return t.map(t=>t===e?null:t.indexOf(e)>-1?t.replace(e+".",""):t).filter(t=>null!==t)}const j="OPERATOR_TYPE_BINARY",v=["&&","||"],x={"==":j,"!=":j,"<=":j,"<":j,">=":j,">":j,StartsWith:"OPERATOR_TYPE_STRING",EndsWith:"OPERATOR_TYPE_STRING",Contains:"OPERATOR_TYPE_STRING"};function C(t){if(I(t)){let e=t.conditions.length;if(0===e)return"";if(-1===v.indexOf(t.operator))throw new Error(`Operator ${t.operator} is not valid for group`);let n="(",r=t.operator;return t.conditions.sort((t,e)=>t.order>e.order?1:t.order<e.order?-1:0).forEach((t,i)=>{let o=C(t);""!==o&&(n+=o,i<e-1&&(n+=` ${r} `))}),n+=")"}if(M(t)){if(!x.hasOwnProperty(t.operator))throw new Error(`Operator ${t.operator} is not valid`);let e="",n=t.left.needsQuote?`"${t.left.value}"`:t.left.value,r=t.right.needsQuote?`"${t.right.value}"`:t.right.value;return e=x[t.operator]===j?`${n} ${t.operator} ${r}`:`${n}.${t.operator}(${r})`,t.negate?`!(${e})`:e}throw new Error("Predicate is neither a Condition or ConditionGroup")}function I(t){return t.hasOwnProperty("conditions")&&t.conditions instanceof Array}function M(t){return t.hasOwnProperty("left")&&t.hasOwnProperty("right")}const D={"==":(t,e)=>t==e,"!=":(t,e)=>t!=e,"<=":(t,e)=>t<=e,"<":(t,e)=>t<e,">":(t,e)=>t>e,">=":(t,e)=>t>=e,StartsWith:(t,e)=>t.indexOf&&0===t.indexOf(e),EndsWith:(t,e)=>t.indexOf&&t.indexOf(e)===t.length-e.length,Contains:(t,e)=>t.indexOf&&t.indexOf(e)>-1};function P(t,e=null){let n=this,r=t.operator;if(I(t)){if(0===t.conditions.length)return n;if(t.conditions.sort((t,e)=>t.order>e.order?1:t.order<e.order?-1:0),"||"===r)t.conditions.forEach(e=>{P.call(n,e,t.operator,!1)});else{if("&&"!==r)throw new Error(`Operator ${r} is not valid for group`);t.conditions.forEach(e=>{P.call(n,e,t.operator,!1)})}return n}if(M(t))return function(t,e,n="&&"){if(!D.hasOwnProperty(e.operator))throw new Error(`Operator ${e.operator} is not valid`);"||"===n?t.orWhere(e.left.value,t=>D[e.operator](t,e.right.value)):t.where(e.left.value,t=>D[e.operator](t,e.right.value));return t}(this,t,e);throw new Error("Predicate is neither a Condition or ConditionGroup")}var S={install(t,e){t.Query.prototype.applyFilter=P}};const T={VIEW_MODE:"VIEW_MODE",EDIT_MODE:"EDIT_MODE"},N={CANCEL:"cancelEdit",CREATE_NEW:"createNew",DELETE:"delete",ENTER_EDIT:"enterEdit",SAVE:"save"};function _(t){let{modelReference:e,entityName:n,internalName:r}=t;if(!n)throw new Error("Missing entityName option for FormComponentMixinFactory");let i=n.toLowerCase(),o=r||n,s="local"+o+"Object";return{data:function(){return{[s]:null,initialViewMode:T.VIEW_MODE,FORM_ACTIONS:N}},computed:{["current"+o+"Item"]:function(){return null!==this[s]?this[s]:this.storeObject}},created:function(){this.id&&"create"===this.id&&(this["create"+o](),this.initialViewMode=T.EDIT_MODE)},methods:{cancelEdit(){this[s]=null},enterEdit(){this[s]=Object.assign({},this["current"+o+"Item"],{IsDirty:!0})},["create"+o](){this[s]=e.createNew()},["delete"+o](){},["save"+o](){null!=this[s]&&(this[s].IsNew?this.$store.dispatch("entities/"+i+"/insert",{data:this[s]}):this.$store.dispatch("entities/"+i+"/update",this[s]),this.$store.dispatch("crud/saveAll",{entityName:i}).then(()=>{this["load"+o](this[s].Id).then(this[s]=null)}))}}}}function $(t){let{entityName:e,includes:n,internalName:r}=t;if(!e)throw new Error("Missing entityName option for MultipleEntitiesComponentMixin");let i=e.toLowerCase(),o=r||e;return{props:{externalFilter:Object},data:()=>({["isLoading"+o+"Collection"]:!1}),computed:{["current"+o+"Collection"]:function(){let t=this.$store.getters["entities/"+i+"/query"]();return this.externalFilter&&(t=t.applyFilter(this.externalFilter)),n&&(t=t.with(n)),t.get()}},mounted(){this["load"+o+"Collection"]()},methods:{["load"+o+"Collection"]:function(){this["isLoading"+o+"Collection"]=!0;let t={};return n&&(t.include=n),this.externalFilter&&(t.filter=C(this.externalFilter)),this.$store.dispatch("crud/getCollection",{entityName:i,configuration:t}).then(t=>{this["isLoading"+o+"Collection"]=!1}).catch(t=>{this["isLoading"+o+"Collection"]=!1,console.warn(t)})}},watch:{externalFilter(t,e){this["load"+o+"Collection"]()}}}}function F(t){let{entityName:e,internalName:n}=t;if(!e)throw new Error("Missing entityName option for SingleEntityComponentMixinFactory");let r=n||e,i="local"+r+"Object",o=e.toLowerCase();return{props:["id"],data:function(){return{[i]:null,storeObject:null,["isLoading"+r+"Item"]:!1}},computed:{["current"+r+"Item"]:function(){return null!==this[i]?this[i]:this.storeObject}},created:function(){this.id&&this["load"+r](this.id)},methods:{["load"+r]:function(t){return this["isLoading"+r+"Item"]=!0,this.$store.dispatch("crud/get",{entityName:o,pks:[t]}).then(t=>{this["isLoading"+r+"Item"]=!1,this.storeObject=t}).catch(t=>{throw this["isLoading"+r+"Item"]=!1,t})}}}}n.d(e,"GOUuuid",function(){return R}),n.d(e,"GOAPIAdapter",function(){return A}),n.d(e,"GOPredicate",function(){return L}),n.d(e,"FormComponentMixin",function(){return G}),n.d(e,"MultipleEntitiesComponentMixin",function(){return W}),n.d(e,"SingleEntityComponentMixin",function(){return Y}),n.d(e,"VuexORMPlugin",function(){return V});const R=r,A=i,L=o,G=s,W=a,Y=u,V=S}])});