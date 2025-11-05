'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { LaneDetailType } from '@/types/lanes';
import { getLaneDetail } from "@/api/judge/client";

function equalLane(a: LaneDetailType, b: LaneDetailType) {
  return (
    a.id === b.id &&
    a.lane === b.lane &&
    a.play_num === b.play_num &&
    a.dq === b.dq &&
    a.team === b.team &&
    a.player === b.player &&
    a.swimming_name === b.swimming_name &&
    a.record === b.record &&
    a.prev === b.prev &&
    a.next === b.next
  );
}

export default function RefreshOnChange({
  id,
  initial,
  intervalMs = 5000,
}: {
  id: string;
  initial: LaneDetailType;
  intervalMs?: number;
}) {
  const router = useRouter();
  const snapshotRef = useRef<LaneDetailType>(initial);
  const inFlightRef = useRef(false);

  useEffect(() => {
    const tick = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        const next: LaneDetailType = await getLaneDetail(id);

        if (!equalLane(snapshotRef.current, next)) {
          snapshotRef.current = next;   // 동일 변경 반복 방지
          router.refresh();             // 서버 컴포넌트 전체를 최신으로 교체
        }
      } catch {
        // 네트워크 오류는 조용히 무시
      } finally {
        inFlightRef.current = false;
      }
    };

    // 즉시 1회 + 인터벌
    tick();
    const t = setInterval(tick, intervalMs);
    return () => {
      clearInterval(t);
    };
  }, [id, intervalMs, router]);

  return null;
}
