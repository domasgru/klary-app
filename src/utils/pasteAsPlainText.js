export const pasteAsPlainText = (e) => {
  // cancel paste
  e.preventDefault();

  // get text representation of clipboard
  const text = (e.originalEvent || e).clipboardData.getData('text/plain');

  // insert text manually
  document.execCommand('insertHTML', false, text);
};
