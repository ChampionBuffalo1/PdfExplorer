import { Text } from 'react-native';
import { FileStatus } from '../kvStore';

type StatusProps = {
  type: FileStatus;
  page?: number;
  totalPages?: number;
};

export default function StatusMessage({
  type,
  page,
  totalPages,
}: StatusProps) {
  const gotPages = page && totalPages;
  let str = 'Start Reading',
    color = 'bg-green-600';

  if (type === 'COMPLETED' || gotPages && page === totalPages) {
    str = 'Completed';
    color = 'bg-blue-600 ';
  } else if (type === 'ONGOING' && gotPages) {
    str = `${((page / totalPages) * 100).toFixed(2)}% Read`;
    color = 'bg-gray-600';
  }
  return (
    <Text
      className={'text-white rounded-md p-2 mt-2 w-28 text-center ' + color}>
      {str}
    </Text>
  );
}
