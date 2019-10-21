/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function parseOcr() {
  const inputOcrNode = document.getElementsByClassName('ocrInputTextArea')[0];
  const inputOcrText = inputOcrNode.value;
  return fetch('/v1/parseOcrText', {
    method: 'POST',
    body: JSON.stringify({ inputText: inputOcrText }),
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => { // eslint-disable-line arrow-body-style
    return response.json();
  }).then((parsedResponse) => {
    // grab div that holds ul with results to empty it
    const divNode = document.getElementsByClassName('outputTextContainer')[0];
    divNode.innerHTML = '';

    // create a ul tag that will go inside of the div found above
    const parentUlNode = document.createElement('ul');
    parentUlNode.className = 'outputTextList';

    // iterate through the required fields (which are the keys on the response object)
    // and create the HTML to display each field and its value on the web page
    Object.keys(parsedResponse).forEach((field) => {
      const node = document.createElement('li');
      node.className = 'outputTextListItem';
      // create a text node and set the text equal to the field name colon and the parsed value
      // returned from the server for that field
      const textNode = document.createTextNode(
        // capitalize the field name, add colon, then field value
        `${field.charAt(0).toUpperCase() + field.slice(1)}: ${parsedResponse[field]}`,
      );
      // append the text to the li and li to ul
      node.appendChild(textNode);
      parentUlNode.appendChild(node);
    });

    // now append the ul and all of its children to the div currently displayed on the web page
    divNode.append(parentUlNode);
  }).catch((err) => {
    // eslint-disable-next-line no-alert
    alert('An error occurred while submitting your text for processing...');
  });
}

module.exports = parseOcr;
