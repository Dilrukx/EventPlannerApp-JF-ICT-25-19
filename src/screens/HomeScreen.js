import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../context/EventsContext';
import EventCard from '../components/EventCard';
import { colors, shadow } from '../theme';
import { combine, formatDateTime, isUpcoming } from '../utils/date';

export default function HomeScreen({ navigation }) {
  const { events, deleteEvent } = useEvents();
  const [tab, setTab] = useState('upcoming');
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => (tab === 'upcoming' ? isUpcoming(e) : !isUpcoming(e)))
      .filter((e) => !q || e.name.toLowerCase().includes(q) || formatDateTime(e.date, e.time).toLowerCase().includes(q))
      .sort((a, b) => {
        const diff = combine(a.date, a.time) - combine(b.date, b.time);
        return tab === 'upcoming' ? diff : -diff;
      });
  }, [events, tab, query]);

  const edit = (e) => navigation.navigate('EditEvent', { eventId: e.id });

  return (
    <SafeAreaView style={styles.fill} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Events</Text>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or date..."
            placeholderTextColor="#B3B6C6"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.segment}>
          {['upcoming', 'past'].map((k) => (
            <TouchableOpacity key={k} style={[styles.pill, tab === k && styles.pillActive]} onPress={() => setTab(k)}>
              <Text style={[styles.pillText, tab === k && styles.pillTextActive]}>
                {k === 'upcoming' ? 'Upcoming' : 'Past'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => edit(item)} onEdit={() => edit(item)} onDelete={() => deleteEvent(item.id)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={44} color={colors.border} />
            <Text style={styles.emptyText}>No {tab} events</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => navigation.navigate('AddEvent')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { 
    flex: 1, 
    backgroundColor: colors.bg
   },

  header: { 
    paddingHorizontal: 16,
     paddingTop: 8
    },

  title: { 
    fontSize: 22, 
    fontWeight: '800',
     color: colors.text,
      marginBottom: 12
     },

  search: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchInput: { 
    flex: 1,
     marginLeft: 8,
     fontSize: 14,
      color: colors.text
     },

  segment: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 12,
     marginBottom: 8
     },

  pill: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pillActive: { 
    backgroundColor: colors.primary,
     borderColor: colors.primary
     },

  pillText: {
     fontSize: 14, 
     fontWeight: '600',
      color: colors.text
     },

  pillTextActive: { 
    color: '#fff'
   },

  list: { 
    padding: 16, 
    paddingBottom: 100 
  },

  empty: { 
    alignItems: 'center',
     marginTop: 60
     },

  emptyText: {
     color: colors.muted, 
     marginTop: 10
     },
     
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
    shadowOpacity: 0.3,
  },
});
