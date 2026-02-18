import torch
import joblib
import numpy as np
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from typing import List, Dict

from model import SurrogateModel

# --- 모델 및 스케일러 로딩 ---
MODEL_PATH = "ai-server/models/surrogate_model.pth"
SCALER_PATH = "ai-server/models/scaler.joblib"

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI 앱 시작 시 모델과 스케일러를 로드하고, 종료 시 정리합니다.
    """
    print("--- Loading ML model and scaler for Multi-parameter Surrogate Model ---")
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(
            f"Model '{MODEL_PATH}' or scaler '{SCALER_PATH}' not found. "
            "Please run 'python -m ai_server.train' first to train and save the model."
        )
    
    # 모델 로드 (input_size=3)
    model = SurrogateModel(input_size=3)
    model.load_state_dict(torch.load(MODEL_PATH))
    model.eval() # 추론 모드로 설정
    ml_models["surrogate_model"] = model

    # 스케일러 로드
    scaler = joblib.load(SCALER_PATH)
    ml_models["scaler"] = scaler
    
    print("--- Model and scaler loaded successfully ---")
    yield
    ml_models.clear()
    print("--- Cleaned up ML models ---")


app = FastAPI(lifespan=lifespan)

# --- API 요청 및 응답 모델 정의 (배치 처리) ---
class MetaAtom(BaseModel):
    radius: float
    # 'lambda'는 Python 예약어이므로 alias를 사용
    lambda_val: float = Field(..., alias="lambda")
    period: float

class PredictRequest(BaseModel):
    atoms: List[MetaAtom]

class PredictionResult(BaseModel):
    phase: float
    transmission: float

class PredictResponse(BaseModel):
    predictions: List[PredictionResult]


# --- API 엔드포인트 ---
@app.post("/api/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """
    입력된 메타 원자 배치(Batch)에 대한 위상(Phase)과 투과율(Transmission)을 예측합니다.
    """
    try:
        model = ml_models.get("surrogate_model")
        scaler = ml_models.get("scaler")

        if model is None or scaler is None:
            raise HTTPException(status_code=500, detail="Model is not loaded")

        # 1. 입력 데이터 배치 생성
        input_data = [[atom.radius, atom.lambda_val, atom.period] for atom in request.atoms]
        input_np = np.array(input_data)

        if input_np.shape[0] == 0:
            return PredictResponse(predictions=[])

        # 2. 배치 데이터 스케일링
        input_scaled = scaler.transform(input_np)
        input_tensor = torch.tensor(input_scaled, dtype=torch.float32)

        # 3. 모델 추론 (배치)
        with torch.no_grad():
            predictions_raw = model(input_tensor)

        # 4. 결과 후처리 (배치)
        # - Phase: 0-1로 예측된 값을 0-2pi 범위로 변환
        # - Transmission: Logit 값을 Sigmoid를 통해 0-1 확률 값으로 변환
        pred_phase_scaled = predictions_raw[:, 0]
        pred_trans_logit = predictions_raw[:, 1]
        
        phases = (pred_phase_scaled * 2 * np.pi).tolist()
        transmissions = torch.sigmoid(pred_trans_logit).tolist()

        # 5. 응답 데이터 구성
        results = [
            PredictionResult(phase=ph, transmission=tr)
            for ph, tr in zip(phases, transmissions)
        ]

        return PredictResponse(predictions=results)

    except Exception as e:
        # 에러 로깅을 위해 실제 프로덕션에서는 logging 라이브러리 사용 권장
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {e}")

@app.get("/")
def read_root():
    return {"message": "Metasurface Multi-parameter Surrogate Model AI Server is running."}

if __name__ == "__main__":
    import uvicorn
    print("Starting server... To run, use: uvicorn ai-server.main:app --reload")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_config=None)
