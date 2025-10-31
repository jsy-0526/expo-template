import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function WelcomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name="theme-demo"
        options={{
          title: 'Theme',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🎨</Text>,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>💾</Text>,
        }}
      />
      <Tabs.Screen
        name="i18n"
        options={{
          title: 'i18n',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🌐</Text>,
        }}
      />
    </Tabs>
  );
}
