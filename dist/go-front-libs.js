!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.goFrontLibs=e():t.goFrontLibs=e()}(window,function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e,n){!function(e,n){"use strict";t.exports=function(){var t=624,e=397,n=function(e){void 0===e&&(e=(new Date).getTime()),this.mt=new Array(t),this.mti=625,this.seed(e)};n.prototype.seed=function(e){var n;for(this.mt[0]=e>>>0,this.mti=1;this.mti<t;this.mti++)n=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&n)>>>16)<<16)+1812433253*(65535&n)+this.mti,this.mt[this.mti]>>>=0},n.prototype.seedArray=function(e){var n,i=1,r=0,o=t>e.length?t:e.length;for(this.seed(19650218);o>0;o--)n=this.mt[i-1]^this.mt[i-1]>>>30,this.mt[i]=(this.mt[i]^(1664525*((4294901760&n)>>>16)<<16)+1664525*(65535&n))+e[r]+r,this.mt[i]>>>=0,r++,++i>=t&&(this.mt[0]=this.mt[623],i=1),r>=e.length&&(r=0);for(o=623;o;o--)n=this.mt[i-1]^this.mt[i-1]>>>30,this.mt[i]=(this.mt[i]^(1566083941*((4294901760&n)>>>16)<<16)+1566083941*(65535&n))-i,this.mt[i]>>>=0,++i>=t&&(this.mt[0]=this.mt[623],i=1);this.mt[0]=2147483648},n.prototype.int=function(){var n,i,r=new Array(0,2567483615);if(this.mti>=t){for(625===this.mti&&this.seed(5489),i=0;i<227;i++)n=2147483648&this.mt[i]|2147483647&this.mt[i+1],this.mt[i]=this.mt[i+e]^n>>>1^r[1&n];for(;i<623;i++)n=2147483648&this.mt[i]|2147483647&this.mt[i+1],this.mt[i]=this.mt[i+(e-t)]^n>>>1^r[1&n];n=2147483648&this.mt[623]|2147483647&this.mt[0],this.mt[623]=this.mt[396]^n>>>1^r[1&n],this.mti=0}return n=this.mt[this.mti++],n^=n>>>11,n^=n<<7&2636928640,n^=n<<15&4022730752,(n^=n>>>18)>>>0},n.prototype.int31=function(){return this.int()>>>1},n.prototype.real=function(){return this.int()*(1/4294967295)},n.prototype.realx=function(){return(this.int()+.5)*(1/4294967296)},n.prototype.rnd=function(){return this.int()*(1/4294967296)},n.prototype.random=n.prototype.rnd,n.prototype.rndHiRes=function(){var t=this.int()>>>5,e=this.int()>>>6;return(67108864*t+e)*(1/9007199254740992)};var i=new n;return n.random=function(){return i.rnd()},n}()}()},function(t,e,n){"use strict";n.r(e);var i={};n.r(i),n.d(i,"newGuid",function(){return f}),n.d(i,"isGuid",function(){return m}),n.d(i,"EMPTY_GUID",function(){return p});var r={};n.r(r),n.d(r,"buildDataset",function(){return g}),n.d(r,"cleanResultFromRefMentions",function(){return y});var o={};n.r(o),n.d(o,"predicateToString",function(){return P}),n.d(o,"isConditionGroup",function(){return b}),n.d(o,"isCondition",function(){return M}),n.d(o,"arePredicatesEqual",function(){return S});var s={};n.r(s),n.d(s,"MODES",function(){return N}),n.d(s,"FORM_ACTIONS",function(){return j}),n.d(s,"FormComponentMixinFactory",function(){return T});var a={};n.r(a),n.d(a,"MultipleEntitiesComponentMixinFactory",function(){return _});var l={};n.r(l),n.d(l,"SingleEntityComponentMixinFactory",function(){return F});var u=n(0),c=n.n(u);
/*!
   Adapted by T. Villaren from Math.uuid.js (v1.4)
   http://www.broofa.com
   mailto:robert@broofa.com

   Copyright (c) 2010 Robert Kieffer

   Initially dual licensed under the MIT and GPL licenses.
   Used under the MIT License
*/
const h="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");let d=new c.a;function f(){for(var t,e=h,n=new Array(36),i=0,r=0;r<36;r++)8==r||13==r||18==r||23==r?n[r]="-":14==r?n[r]="4":(i<=2&&(i=33554432+16777216*d.random()|0),t=15&i,i>>=4,n[r]=e[19==r?3&t|8:t]);return n.join("")}function m(t){return t===p||/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)}const p="00000000-0000-0000-0000-000000000000";function g(t){let e={InternalObjectId:1,ObjectsDataSet:{$type:"ObjectsDataSet"}};if(t&&t.length>0){let n=t[0].pkFields;if(!n||0==n.length)throw new Error("You must specify the PK field(s) for the first entity");t.forEach((t,n)=>{if(!t.name)throw new Error("You must specify the Entity Name for each entity");!function(t,e,n){let i=n.lastInternalObjectId||0,r=i;t+"ObjectsDataSet"in n.ObjectsDataSet||(n.ObjectsDataSet[t+"ObjectsDataSet"]={},n.ObjectsDataSet[t+"ObjectsDataSet"][t+"Objects"]={});e.forEach((e,o)=>{n.ObjectsDataSet[t+"ObjectsDataSet"][t+"Objects"][o+1+i]=e,r=o+i+1}),n.lastInternalObjectId=r}(t.name,[t.data],e)}),e.PrimaryKey=function(t,e){let n;1==e.length?n=t[e]:(n={},e.forEach(e=>{n[e]=t[e]}));return n}(t[0].data,n)}return delete e.lastInternalObjectId,e}function y(t,e){return t instanceof Array?function(t,e){let n=[];return t.forEach(t=>{var i=y(t,e);null!=i&&n.push(i)}),n}(t,e):t instanceof Object?function(t,e){if(1===Object.keys(t).length&&t.hasOwnProperty("$ref"))return null;return Object.keys(t).forEach(n=>{if(e.indexOf(n)>-1){let i=E(e,n);t[n]=y(t[n],i)}else if(void 0!==e.find(t=>t.indexOf(n)>-1)){let i=E(e,n);t[n]=y(t[n],i)}}),t}(t,e):t}function E(t,e){return t.map(t=>t===e?null:t.indexOf(e)>-1?t.replace(e+".",""):t).filter(t=>null!==t)}const O="OPERATOR_TYPE_BINARY",w=["&&","||"],C={"==":O,"!=":O,"<=":O,"<":O,">=":O,">":O,StartsWith:"OPERATOR_TYPE_STRING",EndsWith:"OPERATOR_TYPE_STRING",Contains:"OPERATOR_TYPE_STRING"};function P(t){if(b(t)){let e=t.conditions.length;if(0===e)return"";if(-1===w.indexOf(t.operator))throw new Error(`Operator ${t.operator} is not valid for group`);let n="(",i=t.operator;return t.conditions.sort(I).forEach((t,r)=>{let o=P(t);""!==o&&(n+=o,r<e-1&&(n+=` ${i} `))}),n+=")"}if(M(t)){if(!C.hasOwnProperty(t.operator))throw new Error(`Operator ${t.operator} is not valid`);let e="",n=t.left.needsQuote?`"${t.left.value}"`:t.left.value,i=t.right.needsQuote?`"${t.right.value}"`:t.right.value;return e=C[t.operator]===O?`${n} ${t.operator} ${i}`:`${n}.${t.operator}(${i})`,t.negate?`!(${e})`:e}throw new Error("Predicate is neither a Condition or ConditionGroup")}function b(t){return t&&t.hasOwnProperty("conditions")&&t.conditions instanceof Array}function M(t){return t&&t.hasOwnProperty("left")&&t.hasOwnProperty("right")}function S(t,e){return!!(M(t)&&M(e)||b(t)&&b(e))&&P(t)===P(e)}function I(t,e){return t.order>e.order?1:t.order<e.order?-1:0}const D={"==":(t,e)=>t==e,"!=":(t,e)=>t!=e,"<=":(t,e)=>t<=e,"<":(t,e)=>t<e,">":(t,e)=>t>e,">=":(t,e)=>t>=e,StartsWith:(t,e)=>t.indexOf&&0===t.indexOf(e),EndsWith:(t,e)=>t.indexOf&&t.indexOf(e)===t.length-e.length,Contains:(t,e)=>t.indexOf&&t.indexOf(e)>-1};function v(t,e=null){let n=this,i=t.operator;if(b(t)){if(0===t.conditions.length)return n;if(t.conditions.sort((t,e)=>t.order>e.order?1:t.order<e.order?-1:0),"||"===i)t.conditions.forEach(e=>{n.orWhere((n,i)=>{v.call(i,e,t.operator,!1)})});else{if("&&"!==i)throw new Error(`Operator ${i} is not valid for group`);n.where((e,n)=>{t.conditions.forEach(e=>{v.call(n,e,t.operator,!1)})})}return n}if(M(t))return function(t,e,n="&&"){if(!D.hasOwnProperty(e.operator))throw new Error(`Operator ${e.operator} is not valid`);"||"===n?t.orWhere(e.left.value,t=>D[e.operator](t,e.right.value)):t.where(e.left.value,t=>D[e.operator](t,e.right.value));return t}(this,t,e);throw new Error("Predicate is neither a Condition or ConditionGroup")}var x={install(t,e){!function(t,e){t.Query.prototype.applyFilter=v}(t),function(t,e){t.Model.prototype.cleanInstanceRelations=function(t){return function(){Object.keys(this.constructor.fields()).filter(e=>this.constructor.fields()[e]instanceof t).forEach(t=>{delete this[t]})}}(t.Relation)}(t)}};const N={VIEW_MODE:"VIEW_MODE",EDIT_MODE:"EDIT_MODE"},j={CANCEL_EDIT:"cancelEdit",CREATE_ITEM:"createNew",DELETE_ITEM:"delete",ENTER_EDIT:"enterEdit",SAVE_ITEM:"save"};function T(t){let{modelReference:e,entityName:n,internalName:i,pkName:r}=t;if(!n)throw new Error("Missing entityName option for FormComponentMixinFactory");let o=n.toLowerCase(),s=i||n,a=null;return{props:{currentMode:String},data:function(){return{FORM_ACTIONS:j,currentViewMode:N.VIEW_MODE}},computed:{IsViewMode(){return this.currentMode?this.currentMode===N.VIEW_MODE:this.currentViewMode==N.VIEW_MODE},computedViewMode(){return this.currentMode||this.currentViewMode}},created:function(){this.id&&"create"===this.id&&(this["create"+s](),this.currentViewMode=N.EDIT_MODE)},beforeDestroy:function(){this.IsViewMode||this.cancelEdit()},methods:{cancelEdit(){this.currentViewMode=N.VIEW_MODE,this.undo(a),a=null},enterEdit(){this.currentViewMode=N.EDIT_MODE,a=f(),this.$store.commit("tagUndoMutation",a)},async["create"+s](){let t=await e.createNew();this["local"+s+"PK"]=t.$id,this.currentViewMode=N.EDIT_MODE},async["delete"+s](){this.id&&window.confirm("Are you sure you want to delete this entity?")&&await this.$store.dispatch("crud/delete",{entityName:o,pks:[this["local"+s+"PK"]]})},async["save"+s](){null!=this["current"+s+"Item"]&&(await this.$store.dispatch("crud/saveAll",{entityName:o}),await this["refetch"+s+"WithIdCheck"](),this.currentViewMode=N.VIEW_MODE)}}}}function _(t){let{entityName:e,includes:n,internalName:i,pageSize:r,paginationEnabled:o,initialOrderBy:s,isInitialOrderDesc:a}=t;if(!e)throw new Error("Missing entityName option for MultipleEntitiesComponentMixin");let l=e.toLowerCase(),u=i||e,c=r||15,h=void 0!==o&&o,d=s||null,f=a||!1;return{props:{externalFilter:Object,dataCollection:Array},data:()=>({["isLoading"+u+"Collection"]:!1,["is"+u+"PaginationEnabled"]:h,["total"+u+"Count"]:0,["current"+u+"PageNumber"]:1,["current"+u+"SortColumn"]:d,["is"+u+"SortDescending"]:f}),computed:{["current"+u+"Collection"](){if(this.dataCollection)return this.dataCollection;if(null===this.externalFilter)return[];let t=this.$store.getters["entities/"+l+"/query"]();if(this.externalFilter&&(t=t.applyFilter(this.externalFilter)),n&&(t=t.with(n)),this["is"+u+"PaginationEnabled"]){let e=this[u+"CollectionPagination"].pageSize,n=(this[u+"CollectionPagination"].currentPageNumber-1)*e;t.limit(e),n>0&&t.offset(n)}return null!==this["current"+u+"SortColumn"]&&t.orderBy(this["current"+u+"SortColumn"],this["is"+u+"SortDescending"]?"desc":"asc"),t.get()},[u+"CollectionPagination"](){let t={isPaginationEnabled:this["is"+u+"PaginationEnabled"]};if(this["is"+u+"PaginationEnabled"]){let e=this["total"+u+"Count"];t.pageSize=c,t.currentTotal=e,t.totalPage=e>c?Math.ceil(e/c):1,t.currentPageNumber=this["current"+u+"PageNumber"]}return t},[u+"CollectionSort"](){return{sortColumn:this["current"+u+"SortColumn"],isDescending:["is"+u+"SortDescending"]}}},mounted(){this.dataCollection||this["countAndLoad"+u+"Collection"]()},methods:{async["countAndLoad"+u+"Collection"](){await this["count"+u+"Collection"](),await this["load"+u+"Collection"]()},async["count"+u+"Collection"](){if(null===this.externalFilter||!this["is"+u+"PaginationEnabled"])return 0;this["isLoading"+u+"Collection"]=!0;let t={};this.externalFilter&&(t.filter=GOPredicate.predicateToString(this.externalFilter));let e=await this.$store.dispatch("crud/count",{entityName:l,configuration:t});return this["total"+u+"Count"]=e,e},async["load"+u+"Collection"](){if(null===this.externalFilter)return[];this["isLoading"+u+"Collection"]=!0;let t={};n&&(t.include=n),this.externalFilter&&(t.filter=P(this.externalFilter)),this["is"+u+"PaginationEnabled"]&&(t.pageSize=this[u+"CollectionPagination"].pageSize,t.pageNumber=this[u+"CollectionPagination"].currentPageNumber),null!==this["current"+u+"SortColumn"]&&(t.sortColumn=this["current"+u+"SortColumn"],t.sortOrder="desc");try{let e=await this.$store.dispatch("crud/getCollection",{entityName:l,configuration:t});return this["isLoading"+u+"Collection"]=!1,e}catch(t){throw this["isLoading"+u+"Collection"]=!1,t}},["current"+u+"PageChanged"](t){this["current"+u+"PageNumber"]=t},["current"+u+"SortChanged"]({isDescending:t,sortColumn:e}){this["is"+u+"SortDescending"]=t,this["current"+u+"SortColumn"]=e}},watch:{externalFilter(t,e){t&&!S(e,t)&&this["countAndLoad"+u+"Collection"]()},["current"+u+"PageNumber"](t,e){t!==e&&this["countAndLoad"+u+"Collection"]()},[u+"CollectionSort"](t,e){t.sortColumn===e.sortColumn&&t.isDescending===e.isDescending||this["countAndLoad"+u+"Collection"]()}}}}function F(t){let{modelReference:e,entityName:n,includes:i,internalName:r}=t;if(!n)throw new Error("Missing entityName option for SingleEntityComponentMixinFactory");let o=r||n,s=n.toLowerCase();const a=i?i.split(","):null;return{props:{id:String,routeName:String,item:Object},data:function(){return{["local"+o+"PK"]:null,["isLoading"+o+"Item"]:!1}},computed:{["current"+o+"Item"]:function(){return this.item?this.item:null!==this.storeObject?this.storeObject:null},["current"+o+"PK"]:function(){return this["local"+o+"PK"]?this["local"+o+"PK"]:this.item},storeObject(){if(this["current"+o+"PK"]){let t=this.$store.getters["entities/"+s+"/query"]();a&&(t=t.with(a)),t.whereId(this["current"+o+"PK"]);let e=t.get();return e.length?e[0]:null}return null}},created:function(){this.id&&"create"!==this.id&&(this["local"+o+"PK"]=this.id,this["load"+o](this.id))},methods:{async["load"+o](t){if(!t)return null;this["isLoading"+o+"Item"]=!0;let e={};i&&(e.include=i);try{let n=await this.$store.dispatch("crud/get",{entityName:s,pks:[t],configuration:e});return this["isLoading"+o+"Item"]=!1,this["local"+o+"PK"]=t,n}catch(t){throw this["isLoading"+o+"Item"]=!1,t}},async["refetch"+o](){this["local"+o+"PK"]&&await this["load"+o](this["local"+o+"PK"])},async["refetch"+o+"WithIdCheck"](){this.routeName&&this["local"+o+"PK"]&&this["local"+o+"PK"]!==this.id?this.$router.push({name:this.routeName,params:{id:this["local"+o+"PK"]}}):this["refetch"+o]()}}}}n.d(e,"GOUuuid",function(){return A}),n.d(e,"GOAPIAdapter",function(){return $}),n.d(e,"GOPredicate",function(){return R}),n.d(e,"FormComponentMixin",function(){return L}),n.d(e,"MultipleEntitiesComponentMixin",function(){return V}),n.d(e,"SingleEntityComponentMixin",function(){return K}),n.d(e,"VuexORMPlugin",function(){return W});const A=i,$=r,R=o,L=s,V=a,K=l,W=x}])});