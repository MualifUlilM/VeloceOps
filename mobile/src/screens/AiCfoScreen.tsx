import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Tenant, AnomalyDetection } from '../types';
import { colors } from '../theme';
import { formatCurrency, INITIAL_ANOMALIES } from '../data';

const API_BASE_URL = 'https://veloce-ops-ochre.vercel.app';

interface AiCfoScreenProps {
  currentTenant: Tenant;
}

interface AiRecommendation {
  id: string;
  priority: string;
  title: string;
  impact: string;
  action: string;
}

export function AiCfoScreen({ currentTenant }: AiCfoScreenProps) {
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>(INITIAL_ANOMALIES);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [resolved, setResolved] = useState<string[]>([]);
  const [scenarioRunway, setScenarioRunway] = useState(1.2);

  // AI Copilot Q&A state
  const [question, setQuestion] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{
    query: string;
    answer: string;
    estimated_impact?: string;
    key_actions?: string[];
  } | null>(null);

  // Fetch live surveillance & recommendations from API
  useEffect(() => {
    async function fetchSurveillance() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ai-cfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'surveillance',
            tenant_id: currentTenant.id,
            context: {
              operating_cash: currentTenant.operating_cash,
              currency: currentTenant.currency,
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.anomalies && data.anomalies.length > 0) {
            setAnomalies(data.anomalies);
          }
          if (data.recommendations && data.recommendations.length > 0) {
            setRecommendations(data.recommendations);
          }
        }
      } catch (err) {
        // Fallback to local data gracefully
      }
    }
    fetchSurveillance();
  }, [currentTenant.id]);

  const handleAction = async (ano: AnomalyDetection) => {
    setResolved((prev) => [...prev, ano.id]);

    try {
      await fetch(`${API_BASE_URL}/api/ai-cfo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve',
          tenant_id: currentTenant.id,
          anomaly_id: ano.id,
        }),
      });
    } catch {
      // Offline fallback
    }

    Alert.alert('Action Executed', `${ano.actionLabel} has been dispatched to subledger.`);
  };

  const handleAskCfo = async (promptQuery?: string) => {
    const q = promptQuery || question;
    if (!q.trim()) return;

    setIsLoadingAi(true);
    setQuestion('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-cfo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask',
          query: q,
          tenant_id: currentTenant.id,
          context: {
            operating_cash: currentTenant.operating_cash,
            currency: currentTenant.currency,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnswer({
          query: q,
          answer: data.answer,
          estimated_impact: data.estimated_impact,
          key_actions: data.key_actions,
        });
      } else {
        Alert.alert('Error', 'Failed to retrieve AI CFO response.');
      }
    } catch (err: any) {
      Alert.alert('Network Error', err.message || 'Could not connect to AI CFO API.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AI CFO Surveillance</Text>
          <Text style={styles.subtitle}>Autonomous Financial Guard • API v1.2</Text>
        </View>

        {/* AI Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>✨ Autonomous Financial Guard</Text>
          <Text style={styles.bannerDesc}>
            VeloceOps continuously analyzes AR default latency and AWS egress spikes via the live `/api/ai-cfo` endpoint.
          </Text>
        </View>

        {/* AI Copilot Interactive Query Box */}
        <View style={styles.copilotBox}>
          <Text style={styles.copilotTitle}>Ask AI CFO Copilot</Text>
          <Text style={styles.copilotSubtitle}>Instant executive guidance for cashflow & runway</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.copilotInput}
              placeholder="e.g. How to extend runway by 6 months?"
              placeholderTextColor={colors.inkTertiary}
              value={question}
              onChangeText={setQuestion}
              onSubmitEditing={() => handleAskCfo()}
            />
            <TouchableOpacity
              style={[styles.askBtn, isLoadingAi ? styles.askBtnDisabled : null]}
              onPress={() => handleAskCfo()}
              disabled={isLoadingAi}
            >
              {isLoadingAi ? (
                <ActivityIndicator size="small" color={colors.ink} />
              ) : (
                <Text style={styles.askBtnText}>Ask</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Prompt Pills */}
          <View style={styles.quickPromptsRow}>
            {[
              'Extend runway 6 mos',
              'Prune Cloud Spend',
              'Linear Orbit Risk',
            ].map((qp) => (
              <TouchableOpacity
                key={qp}
                style={styles.quickPill}
                onPress={() => handleAskCfo(qp)}
              >
                <Text style={styles.quickPillText}>{qp}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Live AI Answer Display */}
          {aiAnswer && (
            <View style={styles.aiResultCard}>
              <View style={styles.aiResultHeader}>
                <Text style={styles.aiResultTag}>AI CFO Response</Text>
                {aiAnswer.estimated_impact && (
                  <Text style={styles.aiResultImpact}>{aiAnswer.estimated_impact}</Text>
                )}
              </View>
              <Text style={styles.aiResultText}>{aiAnswer.answer}</Text>

              {aiAnswer.key_actions && aiAnswer.key_actions.length > 0 && (
                <View style={styles.keyActionsWrap}>
                  <Text style={styles.keyActionsTitle}>Recommended Actions:</Text>
                  {aiAnswer.key_actions.map((act, idx) => (
                    <Text key={idx} style={styles.keyActionItem}>
                      • {act}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Anomaly Feed */}
        <Text style={styles.sectionTitle}>Detected Anomalies ({anomalies.length})</Text>
        {anomalies.map((ano) => {
          const isDone = resolved.includes(ano.id);
          const isOverdue = ano.kind === 'OVERDUE_RECEIVABLE';

          return (
            <View key={ano.id} style={[styles.card, isDone ? styles.cardDone : null]}>
              <View style={styles.cardTop}>
                <View style={styles.kindWrap}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isDone ? colors.emerald : isOverdue ? colors.coral : colors.amber },
                    ]}
                  />
                  <Text style={styles.kindText}>{ano.kind.replace('_', ' ')}</Text>
                </View>
                <Text style={styles.amount}>
                  {formatCurrency(ano.amount, currentTenant.currency)}
                </Text>
              </View>

              <Text style={styles.anoTitle}>{ano.title}</Text>
              <Text style={styles.anoDesc}>{ano.description}</Text>

              <View style={styles.cardBottom}>
                {ano.runwayImpactMonths && (
                  <Text style={styles.impactText}>+{ano.runwayImpactMonths} Mo Runway Impact</Text>
                )}
                {ano.monthlySavings && (
                  <Text style={styles.impactText}>
                    +{formatCurrency(ano.monthlySavings, currentTenant.currency)}/mo Savings
                  </Text>
                )}

                {isDone ? (
                  <Text style={styles.doneText}>✓ Resolved</Text>
                ) : (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(ano)}>
                    <Text style={styles.actionBtnText}>{ano.actionLabel}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* Live Strategic Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.recContainer}>
            <Text style={styles.sectionTitle}>Strategic Actions ({recommendations.length})</Text>
            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.recCard}>
                <View style={styles.recTop}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recPriority}>{rec.priority}</Text>
                </View>
                <Text style={styles.recImpact}>{rec.impact}</Text>
                <Text style={styles.recActionText}>Action: {rec.action}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Runway Scenario Simulator */}
        <View style={styles.simulatorCard}>
          <Text style={styles.simTitle}>Interactive Runway Scenario</Text>
          <Text style={styles.simDesc}>
            Target recovery of overdue collections and compute reallocation:
          </Text>

          <View style={styles.simControl}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setScenarioRunway((p) => Math.max(0.5, p - 0.2))}
            >
              <Text style={styles.stepBtnText}>-</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <Text style={styles.simValue}>+{scenarioRunway.toFixed(1)} Months</Text>
              <Text style={styles.simSub}>Dec 2027 Zero-Cash Horizon</Text>
            </View>

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setScenarioRunway((p) => Math.min(3.0, p + 0.2))}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.shell,
  },
  container: {
    flex: 1,
    padding: 14,
    marginBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    marginTop: 2,
  },
  banner: {
    backgroundColor: colors.ink,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.volt,
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 11,
    color: colors.canvas,
    lineHeight: 16,
  },
  copilotBox: {
    backgroundColor: colors.canvas,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 14,
    marginBottom: 16,
  },
  copilotTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  copilotSubtitle: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    marginBottom: 10,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  copilotInput: {
    flex: 1,
    backgroundColor: colors.subtle,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: colors.ink,
  },
  askBtn: {
    backgroundColor: colors.volt,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  askBtnDisabled: {
    opacity: 0.6,
  },
  askBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  quickPromptsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  quickPill: {
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quickPillText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkSecondary,
  },
  aiResultCard: {
    marginTop: 8,
    backgroundColor: colors.subtle,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 12,
  },
  aiResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiResultTag: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.ink,
    textTransform: 'uppercase',
  },
  aiResultImpact: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.emerald,
  },
  aiResultText: {
    fontSize: 12,
    color: colors.ink,
    lineHeight: 18,
    marginBottom: 8,
  },
  keyActionsWrap: {
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
    paddingTop: 6,
  },
  keyActionsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  keyActionItem: {
    fontSize: 11,
    color: colors.inkSecondary,
    lineHeight: 16,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.inkTertiary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.canvas,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 14,
    marginBottom: 10,
  },
  cardDone: {
    opacity: 0.5,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kindWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  kindText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Courier',
    color: colors.inkTertiary,
  },
  amount: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Courier',
    color: colors.ink,
  },
  anoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  anoDesc: {
    fontSize: 11,
    color: colors.inkSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
  },
  impactText: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.emerald,
  },
  actionBtn: {
    backgroundColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.volt,
  },
  doneText: {
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.emerald,
  },
  recContainer: {
    marginVertical: 6,
  },
  recCard: {
    backgroundColor: colors.canvas,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 12,
    marginBottom: 8,
  },
  recTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  recPriority: {
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.volt,
    backgroundColor: colors.ink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recImpact: {
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.emerald,
    marginBottom: 4,
  },
  recActionText: {
    fontSize: 10,
    color: colors.inkSecondary,
  },
  simulatorCard: {
    backgroundColor: colors.subtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 14,
    marginTop: 10,
  },
  simTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  simDesc: {
    fontSize: 11,
    color: colors.inkTertiary,
    marginBottom: 12,
  },
  simControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.canvas,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 10,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  simValue: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Courier',
    color: colors.ink,
  },
  simSub: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    marginTop: 2,
  },
});
