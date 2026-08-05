-- 1. 장비(equipment) 테이블 생성
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  "purchaseDate" TEXT,
  price TEXT,
  serial TEXT,
  components TEXT,
  manager TEXT,
  owner TEXT,
  "desc" TEXT,
  qty INTEGER DEFAULT 1,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 대여 신청(requests) 테이블 생성
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "equipmentIds" UUID[] NOT NULL,
  applicant TEXT NOT NULL,
  purpose TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  memo TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (선택) 보안을 위해 RLS(Row Level Security)를 비활성화 하거나,
-- 누구나 읽고 쓸 수 있도록 설정합니다. 소규모 내부용이므로 모든 접근을 허용하는 정책을 추가합니다.
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all actions on equipment" ON equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all actions on requests" ON requests FOR ALL USING (true) WITH CHECK (true);
