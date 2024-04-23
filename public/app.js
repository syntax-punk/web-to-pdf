const endpoint = "https://puppet-master.fly.dev";

window.onload = function() {
  const button = document.querySelector('.button');
  const spinner = document.querySelector('.spinner');
  let objectUrl;

  document.theform.onsubmit = function(e) {
    e.preventDefault();
    e.stopPropagation();
    let input = document.getElementById('url').value.trim();
    
    if (!input) {
      alert('Please enter a URL');
      return;
    }

    try {
      input = checkUrlStructure(input);

      button.setAttribute('disabled', 'true');
      spinner.classList.remove('hidden');
  
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: input })
      }).then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Network response was not ok.');
      }).then(blob => {
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'document.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }).catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }).finally(() => {
        if (objectUrl) {
          window.URL.revokeObjectURL(objectUrl);
        }
  
        spinner.classList.add('hidden');
        button.removeAttribute('disabled');
      });
    } catch (error) {
      alert("We don't support that URL. Please try another one.");
    }
  }
}

function checkUrlStructure(url) {
  const withProtocol = url.includes('://');

  if (withProtocol) {
    const protocol = url.split('://')[0].toLowerCase();
    if (protocol !== 'http' && protocol !== 'https')
      throw new Error('Invalid URL protocol');
    
    return url;
  } else {
    return `https://${url}`;
  }
}