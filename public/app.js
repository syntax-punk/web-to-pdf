const endpoint = "https://gander-5fosbnbg3a-uc.a.run.app";

window.onload = function() {
  document.theform.onsubmit = function(e) {
    e.preventDefault();
    e.stopPropagation();
    const input = document.getElementById('url').value.trim();
    
    if (!input) {
      alert('Please enter a URL');
      return;
    } 

    console.log('-> input', input);
    
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: input })
    })
  }
}