import { Text, View } from "@/ui";
import React from "react";

type PasswordCheckBoxProps = {
  password: string;
};

export const PASSWORD_REGEX = {
  length: /^.{6,}$/,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*]/,
};

export const controlPassword = (password: string) => {
  return (
    PASSWORD_REGEX.length.test(password) &&
    PASSWORD_REGEX.lowercase.test(password) &&
    PASSWORD_REGEX.uppercase.test(password) &&
    PASSWORD_REGEX.number.test(password)
  );
};

export const PASSWORD_ERROR = {
  length: "Between 6 to 20 characters",
  lowercase: "One lowercase letter",
  uppercase: "One uppercase letter",
  number: "One number",
  specialCharacter: "One special character",
};

export const PasswordCheckBox = ({ password }: PasswordCheckBoxProps) => {
  return (
    <View className="flex-row justify-between">
      <View>
        <Text
          className={`text-xs text-red-500
        ${PASSWORD_REGEX.length.test(password) ? "line-through" : ""}
      `}
        >
          {PASSWORD_ERROR.length}
        </Text>
        <Text
          className={`text-xs text-red-500
        ${PASSWORD_REGEX.lowercase.test(password) ? "line-through" : ""}
      `}
        >
          {PASSWORD_ERROR.lowercase}
        </Text>
      </View>
      <View>
        <Text
          className={`text-xs text-red-500
        ${PASSWORD_REGEX.uppercase.test(password) ? "line-through" : ""}
      `}
        >
          {PASSWORD_ERROR.uppercase}
        </Text>
        <Text
          className={`text-xs text-red-500
        ${PASSWORD_REGEX.number.test(password) ? "line-through" : ""}
      `}
        >
          {PASSWORD_ERROR.number}
        </Text>
        <Text
            className={`text-xs text-red-500
        ${PASSWORD_REGEX.uppercase.test(password) ? "line-through" : ""}
      `}
        >
          {PASSWORD_ERROR.specialCharacter}
        </Text>

      </View>
    </View>
  );
};
