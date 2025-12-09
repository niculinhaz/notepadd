import React from 'react';
import { Text as RNText, TextInput as RNTextInput, TextProps as RNTextProps, TextInputProps } from 'react-native';
import { Text as TamaguiText, TextProps } from '@tamagui/core';
import { H1 as TamaguiH1, H2 as TamaguiH2, H3 as TamaguiH3 } from 'tamagui';
import type { HeadingProps } from '@tamagui/text';

export function StyledText(props: RNTextProps) {   // substitui RNText
  return (
    <RNText 
      {...props} 
      style={[{ fontFamily: 'SF-Pro' }, props.style]}
    />
  );
}

export function Text(props: TextProps) {
  return <TamaguiText {...props} />;  
}

export function TextInput(props: TextInputProps) {
  return (
    <RNTextInput 
      {...props} 
      style={[{ fontFamily: 'SF-Pro-Bold' }, props.style]}
    />
  );
}

export function H1(props: HeadingProps) {
  const { style, ...rest } = props;
  return (
    <TamaguiH1 
      {...rest}
      style={[{ fontFamily: 'SF-Pro' }, style]}
    />
  );
}

export function H2(props: HeadingProps) {
  const { style, ...rest } = props;
  return (
    <TamaguiH2 
      {...rest}
      style={[{ fontFamily: 'SF-Pro' }, style]}
    />
  );
}

export function H3(props: HeadingProps) {
  const { style, ...rest } = props;
  return (
    <TamaguiH3 
      {...rest}
      style={[{ fontFamily: 'SF-Pro' }, style]}
    />
  );
}