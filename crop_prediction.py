import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

class CropPredictionModel:
    def __init__(self):
        self.model = RandomForestClassifier()
        self.scaler = StandardScaler()
        
    def train(self, X_train, y_train):
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        
    def predict(self, features):
        features_scaled = self.scaler.transform(features)
        return self.model.predict(features_scaled)
    
    def save_model(self, path):
        joblib.dump((self.model, self.scaler), path)
    
    def load_model(self, path):
        self.model, self.scaler = joblib.load(path)