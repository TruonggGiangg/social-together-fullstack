import { Image } from 'expo-image';
import { FlatList, Platform, StyleSheet, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

// Dữ liệu giả lập post
const posts = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "Hôm nay trời đẹp quá ☀️",
    image: "https://picsum.photos/400/250?random=1",
  },
  {
    id: "2",
    user: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "Cafe sáng cùng bạn bè ☕",
    image: "https://picsum.photos/400/250?random=2",
  },
];

export default function HomeScreen() {
  const renderPost = ({ item }: { item: any }) => (
    <Card className="mb-4 rounded-2xl shadow p-3 bg-white">
      {/* Header post */}
      <Box className="flex-row items-center mb-2">
        <Avatar size="md">
          <AvatarFallbackText>{item.user}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: item.avatar,
            }}
          />
          <AvatarBadge />
        </Avatar>
        {/* <Text className="font-semibold">{item.user}</Text> */}
      </Box>

      {/* Content post */}
      <Text className="mb-2">{item.content}</Text>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 200, borderRadius: 12 }}
        />
      )}
    </Card>
  );

  return (
    <Box className="flex-1 bg-gray-100">
      {/* Header */}
      <Box className="flex-row justify-between items-center px-4 py-3 bg-white shadow">
        <Text className="text-xl font-bold text-blue-600">Facebook</Text>
        <Button className="rounded-full w-10 h-10 bg-gray-200 items-center justify-center">
          <Text>🔔</Text>
        </Button>
      </Box>

      {/* Ô đăng bài */}
      <Card className="flex-row items-center p-3 m-3 rounded-2xl bg-white shadow">
        <AvatarImage
          className="w-10 h-10 rounded-full mr-3"
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
        />
        <Input
          // placeholder="Bạn đang nghĩ gì?"
          className="flex-1 rounded-full bg-gray-100 px-3 py-2"
        />
      </Card>

      {/* Danh sách post */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
