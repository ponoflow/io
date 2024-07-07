(function() {
var style=document.querySelectorAll('head style, head link'), append=(a)=>{document.head.appendChild(a)};
if(style[0]) append=(a)=>{style[0].insertAdjacentHTML('afterend', a)};
const doc = new DOMParser().parseFromString(`<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${window.GOOGLE_FONTS||'Roboto'}:wght@300;400;500;700&display=swap" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />`, 'text/html');
    doc.querySelectorAll('link').forEach(append)
})();
