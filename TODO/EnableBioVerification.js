/**
 * 开启生物识别
 */
import * as LocalAuthentication from "expo-local-authentication";
import { useProfile } from 'hooks/datahook/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleIcon } from "react-native-heroicons/outline";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";
import { PrimaryButton } from "../../components/ButtonView";
import CloseIcon from "../../components/icons/CloseIcon";
import SafeLoadingScreen from '../../components/SafeLoadingScreen';
import {
    StyledErrorText,
    StyledHStack,
    StyledIcon,
    StyledPressable,
    StyledText,
    StyledTouchableOpacity,
    StyledView
} from "../../components/TailwindComponents";
import { IconInput } from "../../components/TextInput";
import { updateUserEnableFace_ } from "../../hooks/datahook/settings";
import { checkAccount_, useAuth } from "../../hooks/useAuth";
import { useColorModeValueKey } from '../../hooks/useColors';
import { useNavigation } from "../../hooks/useNavigation";
import { getErrorMessage } from "../../utils/error";

const EnableBioVerification = (props) => {
    const {route} = props;
    const backRoute = route.params?.backRoute;
    const {t} = useTranslation('app');
    const navigation = useNavigation();
    const {login} = useAuth();
    const {data: profile} = useProfile();
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const errorColor = useColorModeValueKey("error");

    const verifyFace = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: '请使用指纹或面部识别进行身份验证',
                fallbackLabel: '使用密码',
                cancelLabel: '取消',
                disableDeviceFallback: true,
            });

            if (result.success) {
                // 识别成功
                // await onSaveUsernamePassword_(profile?.email, password);
                // const deviceId = DeviceInfo.getUniqueId();
                await updateUserEnableFace_({
                    // deviceId: deviceId,
                    enableFace: true,
                })
                setTimeout(() => {
                    if (backRoute) {
                        navigation.navigate(backRoute, {
                            isRefresh: true,
                        });
                    }
                }, 300);

            } else {
                //识别失败
                console.log('识别失败');
            }
        } catch (error) {
            // 处理错误
            console.error('识别出错:', error);
        }
    };

    const onCheckAccount = async () => {
        try {
            setError(null);
            setLoading(true);
            const res = await checkAccount_({
                // username: profile?.email,
                password: password.trim(),
            });

            setTimeout(() => {
                verifyFace();
            }, 300);
        } catch (error) {
            setError(getErrorMessage(error));
            console.log(error.response.body, error.response.text);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeLoadingScreen>
            <StyledView className='absolute right-4 top-4'>
                <StyledPressable onPress={() => {
                    navigation.goBack()
                }}>
                    <CloseIcon/>
                </StyledPressable>
            </StyledView>
            <StyledView
                className='px-3 space-y-3 mt-12' flex={1}
            >
                <StyledView className='space-y-1'>
                    <StyledText variant={'H3'}>
                        {t('pleaseEnterYourLoginPassword')}
                    </StyledText>
                    <StyledText variant={'body-s'}>{t('pleaseEnterYourLoginPasswordLimit')}</StyledText>
                </StyledView>


                <StyledView className='space-y-4 pt-2'>
                    <StyledView className='space-y-2'>
                        <StyledText variant={'H5'}>{t('password')}</StyledText>
                        <StyledView>
                            <IconInput
                                setValue={setPassword}
                                value={password}
                                passwordVisible={false}
                                secureTextEntry={show ? false : true}
                                rightIcon={
                                    <StyledTouchableOpacity
                                        onPress={() => setShow((c) => !c)}
                                        className={"pr-2"}
                                    >
                                        {show ? (
                                            <StyledIcon Icon={EyeIcon}/>
                                        ) : (
                                            <StyledIcon Icon={EyeSlashIcon}/>
                                        )}
                                    </StyledTouchableOpacity>
                                }
                            />
                        </StyledView>
                        {error && (
                            <StyledHStack className={'space-x-1'}>
                                <ExclamationCircleIcon
                                    color={errorColor}
                                    size={15}
                                    mt={1}
                                />
                                <StyledErrorText>
                                    {t(error)}
                                </StyledErrorText>
                            </StyledHStack>
                        )}
                    </StyledView>
                    <StyledView className='pt-5'>
                        <PrimaryButton
                            loading={loading}
                            onPress={onCheckAccount}
                            disabled={!password}
                            text={'confirm'}
                        />
                    </StyledView>
                </StyledView>
            </StyledView>
        </SafeLoadingScreen>
    )
}

export default EnableBioVerification;
