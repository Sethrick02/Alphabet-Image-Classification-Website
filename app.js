// Functionality for file selection
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const img = document.getElementById('uploadImage');
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
});

// Functionality for drag and drop
const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropzone.style.backgroundColor = '#eee'; // Add visual cue when dragging
});

dropzone.addEventListener('dragleave', function (e) {
    dropzone.style.backgroundColor = 'transparent'; // Remove visual cue
});

dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.style.backgroundColor = 'transparent'; // Remove visual cue
    const file = e.dataTransfer.files[0];
    const img = document.getElementById('uploadImage');
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
});

// Reset button
document.getElementById('resetButton').addEventListener('click', function () {
    const img = document.getElementById('uploadImage');
    img.src = '#';
    img.style.display = 'none';
    document.getElementById('predictionText').textContent = 'Prediction will be displayed here';
});

// Prediction button functionality
document.getElementById('predictButton').addEventListener('click', async function () {
    const img = document.getElementById('uploadImage');

    // Ensure an image is selected
    if (img.src === '#' || !img.complete) {
        alert('Please upload an image first.');
        return;
    }

    // Load the model
    const model = await tf.loadLayersModel('https://sethrick02.github.io/model.json');

    // Preprocess the image
    const tensorImg = tf.browser.fromPixels(img).toFloat();
    const resized = tf.image.resizeBilinear(tensorImg, [modelInputWidth, modelInputHeight]);
    const normalized = resized.div(tf.scalar(255));
    const batched = normalized.expandDims();

    // Make the prediction
    const prediction = model.predict(batched);
    const predictionData = await prediction.data();
    const predictionClass = tf.argMax(predictionData).dataSync()[0]; // Assumes the model returns probabilities for each class

    // Display the prediction on the page
    const predictionText = document.getElementById('predictionText');
    if (isNaN(predictionClass)) {
        predictionText.textContent = 'Prediction not available.';
    } else {
        predictionText.textContent = `Prediction: ${predictionClass}`;
    }

    // Clean up
    tensorImg.dispose();
    resized.dispose();
    normalized.dispose();
    batched.dispose();
    model.dispose();
});

// Load the model
const modelInputWidth = 224; // Replace with the appropriate value
const modelInputHeight = 224; // Replace with the appropriate value
tf.loadLayersModel('https://sethrick02.github.io/model.json').then(model => {
    // store the loaded model in a variable for later use
    const loadedModel = model;
}).catch(error => {
    console.error('Error:', error);
});
