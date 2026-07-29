import { Text, TextProps, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import { fonts } from "@/theme";

const DIGIT_CHUNK = /(\d[\d.,:%+\-/\s]*)/g;

type DigitTextProps = TextProps & {
  children?: ReactNode;
};

/**
 * Renders mixed copy with Archivo Black applied only to Latin numeral runs.
 */
export function DigitText({ children, style, ...rest }: DigitTextProps) {
  if (children == null || typeof children === "boolean") {
    return <Text style={style} {...rest} />;
  }

  if (typeof children === "number") {
    return (
      <Text style={[styles.digit, style]} {...rest}>
        {children}
      </Text>
    );
  }

  if (typeof children !== "string") {
    return (
      <Text style={style} {...rest}>
        {children}
      </Text>
    );
  }

  const parts = children.split(DIGIT_CHUNK);
  return (
    <Text style={style} {...rest}>
      {parts.map((part, index) => {
        if (!part) return null;
        const isDigit = /^\d/.test(part);
        return isDigit ? (
          <Text key={`${index}-${part}`} style={styles.digit}>
            {part}
          </Text>
        ) : (
          <Text key={`${index}-${part}`}>{part}</Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  digit: {
    fontFamily: fonts.archivoBlack,
    fontWeight: "400",
  },
});
