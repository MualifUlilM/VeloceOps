import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Tenant, Invoice } from '../types';
import { colors } from '../theme';
import { formatCurrency } from '../data';
import { MetricCard } from '../components/MetricCard';
import { InvoiceDetailModal } from '../components/InvoiceDetailModal';

interface TreasuryScreenProps {
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
  invoices: Invoice[];
  onSimulateWebhook: () => void;
  onMarkPaid: (id: string) => void;
}

export function TreasuryScreen({
  currentTenant,
  onSelectTenant,
  tenants,
  invoices,
  onSimulateWebhook,
  onMarkPaid,
}: TreasuryScreenProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const tenantInvoices = invoices.filter((i) => i.tenant_id === currentTenant.id);
  const receivables = tenantInvoices
    .filter((i) => i.status !== 'PAID')
    .reduce((acc, i) => acc + i.total_amount, 0);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.shell} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Inset Canvas Container */}
        <View style={styles.canvas}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>VO</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>VeloceOps</Text>
                <Text style={styles.brandSubtitle}>B2B Treasury Mobile</Text>
              </View>
            </View>

            {/* RLS Dot */}
            <View style={styles.rlsBadge}>
              <View style={styles.rlsDot} />
              <Text style={styles.rlsText}>RLS • {currentTenant.slug}</Text>
            </View>
          </View>

          {/* Tenant Switcher Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tenantTabs}>
            {tenants.map((t) => {
              const active = t.id === currentTenant.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.tenantPill, active ? styles.tenantPillActive : null]}
                  onPress={() => onSelectTenant(t)}
                >
                  <Text style={[styles.tenantPillText, active ? styles.tenantPillTextActive : null]}>
                    {t.name} ({t.currency})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Big Balance Hero */}
          <View style={styles.balanceHero}>
            <Text style={styles.balanceLabel}>Operating Liquidity Cash</Text>
            <Text style={styles.balanceValue}>
              {formatCurrency(currentTenant.operating_cash, currentTenant.currency)}
            </Text>
            <View style={styles.balanceMeta}>
              <Text style={styles.sweepText}>● Fedwire & ACH Sweep Ready</Text>
              <TouchableOpacity style={styles.webhookBtn} onPress={onSimulateWebhook}>
                <Text style={styles.webhookBtnText}>⚡ Simulate Webhook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Metric Strip (Horizontal Scroll) */}
          <View style={styles.metricSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricScroll}>
              <MetricCard
                label="Accounts Receivable"
                value={formatCurrency(receivables, currentTenant.currency)}
                subtext="2 Overdue • 1 Pending"
                accent={colors.amber}
              />
              <MetricCard
                label="Monthly Burn"
                value="$42,380.00"
                subtext="14.2 Mos Runway"
                accent={colors.inkSecondary}
              />
              <MetricCard
                label="Contracted ARR"
                value="$528,000.00"
                subtext="+109.4% NRR"
                accent={colors.emerald}
              />
            </ScrollView>
          </View>

          {/* Cashflow Velocity Mini Trajectory */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Cashflow Velocity</Text>
              <Text style={styles.chartBadge}>T+0 Reconciled</Text>
            </View>
            <View style={styles.chartBars}>
              <View style={styles.barCol}>
                <View style={[styles.bar, { height: 48, backgroundColor: colors.volt }]} />
                <Text style={styles.barLabel}>W1</Text>
              </View>
              <View style={styles.barCol}>
                <View style={[styles.bar, { height: 64, backgroundColor: colors.volt }]} />
                <Text style={styles.barLabel}>W2</Text>
              </View>
              <View style={styles.barCol}>
                <View style={[styles.bar, { height: 32, backgroundColor: colors.ink }]} />
                <Text style={styles.barLabel}>W3</Text>
              </View>
              <View style={styles.barCol}>
                <View style={[styles.bar, { height: 80, backgroundColor: colors.volt }]} />
                <Text style={styles.barLabel}>W4</Text>
              </View>
            </View>
          </View>

          {/* Sub-Ledger Section */}
          <View style={styles.subledgerSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sub-Ledger Transactions</Text>
              <Text style={styles.sectionSub}>Tap row to inspect</Text>
            </View>

            {tenantInvoices.map((inv) => {
              const isPaid = inv.status === 'PAID';
              const isOverdue = inv.status === 'OVERDUE';
              const dotColor = isPaid ? colors.emerald : isOverdue ? colors.coral : colors.amber;

              return (
                <TouchableOpacity
                  key={inv.id}
                  style={styles.invoiceRow}
                  activeOpacity={0.7}
                  onPress={() => setSelectedInvoice(inv)}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(inv.customer_name)}</Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.rowCustomer}>{inv.customer_name}</Text>
                    <Text style={styles.rowNumber}>
                      {inv.invoice_number} • {inv.payment_method}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.rowAmount}>
                      {formatCurrency(inv.total_amount, inv.currency)}
                    </Text>
                    <View style={styles.dotWrap}>
                      <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                      <Text style={[styles.rowStatus, { color: dotColor }]}>{inv.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Invoice Detail Inspector Bottom Sheet */}
      <InvoiceDetailModal
        visible={!!selectedInvoice}
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onMarkPaid={onMarkPaid}
      />
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
    padding: 10,
  },
  canvas: {
    backgroundColor: colors.canvas,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    overflow: 'hidden',
    paddingBottom: 24,
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.volt,
    fontSize: 11,
    fontWeight: '700',
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  brandSubtitle: {
    fontSize: 10,
    color: colors.inkTertiary,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  rlsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rlsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald,
  },
  rlsText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkSecondary,
    fontWeight: '600',
  },
  tenantTabs: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
    backgroundColor: colors.subtle,
  },
  tenantPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    marginRight: 8,
  },
  tenantPillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  tenantPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.inkSecondary,
  },
  tenantPillTextActive: {
    color: colors.canvas,
  },
  balanceHero: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
  },
  balanceLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    marginVertical: 4,
  },
  balanceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sweepText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.emerald,
    fontWeight: '600',
  },
  webhookBtn: {
    backgroundColor: colors.volt,
    borderWidth: 1,
    borderColor: colors.voltBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  webhookBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
  metricSection: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
  },
  metricScroll: {
    paddingHorizontal: 16,
  },
  chartCard: {
    margin: 16,
    padding: 14,
    backgroundColor: colors.subtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  chartBadge: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkSecondary,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 90,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    width: 32,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    marginTop: 6,
  },
  subledgerSection: {
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.inkTertiary,
  },
  sectionSub: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Courier',
    color: colors.ink,
  },
  rowCustomer: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  rowNumber: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    marginTop: 2,
  },
  rowAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    fontFamily: 'Courier',
  },
  dotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  rowStatus: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Courier',
  },
});
