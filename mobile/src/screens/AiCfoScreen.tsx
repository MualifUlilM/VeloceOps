import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Tenant, AnomalyDetection } from '../types';
import { colors } from '../theme';
import { formatCurrency, INITIAL_ANOMALIES } from '../data';

interface AiCfoScreenProps {
  currentTenant: Tenant;
}

export function AiCfoScreen({ currentTenant }: AiCfoScreenProps) {
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES);
  const [resolved, setResolved] = useState<string[]>([]);
  const [scenarioRunway, setScenarioRunway] = useState(1.2);

  const handleAction = (ano: AnomalyDetection) => {
    setResolved((prev) => [...prev, ano.id]);
    Alert.alert('Action Executed', `${ano.actionLabel} has been dispatched successfully.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AI CFO Surveillance</Text>
          <Text style={styles.subtitle}>pgvector Anomaly Heuristics</Text>
        </View>

        {/* AI Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>✨ Autonomous Financial Guard</Text>
          <Text style={styles.bannerDesc}>
            VeloceOps scans cross-border invoice payment cadence and AWS NAT egress to eliminate cash leaks.
          </Text>
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
