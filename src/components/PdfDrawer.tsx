import { FlashList } from '@shopify/flash-list';
import { ArrowBigDown } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Pdf, { type TableContent } from 'react-native-pdf';

type DrawerProps<T extends 'item' | 'drawer' = 'drawer'> = {
  PDF: Pdf;
  content: T extends 'item' ? TableContent : TableContent[];
  close: () => void;
};

function DrawerItem({ content, PDF, close }: DrawerProps<'item'>) {
  const hasNested = content.children.length > 0;
  return (
    <View
      className={
        'mt-2' + hasNested
          ? ' border-l-black border border-t-0 border-b-0 border-r-0'
          : ''
      }>
      <Pressable>
        <Text
          onPress={() => {
            close();
            PDF.setPage(content.pageIdx);
          }}
          className="text-black mt-1 left-1"
          numberOfLines={2}>
          {hasNested && <ArrowBigDown className="text-black" size={16} />}
          {content.title}
        </Text>
      </Pressable>
      <View className="left-4">
        {content.children.map((childContent, index) => (
          <DrawerItem
            content={childContent}
            PDF={PDF}
            key={index}
            close={close}
          />
        ))}
      </View>
    </View>
  );
}

export default function PdfDrawer({ content, PDF, close }: DrawerProps) {
  return (
    <FlashList
      data={content}
      renderItem={({ item, index }) => (
        <DrawerItem content={item} PDF={PDF} key={index} close={close} />
      )}
      estimatedItemSize={200}
    />
  );
}
