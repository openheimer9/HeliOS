"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingDown, Map, FileText, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import TierCard from "./TierCard";
import ChartView from "./ChartView";

export default function Dashboard({ data }) {
  if (!data) {
    return null;
  }

  const scorecard = data.scorecard || {};
  const gapAnalysis = data.gap_analysis || {};
  const roadmap = data.roadmap || {};
  const drafts = data.drafts || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tier 1: Citation Audit Scorecard */}
      <TierCard
        title="1️⃣ Citation Audit Scorecard"
        icon={Trophy}
        defaultOpen={true}
      >
        <div className="space-y-6">
          {scorecard.overall_score !== undefined && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-gradient-to-br from-primary/20 to-cyan-400/10 rounded-xl border border-primary/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <p className="text-sm text-muted-foreground mb-2 font-medium">Overall Score</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent relative z-10">
                  {scorecard.overall_score}%
                </p>
              </motion.div>
              {scorecard.citation_lift !== undefined && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 bg-gradient-to-br from-primary/20 to-cyan-400/10 rounded-xl border border-primary/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all relative overflow-hidden"
                >
                  <p className="text-sm text-muted-foreground mb-2 font-medium">AI Citation Lift</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent relative z-10">
                    +{scorecard.citation_lift}%
                  </p>
                </motion.div>
              )}
              {scorecard.visibility_rank !== undefined && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 bg-gradient-to-br from-primary/20 to-cyan-400/10 rounded-xl border border-primary/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all relative overflow-hidden"
                >
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Visibility Rank</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent relative z-10">
                    #{scorecard.visibility_rank}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {scorecard.metrics && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Detailed Metrics</h4>
              <ChartView data={{ metrics: scorecard.metrics }} type="radar" />
            </div>
          )}

          {scorecard.summary && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">{scorecard.summary}</p>
            </div>
          )}
        </div>
      </TierCard>

      {/* Tier 2: Competitive Gap Analysis */}
      <TierCard
        title="2️⃣ Competitive Gap Analysis"
        icon={TrendingDown}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {gapAnalysis.competitors && Array.isArray(gapAnalysis.competitors) && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Competitor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Visibility Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {gapAnalysis.competitors.map((competitor, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-b border-primary/10 hover:bg-primary/5"
                    >
                      <td className="py-3 px-4 text-foreground">{competitor.name || "Unknown"}</td>
                      <td className="py-3 px-4 text-foreground">{competitor.score || 0}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          (competitor.gap || 0) > 0 
                            ? "bg-red-500/20 text-red-400" 
                            : "bg-green-500/20 text-green-400"
                        }`}>
                          {(competitor.gap || 0) > 0 ? `-${competitor.gap}` : `+${Math.abs(competitor.gap || 0)}`}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {gapAnalysis.summary && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">{gapAnalysis.summary}</p>
            </div>
          )}

          {gapAnalysis.key_findings && Array.isArray(gapAnalysis.key_findings) && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Key Findings</h4>
              {gapAnalysis.key_findings.map((finding, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 p-3 bg-secondary/20 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{finding}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </TierCard>

      {/* Tier 3: Intervention Roadmap */}
      <TierCard
        title="3️⃣ Intervention Roadmap"
        icon={Map}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {roadmap.recommendations && Array.isArray(roadmap.recommendations) && (
            <div className="space-y-3">
              {roadmap.recommendations.map((rec, idx) => {
                const priority = rec.priority?.toLowerCase() || "medium";
                const priorityColors = {
                  high: "bg-green-500/20 text-green-400 border-green-500/30",
                  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                  low: "bg-red-500/20 text-red-400 border-red-500/30",
                };

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="p-5 bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-xl border border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-cyan-400/10 flex items-center justify-center text-primary font-bold border border-primary/30 glow"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {idx + 1}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{rec.title || `Recommendation ${idx + 1}`}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs border ${priorityColors[priority]}`}>
                            {priority.toUpperCase()}
                          </span>
                        </div>
                        {rec.description && (
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        )}
                        {rec.expected_impact && (
                          <p className="text-xs text-primary">
                            Expected Impact: {rec.expected_impact}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {roadmap.timeline && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 text-foreground">Timeline</h4>
              <p className="text-sm text-foreground">{roadmap.timeline}</p>
            </div>
          )}
        </div>
      </TierCard>

      {/* Tier 4: Drafts & Templates */}
      <TierCard
        title="4️⃣ Drafts & Templates"
        icon={FileText}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {drafts.rewrites && Array.isArray(drafts.rewrites) && (
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">Content Rewrites</h4>
              <div className="space-y-3">
                {drafts.rewrites.map((rewrite, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-secondary/30 rounded-lg border border-primary/20"
                  >
                    {rewrite.section && (
                      <p className="text-xs text-primary mb-2 font-medium">{rewrite.section}</p>
                    )}
                    <p className="text-sm text-foreground whitespace-pre-wrap">{rewrite.content || rewrite}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {drafts.third_party_targeting && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Third-Party Targeting</h4>
              <div className="p-4 bg-secondary/30 rounded-lg border border-primary/20">
                {typeof drafts.third_party_targeting === "string" ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap">{drafts.third_party_targeting}</p>
                ) : (
                  <ul className="space-y-2">
                    {Array.isArray(drafts.third_party_targeting) &&
                      drafts.third_party_targeting.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {drafts.subdomain_templates && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Subdomain Templates</h4>
              <div className="p-4 bg-secondary/30 rounded-lg border border-primary/20">
                {typeof drafts.subdomain_templates === "string" ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap">{drafts.subdomain_templates}</p>
                ) : (
                  <pre className="text-xs text-foreground overflow-x-auto">
                    {JSON.stringify(drafts.subdomain_templates, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </TierCard>
    </div>
  );
}

