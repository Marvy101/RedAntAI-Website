document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkButton');
    const results = document.getElementById('results');
    
    checkButton.addEventListener('click', sendToAPI);
  });

  async function loadDocx(file) {
    const reader = new FileReader();
    const fileContent = await new Promise((resolve) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsArrayBuffer(file);
    });
  
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(fileContent);
    const xml = await zipContent.file("word/document.xml").async("string");
  
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
  
    const textElements = xmlDoc.getElementsByTagName("w:t");
    let out = [];
  
    for (let i = 0; i < textElements.length; i++) {
      out.push(textElements[i].textContent);
    }
  
    return out;
  }
  
  
  async function handleFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
  
    if (file.type === "text/plain" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const extractedText = await loadDocx(file);
        document.getElementById("input").value = extractedText.join(" ");
      } else {
        const reader = new FileReader();
        reader.onload = function(e) {
          const fileContent = e.target.result;
          document.getElementById("input").value = fileContent;
        };
        reader.readAsText(file);
      }
    } else {
      alert("Unsupported file type. Please upload a .txt or .docx file.");
      fileInput.value = "";
    }
  }
  
  
  
    
    function sendToAPI() {
      const inputText = document.getElementById("input").value;
      console.log(inputText);
    
      document.getElementById("loader").style.display = "block";
      document.getElementById("results").innerHTML = "Loading...";
    
      fetch(`https://marvy101.pythonanywhere.com/user/?user=${encodeURIComponent(inputText)}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
    
          document.getElementById("loader").style.display = "none";
    
          document.getElementById("results").innerHTML = JSON.stringify(data);
        })
        .catch(error => {
          console.error(error);
    
          document.getElementById("loader").style.display = "none";
          document.getElementById("results").innerHTML = "Error: " + error;
        });
    }
    
  