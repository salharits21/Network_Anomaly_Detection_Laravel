import joblib
import numpy as np
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf

# Inisialisasi aplikasi FastAPI
app = FastAPI()

# Muat model Keras dan Scaler saat aplikasi dimulai
try:
    model = tf.keras.models.load_model('network-anomaly-detector-v6.keras')
    scaler = joblib.load('scaler.joblib')
    print("Model dan Scaler berhasil dimuat.")
except Exception as e:
    print(f"Error memuat model atau scaler: {e}")
    model = None
    scaler = None

# Definisikan pemetaan label ke kategori seperti sebelumnya
ATTACK_CATEGORY_MAP = {
    0: 'Normal', 1: 'Fuzzers', 2: 'Analysis', 3: 'Backdoors', 4: 'DoS',
    5: 'Exploits', 6: 'Generic', 7: 'Reconnaissance', 8: 'Shellcode',
    9: 'Worms', 10: 'Unknown'
}

# Definisikan struktur data input yang diharapkan
class NetflowFeatures(BaseModel):
    dur: float
    sbytes: int
    dbytes: int
    Sload: float
    smeansz: float
    Stime: int
    duration: float
    byte_pkt_interaction_dst: float

# Buat endpoint API untuk prediksi
@app.post("/predict")
def predict(features: NetflowFeatures):
    if not model or not scaler:
        return {"error": "Model atau scaler tidak berhasil dimuat"}

    # Susun data sesuai urutan yang diharapkan model
    feature_list = [
        features.dur, features.sbytes, features.dbytes, features.Sload,
        features.smeansz, features.Stime, features.duration,
        features.byte_pkt_interaction_dst
    ]
    
    # Konversi ke numpy array dan reshape untuk scaler
    data_to_predict = np.array(feature_list).reshape(1, -1)
    
    # Terapkan scaling
    scaled_data = scaler.transform(data_to_predict)
    
    # Lakukan prediksi
    prediction = model.predict(scaled_data)
    
    # Dapatkan label dan nama kategori
    predicted_label = int(np.argmax(prediction, axis=1)[0])
    attack_category = ATTACK_CATEGORY_MAP.get(predicted_label, 'Undefined')
    
    return {
        "label": predicted_label,
        "attack_category": attack_category
    }

# Jalankan server API (untuk pengembangan)
if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)