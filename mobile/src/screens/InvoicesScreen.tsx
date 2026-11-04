import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Invoice, InvoiceStatus, Tenant } from '../types';
import { colors } from '../theme';
import { formatCurrency } from '../data';
import { InvoiceDetailModal } from '../components/InvoiceDetailModal';

const API_BASE_URL = 'https://veloce-ops-ochre.vercel.app';

interface InvoicesScreenProps {
  currentTenant: Tenant;
  invoices: Invoice[];
  onMarkPaid: (id: string) => void;
  onRefresh?: () => Promise<void>;
  onInvoiceCreated?: (invoice: Invoice) => void;
}

export function InvoicesScreen({
  currentTenant,
  invoices,
  onMarkPaid,
  onRefresh,
  onInvoiceCreated,
}: InvoicesScreenProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const tenantInvoices = invoices.filter((i) => i.tenant_id === currentTenant.id);

  const filtered = tenantInvoices.filter((inv) => {
    const matchQuery =
      inv.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'ALL' || inv.status === filter;
    return matchQuery && matchStatus;
  });

  const handlePullRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  const handleQuickCreate = async () => {
    setIsCreating(true);
    const demoClients = [
      { name: 'Linear Orbit Ltd', email: 'billing@linear.app', amount: 9200, item: 'SaaS Platform Retainer' },
      { name: 'Figma Systems Inc.', email: 'ap@figma.com', amount: 14500, item: 'Design System Enterprise License' },
      { name: 'OpenAI API Services', email: 'finance@openai.com', amount: 18000, item: 'Custom Model Fine-Tuning' },
    ];
    const picked = demoClients[Math.floor(Math.random() * demoClients.length)];

    try {
      const res = await fetch(`${API_BASE_URL}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: currentTenant.id,
          customer_name: picked.name,
          customer_email: picked.email,
          payment_method: 'Stripe ACH Transfer',
          currency: currentTenant.currency,
          items: [
            {
              description: picked.item,
              quantity: 1,
              unit_price: picked.amount,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.invoice && onInvoiceCreated) {
          onInvoiceCreated(data.invoice);
        }
        Alert.alert(
          'Invoice Created via API',
          `${data.invoice?.invoice_number || 'New invoice'} for ${picked.name} (${formatCurrency(picked.amount, currentTenant.currency)}) has been issued and stored.`
        );
      } else {
        Alert.alert('Error', 'Failed to issue invoice via API.');
      }
    } catch (err: any) {
      Alert.alert('Network Error', err.message || 'Could not connect to API.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Invoices Sub-Ledger</Text>
            <Text style={styles.subtitle}>Multi-tenant RLS • {currentTenant.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.createBtn, isCreating ? styles.createBtnDisabled : null]}
            onPress={handleQuickCreate}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color={colors.ink} />
            ) : (
              <Text style={styles.createBtnText}>+ Issue</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search invoice or client..."
            placeholderTextColor={colors.inkTertiary}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(['ALL', 'PENDING', 'OVERDUE', 'PAID'] as const).map((s) => {
            const active = filter === s;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.filterPill, active ? styles.filterPillActive : null]}
                onPress={() => setFilter(s)}
              >
                <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Invoice List */}
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={isRefreshing} onRefresh={handlePullRefresh} />
            ) : undefined
          }
        >
          {filtered.map((inv) => {
            const isPaid = inv.status === 'PAID';
            const isOverdue = inv.status === 'OVERDUE';
            const dotColor = isPaid ? colors.emerald : isOverdue ? colors.coral : colors.amber;

            return (
              <TouchableOpacity
                key={inv.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => setSelectedInvoice(inv)}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.invNum}>{inv.invoice_number}</Text>
                  <View style={styles.statusWrap}>
                    <View style={[styles.dot, { backgroundColor: dotColor }]} />
                    <Text style={[styles.statusText, { color: dotColor }]}>{inv.status}</Text>
                  </View>
                </View>

                <View style={styles.cardMid}>
                  <Text style={styles.customer}>{inv.customer_name}</Text>
                  <Text style={styles.amount}>
                    {formatCurrency(inv.total_amount, inv.currency)}
                  </Text>
                </View>

                <View style={styles.cardBottom}>
                  <Text style={styles.metaText}>Due: {inv.due_date}</Text>
                  <Text style={styles.metaText}>{inv.payment_method}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createBtn: {
    backgroundColor: colors.volt,
    borderWidth: 1,
    borderColor: colors.voltBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  createBtnDisabled: {
    opacity: 0.6,
  },
  createBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  searchBox: {
    backgroundColor: colors.canvas,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchInput: {
    fontSize: 13,
    color: colors.ink,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
  },
  filterPillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  filterText: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.inkSecondary,
  },
  filterTextActive: {
    color: colors.canvas,
  },
  list: {
    flex: 1,
    marginBottom: 50,
  },
  card: {
    backgroundColor: colors.canvas,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  invNum: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.inkTertiary,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Courier',
  },
  cardMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customer: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Courier',
    color: colors.ink,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline,
  },
  metaText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
  },
});
