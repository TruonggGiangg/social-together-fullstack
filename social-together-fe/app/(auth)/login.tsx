import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Link, LinkText } from '@/components/ui/link';
import { Text, View } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { Image } from '@/components/ui/image';

export default function TabLayoutLogin() {
    // const router = useRouter();
    const [isInvalidPhone, setIsInvalidPhone] = React.useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const handleSubmit = () => {
        setIsInvalidPassword(password.length < 6);
        setIsInvalidPhone(phone.length < 6);
    };


    return (
        <>
            <VStack space={5} className='p-4 flex-1 justify-center'>
                <Text className='text-center mb-20 text-3xl'>LOGO</Text>

                <FormControl
                    isInvalid={isInvalidPhone}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                >
                    <FormControlLabel>
                        <FormControlLabelText>Số điện thoại</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" size="md">
                        <InputField
                            type="text"
                            placeholder="Nhập số điện thoại"
                            value={phone}
                            onChangeText={text => setPhone(text)}
                        />
                    </Input>
                    <FormControlError>
                        <FormControlErrorIcon className="text-red-500" />
                        <FormControlErrorText className="text-red-500">
                            Số điện thoại không hợp lệ
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>
                <FormControl
                    isInvalid={isInvalidPassword}
                    size="md"
                    isDisabled={false}
                    isReadOnly={false}
                    isRequired={false}
                >
                    <FormControlLabel>
                        <FormControlLabelText>Mật khẩu</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" size="md">
                        <InputField
                            type="password"
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                    </Input>
                    <FormControlError>
                        <FormControlErrorIcon className="text-red-500" />
                        <FormControlErrorText className="text-red-500">
                            Mật khẩu không hợp lệ
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>
                <Button
                    className="self-end mt-4 w-full"
                    size="md"
                    variant="outline"
                    onPress={handleSubmit}
                    parentVariants={{ size: "lg" }}


                >
                    <ButtonText>Đăng nhập</ButtonText>
                </Button>
                <Divider className="my-5" />
                <View className='flex-row gap-10 justify-center mb-5'>
                    <Image
                        size="xs"
                        source={{
                            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png',
                        }}
                        alt="image"
                    />
                    <Image
                        size="xs"
                        source={{
                            uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
                        }}
                        alt="image"
                    />
                    <Image
                        size="xs"
                        source={{
                            uri: 'https://img.freepik.com/psd-cao-cap/logo-instagram_971166-164438.jpg?semt=ais_hybrid&w=740&q=80',
                        }}
                        alt="image"
                    />
                </View>

                <View className='flex-row justify-center items-center'>
                    <Text className='text-base'>Chưa có tài khoản ? </Text>
                    <Link href="/signup" className="self-center">
                        <LinkText style={{ textDecorationLine: "none" }}> Đăng ký</LinkText>
                    </Link>
                </View>
            </VStack>
        </>
    );
}
