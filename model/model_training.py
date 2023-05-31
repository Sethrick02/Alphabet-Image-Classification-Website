from tensorflow import keras
from tensorflow.keras import layers
from emnist import extract_training_samples, extract_test_samples
import numpy as np

# Load the training and test data
train_images, train_labels = extract_training_samples('letters')
test_images, test_labels = extract_test_samples('letters')

# Make writable copies of the label arrays
train_labels = train_labels.copy()
test_labels = test_labels.copy()

# Rotate images
train_images = np.rot90(train_images, -1, axes=(1, 2))
test_images = np.rot90(test_images, -1, axes=(1, 2))

# Scale pixel values from 0-255 to 0-1
train_images = train_images / 255.0
test_images = test_images / 255.0

# Adjust labels, subtract 1 as EMNIST's labels are 1-based
train_labels -= 1
test_labels -= 1

# CNN model
model = keras.Sequential([
    layers.Reshape((28, 28, 1), input_shape=(28, 28)),  # Reshape the input
    # First convolutional layer
    layers.Conv2D(32, kernel_size=(3, 3), activation='relu'),
    layers.MaxPooling2D(pool_size=(2, 2)),  # First pooling layer
    # Second convolutional layer
    layers.Conv2D(64, kernel_size=(3, 3), activation='relu'),
    layers.MaxPooling2D(pool_size=(2, 2)),  # Second pooling layer
    layers.Flatten(),  # Flatten the tensor output from the previous layer
    layers.Dense(128, activation='relu'),  # A fully connected layer
    # Output layer (26 classes for the letters A-Z)
    layers.Dense(26, activation='softmax')
])

# Compile
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
history = model.fit(train_images, train_labels, epochs=25,
                    validation_data=(test_images, test_labels))

# Evaluate the model
test_loss, test_acc = model.evaluate(test_images, test_labels)
print('Test accuracy:', test_acc)

# Save the model
model.save('model/alphabet_model.h5')
