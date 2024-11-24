import pickle
import pandas as pd
from pathlib import Path

def predict_marathon(input_features: list):
    current_dir = Path(__file__).resolve().parent  

    model_path = current_dir / "../mlmodels/regressor.pkl"
    model_path = model_path.resolve()  

    with open(model_path, 'rb') as file:
        data = pickle.load(file)

    pipeline = data['pipeline']
    feature_order = data['features']

    if not hasattr(pipeline, 'predict'):
        raise ValueError("The loaded pipeline is not correctly fitted.")

    input_df = pd.DataFrame([input_features], columns=feature_order)

    prediction = pipeline.predict(input_df)

    return prediction[0]  

