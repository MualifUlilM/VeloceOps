import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme';
import { Tenant, Invoice } from './src/types';
import { INITIAL_TENANTS, INITIAL_INVOICES } from './src/data';
import { TreasuryScreen } from './src/screens/TreasuryScreen';
import { InvoicesScreen } from './src/screens/InvoicesScreen';
import { SpendScreen } from './src/screens/SpendScreen';
import { AiCfoScreen } from './src/screens/AiCfoScreen';

type Tab = 'treasury' | 'invoices' | 'spend' | 'aicfo';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('treasury');
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(INITIAL_TENANTS[0]);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  // Webhook Simulation handler
  const handleSimulateWebhook = () => {
    const tenantInvoices = invoices.filter((i) => i.tenant_id === currentTenant.id);
    const targetInvoice = tenantInvoices.find((i) => i.status !== 'PAID') || tenantInvoices[0];

    if (targetInvoice) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === targetInvoice.id ? { ...inv, status: 'PAID' } : inv
        )
      );

      setCurrentTenant((prev) => ({
        ...prev,
        operating_cash: prev.operating_cash + targetInvoice.total_amount,
      }));

      Alert.alert(
        'Stripe Webhook Reconciled',
        `${targetInvoice.invoice_number} successfully marked as PAID. +$${targetInvoice.total_amount.toLocaleString()} added to operating liquidity.`
      );
    } else {
      Alert.alert('Notice', 'All invoices for this tenant are already reconciled.');
    }
  };

  const handleMarkPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          setCurrentTenant((t) => ({ ...t, operating_cash: t.operating_cash + inv.total_amount }));
          return { ...inv, status: 'PAID' };
        }
        return inv;
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Main Screen Content */}
      <View style={styles.content}>
        {activeTab === 'treasury' && (
          <TreasuryScreen
            currentTenant={currentTenant}
            onSelectTenant={setCurrentTenant}
            tenants={tenants}
            invoices={invoices}
            onSimulateWebhook={handleSimulateWebhook}
            onMarkPaid={handleMarkPaid}
          />
        )}
        {activeTab === 'invoices' && (
          <InvoicesScreen
            currentTenant={currentTenant}
            invoices={invoices}
            onMarkPaid={handleMarkPaid}
          />
        )}
        {activeTab === 'spend' && <SpendScreen currentTenant={currentTenant} />}
        {activeTab === 'aicfo' && <AiCfoScreen currentTenant={currentTenant} />}
      </View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('treasury')}
        >
          <Text style={styles.tabIcon}>🏛️</Text>
          <Text style={[styles.tabLabel, activeTab === 'treasury' ? styles.tabLabelActive : null]}>
            Treasury
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('invoices')}
        >
          <Text style={styles.tabIcon}>📄</Text>
          <Text style={[styles.tabLabel, activeTab === 'invoices' ? styles.tabLabelActive : null]}>
            Invoices
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('spend')}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={[styles.tabLabel, activeTab === 'spend' ? styles.tabLabelActive : null]}>
            Spend
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('aicfo')}
        >
          <Text style={styles.tabIcon}>✨</Text>
          <Text style={[styles.tabLabel, activeTab === 'aicfo' ? styles.tabLabelActive : null]}>
            AI CFO
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.shell,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.borderCanvas,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.inkTertiary,
  },
  tabLabelActive: {
    color: colors.ink,
  },
});
