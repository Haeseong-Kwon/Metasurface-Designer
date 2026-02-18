import json
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import MinMaxScaler
import numpy as np

class MetaAtomDataset(Dataset):
    """
    메타 아톰 샘플 데이터(`sample_meta_atom_data.json`)를 위한 PyTorch Dataset.
    이제 radius, wavelength, period를 입력으로 사용합니다.
    """
    def __init__(self, data_path='../sample_meta_atom_data.json', train=True, test_split=0.2):
        """
        Args:
            data_path (str): sample_meta_atom_data.json 파일 경로.
            train (bool): True이면 학습 데이터, False이면 테스트 데이터를 반환.
            test_split (float): 전체 데이터 중 테스트 데이터로 사용할 비율.
        """
        with open(data_path, 'r') as f:
            raw_data = json.load(f)

        # 데이터 파싱: 3개의 입력 파라미터(radius, wavelength, period)
        radii = [item['dimensions']['radius'] for item in raw_data]
        periods = [item['dimensions']['period'] for item in raw_data]
        wavelengths = [item['phase_response']['wavelength'] for item in raw_data]
        
        phases = [item['phase_response']['phase'] for item in raw_data]
        transmissions = [item['phase_response']['transmission'] for item in raw_data]

        # Numpy 배열로 변환 (N, 3) 형태로
        X = np.stack([radii, wavelengths, periods], axis=1)
        
        # Phase는 0-2pi, Transmission은 0-1 범위로 정규화
        y_phase = np.array(phases).reshape(-1, 1) / (2 * np.pi)
        y_transmission = np.array(transmissions).reshape(-1, 1)
        y = np.concatenate([y_phase, y_transmission], axis=1)

        # 데이터 분할
        dataset_size = len(X)
        indices = list(range(dataset_size))
        split = int(np.floor(test_split * dataset_size))
        
        # NOTE: 실제 프로젝트에서는 매번 실행 시 동일한 분할을 위해 np.random.seed 사용 고려
        np.random.shuffle(indices)
        train_indices, test_indices = indices[split:], indices[:split]

        if train:
            self.indices = train_indices
        else:
            self.indices = test_indices
            
        # Scaler 정의. 3개의 모든 입력(X)을 스케일링한다.
        self.scaler_X = MinMaxScaler()
        self.scaler_X.fit(X[train_indices]) # 학습 데이터 기준으로 스케일링

        # 데이터를 float32 텐서로 변환
        self.X_tensor = torch.tensor(self.scaler_X.transform(X), dtype=torch.float32)
        self.y_tensor = torch.tensor(y, dtype=torch.float32)

    def __len__(self):
        return len(self.indices)

    def __getitem__(self, idx):
        data_idx = self.indices[idx]
        return self.X_tensor[data_idx], self.y_tensor[data_idx]

def get_dataloader(data_path='../sample_meta_atom_data.json', batch_size=16, test_split=0.2):
    """
    학습 및 테스트용 DataLoader를 반환합니다.

    Args:
        data_path (str): JSON 데이터 파일 경로.
        batch_size (int): 배치 사이즈.
        test_split (float): 테스트 데이터 비율.

    Returns:
        tuple: (train_loader, test_loader, scaler_X)
    """
    train_dataset = MetaAtomDataset(data_path=data_path, train=True, test_split=test_split)
    # 테스트셋에도 동일한 데이터 분할을 적용하기 위해 train_indices를 전달할 수도 있으나,
    # 여기서는 간단하게 다시 생성합니다.
    test_dataset = MetaAtomDataset(data_path=data_path, train=False, test_split=test_split)

    train_loader = DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(dataset=test_dataset, batch_size=batch_size, shuffle=False)
    
    # 추론 시 입력을 스케일링하기 위해 scaler 객체를 반환합니다.
    return train_loader, test_loader, train_dataset.scaler_X

if __name__ == '__main__':
    # 데이터 로더 테스트
    try:
        # get_dataloader가 프로젝트 루트의 파일을 찾도록 경로 수정
        train_loader, test_loader, scaler = get_dataloader(batch_size=4, data_path='sample_meta_atom_data.json')

        print(f"Total training batches: {len(train_loader)}")
        print(f"Total test batches: {len(test_loader)}")

        # 첫 번째 배치 데이터 확인
        train_features, train_labels = next(iter(train_loader))
        print(f"Feature batch shape: {train_features.size()}") # 기대값: torch.Size([4, 3])
        print(f"Labels batch shape: {train_labels.size()}")
        print("--- Sample Batch ---")
        print("Feature (Scaled Radius, Wavelength, Period):")
        print(train_features)
        print("Labels (Scaled Phase, Transmission):")
        print(train_labels)
        
        print(f"Scaler fitted on {scaler.n_features_in_} features.")
        print(f"Scaler Min: {scaler.min_}")
        print(f"Scaler Scale: {scaler.scale_}")

    except FileNotFoundError:
        print("Error: `sample_meta_atom_data.json` not found.")
        print("Please make sure the data file exists in the project root directory.")

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please check the format of `sample_meta_atom_data.json`.")
