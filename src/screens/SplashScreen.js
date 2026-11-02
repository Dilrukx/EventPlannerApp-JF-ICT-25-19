import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function SplashScreen({ navigation }) {
  return (
    <LinearGradient colors={['#F4F3FF', '#E7E4FF']} style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <View style={styles.center}>
          <MaterialCommunityIcons name="calendar-check" size={92} color={colors.primary} />
          <Text style={styles.title}>Event Planner</Text>
          <Text style={styles.tagline}>Plan your moments,{'\n'}never miss your events!</Text>
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => navigation.replace('Main')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 24 
  },

  title: { fontSize: 30,
     fontWeight: '800', 
     color: colors.text, 
     marginTop: 20 
    },

  tagline: { fontSize: 15,
     color: colors.muted,
      textAlign: 'center', 
      marginTop: 10,
       lineHeight: 22 
      },

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  
  buttonText: { 
    color: '#fff',
     fontSize: 16,
      fontWeight: '700' 
    },
});
