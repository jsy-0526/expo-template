import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import type { FormComponentProps, FormValues, Option, SelectFieldConfig } from '../../types';

export const SelectField = <T = FormValues>(props: FormComponentProps<T> & SelectFieldConfig<T>) => {
  const {
    formik,
    name,
    label,
    placeholder = 'Please select...',
    options,
    disabled,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);

  const value = formik.values[name];
  const resolvedOptions = typeof options === 'function' ? options(formik.values) : options;
  const isDisabled = typeof disabled === 'function' ? disabled(formik.values) : disabled;

  const selectedOption = resolvedOptions.find((opt) => opt.value === value);

  const handleSelect = async (option: Option) => {
    await formik.setFieldValue(name, option.value);
    await formik.setFieldTouched(name, true);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => !isDisabled && setModalVisible(true)}
        disabled={isDisabled}
        className={`
          border border-gray-300 rounded-lg px-4 py-3 h-12
          flex-row items-center justify-between
          ${isDisabled ? 'bg-gray-100' : 'bg-white'}
        `}
      >
        <Text className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="text-gray-400">▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-lg w-4/5 max-h-96">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">
                {typeof label === 'function' ? label(formik.values) : label}
              </Text>
            </View>
            <FlatList
              data={resolvedOptions}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`
                    p-4 border-b border-gray-100
                    ${item.value === value ? 'bg-blue-50' : ''}
                  `}
                >
                  <Text
                    className={`
                      ${item.value === value ? 'text-blue-600 font-semibold' : 'text-gray-900'}
                    `}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
