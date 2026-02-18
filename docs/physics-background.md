# Metasurface Physics & Phase Profile

메타렌즈 설계의 핵심 물리 이론과 수식 체계에 대한 설명입니다.

## 1. 하이퍼볼릭 위상 프로파일 (Hyperbolic Phase Profile)

메타렌즈가 빛을 한 점으로 모으기 위해서는 구면 수차를 보정한 위상 분포가 필요합니다. 중심에서 거리 $r$인 지점에 필요한 위상 $\Phi(r)$은 다음과 같은 하이퍼볼릭 공식으로 정의됩니다.

$$ \Phi(r) = \frac{2\pi}{\lambda} \left( f - \sqrt{r^2 + f^2} \right) \pmod{2\pi} $$

- $f$: 초점 거리 (Focal Length)
- $\lambda$: 파장 (Wavelength)
- $r$: 렌즈 중심으로부터의 반지름 방향 거리

## 2. 유닛 셀 매핑 (Unit-cell Mapping)

각 좌표 $(x, y)$에서 계산된 타겟 위상을 구현하기 위해, 해당 위상값을 가지는 메타 아톰(Meta-atom)을 라이브러리에서 선택합니다.

- **Phase Range**: $0$ to $2\pi$를 모두 커버할 수 있는 나노 구조 설계.
- **Transmission**: 회절 효율을 위해 투과율 $T > 0.8$ 이상을 유지하는 구조 선택.

---

## AI Surrogate 모델 아키텍처

본 플랫폼은 고부하 시뮬레이션을 대체하기 위해 다층 퍼셉트론(MLP) 기반 AI 모델을 사용합니다.

- **Input**: `[radius, height, wavelength, geometry_params]`
- **Output**: `[phase, transmission]`
- **Loss**: MSE(Mean Squared Error) minimizing combined with Phase Wrapping loss.
