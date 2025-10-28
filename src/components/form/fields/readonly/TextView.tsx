import { Text, View } from 'react-native';
import type { FormValues, ViewComponentProps } from '../../types';

export function TextView<T = FormValues>(props: ViewComponentProps<T>) {
  const { data, name, label, formatter } = props;

  const value = data[name];
  const resolvedLabel = typeof label === 'function' ? label(data) : label;
  const displayValue = formatter ? formatter(value) : String(value || '-');

  return (
    <View className="mb-3">
      <Text className="text-gray-500 text-sm mb-1">{resolvedLabel}</Text>
      <Text className="text-gray-900 text-base">{displayValue}</Text>
    </View>
  );
}
