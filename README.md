Alphabetical Image Classification IN PROGRESS

To Run Program:

1. Ensure you have the following software installed on your machine:

    - Python 3 (3.6 or newer is recommended)
    - TensorFlow (2.0 or newer is recommended)
    - Keras
    - Flask
    - PIL (Python Imaging Library)

2. Create a directory structure like the following:

    ```
    .
    ├── uploads
    ├── app.py
    ├── model_training.py
    ├── static
    │   ├── css
    │   │   └── styles.css
    │   └── js
    │       └── app.js
    └── templates
        └── index.html
    ```
    
4. Run the `model_training.py` script to train your model. Once the model is trained, it will be saved as `alphabet_model.h5` in the same directory. Make     sure the file saves in the `uploads` directory.

5. Once your model is trained and saved, and your directory structure is set up as above, run app.py.
