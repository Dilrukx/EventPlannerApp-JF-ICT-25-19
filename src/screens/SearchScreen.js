import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../context/EventsContext';
import EventCard from '../components/EventCard';
import { colors } from '../theme';
import { combine, formatDateTime } from '../utils/date';

export default function SearchScreen({ navigation }) {
  const { events } = useEvents();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return events
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.description || '').toLowerCase().includes(q) ||
          formatDateTime(e.date, e.time).toLowerCase().includes(q)
      )
      .sort((a, b) => combine(a.date, a.time) - combine(b.date, b.time));
  }, [events, query]);

  return (
    <SafeAreaView style={styles.fill} edges={['top']}>
      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="Search events..."
            placeholderTextColor="#B3B6C6"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {!!query && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <EventCard
            event={item}
            showMenu={false}
            onPress={() => navigation.navigate('EditEvent', { eventId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>{query ? 'No matching events' : 'Type to search your events'}</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
     flex: 1,
      backgroundColor: colors.bg
    },

  searchWrap: {
     padding: 16
    },

  search: {
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E9EAF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  input: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14,
     color: colors.text 
    },

  list: { 
    paddingHorizontal: 16, 
    paddingBottom: 24 
  },

  empty: {
     textAlign: 'center', 
     color: colors.muted,
      marginTop: 40 
    },
});
