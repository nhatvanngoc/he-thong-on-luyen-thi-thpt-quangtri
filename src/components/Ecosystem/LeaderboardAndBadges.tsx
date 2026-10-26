import React, { useState, useEffect, useCallback } from 'react';
import { UserStats } from '../../types/biology';
import { Trophy, Award, User, RefreshCw, ListFilter, Activity, Cloud, Wifi, CheckCircle2 } from 'lucide-react';
import { QuestionReviewView } from '../Review/QuestionReviewView';
import { CloudSyncResult, subscribeToRealtimeLeaderboard } from '../../services/firebase';

interface LeaderboardAndBadgesProps {
  stats: UserStats;
  onOpenNameModal?: () => void;
  onClearHistory?: () => void;
  cloudSyncResult: CloudSyncResult;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  updatedAt: string;
}

const LEADERBOARD_STORAGE_KEY = 'bioquest_11_real_leaderboard_v1';

export const LeaderboardAndBadges: React.FC<LeaderboardAndBadgesProps> = ({
  stats,
  onOpenNameModal,
  onClearHistory,
  cloudSyncResult,
}) => {
  const [subTab, setSubTab] = useState<'leaderboard' | 'review'>('leaderboard');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [cloudReadStatus, setCloudReadStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [cloudReadError, setCloudReadError] = useState('');
  const [isManualRefreshing, setIsManualRefreshing] = useState<boolean>(false);
  const [livePulse, setLivePulse] = useState<boolean>(false);

  // Load initial records from storage
  const [records, setRecords] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Merge helper to prevent race condition regressions and keep highest scores
  const mergeRecords = useCallback((incoming: LeaderboardEntry[]) => {
    setRecords((prev) => {
      const map = new Map<string, LeaderboardEntry>();
      // Keep existing
      prev.forEach((r) => map.set(r.name.trim().toLowerCase(), r));
      // Apply incoming with max score rule
      incoming.forEach((r) => {
        const key = r.name.trim().toLowerCase();
        const cur = map.get(key);
        if (!cur) {
          map.set(key, r);
        } else {
          map.set(key, {
            name: r.name,
            score: Math.max(cur.score, r.score),
            level: Math.max(cur.level, r.level),
            updatedAt: r.updatedAt || cur.updatedAt,
          });
        }
      });

      // Always ensure current user's latest local score is present
      const currentName = (stats.userName || '').trim();
      if (currentName) {
        const key = currentName.toLowerCase();
        const cur = map.get(key);
        if (!cur || stats.xp > cur.score) {
          map.set(key, {
            name: currentName,
            score: Math.max(cur ? cur.score : 0, stats.xp),
            level: Math.max(cur ? cur.level : 1, stats.level),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      const merged = Array.from(map.values()).sort((a, b) => b.score - a.score);
      try {
        localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    });

    setLastSyncTime(new Date());
    setLivePulse(true);
    setTimeout(() => setLivePulse(false), 800);
  }, [stats.userName, stats.xp, stats.level]);

  // 1. Live SSE (Server-Sent Events) Stream Subscription
  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connectSSE = () => {
      try {
        es = new EventSource('/api/leaderboard/stream');
        
        es.onopen = () => {
          setIsLiveConnected(true);
        };

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (Array.isArray(data)) {
              mergeRecords(data);
            }
          } catch (err) {
            console.warn('Error parsing SSE leaderboard payload:', err);
          }
        };

        es.onerror = () => {
          setIsLiveConnected(false);
          if (es) {
            es.close();
            es = null;
          }
          // Retry connection after 3 seconds
          reconnectTimeout = setTimeout(connectSSE, 3000);
        };
      } catch {
        setIsLiveConnected(false);
      }
    };

    connectSSE();

    return () => {
      if (es) es.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [mergeRecords]);

  // 2. Cross-tab BroadcastChannel listener
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('bioquest_leaderboard_live');
      bc.onmessage = (event) => {
        if (event.data?.type === 'LEADERBOARD_UPDATED') {
          const entry: LeaderboardEntry = {
            name: event.data.name,
            score: event.data.score,
            level: event.data.level,
            updatedAt: event.data.updatedAt || new Date().toISOString(),
          };
          mergeRecords([entry]);
        }
      };
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LEADERBOARD_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            mergeRecords(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [mergeRecords]);

  // 3. Real-time Firestore Cloud onSnapshot listener
  useEffect(() => {
    const unsubscribeCloud = subscribeToRealtimeLeaderboard((cloudItems) => {
      if (cloudItems && cloudItems.length > 0) {
        const mapped: LeaderboardEntry[] = cloudItems.map((item) => ({
          name: item.userName,
          score: item.xp,
          level: item.level,
          updatedAt: item.updatedAt,
        }));
        mergeRecords(mapped);
      }
    }, (connected, error) => {
      setCloudReadStatus(connected ? 'connected' : 'error');
      setCloudReadError(error?.message || '');
    });

    return () => {
      unsubscribeCloud();
    };
  }, [mergeRecords]);

  // 4. Initial & Heartbeat REST Polling (Fall-safe every 6 seconds)
  const refreshFromRest = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          mergeRecords(data);
        }
      }
    } catch {}
  }, [mergeRecords]);

  useEffect(() => {
    refreshFromRest();
    const interval = setInterval(refreshFromRest, 6000);
    return () => clearInterval(interval);
  }, [refreshFromRest]);

  // Manual Refresh Handler
  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refreshFromRest();
    setTimeout(() => {
      setIsManualRefreshing(false);
    }, 600);
  };

  const userDisplayName = stats.userName.trim();
  const userRankIndex = records.findIndex(
    (r) => r.name.toLowerCase() === userDisplayName.toLowerCase()
  );
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : 1;

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSecs < 5) return 'Vừa xong';
      if (diffSecs < 60) return `${diffSecs}s trước`;
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}p trước`;
      const hours = String(date.getHours()).padStart(2, '0');
      const mins = String(date.getMinutes()).padStart(2, '0');
      return `Hôm nay ${hours}:${mins}`;
    } catch {
      return 'Vừa xong';
    }
  };

  const attemptHistory = stats.attemptHistory || [];
  const wrongAttemptsCount = attemptHistory.filter((item) => !item.isCorrect).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* User Status Bar - Responsive on Mobile */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {stats.userName || 'Học sinh chưa đặt tên'}
              </span>
              {onOpenNameModal && (
                <button
                  onClick={onOpenNameModal}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
                >
                  Đổi tên
                </button>
              )}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Hạng thành tích: <span className="font-bold text-emerald-600 dark:text-emerald-400">#{stats.userName ? userRank : '-'}</span></span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                <span>{isLiveConnected ? 'Máy chủ hiện tại đang kết nối' : 'Máy chủ hiện tại mất kết nối'}</span>
              </span>
              <span
                title={cloudReadError || cloudSyncResult.message || 'Trạng thái đọc và ghi Firestore'}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cloudReadStatus === 'error' || cloudSyncResult.status === 'error' ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300' : cloudReadStatus === 'connected' && cloudSyncResult.status === 'synced' ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}
              >
                <span className={`h-2 w-2 rounded-full ${cloudReadStatus === 'error' || cloudSyncResult.status === 'error' ? 'bg-rose-500' : cloudReadStatus === 'connected' && cloudSyncResult.status === 'synced' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>Firestore: {cloudReadStatus === 'error' || cloudSyncResult.status === 'error' ? 'lỗi' : cloudReadStatus === 'connected' && cloudSyncResult.status === 'synced' ? 'đã kết nối' : 'đang kết nối'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3 Stats Grid on Mobile */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-xs font-mono pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 sm:p-0 rounded-xl sm:rounded-none text-center sm:text-right border sm:border-0 border-slate-200 dark:border-slate-700">
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Điểm XP</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">{stats.xp}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 sm:p-0 rounded-xl sm:rounded-none text-center sm:text-right border sm:border-0 border-slate-200 dark:border-slate-700">
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Cấp Độ</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">Lv.{stats.level}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 sm:p-0 rounded-xl sm:rounded-none text-center sm:text-right border sm:border-0 border-slate-200 dark:border-slate-700">
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Đúng/Tổng</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
              {stats.totalCorrect}/{stats.totalAnswered}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation: Bảng Xếp Hạng vs Xem Lại Bài Làm */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-200/80 dark:bg-slate-800/90 p-1 rounded-2xl flex items-center gap-1 border border-slate-300/60 dark:border-slate-700">
          <button
            onClick={() => setSubTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'leaderboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Bảng Xếp Hạng Trực Tiếp ({records.length})</span>
          </button>

          <button
            onClick={() => setSubTab('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subTab === 'review'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Xem Lại Câu Đã Làm ({attemptHistory.length})</span>
            {wrongAttemptsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold ml-0.5">
                {wrongAttemptsCount} sai
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Real-time Leaderboard */}
      {subTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-0">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Bảng Xếp Hạng Trực Tiếp (Real-time Live Sync)</span>
                  {livePulse && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-mono font-bold animate-pulse">
                      MỚI
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bảng dùng chung giữa các thiết bị được đọc và ghi qua Google Cloud Firestore.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                Đồng bộ: {lastSyncTime.toLocaleTimeString()}
              </span>
              <button
                onClick={handleManualRefresh}
                disabled={isManualRefreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                title="Làm mới bảng xếp hạng ngay lập tức"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <Award className="w-8 h-8 text-slate-400 mx-auto opacity-50 mb-1" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Chưa có dữ liệu xếp hạng</p>
              <p className="text-slate-500">
                Hãy nhập họ tên và hoàn thành các câu hỏi trong Đấu Trường để ghi danh tức thì!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold w-12 sm:w-16 text-center">Hạng</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Họ Và Tên Học Sinh</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-center w-16 sm:w-28">Cấp Độ</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-right w-24 sm:w-32">Cập Nhật</th>
                    <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-right w-24 sm:w-36">Tổng Điểm XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {records.map((student, idx) => {
                    const isCurrent =
                      userDisplayName && student.name.toLowerCase() === userDisplayName.toLowerCase();

                    return (
                      <tr
                        key={`${student.name}-${idx}`}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="py-3 px-3 sm:px-4 text-center font-mono font-bold">
                          {idx === 0 ? (
                            <span className="text-amber-500 text-sm">🥇 1</span>
                          ) : idx === 1 ? (
                            <span className="text-slate-400 text-sm">🥈 2</span>
                          ) : idx === 2 ? (
                            <span className="text-amber-700 text-sm">🥉 3</span>
                          ) : (
                            <span className="text-slate-600 dark:text-slate-400">{idx + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                                Bạn
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-center font-mono font-medium">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Lv.{student.level}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right text-[11px] text-slate-400 font-mono">
                          {student.updatedAt ? formatRelativeTime(student.updatedAt) : 'Vừa xong'}
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {student.score.toLocaleString()} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Real-time Status Footer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-4 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Firestore đồng bộ giữa thiết bị; SSE chỉ dùng chung khi truy cập cùng một máy chủ.</span>
            </div>
            <div className="italic text-slate-400 text-[10px]">
              flop quá thì ghi Nhật Anh vào
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Question Review & Stats */}
      {subTab === 'review' && (
        <QuestionReviewView
          history={attemptHistory}
          onClearHistory={onClearHistory}
        />
      )}
    </div>
  );
};
