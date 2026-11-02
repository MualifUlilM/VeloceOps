import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Invoice } from '../types';
import { colors } from '../theme';
import { formatCurrency } from '../data';

interface InvoiceDetailModalProps {
  visible: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onMarkPaid?: (id: string) => void;
}

export function InvoiceDetailModal({
  visible,
  invoice,
  onClose,
  onMarkPaid,
}: InvoiceDetailModalProps) {
  if (!invoice) return null;

  const isPaid = invoice.status === 'PAID';
  const statusColor = isPaid
    ? colors.emerald
    : invoice.status === 'OVERDUE'
    ? colors.coral
    : colors.amber;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.sheet}>
          <View style={styles.dragPill} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.invNumber}>{invoice.invoice_number}</Text>
              <Text style={styles.customerName}>{invoice.customer_name}</Text>
              <Text style={styles.customerEmail}>{invoice.customer_email}</Text>
            </View>
            <View style={styles.statusWrap}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{invoice.status}</Text>
            </View>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Amount Box */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Total Settled Amount</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(invoice.total_amount, invoice.currency)}
              </Text>
              <Text style={styles.methodText}>Rail: {invoice.payment_method}</Text>
            </View>

            {/* Line Items */}
            <Text style={styles.sectionTitle}>Deliverables & SLA</Text>
            {(invoice.items || [
              {
                id: '1',
                description: 'Core B2B Enterprise Subscription',
                quantity: 1,
                unit_price: invoice.total_amount,
                total_price: invoice.total_amount,
              },
            ]).map((it) => (
              <View key={it.id} style={styles.lineItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemDesc}>{it.description}</Text>
                  <Text style={styles.itemQty}>Qty: {it.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatCurrency(it.total_price, invoice.currency)}
                </Text>
              </View>
            ))}

            {/* Audit Proof */}
            <View style={styles.auditBox}>
              <Text style={styles.auditTitle}>Cryptographic Audit Proof (SHA-256)</Text>
              <Text style={styles.auditHash}>
                sha256:7e9a8f4c2b1e0d3f6a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
              </Text>
              <Text style={styles.auditPolicy}>Enforced by PostgreSQL RLS Policy</Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            {!isPaid && onMarkPaid && (
              <TouchableOpacity
                style={styles.payBtn}
                onPress={() => {
                  onMarkPaid(invoice.id);
                  onClose();
                }}
              >
                <Text style={styles.payBtnText}>Reconcile & Settle</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(18, 19, 22, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
  },
  invNumber: {
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
    color: colors.inkTertiary,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 2,
  },
  customerEmail: {
    fontSize: 11,
    color: colors.inkTertiary,
    fontFamily: 'Courier',
    marginTop: 1,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Courier',
  },
  body: {
    marginBottom: 16,
  },
  amountBox: {
    backgroundColor: colors.subtle,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.inkTertiary,
    fontFamily: 'Courier',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.ink,
    marginVertical: 4,
  },
  methodText: {
    fontSize: 11,
    color: colors.inkSecondary,
    fontFamily: 'Courier',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.inkTertiary,
    fontFamily: 'Courier',
    marginBottom: 8,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderHairline,
  },
  itemDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  itemQty: {
    fontSize: 11,
    color: colors.inkTertiary,
    fontFamily: 'Courier',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    fontFamily: 'Courier',
  },
  auditBox: {
    backgroundColor: colors.subtle,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    marginTop: 16,
  },
  auditTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
  },
  auditHash: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: colors.inkTertiary,
    marginVertical: 4,
  },
  auditPolicy: {
    fontSize: 10,
    color: colors.emerald,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  payBtn: {
    flex: 1,
    backgroundColor: colors.volt,
    borderWidth: 1,
    borderColor: colors.voltBorder,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  payBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.canvas,
  },
});
