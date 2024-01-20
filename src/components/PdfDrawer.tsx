import PdfHeader from './PdfHeader';
import { PageData } from '../screens/PdfView';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigDown } from 'lucide-react-native';
import Pdf, { TableContent } from 'react-native-pdf';
import { Pressable, Text, View } from 'react-native';

function DrawerItem({ content, close, PDF }: DrawerItemProps) {
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
            PDF={PDF}
            key={index}
            close={close}
            content={childContent}
          />
        ))}
      </View>
    </View>
  );
}

export default function PdfDrawer({
  PDF,
  close,
  content,
  pageData,
}: DrawerProps) {
  return (
    <FlashList
      data={content}
      estimatedItemSize={200}
      renderItem={({ item, index }) => (
        <DrawerItem PDF={PDF} key={index} close={close} content={item} />
      )}
      ListHeaderComponent={
        <PdfHeader pageData={pageData} PDF={PDF} close={close} />
      }
      ListFooterComponent={<View className="mt-10" />}
      ListEmptyComponent={<Text className="text-black text-md">Empty</Text>}
    />
  );
}

export type DrawerProps = {
  PDF: Pdf;
  close: () => void;
  pageData: PageData;
  content: TableContent[];
};

type DrawerItemProps = Omit<DrawerProps, 'content' | 'pageData'> & {
  content: TableContent;
};
