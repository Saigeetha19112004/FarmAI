import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import joblib

class YieldPredictionModel:
    def __init__(self):
        self.model = GradientBoostingRegressor()
        self.scaler = StandardScaler()
        
    def preprocess_data(self, data):
        # Handle weather data
        weather_features = self.process_weather_data(data['weather'])
        # Handle soil data
        soil_features = self.process_soil_data(data['soil'])
        # Combine features
        return np.concatenate([weather_features, soil_features])
    
    def process_weather_data(self, weather_data):
        # Extract relevant weather features
        features = [
            weather_data['temperature'],
            weather_data['rainfall'],
            weather_data['humidity'],
            weather_data['sunshine_hours']
        ]
        return np.array(features)
    
    def process_soil_data(self, soil_data):
        # Extract relevant soil features
        features = [
            soil_data['ph'],
            soil_data['nitrogen'],
            soil_data['phosphorus'],
            soil_data['potassium']
        ]
        return np.array(features)
    
    def train(self, X_train, y_train):
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
    
    def predict(self, features):
        features_scaled = self.scaler.transform(features)
        return self.model.predict(features_scaled)