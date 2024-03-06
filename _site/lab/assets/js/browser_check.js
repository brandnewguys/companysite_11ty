document.documentElement.className = 'js';
var supportsCssVars = function() {
    var s = document.createElement('style'),
        support;
    s.innerHTML = "root: { --tmp-var: bold; }";
    document.head.appendChild(s);
    support = !!(window.CSS && window.CSS.supports && window.CSS.supports('font-weight', 'var(--tmp-var)'));
    s.parentNode.removeChild(s);
    return support;
};
if (!supportsCssVars()) alert('Please view this demo in a modern browser that supports CSS Variables.');