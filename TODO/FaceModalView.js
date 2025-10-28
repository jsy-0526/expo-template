import {useTranslation} from "react-i18next";
import {Modal, Alert} from "react-native";
import {StyledTouchableOpacity, StyledText, StyledView, StyledIcon} from "./TailwindComponents";
import CardContainer from "./CardContainer";
import React, {useEffect, useCallback} from "react";
import LockingIcon from "./icons/LockingIcon";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import {useUIStore} from "../stores/uiStore";
import {useUserSetting} from "../hooks/datahook/settings";
import {useAuth} from "../hooks/useAuth";

const FaceModalView = (props) => {

    const {
        modalVisible,
        setModalVisible,
    } = props;
    const {data: setting} = useUserSetting();
    const { isLoggedIn } = useAuth();
    const {t} = useTranslation();
    const uiState = useUIStore((state) => state);

    const authenticate = useCallback(async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: t('请使用指纹或面部识别进行身份验证'),
                fallbackLabel: t('使用密码'),
                cancelLabel: t('取消'),
            });

            if (result.success) {
                // 认证成功，保存状态并关闭模态
                uiState.setHasAuthenticated(true);
                setModalVisible(false);
            } else {
                console.log("身份验证失败",result.error)
            }
        } else {
            Alert.alert(t('设备不支持生物识别或未注册生物识别信息'));
        }
    }, [setModalVisible, t]);

    useEffect(() => {
        if (modalVisible && setting?.enableFace && isLoggedIn) {
            authenticate(); // 只有在模态可见时进行认证
        }
    }, [modalVisible, authenticate,setting?.enableFace,isLoggedIn]);

    return (
        <Modal
            // animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <StyledView
                className={'justify-center items-center px-5'}
                style={{backgroundColor: 'white',}}
                flex={1}
            >
                    <StyledView flex={1} className={'items-center'}>
                        <StyledView flex={1} className={'items-center justify-center space-y-6 py-1'}>
                            <StyledIcon Icon={LockingIcon} size={80}/>
                            <StyledText variant={'H2'}
                                        className={'text-primary-500'}>{t('RZ Forex is locked')}</StyledText>
                        </StyledView>
                        <StyledTouchableOpacity className={'mb-20'} onPress={authenticate}>
                            <StyledText variant={'H2'} className={'text-primary-500'}>{t('unlock')}</StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
            </StyledView>
        </Modal>
    )
}

export default FaceModalView;
