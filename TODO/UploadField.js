import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import * as FileSystem from "expo-file-system";
import { get, round, set } from "lodash";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from "react-native";
import { useImageGalleryPicker, usePickDocument, useTakePhoto } from "../hooks/pickerHooks";
import { useColorModeValueKey } from "../hooks/useColors";
import { useNavigation } from "../hooks/useNavigation";
import { isImageExtension } from "../utils/mime";
import { useShowToast } from "./CustomToast";
import Divider from "./Divider";
import FastImageWithLoading from "./FastImageWithLoading";
import CloseIcon from "./icons/CloseIcon";
import FileIcon from "./icons/FileIcon";
import UploadIcon from "./icons/UploadIcon";
import {
    Spinner,
    StyledCenter,
    StyledHStack,
    StyledIcon,
    StyledPressable,
    StyledRow,
    StyledText,
    StyledView
} from "./TailwindComponents";

const DisplayBlock = (props) => {
    const {uploading, disabled, onClean, file, index,isEdit = true} = props;
    const navigation = useNavigation();
    const {t} = useTranslation('app');
    const uri = file?.uri || file;

    return (
        <StyledView className={'mb-2 bg-grayerWhite rounded-md'}>
            {isImageExtension(uri) ? (
                <StyledPressable
                    disabled={disabled}
                    // onPress={
                    //     uploading
                    //         ? null
                    //         : () =>
                    //             navigation.navigate('ImageViewer', {
                    //                 images: [{url: uri}],
                    //             })
                    // }
                >
                    <StyledView className={'h-52 w-full'}>
                        <FastImageWithLoading
                            source={{
                                uri: uri,
                            }}
                            className="w-full h-full rounded-md"
                            resizeMode={'contain'}
                        />
                        {
                            isEdit && (
                                <StyledPressable
                                    position={'absolute'}
                                    top={3}
                                    right={3}
                                    zIndex={1}
                                    onPress={() => onClean(file, index)}
                                    disabled={disabled}
                                >
                                    <StyledIcon Icon={CloseIcon}/>
                                </StyledPressable>
                            )
                        }
                        {uploading && (
                            <StyledCenter
                                zIndex={2}
                                position={'absolute'}
                                top={0}
                                bottom={0}
                                left={0}
                                right={0}
                                bg={'rgba(0,0,0,0.3)'}
                            >
                                <Spinner/>
                                <StyledText>{t('uploading')}</StyledText>
                            </StyledCenter>
                        )}
                    </StyledView>
                </StyledPressable>
            ) : (
                <StyledRow
                    className={'px-3 py-3 justify-between items-center space-x-2'}
                >
                    <StyledPressable
                        flex={1}
                        // onPress={() =>
                        //     Platform.OS === 'web'
                        //         ? window.open(uri, '_blank')
                        //         : null
                        // }
                    >
                        <StyledHStack className={'space-x-1'}>
                            <StyledIcon Icon={FileIcon}/>
                            <StyledText numberOfLines={1} maxW="80%">
                                {file?.path || uri}
                            </StyledText>
                        </StyledHStack>
                    </StyledPressable>
                    <StyledRow className={'items-center space-x-2'}>
                        {uploading && <Spinner />}
                        {isEdit && (
                        <StyledPressable
                            zIndex="1"
                            onPress={() => onClean(file, index)}
                            disabled={disabled}
                        >
                            <StyledIcon Icon={CloseIcon}/>
                        </StyledPressable>
                        )}
                    </StyledRow>
                </StyledRow>
            )}
        </StyledView>
    )

}

