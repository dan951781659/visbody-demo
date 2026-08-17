import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { ColorPalette, glass, typography } from "@/theme";

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_CONTENT_HEIGHT = 52;

function TabBarBackground({ colors }: { colors: ColorPalette }) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (Platform.OS === "web") {
    return <View style={styles.tabBarFallback} />;
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BlurView intensity={glass.tabBlurIntensity} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.tabBarTint} />
      <View style={styles.tabBarHighlight} />
    </View>
  );
}

function TabIcon({
  name,
  focused,
  colors,
}: {
  name: TabIconName;
  focused: boolean;
  colors: ColorPalette;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.iconSlot}>
      {focused ? (
        <View style={styles.activeIconWrap}>
          {Platform.OS !== "web" ? (
            <BlurView intensity={36} tint="light" style={StyleSheet.absoluteFillObject} />
          ) : null}
          <View style={styles.activeTint} />
        </View>
      ) : null}
      <Ionicons
        name={name}
        size={21}
        color={focused ? colors.accentBright : colors.tabInactive}
        style={styles.icon}
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isWeb = Platform.OS === "web";
  // Web 手机浏览器常无 safe-area；至少留出底部内边距，避免 Tab 文案/图标被裁切
  const bottomInset = isWeb
    ? Math.max(insets.bottom, 16)
    : Platform.OS === "ios"
      ? Math.max(insets.bottom, 20)
      : Math.max(insets.bottom, 10);
  const tabBarHeight = TAB_CONTENT_HEIGHT + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingTop: 6,
            paddingBottom: bottomInset,
            // Web 用文档流占位，避免 absolute 沉到浏览器底栏下方被裁切
            position: isWeb ? "relative" : "absolute",
          },
        ],
        tabBarBackground: () => <TabBarBackground colors={colors} />,
        tabBarActiveTintColor: colors.accentBright,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
        tabBarItemStyle: styles.tabItem,
        tabBarHideOnKeyboard: true,
        sceneStyle: isWeb ? styles.webScene : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} focused={focused} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "探索",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "compass" : "compass-outline"}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: "训练",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "fitness" : "fitness-outline"}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "person" : "person-outline"}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function createStyles(colors: ColorPalette) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: Platform.OS === "ios" ? "transparent" : "rgba(28,28,30,0.92)",
      borderTopColor: colors.glassBorder,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    webScene: {
      flex: 1,
      minHeight: 0,
    },
    tabBarFallback: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.glassStrong,
    },
    tabBarTint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(20,20,22,0.28)",
    },
    tabBarHighlight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.glassHighlight,
    },
    tabItem: {
      paddingTop: 2,
    },
    tabIcon: {
      marginBottom: 0,
    },
    tabLabel: {
      ...typography.tab,
      marginTop: 2,
    },
    iconSlot: {
      width: 30,
      height: 26,
      alignItems: "center",
      justifyContent: "center",
    },
    activeIconWrap: {
      position: "absolute",
      width: 30,
      height: 26,
      borderRadius: 13,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    activeTint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.accentGlass,
    },
    icon: {
      zIndex: 1,
    },
  });
}
