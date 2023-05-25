// Functionality for file selection
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const img = document.getElementById('uploadImage');
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
    document.querySelector('#dropzone p').style.display = 'none'; // hide the text
});

// Functionality for drag and drop
dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.style.backgroundColor = 'transparent'; // Remove visual cue
    const file = e.dataTransfer.files[0];
    const img = document.getElementById('uploadImage');
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
    document.querySelector('#dropzone p').style.display = 'none'; // hide the text
});

// Reset button functionality
document.getElementById('resetButton').addEventListener('click', function () {
    const img = document.getElementById('uploadImage');
    img.src = '#';
    img.style.display = 'none';
    document.getElementById('predictionText').textContent = 'Prediction will be displayed here';
    document.querySelector('#dropzone p').style.display = 'block'; // show the text
});

// Prediction button functionality
document.getElementById('predictButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    const loadingIcon = document.getElementById('loadingIcon');
    const predictionText = document.getElementById('predictionText');

    // Ensure an image is selected
    if (fileInput.files.length === 0) {
        predictionText.textContent = 'Please upload an image first.';
        return;
    }

    // Show loading icon
    loadingIcon.style.display = 'block';

    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Here, 'data' is the prediction returned from the server.
            console.log(data);
            predictionText.textContent = `Prediction: ${data[0]}`;
        })
        .catch(error => {
            console.error('Error:', error);
            predictionText.textContent = 'Could not classify image.';
        })
        .finally(() => {
            // Hide loading icon
            loadingIcon.style.display = 'none';
        });
});

// Load the model
const modelInputWidth = 28; // Replace with the appropriate value
const modelInputHeight = 28; // Replace with the appropriate value
tf.loadLayersModel('./model/model.json').then(model => {
    // store the loaded model in a variable for later use
    const loadedModel = model;
}).catch(error => {
    console.error('Error:', error);
});
