from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.get("/")
def home():
    return {"msg": "Spam API running"}

@app.post("/predict")
def predict(text: str):
    vec = vectorizer.transform([text])
    result = model.predict(vec)[0]

    return {
        "input": text,
        "prediction": "spam" if result == 1 else "ham"
    }