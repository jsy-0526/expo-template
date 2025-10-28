/**
 * 二段验证
 */
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import { useShowToast } from "../../components/CustomToast";
import MenuListItem from "../../components/MenuListItem";
import SwitchView from "../../components/SwitchView";
import { StyledText, StyledView } from "../../components/TailwindComponents";
import { useProfile } from "../../hooks/datahook/auth";
import { updateUserEnableFace_, useUserSetting } from "../../hooks/datahook/settings";
import { useNavigation, useRoute } from "../../hooks/useNavigation";
import { useOtpSecretStore } from "../../stores/otpSecretStore";
import { generateSecret } from "../../utils/validator";

const TwoFactorSettings = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const {showToast} = useShowToast();
    const otpSecretStore = useOtpSecretStore((state) => state);
    const {data: profile, isCompany} = useProfile();

    const {data: setting, mutate: mutateSetting} = useUserSetting();
    const isRefresh = route?.params?.isRefresh || false;
    const isMutate = route?.params?.isMutate || false;
    const {t} = useTranslation('app');
    const [secret, setSecret] = useState(null);
    const [supportedBiometrics, setSupportedBiometrics] = useState([]);
    const [enableEmailFact, setEnableEmailFact] = useState(
        setting?.enableEmailFact,
    );
    const [enableOtpFact, setEnableOtpFact] = useState(setting?.enableOtpFact);
    const [enableSmsFact, setEnableSmsFact] = useState(setting?.enableSmsFact);
    const [enableFace, setEnableFace] = useState(setting?.enableFace);


    const handlePress = async () => {
        const issuer = 'RZ Forex';
        const account = profile?.email;
        const secret = await generateSecret(10); // 你的密钥
        otpSecretStore.setOtpSecret(secret);
        const otpUrl = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}`;
        Linking.canOpenURL(otpUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(otpUrl);
                } else {
                    // console.log("未找到可打开的Authenticator应用");
                    showToast({
                        type: 'error',
                        text1: t('notAuthenticatorTip'),
                    });
                }
            })
            .catch(err => {
                // console.error("打开应用时出错", err)
                showToast({
                    type: 'error',
                    text1: t('errorOpeningApp'),
                    text2: err
                });
            });
    };

    useEffect(() => {
        mutateSetting();
    }, [isMutate])

    useEffect(() => {
        setEnableSmsFact(setting?.enableSmsFact);
    }, [setting?.enableSmsFact]);

    useEffect(() => {
        setEnableEmailFact(setting?.enableEmailFact);
    }, [setting?.enableEmailFact])

    useEffect(() => {
        setEnableOtpFact(setting?.enableOtpFact);
    }, [setting?.enableOtpFact])

    useEffect(() => {
        setEnableFace(setting?.enableFace);
    }, [setting?.enableFace])


    useEffect(() => {
        getBiometricSupport();
    }, []);

    const getBiometricSupport = async () => {
        const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setSupportedBiometrics(supportedBiometrics);
    };

    const checkBiometrics = async () => {
        try {
            // 检查用户是否已注册生物识别信息
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            return isEnrolled; // 返回 true 或 false
        } catch (error) {
            console.error("检查生物识别状态时出错:", error);
            return false; // 出现错误时返回 false
        }
    };
    const getBiometricStatus = async () => {
        const isUserEnrolled = await checkBiometrics();
        console.log("用户已注册生物识别信息:", isUserEnrolled); // 输出 true 或 false
    };

    //关闭识别
    const disableFaceAuth = async () => {
        setEnableFace(false);
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: '请使用指纹或面部识别进行身份验证',
                fallbackLabel: '使用密码',
                cancelLabel: '取消',
                disableDeviceFallback: true,
            });
            if (result.success) {
                // 识别成功
                // await deleteUsernamePassword_();
                // const deviceId = DeviceInfo.getUniqueId();
               await updateUserEnableFace_({
                    // deviceId: deviceId,
                    enableFace: false,
                })


                setEnableFace(false);
            } else {
                //识别失败
                console.log('识别失败');
                setEnableFace(true);
            }
        } catch (error) {
            // 处理错误
            setEnableFace(true);
            console.error('识别出错:', error);
        }
    };


    const settings = [
        {
            label: t('otp'),
            fact: enableOtpFact,
            key: 'otp',
            isDisabled: setting?.enableOtpFact,
        },
        {
            label: t('SMS'),
            fact: enableSmsFact,
            key: 'sms',
            isDisabled: setting?.enableSmsFact,
        },
        {
            label: t('email'),
            fact: enableEmailFact,
            key: 'email',
            isDisabled: !(setting?.enableOtpFact || setting?.enableSmsFact),
        },
    ].map((item) => ({
        label: item.label,
        component: (
            <SwitchView
                checked={item.fact}
                setChecked={async () => {
                    if (item.key === 'otp') {
                        if (!setting?.enableOtpFact) {
                            handlePress();
                            navigation.navigate('TwoFactorModal', {
                                screen: 'TwoFactorSetup',
                                params: {
                                    backRoute: 'Security',
                                    useType: item.key,
                                    additional: {key: item.key},
                                    enableOtpFact: setting?.enableOtpFact,
                                },
                            });
                        }
                        return;
                    }
                    if (item.key !== 'otp') {
                        navigation.navigate('TwoFactorModal', {
                            screen: 'TwoFactorSetup',
                            params: {
                                backRoute: 'Security',
                                useType: item.key,
                                additional: {key: item.key},
                                enableEmailFact: setting?.enableEmailFact,
                                enableSmsFact: setting?.enableSmsFact
                            },
                        });
                        return;
                    }
                }}
                disabled={item.isDisabled}
            />
        ),
    }));



    const hasFace = supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
    const hasFingerPrint = supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

    const bioSettings = [
        ...(
            hasFace || hasFingerPrint ? [
                {
                    label: t('faceIDLogin'),
                    component: (
                        <SwitchView
                            checked={enableFace}
                            setChecked={(d) => {

                                const hasFace = getBiometricStatus();
                                if (hasFace){
                                    if (d) {
                                        navigation.navigate('BioIdModal', {
                                            screen: 'EnableBioVerification',
                                            params: {
                                                backRoute: 'Security',
                                            },
                                        });
                                        return;
                                    } else {
                                        disableFaceAuth();
                                    }
                                }else {
                                    Alert.alert(
                                        '设备未开启指纹或人脸认证',
                                        '请前往设置开启生物识别功能。',
                                        [
                                            {
                                                text: '取消',
                                                style: 'cancel', // 取消按钮
                                            },
                                            {
                                                text: '设置',
                                                onPress: () => {
                                                    // 跳转到设置页面
                                                    Linking.openSettings();
                                                },
                                            },
                                        ],
                                    );
                                }
                            }}
                        />
                    )
                }
            ] : []
        ),
    ];

    const list = [...settings, ...bioSettings];

    return (
        <>
            <StyledView className='space-y-1 mx-3 pb-2'>
                <StyledText variant={'H4'}>{t('twoFactorVerificationMethods')}</StyledText>
                <StyledText variant={'body-s'} withGray>
                    {t("twoFactorVerificationMethodsDesc")}
                </StyledText>
            </StyledView>
            <StyledView className={'px-3'}>
                <MenuListItem list={list}/>
            </StyledView>
        </>
    )
}

export default TwoFactorSettings;
