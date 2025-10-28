import React, {
    useMemo,
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    useEffect,
} from 'react';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Dimensions, ScrollView, Platform, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import {CheckIcon} from "react-native-heroicons/outline";
import {
    StyledView,
    StyledText,
    StyledHeading,
    StyledHStack,
    StyledPressable
} from "./TailwindComponents";
import Divider from "./Divider";
import {
    useImageGalleryPicker,
    useTakePhoto
} from "../hooks/pickerHooks";
import * as FileSystem from 'expo-file-system';
import {every, get, keys, round, set} from 'lodash';
import {useColorModeValueKey} from "../hooks/useColors";
import Toast from 'react-native-toast-message';
import {getErrorMessage} from "../utils/error";
import {useShowToast} from "./CustomToast";

const screen = Dimensions.get('screen');
const ActionSheetImage = (props, ref) => {
    const {
        onSave = () => {
        },
        onUpload,
        options = [],
        snapPoint = [215],
        sizeLimit = 1024 * 1024 * 10,
        type = 'image',
        onClose,
        loading = false,
        disabled = false,
        onChangeFile = () => {
        },
    } = props;
    const {showToast} = useShowToast();
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => snapPoint, []);
    const {t} = useTranslation('app');
    const [uploading, setUploading] = useState({});
    const [files, setFiles] = useState([]);

    useImperativeHandle(
        ref,
        () => ({
            dismiss: () => {
                bottomSheetRef.current?.dismiss();
            },
            present: () => {
                bottomSheetRef.current?.present();
            },
        }),
        [bottomSheetRef],
    );
    const bgColor = useColorModeValueKey("bg");
    const viewColor = useColorModeValueKey("dividerBg");
    const galleryPicker = useImageGalleryPicker();
    const takePhoto = useTakePhoto();

    const sizeLimiter = async (file, limit) => {
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        return {result: fileInfo.size <= limit, size: fileInfo.size};
    };

    const onPressTakePhoto = async () => {
        onClose();
        const res = await takePhoto();
        if (res) {
            const {result: filePassed, size} = await sizeLimiter(
                res?.assets?.[0],
                sizeLimit,
            );
            const id = Math.random();
            if (filePassed) {
                try {
                    setUploading((c) => set(c, id, true));
                    const obj = {...res, id: id};
                    setFiles((c) => [...c, obj]);
                    const response = await onUpload(res?.assets?.[0]);
                    setUploading((c) => ({...set(c, id, false)}));
                    onChangeFile(response);
                } catch (error) {
                    console.log(error);
                    showToast({
                        type: 'error',
                        text1: t('updateFailed'),
                        text2: t(`${error}`)
                    });

                    setUploading((c) => ({...set(c, id, false)}));
                    setFiles((c) => [...c.filter(o => o.id !== id)]);
                }
            } else {
                showToast({
                    type: 'error',
                    text1: t('updateFailed'),
                    text2: t(`fileSizeOverLimit`, {
                        limit: '10MB',
                        size: `${round(size / (1024 * 1024), 2)}MB`,
                    })
                });
            }
        }
    };

    const onPressImageGallery = async () => {
        onClose();
        const res = await galleryPicker();
        if (res) {
            const {result: filePassed, size} = await sizeLimiter(
                res?.assets?.[0],
                sizeLimit,
            );
            if (filePassed) {
                const id = Math.random();
                try {
                    setUploading((c) => set(c, id, true));
                    const obj = {...res, id: id};
                    setFiles((c) => [...c, obj]);
                    const response = await onUpload(res?.assets?.[0]);
                    // some wrong happend, finally call long time when await finished.
                    setUploading((c) => ({...set(c, id, false)}));
                    onChangeFile(response);
                } catch (error) {
                    console.log(error);
                    setUploading((c) => ({...set(c, id, false)}));
                    setFiles((c) => [...c.filter((o) => o.id !== id)]);
                    // toast.show({description: t(`${error}`)});
                }
            } else {
                // toast.show({
                //     description: t(`fileSizeOverLimit`, {
                //         limit: '10MB',
                //         size: `${round(size / (1024 * 1024), 2)}MB`,
                //     }),
                // });
            }
        }
    };


    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            enableOverDrag={false}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                />
            )}
            handleIndicatorStyle={{backgroundColor: 'gray'}}
            backgroundStyle={{backgroundColor: bgColor}}
            // bottomInset={Platform.select({ ios: 34, android: 0 })}
        >
            <StyledView
                className={'flex mx-3 flex-1 space-y-2'}
                style={{
                    paddingBottom: Platform.OS === 'ios' ? 34 : 0
                }}
            >
                <StyledView className={'flex-1'}>
                    <StyledPressable onPress={onPressTakePhoto} className='h-12 rounded-md px-4'>
                        <StyledText variant={'action-m'}>{t('takePhoto')}</StyledText>
                    </StyledPressable>
                    <Divider/>
                    <StyledPressable onPress={onPressImageGallery} className='h-12 rounded-md px-4'>
                        <StyledText variant={'action-m'}>{t('imageGallery')}</StyledText>
                    </StyledPressable>
                </StyledView>

                <StyledView className={'h-2 bg-gray-400 -mx-3'} style={{backgroundColor: viewColor}}/>
                <StyledPressable onPress={onClose} className='h-10 rounded-md px-4'>
                    <StyledText variant={'action-m'}>{t('cancel')}</StyledText>
                </StyledPressable>
            </StyledView>
        </BottomSheetModal>
    )

}


export default forwardRef(ActionSheetImage);
