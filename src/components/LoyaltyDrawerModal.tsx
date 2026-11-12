import React, { useState } from 'react';
import { X, Award, Flame, Bell, Tag, Sparkles, Check, ChevronRight, ThumbsUp, QrCode } from 'lucide-react';
import { UserLoyaltyProfile, MealtimeNudge } from '../types';

interface LoyaltyDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserLoyaltyProfile;
  nudges: MealtimeNudge[];
  onToggleNudge: (id: string) => void;
  onSimulateNudge: (nudge: MealtimeNudge) => void;
  onRedeemVoucher: (id: string) => void;
}

export const LoyaltyDrawerModal: React.FC<LoyaltyDrawerModalProps> = ({
  isOpen,
  onClose,
  profile,
  nudges,
  onToggleNudge,
  onSimulateNudge,
  onRedeemVoucher,
}) => {
  const [activeTab, setActiveTab] = useState<'digest' | 'vouchers' | 'nudges'>('digest');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header with Points and Tier */}
        <div className="bg-stone-900 text-white p-6 relative overflow-hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{profile.tier}</span>
              </div>
              <h2 className="text-2xl font-bold font-display">Foodie Rewards & Profile</h2>
              <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-white">{profile.streakDays}-Day Foodie Streak</span>
                <span>·</span>
                <span>{profile.points} Total Points Earned</span>
              </div>
            </div>

            {/* Points Gauge */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-right shrink-0">
              <div className="text-[11px] text-stone-300">Reward Balance</div>
              <div className="text-2xl font-bold font-mono text-amber-400">{profile.points} pts</div>
              <div className="text-[10px] text-stone-300 mt-0.5">
                {profile.nextMilestonePoints - profile.points} pts to Gold Epicurean
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-stone-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${(profile.points / profile.nextMilestonePoints) * 100}%` }}
            />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-stone-200 px-6 bg-stone-50 gap-6 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('digest')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'digest'
                ? 'border-amber-600 text-stone-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            "Your Week in Food" Digest
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vouchers'
                ? 'border-amber-600 text-stone-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Saved Vouchers ({profile.claimedVouchers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('nudges')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nudges'
                ? 'border-amber-600 text-stone-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Smart Mealtime Nudges</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FCFCFB] space-y-6">
          {/* TAB 1: WEEK IN FOOD DIGEST */}
          {activeTab === 'digest' && (
            <div className="space-y-6">
              {/* Digest Overview */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Personalized Weekly Food Digest</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Your taste profile is evolving! Based on your ratings and visits this week, the algorithm notes your strong affinity for <strong>wood-fired sourdough</strong> and <strong>truffle pasta</strong>. 4 new spots were calibrated to your taste this week.
                </p>
              </div>

              {/* Badges and Streaks */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Foodie Badges & Accomplishments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                        badge.unlocked
                          ? 'bg-white border-stone-200'
                          : 'bg-stone-50 border-dashed border-stone-300 opacity-60'
                      }`}
                    >
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{badge.name}</span>
                          {badge.unlocked && (
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 rounded">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5 leading-tight">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continuous Feedback Tuning History */}
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Recent Meal Feedback (Algorithm Tuning)
                </h3>
                <div className="space-y-2">
                  {profile.feedbackHistory.map((fb, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <span className="font-semibold text-stone-900">{fb.restaurantName}</span>
                          <span className="text-stone-600 ml-2">"{fb.comment}"</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-600 font-mono">{fb.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLAIMED VOUCHERS WALLET */}
          {activeTab === 'vouchers' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-600 mb-2">
                Your claimed seasonal restaurant vouchers ready to use at dining:
              </div>
              {profile.claimedVouchers.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-600 text-xs">
                  No vouchers claimed yet. Head to "Seasonal Offers" to grab exclusive perks!
                </div>
              ) : (
                profile.claimedVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="p-4 bg-white border border-amber-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-900">{voucher.restaurantName}</div>
                      <div className="text-sm font-bold text-stone-900 mt-0.5">{voucher.discountLabel}</div>
                      <div className="text-[11px] text-stone-600 mt-1">
                        Code: <strong className="font-mono text-stone-900">{voucher.code}</strong> · Valid to {voucher.expires}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRedeemVoucher(voucher.id)}
                        disabled={voucher.redeemed}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          voucher.redeemed
                            ? 'bg-stone-100 text-stone-600 cursor-not-allowed'
                            : 'bg-stone-900 hover:bg-stone-800 text-white'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{voucher.redeemed ? 'Redeemed' : 'Present & Redeem'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SMART MEALTIME NUDGES */}
          {activeTab === 'nudges' && (
            <div className="space-y-5">
              <div className="p-4 bg-white border border-stone-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Daily Mealtime Nudge Engine</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  As noted in your planning guidelines: <em>"Daily, around mealtimes: Send smart, opt-in nudges at lunch and dinner. Keep them useful rather than spammy."</em>
                </p>
              </div>

              <div className="space-y-3">
                {nudges.map((nudge) => (
                  <div
                    key={nudge.id}
                    className="p-4 bg-white border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{nudge.mealtime} Nudge</span>
                        <span className="text-[11px] text-stone-600 font-mono">({nudge.timeLabel})</span>
                      </div>
                      <div className="text-xs font-semibold text-stone-800 mt-1">{nudge.headline}</div>
                      <div className="text-[11px] text-stone-600 mt-0.5 leading-snug">{nudge.rationale}</div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => onSimulateNudge(nudge)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title="Preview simulated push notification"
                      >
                        Test Nudge
                      </button>

                      <button
                        onClick={() => onToggleNudge(nudge.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          nudge.enabled ? 'bg-amber-600' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            nudge.enabled ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
