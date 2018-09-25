export function getCaretPosition(el) {
  const documentt: any = {
    selection: undefined
  };
  Object.assign(documentt, document);

  let caretPos = 0;
  if (documentt.selection) { // IE Support
    el.focus();
    const select = documentt.selection.createRange();
    select.moveStart('character', -el.value.length);
    caretPos = select.text.length;
  } else if (el.selectionStart || el.selectionStart === '0') { // Firefox support
    caretPos = el.selectionStart;
  }

  return caretPos;
}

export function setCaretPosition(el, beforeSelIndex, afterSelIndex, symbolsPositions?) {
  // https://javascriptexamples.info/snippet/getset-cursor-in-html-textarea
  let futureSelIndex;
  symbolsPositions = symbolsPositions ? symbolsPositions : [];
  if (el.selectionStart || el.selectionStart === '0') {

    futureSelIndex = afterSelIndex;

    for (let i = 0; i < symbolsPositions.length; i++) {
      if (beforeSelIndex === symbolsPositions[i] && afterSelIndex === symbolsPositions[i] + 1) {
        futureSelIndex = symbolsPositions[i] + 2;

        break;
      }
    }

    setTimeout(() => {
      setCaret();
    });
  }

  function setCaret() {
    if (el.setSelectionRange) {
      if (el.selectionStart) {
        el.focus();
        el.setSelectionRange(futureSelIndex, futureSelIndex);
      } else {
        el.focus();
      }
    } else if (el.createTextRange) {
      const range = el.createTextRange();
      range.collapse(true);
      range.move('character', futureSelIndex);
      range.moveEnd('character', futureSelIndex);
      range.moveStart('character', futureSelIndex);
      range.select();
    }
  }
}
