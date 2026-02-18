-- Meta-Atom Library Schema
-- 이 스키마는 메타렌즈 설계에 사용되는 유닛 셀(Meta-Atom)의 특성을 저장합니다.

-- geometry 타입을 위한 ENUM (필요시 확장)
CREATE TYPE meta_atom_geometry AS ENUM ('cylinder', 'rectangular', 'cross', 'hole');

CREATE TABLE IF NOT EXISTS meta_atom_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    geometry meta_atom_geometry NOT NULL,
    material TEXT NOT NULL,
    
    -- 치수 정보: {radius: 0.1, height: 0.6, unit: "um"} 등 JSON 형식으로 저장
    dimensions JSONB NOT NULL,
    
    -- 위상 응답: {wavelength: 0.532, phase: 1.5, transmission: 0.9} 등
    phase_response JSONB NOT NULL,
    
    -- 인덱싱을 위한 추가 필드
    wavelength_um FLOAT NOT NULL,
    target_frequency_thz FLOAT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 검색 성능 최적화를 위한 인덱스
CREATE INDEX idx_meta_atom_wavelength ON meta_atom_library(wavelength_um);
CREATE INDEX idx_meta_atom_material ON meta_atom_library(material);

-- 자동 업데이트 시간 설정을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meta_atom_library_modtime
    BEFORE UPDATE ON meta_atom_library
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
