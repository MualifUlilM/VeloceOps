import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Tenant, BudgetCap } from '../types';
import { colors } from '../theme';
import { formatCurrency, INITIAL_BUDGET_CAPS } from '../data';

const API_BASE_URL = 'https://veloce-ops-ochre.vercel.app';

interface SpendScreenProps {
  currentTenant: Tenant;
}

interface EnrichedCap {
  id: string;
  department: string;
  cap_amount: number;
  current_spend: number;
  remaining_buffer: number;
  utilization_percentage: number;
  status: 'HEALTHY' | 'WARNING' | 'BREACHED';
  period: string;
}

export function SpendScreen({ currentTenant }: SpendScreenProps) {
  const [caps, setCaps] = useState<EnrichedCap[]>([]);
  const [summary, setSummary] = useState<{
    total_allocated_budget: number;
    total_actual_spend: number;
    overall_utilization_pct: number;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSpend = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/spend?tenant_id=${currentTenant.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.departments && data.departments.length > 0) {
          setCaps(data.departments);
          setSummary(data.summary);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default fallback calculation
    const fallback = INITIAL_BUDGET_CAPS.filter((c) => c.tenant_id === currentTenant.id).map((c) => {
      const pct = (c.current_spend / c.cap_amount) * 100;
      return {
        id: c.id,
        department: c.department,
        cap_amount: c.cap_amount,
        current_spend: c.current_spend,
        remaining_buffer: Math.max(0, c.cap_amount - c.current_spend),
        utilization_percentage: Number(pct.toFixed(1)),
        status: (pct >= 100 ? 'BREACHED' : pct >= 80 ? 'WARNING' : 'HEALTHY') as any,
        period: c.period,
      };
    });
    setCaps(fallback);
  }, [currentTenant.id]);

  useEffect(() => {
    fetchSpend();
  }, [fetchSpend]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchSpend();
    setIsRefreshing(false);
  };

  const totalCap = summary?.total_allocated_budget || caps.reduce((acc, c) => acc + c.cap_amount, 0);
  const totalSpend = summary?.total_actual_spend || caps.reduce((acc, c) => acc + c.current_spend, 0);
  const utilizationPct = summary?.overall_utilization_pct || (totalCap > 0 ? (totalSpend / totalCap) * 100 : 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Departmental Spend Caps</Text>
          <Text style={styles.subtitle}>Live OpEx Policies • API v1.2</Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.statBox}>
          <View>
            <Text style={styles.statLabel}>Total Q4 Budget Cap</Text>
            <Text style={styles.statValue}>
              {formatCurrency(totalCap, currentTenant.currency)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.statLabel}>Spend Realized</Text>
            <Text
              style={[
                styles.statValue,
                { color: utilizationPct >= 100 ? colors.coral : colors.emerald },
              ]}
            >
              {utilizationPct.toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Department Progress Meters */}
        <Text style={styles.sectionTitle}>Budget Cap Policies ({caps.length})</Text>
        {caps.map((cap) => {
          const isOver = cap.status === 'BREACHED';
          const isWarning = cap.status === 'WARNING';
          const barColor = isOver ? colors.coral : isWarning ? colors.amber : colors.ink;

          return (
            <View key={cap.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.deptName}>{cap.department}</Text>
                <Text style={[styles.statusTag, { color: isOver ? colors.coral : isWarning ? colors.amber : colors.emerald }]}>
                  {isOver ? '● Breached' : isWarning ? '● Approaching' : '● In Policy'}
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
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.min(100, cap.utilization_percentage)}%`, backgroundColor: barColor },
                  ]}
                />
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.bufferText}>
                  Remaining: {formatCurrency(cap.remaining_buffer, currentTenant.currency)}
                </Text>
                <Text style={styles.pctText}>{cap.utilization_percentage}% utilized</Text>
              </View>
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  bufferText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkSecondary,
  },
  pctText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
  },
});
