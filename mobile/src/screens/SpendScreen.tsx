import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Tenant, BudgetCap } from '../types';
import { colors } from '../theme';
import { formatCurrency, INITIAL_BUDGET_CAPS } from '../data';

interface SpendScreenProps {
  currentTenant: Tenant;
}

export function SpendScreen({ currentTenant }: SpendScreenProps) {
  const caps = INITIAL_BUDGET_CAPS.filter((c) => c.tenant_id === currentTenant.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Departmental Spend Caps</Text>
          <Text style={styles.subtitle}>OpEx Limits & Policy Throttling</Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.statBox}>
          <View>
            <Text style={styles.statLabel}>Total Q4 Budget Cap</Text>
            <Text style={styles.statValue}>$47,000.00</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.statLabel}>Spend Realized</Text>
            <Text style={[styles.statValue, { color: colors.emerald }]}>90.1%</Text>
          </View>
        </View>

        {/* Department Progress Meters */}
        <Text style={styles.sectionTitle}>Budget Cap Policies</Text>
        {caps.map((cap) => {
          const pct = (cap.current_spend / cap.cap_amount) * 100;
          const isOver = pct > 100;
          const isWarning = pct >= 85 && !isOver;
          const barColor = isOver ? colors.coral : isWarning ? colors.amber : colors.ink;

          return (
            <View key={cap.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.deptName}>{cap.department}</Text>
                <Text style={[styles.statusTag, { color: isOver ? colors.coral : colors.emerald }]}>
                  {isOver ? '● Exceeded' : '● In Policy'}
                </Text>
              </View>

              <View style={styles.amountRow}>
                <Text style={styles.spendText}>
                  Spend: {formatCurrency(cap.current_spend, currentTenant.currency)}
                </Text>
                <Text style={styles.capText}>
                  Cap: {formatCurrency(cap.cap_amount, currentTenant.currency)}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.min(100, pct)}%`, backgroundColor: barColor }]} />
              </View>

              <Text style={styles.pctText}>{pct.toFixed(1)}% of budget utilized</Text>
            </View>
          );
        })}
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
    marginBottom: 14,
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
  statBox: {
    backgroundColor: colors.canvas,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
    color: colors.inkTertiary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 2,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deptName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    flex: 1,
  },
  statusTag: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  spendText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Courier',
    color: colors.ink,
  },
  capText: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.recessed,
    overflow: 'hidden',
    marginVertical: 6,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  pctText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    textAlign: 'right',
  },
});
