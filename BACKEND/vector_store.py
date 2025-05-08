import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors
import pickle
import os

class HealthVectorStore:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.encoder = SentenceTransformer(model_name)
        
        # Initialize nearest neighbors model
        self.knn = NearestNeighbors(n_neighbors=3, metric='cosine')
        
        # Store texts and vectors
        self.texts = []
        self.vectors = None
        
        # Path for persistence
        self.data_path = "health_data.pkl"
        
        # Load existing data if available
        self._load_or_initialize()
    
    def _load_or_initialize(self):
        """Load existing data or initialize with default health data"""
        if os.path.exists(self.data_path):
            # Load existing data
            with open(self.data_path, 'rb') as f:
                data = pickle.load(f)
                self.texts = data['texts']
                self.vectors = data['vectors']
                if len(self.texts) > 0:
                    self.knn.fit(self.vectors)
        else:
            # Initialize with default health data
            default_texts = [
                "Fever is a common symptom of infections and can be caused by viruses or bacteria.",
                "Headache can be caused by stress, dehydration, or underlying medical conditions.",
                "Chest pain should be evaluated by a cardiologist immediately.",
                "Skin rashes can be caused by allergies, infections, or autoimmune conditions.",
                "Abdominal pain can be related to digestive issues, infections, or organ problems.",
                "Shortness of breath may indicate respiratory or cardiac conditions.",
                "Joint pain can be caused by arthritis, injury, or autoimmune diseases.",
                "Fatigue can be a symptom of various conditions including anemia, thyroid problems, or chronic fatigue syndrome.",
                "Nausea and vomiting can be caused by infections, food poisoning, or digestive disorders.",
                "Dizziness can be related to inner ear problems, low blood pressure, or neurological conditions."
            ]
            self.add_texts(default_texts)
    
    def add_texts(self, texts):
        """Add new texts to the vector store"""
        if not texts:
            return
        
        # Convert texts to vectors
        new_vectors = self.encoder.encode(texts)
        
        # Update vectors
        if self.vectors is None:
            self.vectors = new_vectors
        else:
            self.vectors = np.vstack([self.vectors, new_vectors])
        
        # Update texts
        self.texts.extend(texts)
        
        # Fit the KNN model
        self.knn.fit(self.vectors)
        
        # Save to disk
        self._save()
    
    def search(self, query, k=3):
        """Search for similar texts"""
        # Convert query to vector
        query_vector = self.encoder.encode([query])
        
        # If we don't have any vectors yet, return empty list
        if self.vectors is None or len(self.vectors) == 0:
            return []
        
        # Find nearest neighbors
        distances, indices = self.knn.kneighbors(query_vector)
        
        # Get corresponding texts
        results = [self.texts[i] for i in indices[0]]
        return results
    
    def _save(self):
        """Save the data to disk"""
        data = {
            'texts': self.texts,
            'vectors': self.vectors
        }
        with open(self.data_path, 'wb') as f:
            pickle.dump(data, f) 