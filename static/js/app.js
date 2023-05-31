let selectedFile;

document.getElementById('fileInput').addEventListener('change', function (e) {
    handleFileUpload(e.target.files[0]);
});

const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.style.backgroundColor = 'transparent';
    handleFileUpload(e.dataTransfer.files[0]);
});

function handleFileUpload(file) {
    selectedFile = file;
    const img = document.getElementById('uploadImage');
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
    document.querySelector('#dropzone p').style.display = 'none';
}

document.getElementById('predictButton').addEventListener('click', async function () {
    const loadingIcon = document.getElementById('loadingIcon');
    const predictionText = document.getElementById('predictionText');

    if (!selectedFile) {
        predictionText.textContent = 'Please upload an image first.';
        return;
    }

    loadingIcon.style.display = 'block';

    var formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        predictionText.textContent = `Prediction: ${data.predictions}`;
    } catch (error) {
        console.error('Error:', error);
        predictionText.textContent = error.message;
    } finally {
        loadingIcon.style.display = 'none';
    }
});

document.getElementById('resetButton').addEventListener('click', function () {
    const img = document.getElementById('uploadImage');
    img.src = '#';
    img.style.display = 'none';
    document.getElementById('predictionText').textContent = 'Prediction will be displayed here';
    document.querySelector('#dropzone p').style.display = 'block';
});

