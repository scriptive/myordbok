# Replace


<!-- abc=''.replace("။", "").split('၊');copy(JSON.stringify(abc.map(function(s) { return s.trim() }))) -->
<!-- copy(JSON.stringify(''.replace("။", "").split('၊').map(function(s) { return s.trim() }))) -->
<!--î | Î-->

Noun. 13,48
Pronoun 15,

13,15,24,26,29,33,36,50,56,72,75,79,86,141

```javascript
copy(JSON.stringify(''.replace("။", "").split('၊').map(function(s) { return s.trim() })))
x=document.getElementById("destText"); v=x.value; x.value=JSON.stringify(v.replace(/(\r\n|\n|\r)/gm,"").replace("။", "").split('၊').map(function(s) { return s.trim() }));
```

```javascript
x=document.getElementById("sourceText"); v=x.value; x.value=JSON.stringify(v.replace("။", "").split('၊').map(function(s) { return s.trim() }));
x=document.getElementById("sourceText"); v=x.value; x.value=v.replace(/î/g, "|").replace(/Î/g, "|").replace(/ ́/g, "´").replace(/i /g, "i").replace(/Ï/g, ".").replace(/Í/g, "É").replace(/É/g, "Ë").replace(/ ¨/g, "¨").replace(/ ̈/g, "¨").replace(/μ/g, "µ").replace(/XX/g, "X").replace(new RegExp(" \\\\","g"), "\\").replace(/\*/g, "%").replace(/ \./g, ".").replace(/c\\ X/g, "Xc\\").replace(/ x\./g, ".").replace(/x a/g, "Xa").replace(/ X/g, "X").replace(/ X a x/g, "ax").replace(/ \|/g, "|").replace(/ ¨/g, "¨").replace(/ ´/g, "´").replace(/ \^/g, "^").replace(/ u/g, "u").replace(/rsË/g, "risÉ").replace(/ å/g, "å");

```
 ̈
