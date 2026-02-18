import torch
import torch.nn as nn

class SurrogateModel(nn.Module):
    """
    반지름(Radius), 파장(Wavelength), 주기(Period)를 입력받아
    위상(Phase)과 투과율(Transmission)을 예측하는 MLP 모델.
    PINN Loss 적용을 위해 마지막 Sigmoid 활성화 함수는 제거되었습니다.
    """
    def __init__(self, input_size=3, hidden_size1=32, hidden_size2=32, output_size=2):
        super(SurrogateModel, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size1),
            nn.ReLU(),
            nn.Linear(hidden_size1, hidden_size2),
            nn.ReLU(),
            nn.Linear(hidden_size2, output_size),
        )

    def forward(self, x):
        """
        모델의 순전파를 정의합니다.

        Args:
            x (torch.Tensor): 입력 텐서 (Radius, Wavelength, Period)

        Returns:
            torch.Tensor: 예측된 출력 텐서 (Raw Phase, Raw Transmission Logit)
        """
        return self.network(x)

if __name__ == '__main__':
    # 모델 테스트
    # 1. 모델 입력 차원 변경 (1 -> 3)
    model = SurrogateModel(input_size=3)
    print("PyTorch Surrogate Model Architecture (Multi-parameter):")
    print(model)

    # 2. 테스트 입력값 형태 변경 (N, 1) -> (N, 3)
    test_input = torch.randn(5, 3) # 5개의 샘플 데이터
    print("Test Input (Radius, Wavelength, Period):")
    print(test_input)

    # 모델 추론
    with torch.no_grad():
        output = model(test_input)
    
    print("Model Raw Output (Raw Phase, Raw Transmission Logit):")
    print(output)

    # 3. 후처리 로직은 학습/추론 루프에서 담당
    # (예: Transmission에 Sigmoid 적용, Phase에 범위 제한)
    pred_phase_scaled = output[:, 0]
    pred_transmission = torch.sigmoid(output[:, 1])
    
    print("Processed Output (for demonstration):")
    print(f" - Predicted Scaled Phase: {pred_phase_scaled.numpy()}")
    print(f" - Predicted Transmission: {pred_transmission.numpy()}")
