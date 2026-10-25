import React, { useState } from 'react';
import {
  CouncilConsensus,
  CouncilAdvisorOpinion,
} from '../../types/biology';
import {
  Users,
  X,
  Zap,
  ShieldAlert,
  Compass,
  HeartHandshake,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface CouncilModalProps {
  isOpen: boolean;
  onClose: () => void;
  consensus: CouncilConsensus;
}

export const CouncilModal: React.FC<CouncilModalProps> = ({
  isOpen,
  onClose,
  consensus,
}) => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('all');

  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-sky-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-purple-400" />;
      default:
        return <Users className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                  Hội Đồng Cố Vấn Ảo 5 Chuyên Gia
                </h3>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Đồng Thuận
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{consensus.questionTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Direct Core Decision Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <div className="font-semibold text-emerald-300">Quyết Định Trực Diện Của Hội Đồng:</div>
              <div
                className="text-slate-200 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: consensus.coreDecision
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>'),
                }}
              />
            </div>
          </div>

          {/* Advisor Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-xs">
            <button
              onClick={() => setSelectedAdvisor('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedAdvisor === 'all'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Tất Cả 5 Cố Vấn
            </button>
            {consensus.opinions.map((op) => (
              <button
                key={op.advisorId}
                onClick={() => setSelectedAdvisor(op.advisorId)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedAdvisor === op.advisorId
                    ? `${op.colorScheme.bg} ${op.colorScheme.text} border ${op.colorScheme.border} font-bold`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {op.advisorName}
              </button>
            ))}
          </div>

          {/* Individual Opinions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consensus.opinions
              .filter((op) => selectedAdvisor === 'all' || selectedAdvisor === op.advisorId)
              .map((op) => (
                <div
                  key={op.advisorId}
                  className={`p-4 rounded-xl border ${op.colorScheme.border} ${op.colorScheme.bg} flex flex-col justify-between space-y-3`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getIcon(op.avatarIcon)}
                        <div>
                          <div className={`font-bold text-sm ${op.colorScheme.text}`}>
                            {op.advisorName}
                          </div>
                          <div className="text-[11px] text-slate-400">{op.roleTitle}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${op.colorScheme.badge}`}>
                        Góc Nhìn Riêng
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 mb-2">
                      Mục tiêu: {op.keyTakeaway}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {op.detailedArgument}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/40 text-[11px] text-slate-300">
                    <span className="font-semibold text-slate-200">Hành động: </span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: op.actionableTip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Multi-criteria Comparison Table */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Bảng So Sánh Đa Tiêu Chí Ý Kiến Hội Đồng:
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-slate-200 border-b border-slate-700">
                    <th className="p-2.5 font-semibold">Tiêu Chí</th>
                    <th className="p-2.5 font-semibold text-amber-400">Người Điều Hành</th>
                    <th className="p-2.5 font-semibold text-rose-400">Người Hoài Nghi</th>
                    <th className="p-2.5 font-semibold text-emerald-400">Tầm Nhìn</th>
                    <th className="p-2.5 font-semibold text-sky-400">Bênh Vực HS</th>
                    <th className="p-2.5 font-semibold text-purple-400">Số Liệu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {consensus.matrixTable.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-800/30'}>
                      <td className="p-2.5 font-medium text-slate-100 whitespace-nowrap">{row.criteria}</td>
                      <td className="p-2.5">{row.executor}</td>
                      <td className="p-2.5">{row.skeptic}</td>
                      <td className="p-2.5">{row.visionary}</td>
                      <td className="p-2.5">{row.advocate}</td>
                      <td className="p-2.5">{row.analyst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Consensus Recommendation */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Tổng Hợp Đề Xuất Chung Của Hội Đồng
            </div>
            <div
              className="text-xs text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: consensus.finalConsensusRecommendation
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300 font-bold">$1</strong>'),
              }}
            />
          </div>

          {/* Advanced Aspects & Pitfalls to Notice */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Khía Cạnh Nâng Cao & Rủi Ro Cần Lưu Ý
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {consensus.advancedRisks.map((risk, idx) => (
                <li key={idx} className="leading-relaxed">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-800/80 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Đã Hiểu & Áp Dụng Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
