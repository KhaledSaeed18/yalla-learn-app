import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex items-center justify-center h-screen bg-white">
      <Button size="md" variant="solid" action="primary">
        <ButtonText>Hello World!</ButtonText>
      </Button>
    </View>
  );
}
