import torch
import torch.nn as nn
from torch.optim import Adam
import os
import joblib

from model import SurrogateModel
from dataset import get_dataloader

# --- PINN 확장용 함수 ---
def compute_physics_loss(scaled_phase_pred):
    """
    물리적 제약조건(Phase는 0~1 사이)에 기반한 손실 항을 계산합니다.
    (0~1로 정규화된 위상 예측값이 범위를 벗어날 때 패널티를 부과)

    Args:
        scaled_phase_pred (torch.Tensor): 모델이 예측한 정규화된 위상 값.

    Returns:
        torch.Tensor: 물리 법칙 위배 정도를 나타내는 손실 값.
    """
    # 1. 예측값이 1을 초과하는 경우에 대한 손실
    loss_upper = torch.mean(torch.relu(scaled_phase_pred - 1.0))
    # 2. 예측값이 0 미만인 경우에 대한 손실
    loss_lower = torch.mean(torch.relu(-scaled_phase_pred))
    
    return loss_upper + loss_lower


def train(model, train_loader, epochs=100, lr=0.001, physics_weight=0.1):
    """
    PINN Loss가 적용된 Surrogate 모델을 학습시킵니다.
    """
    optimizer = Adam(model.parameters(), lr=lr)
    data_criterion = nn.MSELoss() 

    print("--- Training Started (with PINN loss) ---")
    for epoch in range(epochs):
        model.train()
        total_loss = 0.0
        
        for inputs, targets in train_loader:
            optimizer.zero_grad()

            # 1. 모델 예측 (출력: raw phase, raw transmission logit)
            predictions = model(inputs)
            
            # 예측값과 타겟 분리
            pred_phase_scaled = predictions[:, 0].unsqueeze(1)
            pred_trans_logit = predictions[:, 1].unsqueeze(1)
            target_phase_scaled = targets[:, 0].unsqueeze(1)
            target_trans = targets[:, 1].unsqueeze(1)

            # 2. 데이터 기반 손실 계산
            # - Phase Loss: 예측과 실제 값의 MSE
            # - Transmission Loss: 예측에 Sigmoid를 취한 값과 실제 값의 MSE
            loss_phase_data = data_criterion(pred_phase_scaled, target_phase_scaled)
            loss_trans_data = data_criterion(torch.sigmoid(pred_trans_logit), target_trans)
            data_loss = loss_phase_data + loss_trans_data

            # 3. 물리 기반 손실 계산 (PINN)
            physics_loss = compute_physics_loss(pred_phase_scaled)

            # 4. 최종 손실 = 데이터 손실 + 물리 손실 (가중치 적용)
            loss = data_loss + physics_weight * physics_loss

            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        avg_loss = total_loss / len(train_loader)
        if (epoch + 1) % 10 == 0:
            print(f"Epoch [{epoch+1}/{epochs}], Average Loss: {avg_loss:.6f}")

    print("--- Training Finished ---")


if __name__ == '__main__':
    # 모델 저장 디렉토리 생성
    os.makedirs("ai-server/models", exist_ok=True)
    
    # 데이터 로더 및 모델 초기화
    try:
        # 데이터 로더가 프로젝트 루트의 파일을 찾도록 경로 수정
        train_loader, test_loader, scaler = get_dataloader(
            data_path='sample_meta_atom_data.json',
            batch_size=32
        )
        # 모델 입력 사이즈 3으로 변경
        model = SurrogateModel(input_size=3)

        # 모델 학습 (PINN Loss 가중치(physics_weight) 추가)
        train(model, train_loader, epochs=200, lr=0.001, physics_weight=0.1)

        # 학습된 모델과 스케일러 저장
        model_save_path = "ai-server/models/surrogate_model.pth"
        scaler_save_path = "ai-server/models/scaler.joblib"

        torch.save(model.state_dict(), model_save_path)
        joblib.dump(scaler, scaler_save_path)

        print(f"Model saved to {model_save_path}")
        print(f"Scaler saved to {scaler_save_path}")

    except FileNotFoundError:
        print("Error: `sample_meta_atom_data.json` not found.")
        print("Please run `python generate_sample_data.py` first to create the data file.")
    except Exception as e:
        print(f"An error occurred: {e}")
