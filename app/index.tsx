import { Box } from "@/components/ui/box";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex items-center justify-center h-screen bg-white">
      <Box
        className="bg-primary-500 p-5"
      >
        <Text className='text-typography-0'>
          This is the Box
        </Text>
      </Box>
    </View>
  );
}
