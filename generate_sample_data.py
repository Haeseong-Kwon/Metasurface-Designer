import json
import random
import math

def generate_meta_atom_data(num_samples=100):
    data = []
    for i in range(num_samples):
        # 1. 파라미터 다양화: 파장과 주기를 랜덤 변수로 설정
        wavelength_nm = round(random.uniform(400, 700), 2)  # 400nm ~ 700nm
        radius_nm = round(random.uniform(50, 200), 2)     # 50nm ~ 200nm
        period_nm = round(random.uniform(400, 500), 2)      # 400nm ~ 500nm, 주기
        
        # 물리적 제약조건: 주기는 항상 반지름의 2배보다 커야 함
        # 이 조건이 학습 데이터의 품질을 높일 수 있음
        min_period = radius_nm * 2
        if period_nm < min_period:
            period_nm = round(random.uniform(min_period, min_period + 100), 2)

        # 2. 위상 및 투과율은 그대로 랜덤 생성 (실제로는 시뮬레이션 결과)
        phase_rad = round(random.uniform(0, 2 * math.pi), 4) # Phase between 0 and 2*pi
        transmission = round(random.uniform(0, 1), 4)      # Transmission between 0 and 1

        entry = {
            "name": f"Si Pillar {wavelength_nm}nm - R{radius_nm} P{period_nm}",
            "geometry": "cylinder",
            "material": "silicon",
            "dimensions": {
                "radius": radius_nm,
                "period": period_nm, # 주기(Period) 추가
                "unit": "nm"
            },
            "phase_response": {
                "wavelength": wavelength_nm, # 파장(Wavelength)을 변수로 사용
                "phase": phase_rad,
                "transmission": transmission
            },
        }
        data.append(entry)
    return data

if __name__ == "__main__":
    sample_data = generate_meta_atom_data(100)
    with open("sample_meta_atom_data.json", "w", encoding="utf-8") as f:
        json.dump(sample_data, f, indent=4, ensure_ascii=False)
    print("Generated sample_meta_atom_data.json with 100 entries.")
