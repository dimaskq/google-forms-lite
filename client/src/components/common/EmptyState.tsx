type Props = {
  message: string;
};

export default function EmptyState({ message }: Props) {
  return <p className="text-gray-600 text-center py-8">{message}</p>;
}
