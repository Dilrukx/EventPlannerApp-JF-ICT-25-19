import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';


export default function PickerField({ label, required, mode, value, placeholder, pickerValue, onChange }) {
  const [show, setShow] = useState(false);
  const [temp, setTemp] = useState(pickerValue);

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: pickerValue,
        mode,
        is24Hour: false,
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(date);
        },
      });
    } else {
      setTemp(pickerValue);
      setShow(true);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <TouchableOpacity style={styles.input} activeOpacity={0.8} onPress={open}>
        <Text style={[styles.value, !value && { color: '#B3B6C6' }]}>{value || placeholder}</Text>
        <Ionicons name={mode === 'date' ? 'calendar-outline' : 'time-outline'} size={18} color={colors.muted} />
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <Modal transparent animationType="slide" visible={show} onRequestClose={() => setShow(false)}>
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.sheetCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onChange(temp);
                    setShow(false);
                  }}
                >
                  <Text style={styles.sheetDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker value={temp} mode={mode} display="spinner" onChange={(_, d) => d && setTemp(d)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    marginBottom: 16
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  value: { 
    fontSize: 14,
     color: colors.text
     },

  overlay: {
     flex: 1,
      justifyContent: 'flex-end',
       backgroundColor: 'rgba(0,0,0,0.3)'
       },

  sheet: { 
    backgroundColor: '#fff',
     borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
       paddingBottom: 24
       },

  sheetHeader: { 
    flexDirection: 'row',
     justifyContent: 'space-between',
      padding: 16
     },

  sheetCancel: { 
    color: colors.muted,
     fontSize: 16 
    },

  sheetDone: { color: colors.primary,
     fontSize: 16,
     fontWeight: '700'
     },
});
