/* Ingredient scaler (embedded into index.html by build.py; tested with node). */
(function(G){
var UF={'\u00bd':.5,'\u2153':1/3,'\u2154':2/3,'\u00bc':.25,'\u00be':.75,'\u2155':.2,'\u2156':.4,'\u2157':.6,'\u2158':.8,'\u2159':1/6,'\u215a':5/6,'\u215b':.125,'\u215c':.375,'\u215d':.625,'\u215e':.875};
var UC=Object.keys(UF).join('');
var NUM='(?:\\d+\\s+\\d+\\/\\d+|\\d+\\s*['+UC+']|\\d+\\/\\d+|\\d*\\.\\d+|\\d+|['+UC+'])';
var LEAD=new RegExp('^(\\s*)('+NUM+')(?:(\\s*(?:-|\\u2013|to|or)\\s*)('+NUM+'))?(?![\\d\\/])');
var PAREN=new RegExp('\\((\\s*)('+NUM+')(\\s*(?:g|kg|oz|fl oz|lb|lbs|ml|l|cups?|tbsp|tsp|grams?|ounces?)\\b)','gi');
function val(s){s=s.trim();var m;
 if(m=s.match(/^(\d+)\s+(\d+)\/(\d+)$/))return +m[1]+m[2]/m[3];
 if(m=s.match(new RegExp('^(\\d+)\\s*(['+UC+'])$')))return +m[1]+UF[m[2]];
 if(m=s.match(/^(\d+)\/(\d+)$/))return m[2]>0?m[1]/m[2]:NaN;
 if(UF[s]!=null)return UF[s];return parseFloat(s);}
var FR=[[0,''],[1/8,'\u215b'],[1/6,'\u2159'],[1/4,'\u00bc'],[1/3,'\u2153'],[3/8,'\u215c'],[1/2,'\u00bd'],[5/8,'\u215d'],[2/3,'\u2154'],[3/4,'\u00be'],[7/8,'\u215e'],[1,'']];
function fmt(x){if(!(x>0))return '0';if(x>=10)return String(Math.round(x));
 var w=Math.floor(x),f=x-w,b=FR[0],d=9;FR.forEach(function(p){var e=Math.abs(f-p[0]);if(e<d-1e-9){d=e;b=p}});
 if(d>0.03&&x<1){return String(Math.round(x*100)/100)}
 if(b[0]===1){w+=1;b=FR[0]}
 return (w?String(w):'')+b[1]||'0';}
function scale(t,k,leadOnly){if(k===1||!t)return t;var out=t.replace(LEAD,function(all,sp,a,sep,b){return sp+fmt(val(a)*k)+(b!=null?sep+fmt(val(b)*k):'');});
 return leadOnly?out:out.replace(PAREN,function(all,sp,n,u){return '('+sp+fmt(val(n)*k)+u;});}
function base(s){var m=String(s||'').match(LEAD);return m?val(m[2]):null;}
G.RBScale={scale:scale,fmt:fmt,val:val,base:base};
})(typeof window!=='undefined'?window:globalThis);