const UploadField = (props,ref) => {
    const {
        file,
        onUpload,
        snapPoint = [265],
        sizeLimit = 1024 * 1024 * 10,
        type = 'image',
        accept,
        disabled = false,
        mutiple = false,
        isEdit = true,
        onChangeFile = () => {
        },
        helperText,
        max = 20
    } = props;
    const {showToast} = useShowToast();
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => snapPoint, []);
    const {t} = useTranslation('app');
    const [uploading, setUploading] = useState({});
    const [files, setFiles] = useState(mutiple ? file : file ? [file] : []);

    const bgColor = useColorModeValueKey("bg");
    const viewColor = useColorModeValueKey("dividerBg");
    const galleryPicker = useImageGalleryPicker();
    const takePhoto = useTakePhoto();
    const pickDocument = usePickDocument({
        accept: accept || ['image/*', 'application/pdf'],
    });

    useImperativeHandle(ref, () => ({
        clean: () => {
            setFiles([]);
            onChangeFile(mutiple ? [] : null);
        },
        setDefault: () => {
            setFiles(file ? [file] : []);
        },
    }));

    const onPressBlock = () => {
        bottomSheetRef.current?.present();
    };

    const onPressClose = () => {
        bottomSheetRef.current?.dismiss();
    };

    const sizeLimiter = async (file, limit) => {
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        return {result: fileInfo.size <= limit, size: fileInfo.size};
    };

    const onPressTakePhoto = async () => {
        onPressClose();
        const res = await takePhoto();

        if (res) {
            const f = res?.assets?.[0]; // 获取第一个文件
            console.log("拍摄的文件:", f); // 打印文件信息
            const {result: filePassed, size} = await sizeLimiter(f, sizeLimit);
            const id = Math.random();

            if (filePassed) {
                try {
                    setUploading((c) => set(c, id, true));
                    const obj = {...f, id}; // 确保这里使用正确的字段
                    setFiles((c) => [...c, obj]);

                    const response = await onUpload(f); // 使用文件进行上传
                    setUploading((c) => ({...set(c, id, false)}));
                    onChangeFile(mutiple ? [...file, response] : response);
                } catch (error) {
                    console.log(error);
                    showToast({
                        type: 'error',
                        text1: t('updateFailed'),
                        text2: t(`${error}`),
                    });

                    setUploading((c) => ({...set(c, id, false)}));
                    setFiles((c) => [...c.filter((o) => o.id !== id)]);
                }
            } else {
                showToast({
                    type: 'error',
                    text1: t('updateFailed'),
                    text2: t(`fileSizeOverLimit`, {
                        limit: '10MB',
                        size: `${round(size / (1024 * 1024), 2)}MB`,
                    }),
                });
            }
        }
    };

    const onPressImageGallery = async () => {
        onPressClose();
        let res;
        try {
			res = await galleryPicker();
		} catch (error) {
			showToast({
				type: "error",
				text1: "galleryPicker error",
			});
            return
		}
        if (res) {
            const f = res?.assets?.[0]; // 获取第一个文件
            console.log("选中的文件:", f); // 打印文件信息
            let filePassed;
            let size;
            try {
                const result = await sizeLimiter(f, sizeLimit);
                filePassed = result.result;
                size = result.size;
            } catch (error) {
                showToast({
					type: "error",
					text1: "sizeLimiter error",
				});
                return
            }
            if (filePassed) {
                const id = Math.random();
                try {
                    setUploading((c) => set(c, id, true));
                    const obj = {...f, id}; // 确保这里使用正确的字段
                    setFiles((c) => [...c, obj]);
                    const response = await onUpload(f); // 使用 file 进行上传
                    setUploading((c) => ({...set(c, id, false)}));
                    onChangeFile(mutiple ? [...file, response] : response);
                } catch (error) {
                    console.log(error);
                    setUploading((c) => ({...set(c, id, false)}));
                    setFiles((c) => [...c.filter((o) => o.id !== id)]);
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

    const onPressDocuments = async () => {
        onPressClose();
        const res = await pickDocument();

        if (res) {
            const f = res.assets[0]; // 获取第一个文件
            console.log("选中的文档:", file); // 打印文件信息
            const {result: filePassed, size} = await sizeLimiter(f, sizeLimit);
            if (filePassed) {
                const id = Math.random();
                try {
                    const obj = {...f, id}; // 确保这里使用正确的字段
                    setFiles((c) => [...c, obj]);
                    setUploading((c) => set(c, id, true));
                    const response = await onUpload(f); // 使用文件进行上传
                    setUploading((c) => ({...set(c, id, false)}));
                    onChangeFile(mutiple ? [...file, response] : response);
                } catch (error) {
                    console.log(error);
                    setFiles((c) => [...c.filter((o) => o.id !== id)]);
                    setUploading((c) => ({...set(c, id, false)}));

                    showToast({
                        type: 'error',
                        text1: t('updateFailed'),
                        text2: t(`${error}`),
                    });
                }
            } else {
                showToast({
                    type: 'error',
                    text1: t('updateFailed'),
                    text2: t(`fileSizeOverLimit`, {
                        limit: '10MB',
                        size: `${round(size / (1024 * 1024), 2)}MB`,
                    }),
                });
            }
        }
    };

    const onClean = (_, index) => {
        if (mutiple) {
            setFiles((c) => c.filter((item, i) => i !== index));
            onChangeFile(file.filter((item, i) => i !== index));
        } else {
            setFiles([]);
            onChangeFile(null);
        }
    };


    const hasFile = files?.length > 0;
    const uploadZone = (
        <StyledPressable
            className={`rounded-md space-x-1 flex-auto border border-border py-5 bg-white dark:bg-gray-700`}
            onPress={onPressBlock} disabled={disabled}>
            <StyledCenter py={3} rounded={'md'}>
                <StyledIcon Icon={UploadIcon} size={40}/>
                <StyledText mt={1} fontSize="xs">
                    {helperText || t('uploadImageLimit')}
                </StyledText>
            </StyledCenter>
        </StyledPressable>
    );

    return (
        <>
            {
                hasFile ? (
                    <StyledView>
                        {(files || [])?.map((item, index) => (
                            <DisplayBlock
                                isEdit={isEdit}
                                file={item}
                                key={index}
                                uploading={get(uploading, item?.id) || false}
                                disabled={disabled}
                                onClean={onClean}
                                index={index}
                            />
                        ))}
                        {mutiple && uploadZone}
                    </StyledView>
                ) : (uploadZone)
            }
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
                        <Divider/>
                        <StyledPressable onPress={onPressDocuments} className='h-12 rounded-md px-4'>
                            <StyledText variant={'action-m'}>{t('documents')}</StyledText>
                        </StyledPressable>
                    </StyledView>

                    <StyledView className={'h-2 bg-gray-400 -mx-3'} style={{backgroundColor: viewColor}}/>
                    <StyledPressable onPress={() => bottomSheetRef.current?.dismiss()} className='h-10 rounded-md px-4'>
                        <StyledText variant={'action-m'}>{t('cancel')}</StyledText>
                    </StyledPressable>
                </StyledView>
            </BottomSheetModal>
        </>
    )

}

export default forwardRef(UploadField);
