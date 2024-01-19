import { useEffect } from 'react';
import Pdf, { type TableContent } from 'react-native-pdf';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

interface DrawerProps {
  PDF: Pdf;
  content: TableContent[];
}

function DrawerItem({ content }: { content: TableContent }) {
  return (
    <TouchableOpacity className="mt-2 left-2">
      <Text className="text-black">{content.title}</Text>
    </TouchableOpacity>
  );
}

export default function PdfDrawer({ content, PDF }: DrawerProps) {
  useEffect(() => {
    // console.log(content);
  }, [content]);

  return (
    <ScrollView>
      {content.map((content, index) => (
        <DrawerItem content={content} key={index} />
      ))}
    </ScrollView>
  );
}
