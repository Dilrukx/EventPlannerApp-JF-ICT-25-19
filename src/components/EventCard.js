import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow, tiles } from '../theme';
import { formatDateTime } from '../utils/date';


const pickIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('birthday') || n.includes('party')) return 'gift';
  if (n.includes('study') || n.includes('exam') || n.includes('class')) return 'book';
  if (n.includes('movie') || n.includes('film')) return 'film';
  if (n.includes('meeting') || n.includes('team')) return 'people';
  return 'calendar';
};

const tileFor = (id = '') => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return tiles[hash % tiles.length];
};

export default function EventCard({ event, onPress, onEdit, onDelete, showMenu = true }) {
  const tile = tileFor(event.id);

  const openMenu = () =>
    Alert.alert(event.name, undefined, [
      { text: 'Edit', onPress: onEdit },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete event?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: onDelete },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={[styles.tile, { backgroundColor: tile.bg }]}>
        <Ionicons name={pickIcon(event.name)} size={18} color={tile.fg} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{event.name}</Text>
        <Text style={styles.meta}>{formatDateTime(event.date, event.time)}</Text>
        {!!event.description && <Text style={styles.desc} numberOfLines={1}>{event.description}</Text>}
      </View>
      {showMenu && (
        <TouchableOpacity onPress={openMenu} hitSlop={10} style={styles.dots}>
          <Ionicons name="ellipsis-vertical" size={16} color={colors.muted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    ...shadow,
  },

  tile: {
     width: 38, 
     height: 38,
      borderRadius: 10,
       alignItems: 'center',
        justifyContent: 'center'
       },

  body: { 
    flex: 1,
     marginLeft: 12 
    },

  title: {
     fontSize: 15,
      fontWeight: '700',
       color: colors.text 
      },

  meta: {
     fontSize: 12,
      color: colors.muted,
       marginTop: 2 
      },

  desc: { 
    fontSize: 12,
     color: colors.muted,
      marginTop: 2 
    },

  dots: { 
    paddingLeft: 8,
     paddingVertical: 4
     },
});
