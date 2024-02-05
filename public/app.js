const endpoint = "https://gander-5fosbnbg3a-uc.a.run.app";
// const endpoint = "http://127.0.0.1:5001/pdfify-fe25d/us-central1/gander";

window.onload = function() {
  const button = document.querySelector('.button');
  const spinner = document.querySelector('.spinner');
  let objectUrl;

  document.theform.onsubmit = function(e) {
    e.preventDefault();
    e.stopPropagation();
    const input = document.getElementById('url').value.trim();
    
    if (!input) {
      alert('Please enter a URL');
      return;
    } 

    console.log('-> input', input);

    button.classList.add('hidden');
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
      button.classList.remove('hidden');
    });
  }
}