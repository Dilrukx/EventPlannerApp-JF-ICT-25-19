import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Switch, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../context/EventsContext';
import PickerField from '../components/PickerField';
import { colors } from '../theme';
import { combine, formatDateField, formatTime, parseDate, timeToDate, toHHmm, toISODate, pad } from '../utils/date';

export default function AddEditEventScreen({ navigation, route }) {
  const eventId = route.params?.eventId;
  const { getEvent, addEvent, updateEvent, deleteEvent } = useEvents();
  const existing = eventId ? getEvent(eventId) : null;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? '');
  const [date, setDate] = useState(existing?.date ?? '');
  const [time, setTime] = useState(existing?.time ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [reminderEnabled, setReminderEnabled] = useState(existing?.reminderEnabled ?? true);
  const [reminderTime, setReminderTime] = useState(existing?.reminderTime ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || !date || !time) {
      Alert.alert('Missing details', 'Please enter the event name, date and time.');
      return;
    }

    
    let finalReminder = reminderTime;
    if (reminderEnabled && !finalReminder) {
      const d = new Date(combine(date, time).getTime() - 30 * 60000);
      finalReminder = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    const payload = {
      name: name.trim(),
      date,
      time,
      description: description.trim(),
      reminderEnabled,
      reminderTime: reminderEnabled ? finalReminder : '',
    };

    setSaving(true);
    if (isEdit) await updateEvent(existing.id, payload);
    else await addEvent(payload);
    setSaving(false);
    navigation.goBack();
  };

  const confirmDelete = () =>
    Alert.alert('Delete event?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEvent(existing.id);
          navigation.goBack();
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.fill}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Event' : 'Add Event'}</Text>
      </View>

      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Event Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            placeholderTextColor="#B3B6C6"
            value={name}
            onChangeText={setName}
          />

          <PickerField
            label="Date"
            required
            mode="date"
            value={formatDateField(date)}
            placeholder="Select date"
            pickerValue={date ? parseDate(date) : new Date()}
            onChange={(d) => setDate(toISODate(d))}
          />

          <PickerField
            label="Time"
            required
            mode="time"
            value={formatTime(time)}
            placeholder="Select time"
            pickerValue={timeToDate(time)}
            onChange={(d) => setTime(toHHmm(d))}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Enter description"
            placeholderTextColor="#B3B6C6"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              Set Reminder <Text style={styles.optional}>(optional)</Text>
            </Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor="#fff"
            />
          </View>

          {reminderEnabled && (
            <PickerField
              label="Reminder Time"
              mode="time"
              value={formatTime(reminderTime)}
              placeholder="Select time"
              pickerValue={timeToDate(reminderTime || time)}
              onChange={(d) => setReminderTime(toHHmm(d))}
            />
          )}

          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={save} disabled={saving}>
            <Text style={styles.primaryText}>{isEdit ? 'Update' : 'Save Event'}</Text>
          </TouchableOpacity>

          {isEdit && (
            <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8} onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={styles.deleteText}>Delete Event</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { 
    flex: 1,
     backgroundColor: colors.bg 
    },

  header: { 
    flexDirection: 'row',
     alignItems: 'center',
      paddingHorizontal: 16,
       paddingVertical: 12,
        gap: 14 
      },

  headerTitle: { 
    fontSize: 18,
     fontWeight: '700',
     color: colors.text
     },

  form: { 
    padding: 16,
     paddingBottom: 40 
    },

  label: { 
    fontSize: 13,
     fontWeight: '600', 
     color: colors.text,
      marginBottom: 6
     },

  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
  },

  multiline: {
     height: 96,
      paddingTop: 12
     },

  switchRow: {
     flexDirection: 'row', 
     justifyContent: 'space-between',
      alignItems: 'center',
       marginBottom: 14
       },

  switchLabel: {
     fontSize: 13,
      fontWeight: '600',
       color: colors.text
       },

  optional: {
    fontWeight: '400',
     color: colors.muted 
    },

  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  primaryText: {
     color: '#fff',
      fontSize: 16,
       fontWeight: '700'
       },

  deleteBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  deleteText: { 
    color: colors.danger,
     fontSize: 15,
      fontWeight: '700'
     },
});
