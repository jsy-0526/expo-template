// 图片预览的
import OfflineIcon from 'components/icons/OfflineIcon';
import { styled } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { StyledIcon, StyledText, StyledView } from './TailwindComponents';
// import { } from "react-native-heroicons/solid";
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const MAX_RELOAD_FAST_IMAGE = 3;

const FastImageWithLoading = styled((props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [fastImageKey, setFastImageKey] = useState(1);
    const {source, name, variant = 'H3'} = props;
    const rStyle = useAnimatedStyle(() => {
        const x = isLoading || hasError ? 0 : 1;
        return {
            opacity: withTiming(x, {duration: 400}),
        };
    });

    return (
        <StyledView
            style={[
                {height: "100%", width: "100%", overflow: "hidden"},
                props.style,
            ]}
        >
            <StyledView
                style={[
                    {backgroundColor: "#c9c9c9"},
                    StyleSheet.absoluteFillObject,
                    {
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                    },
                    props.style,
                ]}
            >
                {hasError && (
                    !name ?
                        (<StyledIcon Icon={OfflineIcon}/>) : (
                            <StyledView
                                style={{
                                    backgroundColor: '#275d92',
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <StyledText variant={variant} className={'text-white'}>{name}</StyledText>
                            </StyledView>
                        )
                )}
                {isLoading && <ActivityIndicator color="white"/>}
            </StyledView>

            <AnimatedFastImage
                key={fastImageKey}
                {...props}
                style={[props.style, rStyle]}
                onLoadStart={() => {
                    setHasError(false);
                    setIsLoading(true);
                }}
                onLoadEnd={() => {
                    setIsLoading(false);
                }}
                onError={(error) => {
                    setHasError(true);
                    if (source.uri) {
                        if (fastImageKey < MAX_RELOAD_FAST_IMAGE) {
                            setTimeout(() => {
                                setFastImageKey(fastImageKey + 1);
                            }, 1000);
                        } else {
                            console.warn(
                                "Fast Image error occur, max increment reach, the image won't be displayed"
                            );
                        }
                    }
                }}
            />
        </StyledView>
    );
});

export default FastImageWithLoading;

const styles = StyleSheet.create({});
