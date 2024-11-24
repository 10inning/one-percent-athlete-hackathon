import pickle
import numpy as np
from pathlib import Path

def predict_marathon(input_features: list):
    """
    Predicts the marathon outcome using a pre-trained pipeline.
    Args:
    - input_features (list): Features prepared for the model in the correct order.
    Returns:
    - float: Predicted value.
    """
    # Resolve the current directory and model path
    current_dir = Path(__file__).resolve().parent
    model_path = current_dir / "../mlmodels/regressor.pkl"
    model_path = model_path.resolve()

    # Load the pipeline and feature order
    with open(model_path, 'rb') as file:
        saved_data = pickle.load(file)

    pipeline = saved_data['pipeline']  # Extract the pipeline
    print(pipeline)
    # Prepare features for prediction
    input_features = np.array(input_features).reshape(1, -1)  # Ensure correct shape
    prediction = pipeline.predict(input_features)[0]  # Perform the prediction

    return prediction

# Example of running inference
if __name__ == "__main__":
    features_example = [80, 13, 1.6306, 0, 0, 1, 0, 0, 0]  # Replace with actual prepared features
    result = predict_marathon(features_example)
    print(f"Predicted marathon time: {result}")
