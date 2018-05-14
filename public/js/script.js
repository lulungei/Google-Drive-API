function copy(id) {
	console.log('copying', id);
	const node = document.getElementById(id);
  const range = document.createRange();
  range.selectNode(node);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  try {
  	document.execCommand('copy');
  } catch (err) {
   	console.log('Error: unable to copy');
  }
}
