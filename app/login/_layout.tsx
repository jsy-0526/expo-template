import { Tabs } from 'expo-router';


export default function WelcomeLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        headerShown: false,
      }}>
    </Tabs>
  );
}
