import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  accent?: string;
}

export function MetricCard({ label, value, subtext, accent }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={[styles.subtext, accent ? { color: accent } : null]}>{subtext}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.subtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderCanvas,
    padding: 12,
    marginRight: 10,
    minWidth: 140,
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.inkTertiary,
    fontFamily: 'Courier',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  subtext: {
    fontSize: 10,
    color: colors.inkSecondary,
    fontFamily: 'Courier',
  },
});
