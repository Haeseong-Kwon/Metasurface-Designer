import json
import os
from supabase import create_client, Client

# Supabase 크리덴셜 설정
# 실제 환경에서는 환경 변수를 사용하거나, 별도의 설정 파일을 통해 관리하는 것이 좋습니다.
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY environment variables must be set.")
    print("Example: export SUPABASE_URL='YOUR_SUPABASE_URL'")
    print("Example: export SUPABASE_KEY='YOUR_SUPABASE_ANON_KEY'")
    exit(1)

# Supabase 클라이언트 초기화
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upsert_data(data_file_path: str, table_name: str = "meta_atom_library"):
    """
    JSON 파일에서 데이터를 읽어 Supabase 테이블에 upsert합니다.
    """
    try:
        with open(data_file_path, "r", encoding="utf-8") as f:
            data_to_upsert = json.load(f)

        print(f"Upserting {len(data_to_upsert)} entries into '{table_name}' table...")

        # upsert 작업 수행
        # on_conflict를 사용하지 않으면 기본적으로 'id' 충돌 시 업데이트됩니다.
        # 우리의 경우 id는 gen_random_uuid()로 자동 생성되므로,
        # 중복 방지를 위한 다른 고유 컬럼이 필요할 수 있습니다.
        # 이 스크립트에서는 단순히 insert로 동작하도록 합니다.
        # 실제 데이터 중복 처리가 필요하다면, on_conflict 파라미터를 사용하세요.
        # 예: .upsert(data_to_upsert, on_conflict="name")

        # Supabase Python 클라이언트의 insert/upsert 동작 확인 필요
        # 공식 문서에 따르면 insert는 ID가 없는 경우 새로 생성, 있는 경우 에러
        # upsert는 ID가 없는 경우 새로 생성, 있는 경우 업데이트
        # 현재 생성된 데이터는 ID가 없으므로 insert가 적합합니다.

        res = supabase.table(table_name).insert(data_to_upsert).execute()
        
        # res.data가 None이 아니고 비어있지 않은지 확인하여 성공 여부 판단
        if res.data and len(res.data) > 0:
            print(f"Successfully upserted {len(res.data)} entries.")
        else:
            # Supabase API가 성공했으나 반환된 데이터가 없는 경우
            print("Upsert operation completed, but no data was returned. This might indicate success or an issue depending on Supabase's exact behavior.")
            print(f"Response: {res}")
            # 추가적인 오류 메시지 로깅
            if hasattr(res, 'error') and res.error:
                print(f"Supabase Error: {res.error}")

    except FileNotFoundError:
        print(f"Error: Data file not found at '{data_file_path}'")
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{data_file_path}'. Check file format.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    DATA_FILE = "sample_meta_atom_data.json"
    TABLE_NAME = "meta_atom_library" # 스키마에 정의된 테이블 이름

    # supabase-py 라이브러리 설치 안내
    print("Make sure you have the 'supabase-py' library installed.")
    print("You can install it using: pip install supabase-py")
    print("-" * 30)

    upsert_data(DATA_FILE, TABLE_NAME)
